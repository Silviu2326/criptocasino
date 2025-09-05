import { Injectable } from '@nestjs/common';
import { register, Counter, Gauge, Histogram } from 'prom-client';

@Injectable()
export class AccountingMetrics {
  // Ledger Integrity Metrics
  public readonly ledgerImbalanceTotal = new Gauge({
    name: 'ledger_imbalance_total',
    help: 'Total system-wide ledger imbalance amount',
    labelNames: ['currency'],
    registers: [register],
  });

  public readonly accountImbalancesCount = new Gauge({
    name: 'ledger_account_imbalances_count',
    help: 'Number of accounts with balance imbalances',
    registers: [register],
  });

  public readonly ledgerIntegrityCheckDuration = new Histogram({
    name: 'ledger_integrity_check_duration_seconds',
    help: 'Duration of ledger integrity check operations',
    buckets: [0.1, 0.5, 1, 5, 10, 30],
    registers: [register],
  });

  public readonly ledgerIntegrityCheckResult = new Counter({
    name: 'ledger_integrity_check_total',
    help: 'Total ledger integrity checks performed',
    labelNames: ['result'], // 'pass' or 'fail'
    registers: [register],
  });

  // Daily Close Metrics
  public readonly dailyCloseSuccess = new Counter({
    name: 'daily_close_success_total',
    help: 'Number of successful daily closes',
    labelNames: ['date'],
    registers: [register],
  });

  public readonly dailyCloseFailed = new Counter({
    name: 'daily_close_failed_total',
    help: 'Number of failed daily closes',
    labelNames: ['date', 'error_type'],
    registers: [register],
  });

  public readonly dailyCloseDuration = new Histogram({
    name: 'daily_close_duration_seconds',
    help: 'Duration of daily close operations',
    buckets: [30, 60, 120, 300, 600, 1200],
    labelNames: ['date'],
    registers: [register],
  });

  public readonly dailyCloseUnreconciledItems = new Gauge({
    name: 'daily_close_unreconciled_items',
    help: 'Number of unreconciled items in daily close',
    labelNames: ['date', 'type'],
    registers: [register],
  });

  // Transaction Metrics
  public readonly transactionTotal = new Counter({
    name: 'ledger_transaction_total',
    help: 'Total number of ledger transactions processed',
    labelNames: ['type', 'currency', 'status'],
    registers: [register],
  });

  public readonly transactionAmount = new Counter({
    name: 'ledger_transaction_amount_total',
    help: 'Total amount of ledger transactions by type and currency',
    labelNames: ['type', 'currency'],
    registers: [register],
  });

  public readonly transactionDuration = new Histogram({
    name: 'ledger_transaction_duration_seconds',
    help: 'Duration of ledger transaction processing',
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
    labelNames: ['type'],
    registers: [register],
  });

  public readonly transactionFailures = new Counter({
    name: 'ledger_transaction_failures_total',
    help: 'Number of failed ledger transactions',
    labelNames: ['type', 'currency', 'failure_reason'],
    registers: [register],
  });

  // Balance Metrics
  public readonly totalBalance = new Gauge({
    name: 'ledger_total_balance',
    help: 'Total balance across all user accounts',
    labelNames: ['currency'],
    registers: [register],
  });

  public readonly lockedBalance = new Gauge({
    name: 'ledger_locked_balance',
    help: 'Total locked balance across all accounts',
    labelNames: ['currency'],
    registers: [register],
  });

  public readonly negativeBalanceAttempts = new Counter({
    name: 'ledger_negative_balance_attempts_total',
    help: 'Number of attempts to create negative balances (should always be blocked)',
    labelNames: ['currency'],
    registers: [register],
  });

  // Reconciliation Metrics
  public readonly reconciliationTotal = new Counter({
    name: 'reconciliation_total',
    help: 'Total reconciliation operations performed',
    labelNames: ['type', 'status'],
    registers: [register],
  });

  public readonly reconciliationDuration = new Histogram({
    name: 'reconciliation_duration_seconds',
    help: 'Duration of reconciliation operations',
    buckets: [1, 5, 15, 30, 60, 300],
    labelNames: ['type'],
    registers: [register],
  });

  public readonly unreconciledItems = new Gauge({
    name: 'reconciliation_unreconciled_items',
    help: 'Number of unreconciled items by type',
    labelNames: ['type', 'currency'],
    registers: [register],
  });

  public readonly reconciliationVariance = new Gauge({
    name: 'reconciliation_variance_amount',
    help: 'Total variance amount in unreconciled items',
    labelNames: ['type', 'currency'],
    registers: [register],
  });

  // Queue Metrics
  public readonly dailyCloseQueueSize = new Gauge({
    name: 'daily_close_queue_size',
    help: 'Number of jobs in daily close queue',
    labelNames: ['status'], // 'waiting', 'active', 'completed', 'failed'
    registers: [register],
  });

