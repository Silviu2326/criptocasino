import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { DailyCloseService } from '../daily-close.service';
import { ReconciliationService } from '../reconciliation.service';

export interface DailyCloseJobData {
  closeDate: string; // ISO date string
  force?: boolean; // Force close even if already completed
  includeReconciliation?: boolean; // Run reconciliation as part of close
}

@Processor('daily-close')
export class DailyCloseProcessor extends WorkerHost {
  private readonly logger = new Logger(DailyCloseProcessor.name);

  constructor(
    private dailyCloseService: DailyCloseService,
    private reconciliationService: ReconciliationService,
  ) {
    super();
  }

  async process(job: Job<DailyCloseJobData>): Promise<any> {
    const { closeDate, force = false, includeReconciliation = true } = job.data;
    
    this.logger.log(`Processing daily close job for date: ${closeDate}`, {
      jobId: job.id,
      force,
      includeReconciliation,
    });

    try {
      // Update job progress
      await job.updateProgress(10);

      const parsedDate = new Date(closeDate);
      
      // Step 1: Run reconciliation first if requested
      if (includeReconciliation) {
        this.logger.log('Running reconciliation before close');
        await job.updateProgress(20);
        
        const reconciliationResult = await this.reconciliationService.runFullReconciliation(parsedDate);
        
        this.logger.log('Reconciliation completed', {
          processed: reconciliationResult.processedCount,
          reconciled: reconciliationResult.reconciledCount,
          errors: reconciliationResult.errors.length,
        });
        
        await job.updateProgress(50);
      }

      // Step 2: Execute daily close
      this.logger.log('Starting daily close execution');
      await job.updateProgress(60);

      const result = await this.dailyCloseService.executeDailyClose(parsedDate);
      
      await job.updateProgress(90);

      // Step 3: Log completion metrics
      this.logger.log('Daily close completed successfully', {
        closeId: result.closeId,
        integrityValid: result.integrityCheck.isValid,
        imbalance: result.integrityCheck.imbalance.toString(),
        exportFile: result.exportFilePath,
      });

      await job.updateProgress(100);

      return {
        success: true,
        closeId: result.closeId,
        closeDate: closeDate,
        integrityValid: result.integrityCheck.isValid,
        exportFilePath: result.exportFilePath,
        summary: {
          totalUsers: result.balancesSnapshot.totalUsers || 0,
          ggr: result.financialSummary.ggr,
          ngr: result.financialSummary.ngr,
          imbalance: result.integrityCheck.imbalance.toString(),
        },
      };

    } catch (error) {
      this.logger.error('Daily close job failed', {
        jobId: job.id,
        closeDate,
        error: error.message,
        stack: error.stack,
      });

      // Save error details for investigation
      await job.updateProgress(0);
      
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log('Daily close job completed successfully', {
      jobId: job.id,
      closeDate: job.data.closeDate,
      closeId: result.closeId,
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error('Daily close job failed', {
      jobId: job.id,
      closeDate: job.data.closeDate,
      error: error.message,
      attempts: job.attemptsMade,
      maxAttempts: job.opts?.attempts || 1,
    });
  }

  @OnWorkerEvent('stalled')
  onStalled(job: Job) {
    this.logger.warn('Daily close job stalled', {
      jobId: job.id,
      closeDate: job.data.closeDate,
    });
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job, progress: number | object) {
    this.logger.debug('Daily close job progress', {
      jobId: job.id,
      closeDate: job.data.closeDate,
      progress,
    });
  }
}