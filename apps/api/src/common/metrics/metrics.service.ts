import { Injectable, Logger } from '@nestjs/common';
import { AccountingMetrics } from './accounting.metrics';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    private accountingMetrics: AccountingMetrics,
    private prisma: PrismaService,
  ) {}

  /**
   * Update all accounting-related metrics
   * Called periodically to keep metrics current
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async updateAccountingMetrics(): Promise<void> {
    try {
      await Promise.all([
        this.updateBalanceMetrics(),
        this.updateUnreconciledMetrics(),
        this.updateQueueMetrics(),
      ]);
    } catch (error) {
      this.logger.error('Failed to update accounting metrics', error);
    }
  }

  /**
   * Update financial metrics daily
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async updateDailyFinancialMetrics(): Promise<void> {
    try {
      await this.updateFinancialMetrics();
    } catch (error) {
      this.logger.error('Failed to update daily financial metrics', error);
    }
  }

  private async updateBalanceMetrics(): Promise<void> {
    const balanceAggregates = await this.prisma.ledgerAccount.groupBy({
      by: ['currency'],
      _sum: {
        balance: true,
        locked: true,
      },
    });

    const balances = balanceAggregates.map(agg => ({
      currency: agg.currency,
      totalBalance: parseFloat(agg._sum.balance?.toString() || '0'),
      totalLocked: parseFloat(agg._sum.locked?.toString() || '0'),
    }));

    this.accountingMetrics.updateBalanceMetrics(balances);
  }

  private async updateUnreconciledMetrics(): Promise<void> {
    const unreconciledAggregates = await this.prisma.reconciliationEntry.groupBy({
      by: ['entryType', 'currency'],
      where: { status: 'UNRECONCILED' },
      _count: true,
      _sum: { variance: true },
    });

    const unreconciledItems = unreconciledAggregates.map(agg => ({
      type: agg.entryType,
      currency: agg.currency,
      count: agg._count,
      totalVariance: parseFloat(agg._sum.variance?.toString() || '0'),
    }));

    this.accountingMetrics.updateUnreconciledMetrics(unreconciledItems);
  }

  private async updateQueueMetrics(): Promise<void> {
    // This would be implemented with actual BullMQ queue instances
    // For now, we'll set placeholder values
    this.accountingMetrics.updateQueueMetrics('daily-close', {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
    });

    this.accountingMetrics.updateQueueMetrics('reconciliation', {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
    });
  }

  private async updateFinancialMetrics(): Promise<void> {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get latest daily close data
    const latestClose = await this.prisma.dailyClose.findFirst({
      where: { status: 'COMPLETED' },
      orderBy: { closeDate: 'desc' },
    });

    if (latestClose) {
      // Update GGR metrics
      const ggrData = Object.entries(latestClose.ggrByCurrency || {}).map(([currency, amount]) => ({
        currency,
        period: 'daily',
        amount: parseFloat(amount as string),
      }));

      // Update NGR metrics
      const ngrData = Object.entries(latestClose.ngrByCurrency || {}).map(([currency, amount]) => ({
        currency,
        period: 'daily',
        amount: parseFloat(amount as string),
      }));

      // Get daily transaction volumes
      const dailyVolumes = await this.prisma.transaction.groupBy({
        by: ['type', 'currency'],
        where: {
          createdAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _sum: { amount: true },
      });

      const volumeData = dailyVolumes.map(vol => ({
        type: vol.type,
        currency: vol.currency,
        date: yesterday.toISOString().split('T')[0],
        volume: Math.abs(parseFloat(vol._sum.amount?.toString() || '0')),
      }));

      this.accountingMetrics.updateFinancialMetrics({
        ggr: ggrData,
        ngr: ngrData,
        dailyVolume: volumeData,
      });
    }
  }

  /**
   * Manually trigger metrics update
   */
  async updateAllMetrics(): Promise<void> {
    await this.updateAccountingMetrics();
    await this.updateDailyFinancialMetrics();
  }

  /**
   * Get current metrics summary for health checks
   */
  async getMetricsSummary(): Promise<any> {
    try {
      const balanceAggregates = await this.prisma.ledgerAccount.groupBy({
        by: ['currency'],
        _sum: { balance: true, locked: true },
        _count: true,
      });

      const unreconciledCount = await this.prisma.reconciliationEntry.count({
        where: { status: 'UNRECONCILED' },
      });

      const latestClose = await this.prisma.dailyClose.findFirst({
        orderBy: { closeDate: 'desc' },
        select: { 
          closeDate: true, 
          status: true, 
          ledgerIntegrityCheck: true,
          unreconciledCount: true 
        },
      });

      return {
        timestamp: new Date().toISOString(),
        balances: balanceAggregates.map(agg => ({
          currency: agg.currency,
          accounts: agg._count,
          totalBalance: agg._sum.balance?.toString() || '0',
          totalLocked: agg._sum.locked?.toString() || '0',
        })),
        reconciliation: {
          unreconciledItems: unreconciledCount,
        },
        dailyClose: {
          latest: latestClose?.closeDate,
          status: latestClose?.status,
          integrityCheck: latestClose?.ledgerIntegrityCheck,
          unreconciledCount: latestClose?.unreconciledCount || 0,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get metrics summary', error);
      return {
        error: 'Failed to retrieve metrics',
        timestamp: new Date().toISOString(),
      };
    }
  }
}