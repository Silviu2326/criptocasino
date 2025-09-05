import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Currency } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface ReconciliationResult {
  processedCount: number;
  reconciledCount: number;
  unreconciledCount: number;
  errors: Array<{
    id: string;
    type: string;
    error: string;
  }>;
  summary: {
    deposits: { processed: number; reconciled: number; unreconciled: number };
    withdrawals: { processed: number; reconciled: number; unreconciled: number };
  };
}

export interface UnreconciledItem {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  amount: string;
  currency: Currency;
  reference: string;
  createdAt: string;
  reason: string;
}

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Run full reconciliation for a specific date
   */
  async runFullReconciliation(date: Date): Promise<ReconciliationResult> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    this.logger.log(`Starting reconciliation for ${date.toISOString()}`);

    const result: ReconciliationResult = {
      processedCount: 0,
      reconciledCount: 0,
      unreconciledCount: 0,
      errors: [],
      summary: {
        deposits: { processed: 0, reconciled: 0, unreconciled: 0 },
        withdrawals: { processed: 0, reconciled: 0, unreconciled: 0 },
      },
    };

    try {
      // Reconcile deposit intents
      const depositResult = await this.reconcileDeposits(startOfDay, endOfDay);
      result.summary.deposits = depositResult;
      result.processedCount += depositResult.processed;
      result.reconciledCount += depositResult.reconciled;
      result.unreconciledCount += depositResult.unreconciled;

      // Reconcile withdrawal requests
      const withdrawalResult = await this.reconcileWithdrawals(startOfDay, endOfDay);
      result.summary.withdrawals = withdrawalResult;
      result.processedCount += withdrawalResult.processed;
      result.reconciledCount += withdrawalResult.reconciled;
      result.unreconciledCount += withdrawalResult.unreconciled;

      this.logger.log('Reconciliation completed', {
        date: date.toISOString(),
        processed: result.processedCount,
        reconciled: result.reconciledCount,
        unreconciled: result.unreconciledCount,
      });

      return result;

    } catch (error) {
      this.logger.error('Reconciliation failed', {
        date: date.toISOString(),
        error: error.message,
        stack: error.stack,
      });

      result.errors.push({
        id: 'reconciliation-job',
        type: 'SYSTEM_ERROR',
        error: error.message,
      });

      throw error;
    }
  }

  /**
   * Reconcile deposit intents with their confirmations and ledger entries
   */
  private async reconcileDeposits(startDate: Date, endDate: Date): Promise<{
    processed: number;
    reconciled: number;
    unreconciled: number;
  }> {
    // Get all deposit intents in the date range
    const depositIntents = await this.prisma.depositIntent.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
      include: {
        user: true,
      },
    });

    let processed = 0;
    let reconciled = 0;
    let unreconciled = 0;

    for (const intent of depositIntents) {
      processed++;

      try {
        // Check if there's a payment confirmation
        const confirmation = await this.prisma.paymentConfirmation.findFirst({
          where: {
            depositIntentId: intent.id,
          },
        });

        if (!confirmation) {
          // No confirmation found - check if intent is still pending or expired
          if (intent.status === 'CONFIRMED') {
            // Intent is marked as confirmed but no confirmation record exists
            await this.createReconciliationEntry({
              entryType: 'DEPOSIT',
              referenceId: intent.id,
              expectedAmount: intent.amount,
              actualAmount: new Decimal(0),
              variance: intent.amount.neg(),
              currency: intent.currency,
              notes: 'Deposit intent marked as confirmed but no payment confirmation found',
            });
            unreconciled++;
          }
          continue;
        }

        // Check if there's a corresponding ledger transaction
        const transaction = await this.prisma.transaction.findFirst({
          where: {
            userId: intent.userId,
            type: 'DEPOSIT',
            currency: intent.currency,
            reference: intent.id,
          },
        });

        if (!transaction) {
          // Confirmation exists but no ledger transaction
          await this.createReconciliationEntry({
            entryType: 'DEPOSIT',
            referenceId: intent.id,
            expectedAmount: confirmation.amount,
            actualAmount: new Decimal(0),
            variance: confirmation.amount.neg(),
            currency: confirmation.currency,
            notes: 'Payment confirmed but no ledger transaction created',
          });

          // Update confirmation status
          await this.prisma.paymentConfirmation.update({
            where: { id: confirmation.id },
            data: { reconciliationStatus: 'UNRECONCILED' },
          });

          unreconciled++;
          continue;
        }

        // Check if amounts match
        const expectedAmount = confirmation.amount;
        const actualAmount = transaction.amount;
        const tolerance = new Decimal('0.00000001');

        if (expectedAmount.sub(actualAmount).abs().gt(tolerance)) {
          // Amount mismatch
          await this.createReconciliationEntry({
            entryType: 'DEPOSIT',
            referenceId: intent.id,
            expectedAmount,
            actualAmount,
            variance: expectedAmount.sub(actualAmount),
            currency: confirmation.currency,
            notes: `Amount mismatch: expected ${expectedAmount}, actual ${actualAmount}`,
          });

          await this.prisma.paymentConfirmation.update({
            where: { id: confirmation.id },
            data: { reconciliationStatus: 'VARIANCE' },
          });

          unreconciled++;
          continue;
        }

        // Mark as reconciled
        await this.prisma.paymentConfirmation.update({
          where: { id: confirmation.id },
          data: {
            reconciliationStatus: 'RECONCILED',
            reconciledTransactionId: transaction.id,
            reconciledAt: new Date(),
          },
        });

        reconciled++;

      } catch (error) {
        this.logger.error('Error reconciling deposit', {
          intentId: intent.id,
          error: error.message,
        });
        unreconciled++;
      }
    }

    return { processed, reconciled, unreconciled };
  }

  /**
   * Reconcile withdrawal requests with their confirmations and ledger entries
   */
  private async reconcileWithdrawals(startDate: Date, endDate: Date): Promise<{
    processed: number;
    reconciled: number;
    unreconciled: number;
  }> {
    const withdrawalRequests = await this.prisma.withdrawalRequest.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    let processed = 0;
    let reconciled = 0;
    let unreconciled = 0;

    for (const request of withdrawalRequests) {
      processed++;

      try {
        // Check if there's a payment confirmation
        const confirmation = await this.prisma.paymentConfirmation.findFirst({
          where: {
            withdrawalRequestId: request.id,
          },
        });

        if (!confirmation && request.status === 'CONFIRMED') {
          // Request is marked as confirmed but no confirmation record exists
          await this.createReconciliationEntry({
            entryType: 'WITHDRAWAL',
            referenceId: request.id,
            expectedAmount: request.amount,
            actualAmount: new Decimal(0),
            variance: request.amount,
            currency: request.currency,
            notes: 'Withdrawal request marked as confirmed but no payment confirmation found',
          });
          unreconciled++;
          continue;
        }

        if (!confirmation) {
          continue; // Still pending, nothing to reconcile
        }

        // Check if there's a corresponding ledger transaction
        const transaction = await this.prisma.transaction.findFirst({
          where: {
            userId: request.userId,
            type: 'WITHDRAWAL',
            currency: request.currency,
            reference: request.id,
          },
        });

        if (!transaction) {
          await this.createReconciliationEntry({
            entryType: 'WITHDRAWAL',
            referenceId: request.id,
            expectedAmount: confirmation.amount,
            actualAmount: new Decimal(0),
            variance: confirmation.amount,
            currency: confirmation.currency,
            notes: 'Payment confirmed but no ledger transaction created',
          });

          await this.prisma.paymentConfirmation.update({
            where: { id: confirmation.id },
            data: { reconciliationStatus: 'UNRECONCILED' },
          });

          unreconciled++;
          continue;
        }

        // Check if amounts match (considering fees)
        const expectedAmount = confirmation.amount;
        const actualAmount = transaction.amount.abs();
        const tolerance = new Decimal('0.00000001');

        if (expectedAmount.sub(actualAmount).abs().gt(tolerance)) {
          await this.createReconciliationEntry({
            entryType: 'WITHDRAWAL',
            referenceId: request.id,
            expectedAmount,
            actualAmount,
            variance: expectedAmount.sub(actualAmount),
            currency: confirmation.currency,
            notes: `Amount mismatch: expected ${expectedAmount}, actual ${actualAmount}`,
          });

          await this.prisma.paymentConfirmation.update({
            where: { id: confirmation.id },
            data: { reconciliationStatus: 'VARIANCE' },
          });

          unreconciled++;
          continue;
        }

        // Mark as reconciled
        await this.prisma.paymentConfirmation.update({
          where: { id: confirmation.id },
          data: {
            reconciliationStatus: 'RECONCILED',
            reconciledTransactionId: transaction.id,
            reconciledAt: new Date(),
          },
        });

        reconciled++;

      } catch (error) {
        this.logger.error('Error reconciling withdrawal', {
          requestId: request.id,
          error: error.message,
        });
        unreconciled++;
      }
    }

    return { processed, reconciled, unreconciled };
  }

  /**
   * Create a reconciliation entry for tracking discrepancies
   */
  private async createReconciliationEntry(data: {
    entryType: string;
    referenceId: string;
    expectedAmount: Decimal;
    actualAmount: Decimal;
    variance: Decimal;
    currency: Currency;
    notes: string;
    dailyCloseId?: string;
  }): Promise<void> {
    await this.prisma.reconciliationEntry.create({
      data: {
        dailyCloseId: data.dailyCloseId,
        entryType: data.entryType,
        referenceId: data.referenceId,
        expectedAmount: data.expectedAmount,
        actualAmount: data.actualAmount,
        variance: data.variance,
        currency: data.currency,
        status: 'UNRECONCILED',
        notes: data.notes,
      },
    });
  }

  /**
   * Get all pending unreconciled items
   */
  async getPendingReconciliationItems(limit: number = 100): Promise<UnreconciledItem[]> {
    const entries = await this.prisma.reconciliationEntry.findMany({
      where: { status: 'UNRECONCILED' },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return entries.map(entry => ({
      id: entry.id,
      type: entry.entryType as 'DEPOSIT' | 'WITHDRAWAL',
      amount: entry.expectedAmount.toString(),
      currency: entry.currency,
      reference: entry.referenceId,
      createdAt: entry.createdAt.toISOString(),
      reason: entry.notes || 'Unknown discrepancy',
    }));
  }

  /**
   * Mark a reconciliation entry as resolved
   */
  async resolveReconciliationEntry(
    entryId: string,
    resolvedBy: string,
    resolution: string,
  ): Promise<void> {
    await this.prisma.reconciliationEntry.update({
      where: { id: entryId },
      data: {
        status: 'RESOLVED',
        resolvedBy,
        notes: resolution,
        resolvedAt: new Date(),
      },
    });

    this.logger.log('Reconciliation entry resolved', {
      entryId,
      resolvedBy,
      resolution,
    });
  }

  /**
   * Get reconciliation statistics
   */
  async getReconciliationStats(dateFrom?: Date, dateTo?: Date): Promise<any> {
    const whereClause: any = {};
    
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) whereClause.createdAt.gte = dateFrom;
      if (dateTo) whereClause.createdAt.lte = dateTo;
    }

    const [totalEntries, unreconciledEntries, resolvedEntries] = await Promise.all([
      this.prisma.reconciliationEntry.count({ where: whereClause }),
      this.prisma.reconciliationEntry.count({
        where: { ...whereClause, status: 'UNRECONCILED' },
      }),
      this.prisma.reconciliationEntry.count({
        where: { ...whereClause, status: 'RESOLVED' },
      }),
    ]);

    // Get variance by currency
    const varianceByCurrency = await this.prisma.reconciliationEntry.groupBy({
      by: ['currency'],
      where: { ...whereClause, status: 'UNRECONCILED' },
      _sum: { variance: true },
      _count: true,
    });

    return {
      totalEntries,
      unreconciledEntries,
      resolvedEntries,
      reconciliationRate: totalEntries > 0 ? (resolvedEntries / totalEntries) * 100 : 100,
      varianceByCurrency: varianceByCurrency.map(item => ({
        currency: item.currency,
        totalVariance: item._sum.variance?.toString() || '0',
        count: item._count,
      })),
    };
  }
}