  public readonly reconciliationQueueSize = new Gauge({
    name: 'reconciliation_queue_size',
    help: 'Number of jobs in reconciliation queue',
    labelNames: ['status'],
    registers: [register],
  });

  // Financial Reporting Metrics
  public readonly grossGamingRevenue = new Gauge({
    name: 'financial_ggr',
    help: 'Gross Gaming Revenue by currency and period',
    labelNames: ['currency', 'period'],
    registers: [register],
  });

  public readonly netGamingRevenue = new Gauge({
    name: 'financial_ngr',
    help: 'Net Gaming Revenue by currency and period',
    labelNames: ['currency', 'period'],
    registers: [register],
  });

  public readonly dailyTransactionVolume = new Gauge({
    name: 'financial_transaction_volume_daily',
    help: 'Daily transaction volume by type and currency',
    labelNames: ['type', 'currency', 'date'],
    registers: [register],
  });

  // Utility methods for common metric operations
  recordTransaction(
    type: string,
    currency: string,
    amount: number,
    duration: number,
    status: 'success' | 'failure' = 'success'
  ) {
    this.transactionTotal.inc({ type, currency, status });
    this.transactionAmount.inc({ type, currency }, amount);
    this.transactionDuration.observe({ type }, duration);
  }

  recordTransactionFailure(
    type: string,
    currency: string,
    reason: string
  ) {
    this.transactionFailures.inc({ type, currency, failure_reason: reason });
    this.transactionTotal.inc({ type, currency, status: 'failure' });
  }

  recordLedgerIntegrityCheck(
    duration: number,
    result: 'pass' | 'fail',
    imbalanceAmount: number = 0,
    imbalancedAccountsCount: number = 0
  ) {
    this.ledgerIntegrityCheckDuration.observe(duration);
    this.ledgerIntegrityCheckResult.inc({ result });
    
    if (result === 'fail') {
      this.ledgerImbalanceTotal.set({ currency: 'total' }, imbalanceAmount);
      this.accountImbalancesCount.set(imbalancedAccountsCount);
    } else {
      this.ledgerImbalanceTotal.set({ currency: 'total' }, 0);
      this.accountImbalancesCount.set(0);
    }
  }

  recordDailyClose(
    date: string,
    duration: number,
    status: 'success' | 'failure',
    unreconciledCount: number = 0,
    errorType?: string
  ) {
    if (status === 'success') {
      this.dailyCloseSuccess.inc({ date });
    } else {
      this.dailyCloseFailed.inc({ date, error_type: errorType || 'unknown' });
    }
    
    this.dailyCloseDuration.observe({ date }, duration);
    this.dailyCloseUnreconciledItems.set({ date, type: 'total' }, unreconciledCount);
  }

  recordReconciliation(
    type: string,
    duration: number,
    status: 'success' | 'failure',
    processedCount: number,
    reconciledCount: number,
    unreconciledCount: number
  ) {
    this.reconciliationTotal.inc({ type, status });
    this.reconciliationDuration.observe({ type }, duration);
  }

  updateBalanceMetrics(balances: Array<{
    currency: string;
    totalBalance: number;
    totalLocked: number;
  }>) {
    balances.forEach(({ currency, totalBalance, totalLocked }) => {
      this.totalBalance.set({ currency }, totalBalance);
      this.lockedBalance.set({ currency }, totalLocked);
    });
  }

  updateUnreconciledMetrics(items: Array<{
    type: string;
    currency: string;
    count: number;
    totalVariance: number;
  }>) {
    items.forEach(({ type, currency, count, totalVariance }) => {
      this.unreconciledItems.set({ type, currency }, count);
      this.reconciliationVariance.set({ type, currency }, totalVariance);
    });
  }

  updateQueueMetrics(queueName: 'daily-close' | 'reconciliation', counts: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }) {
    const gauge = queueName === 'daily-close' 
      ? this.dailyCloseQueueSize 
      : this.reconciliationQueueSize;
    
    Object.entries(counts).forEach(([status, count]) => {
      gauge.set({ status }, count);
    });
  }

  updateFinancialMetrics(data: {
    ggr: Array<{ currency: string; period: string; amount: number }>;
    ngr: Array<{ currency: string; period: string; amount: number }>;
    dailyVolume: Array<{ type: string; currency: string; date: string; volume: number }>;
  }) {
    data.ggr.forEach(({ currency, period, amount }) => {
      this.grossGamingRevenue.set({ currency, period }, amount);
    });

    data.ngr.forEach(({ currency, period, amount }) => {
      this.netGamingRevenue.set({ currency, period }, amount);
    });

    data.dailyVolume.forEach(({ type, currency, date, volume }) => {
      this.dailyTransactionVolume.set({ type, currency, date }, volume);
    });
  }

  recordNegativeBalanceAttempt(currency: string) {
    this.negativeBalanceAttempts.inc({ currency });
  }
}