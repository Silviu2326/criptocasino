import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, Job } from 'bullmq';
import { PrismaService } from '../common/prisma/prisma.service';
import { DailyCloseService } from './daily-close.service';
import { ReconciliationService } from './reconciliation.service';
import { LedgerService } from './ledger.service';
import { DailyCloseJobData } from './processors/daily-close.processor';
import { ReconciliationJobData } from './processors/reconciliation.processor';

@Injectable()
export class AccountingService {
  private readonly logger = new Logger(AccountingService.name);

  constructor(
    @InjectQueue('daily-close') private dailyCloseQueue: Queue<DailyCloseJobData>,
    @InjectQueue('reconciliation') private reconciliationQueue: Queue<ReconciliationJobData>,
    private prisma: PrismaService,
    private dailyCloseService: DailyCloseService,
    private reconciliationService: ReconciliationService,
    private ledgerService: LedgerService,
  ) {}

  /**
   * Queue a daily close job
   */
  async queueDailyClose(
    date: Date,
    force: boolean = false,
    includeReconciliation: boolean = true
  ): Promise<Job<DailyCloseJobData>> {
    const jobData: DailyCloseJobData = {
      closeDate: date.toISOString(),
      force,
      includeReconciliation,
    };

    const job = await this.dailyCloseQueue.add(
      'daily-close',
      jobData,
      {
        priority: 100,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 10,
        removeOnFail: 50,
        delay: 0,
      }
    );

    this.logger.log('Daily close job queued', {
      jobId: job.id,
      date: date.toISOString(),
      force,
      includeReconciliation,
    });

    return job;
  }

  /**
   * Queue a reconciliation job
   */
  async queueReconciliation(
    date: Date,
    type: 'FULL' | 'DEPOSITS' | 'WITHDRAWALS' = 'FULL',
    force: boolean = false
  ): Promise<Job<ReconciliationJobData>> {
    const jobData: ReconciliationJobData = {
      date: date.toISOString(),
      type,
      force,
    };

    const job = await this.reconciliationQueue.add(
      'reconciliation',
      jobData,
      {
        priority: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: 20,
        removeOnFail: 100,
      }
    );

    this.logger.log('Reconciliation job queued', {
      jobId: job.id,
      date: date.toISOString(),
      type,
      force,
    });

    return job;
  }

  /**
   * Get daily close job status
   */
  async getDailyCloseJobStatus(jobId: string): Promise<any> {
    const job = await this.dailyCloseQueue.getJob(jobId);
    
    if (!job) {
      return { status: 'NOT_FOUND' };
    }

    const state = await job.getState();
    const progress = job.progress;

    return {
      id: job.id,
      status: state,
      progress,
      data: job.data,
      result: job.returnvalue,
      error: job.failedReason,
      createdAt: new Date(job.timestamp).toISOString(),
      processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      attempts: job.attemptsMade,
      maxAttempts: job.opts?.attempts || 1,
    };
  }

