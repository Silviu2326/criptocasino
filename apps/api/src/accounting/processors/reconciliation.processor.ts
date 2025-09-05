import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ReconciliationService } from '../reconciliation.service';

export interface ReconciliationJobData {
  date: string; // ISO date string
  type: 'FULL' | 'DEPOSITS' | 'WITHDRAWALS';
  force?: boolean;
}

@Processor('reconciliation')
export class ReconciliationProcessor extends WorkerHost {
  private readonly logger = new Logger(ReconciliationProcessor.name);

  constructor(private reconciliationService: ReconciliationService) {
    super();
  }

  async process(job: Job<ReconciliationJobData>): Promise<any> {
    const { date, type = 'FULL', force = false } = job.data;
    
    this.logger.log(`Processing reconciliation job`, {
      jobId: job.id,
      date,
      type,
      force,
    });

    try {
      await job.updateProgress(10);

      const parsedDate = new Date(date);
      
      // Run reconciliation based on type
      let result;
      
      switch (type) {
        case 'FULL':
          result = await this.reconciliationService.runFullReconciliation(parsedDate);
          break;
        default:
          result = await this.reconciliationService.runFullReconciliation(parsedDate);
      }

      await job.updateProgress(90);

      this.logger.log('Reconciliation job completed', {
        jobId: job.id,
        date,
        processed: result.processedCount,
        reconciled: result.reconciledCount,
        unreconciled: result.unreconciledCount,
        errors: result.errors.length,
      });

      await job.updateProgress(100);

      return {
        success: true,
        date,
        type,
        result,
      };

    } catch (error) {
      this.logger.error('Reconciliation job failed', {
        jobId: job.id,
        date,
        type,
        error: error.message,
        stack: error.stack,
      });

      await job.updateProgress(0);
      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log('Reconciliation job completed successfully', {
      jobId: job.id,
      date: job.data.date,
      type: job.data.type,
    });
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error('Reconciliation job failed', {
      jobId: job.id,
      date: job.data.date,
      type: job.data.type,
      error: error.message,
    });
  }
}