  /**
   * Get daily close for a specific date
   */
  async getDailyClose(date: Date): Promise<any> {
    return await this.prisma.dailyClose.findUnique({
      where: { closeDate: date },
      include: {
        reconciliationEntries: {
          where: { status: 'UNRECONCILED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        ledgerSnapshots: {
          take: 10,
          orderBy: { balance: 'desc' },
        },
      },
    });
  }

  /**
   * Get daily close history
   */
  async getDailyCloseHistory(
    from?: Date,
    to?: Date,
    limit: number = 30
  ): Promise<any> {
    const where: any = {};
    
    if (from || to) {
      where.closeDate = {};
      if (from) where.closeDate.gte = from;
      if (to) where.closeDate.lte = to;
    }

    const closes = await this.prisma.dailyClose.findMany({
      where,
      orderBy: { closeDate: 'desc' },
      take: limit,
      select: {
        id: true,
        closeDate: true,
        status: true,
        totalUsers: true,
        totalTransactions: true,
        ngrByCurrency: true,
        ggrByCurrency: true,
        unreconciledCount: true,
        ledgerIntegrityCheck: true,
        completedAt: true,
        createdAt: true,
      },
    });

    return {
      closes,
      count: closes.length,
    };
  }

  /**
   * Generate financial report for a date range
   */
  async generateFinancialReport(
    from: Date,
    to: Date,
    currency?: string
  ): Promise<any> {
    const whereClause: any = {
      createdAt: { gte: from, lte: to },
    };

    if (currency) {
      whereClause.currency = currency;
    }

    // Aggregate transactions by type and currency
    const transactions = await this.prisma.transaction.groupBy({
      by: ['type', 'currency'],
      where: whereClause,
      _sum: { amount: true },
      _count: true,
    });

    // Get daily closes in the range for comparison
    const dailyCloses = await this.prisma.dailyClose.findMany({
      where: {
        closeDate: { gte: from, lte: to },
        status: 'COMPLETED',
      },
      orderBy: { closeDate: 'asc' },
    });

    const report = {
      period: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      summary: {
        totalTransactions: transactions.reduce((sum, t) => sum + t._count, 0),
        byType: {},
        byCurrency: {},
      },
      dailyBreakdown: dailyCloses.map(close => ({
        date: close.closeDate,
        ggr: close.ggrByCurrency,
        ngr: close.ngrByCurrency,
        integrityCheck: close.ledgerIntegrityCheck,
        unreconciled: close.unreconciledCount,
      })),
    };

    // Organize by transaction type
    transactions.forEach(t => {
      if (!report.summary.byType[t.type]) {
        report.summary.byType[t.type] = {};
      }
      report.summary.byType[t.type][t.currency] = t._sum.amount?.toString() || '0';

      // Organize by currency
      if (!report.summary.byCurrency[t.currency]) {
        report.summary.byCurrency[t.currency] = {};
      }
      report.summary.byCurrency[t.currency][t.type] = t._sum.amount?.toString() || '0';
    });

    return report;
  }

  /**
   * Export daily close to CSV
   */
  async exportDailyCloseToCSV(date: Date): Promise<string> {
    const dailyClose = await this.getDailyClose(date);
    
    if (!dailyClose) {
      throw new Error(`Daily close for ${date.toISOString()} not found`);
    }

    // Return existing export file path if available
    if (dailyClose.exportFilePath) {
      return dailyClose.exportFilePath;
    }

    // Generate new export (this would typically be done during the close process)
    const result = await this.dailyCloseService.executeDailyClose(date);
    return result.exportFilePath || '';
  }

  /**
   * Get accounting system health
   */
  async getSystemHealth(): Promise<any> {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check latest daily close
    const latestClose = await this.prisma.dailyClose.findFirst({
      orderBy: { closeDate: 'desc' },
    });

    // Check pending reconciliation items
    const pendingReconciliation = await this.prisma.reconciliationEntry.count({
      where: { status: 'UNRECONCILED' },
    });

    // Check ledger integrity
    let integrityCheck;
    try {
      integrityCheck = await this.ledgerService.verifyLedgerIntegrity();
    } catch (error) {
      integrityCheck = {
        isValid: false,
        error: error.message,
      };
    }

    // Check queue health
    const dailyCloseWaiting = await this.dailyCloseQueue.getWaiting();
    const dailyCloseActive = await this.dailyCloseQueue.getActive();
    const dailyCloseFailed = await this.dailyCloseQueue.getFailed();

    const reconciliationWaiting = await this.reconciliationQueue.getWaiting();
    const reconciliationActive = await this.reconciliationQueue.getActive();
    const reconciliationFailed = await this.reconciliationQueue.getFailed();

    return {
      timestamp: now.toISOString(),
      overall: integrityCheck.isValid && pendingReconciliation < 100 ? 'HEALTHY' : 'DEGRADED',
      components: {
        ledgerIntegrity: {
          status: integrityCheck.isValid ? 'HEALTHY' : 'UNHEALTHY',
          details: integrityCheck,
        },
        dailyClose: {
          status: latestClose && latestClose.status === 'COMPLETED' ? 'HEALTHY' : 'DEGRADED',
          latestClose: latestClose?.closeDate,
          latestStatus: latestClose?.status,
        },
        reconciliation: {
          status: pendingReconciliation < 50 ? 'HEALTHY' : 'DEGRADED',
          pendingItems: pendingReconciliation,
        },
        queues: {
          dailyClose: {
            waiting: dailyCloseWaiting.length,
            active: dailyCloseActive.length,
            failed: dailyCloseFailed.length,
          },
          reconciliation: {
            waiting: reconciliationWaiting.length,
            active: reconciliationActive.length,
            failed: reconciliationFailed.length,
          },
        },
      },
    };
  }

  /**
   * Schedule automatic daily closes
   */
  async scheduleAutomaticDailyClose(): Promise<void> {
    // This would typically be called by a cron job or scheduler
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    // Check if close already exists
    const existingClose = await this.prisma.dailyClose.findUnique({
      where: { closeDate: yesterday },
    });

    if (!existingClose || existingClose.status === 'FAILED') {
      await this.queueDailyClose(yesterday, false, true);
      
      this.logger.log('Automatic daily close scheduled', {
        date: yesterday.toISOString(),
        force: existingClose?.status === 'FAILED',
      });
    }
  }
}