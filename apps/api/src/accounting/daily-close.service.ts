import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { LedgerService } from './ledger.service';
import { Currency } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface DailyCloseResult {
  closeId: string;
  closeDate: Date;
  balancesSnapshot: Record<string, any>;
  financialSummary: {
    deposits: Record<Currency, Decimal>;
    withdrawals: Record<Currency, Decimal>;
    bets: Record<Currency, Decimal>;
    wins: Record<Currency, Decimal>;
    bonuses: Record<Currency, Decimal>;
    ggr: Record<Currency, Decimal>;
    ngr: Record<Currency, Decimal>;
  };
  integrityCheck: {
    isValid: boolean;
    imbalance: Decimal;
    accountImbalances: any[];
  };
  varianceFromPrevious: Record<string, any>;
  exportFilePath?: string;
}

@Injectable()
export class DailyCloseService {
  private readonly logger = new Logger(DailyCloseService.name);

  constructor(
    private prisma: PrismaService,
    private ledgerService: LedgerService,
  ) {}

  /**
   * Execute daily close for a specific date
   */
  async executeDailyClose(closeDate: Date): Promise<DailyCloseResult> {
    this.logger.log(`Starting daily close for ${closeDate.toISOString()}`);

    // Check if close already exists
    const existingClose = await this.prisma.dailyClose.findUnique({
      where: { closeDate },
    });

    if (existingClose && existingClose.status === 'COMPLETED') {
      throw new Error(`Daily close for ${closeDate.toISOString()} already completed`);
    }

    // Create or update close record
    const dailyClose = await this.prisma.dailyClose.upsert({
      where: { closeDate },
      update: {
        status: 'IN_PROGRESS',
        updatedAt: new Date(),
      },
      create: {
        closeDate,
        status: 'IN_PROGRESS',
      },
    });

    try {
      // Step 1: Create balance snapshots for all accounts
      const balancesSnapshot = await this.createBalanceSnapshots(dailyClose.id, closeDate);

      // Step 2: Calculate financial summaries
      const financialSummary = await this.calculateFinancialSummary(closeDate);

      // Step 3: Verify ledger integrity
      const integrityCheck = await this.ledgerService.verifyLedgerIntegrity();

      // Step 4: Calculate variance from previous day
      const varianceFromPrevious = await this.calculateVarianceFromPrevious(closeDate, financialSummary);

      // Step 5: Count unreconciled items
      const unreconciled = await this.countUnreconciledItems();

      // Step 6: Export to CSV
      const exportFilePath = await this.exportToCSV(dailyClose.id, {
        closeDate,
        balancesSnapshot,
        financialSummary,
        integrityCheck,
        varianceFromPrevious,
      });

      // Step 7: Update close record with results
      await this.prisma.dailyClose.update({
        where: { id: dailyClose.id },
        data: {
          status: integrityCheck.isValid ? 'COMPLETED' : 'FAILED',
          totalUsers: balancesSnapshot.totalUsers,
          totalTransactions: balancesSnapshot.totalTransactions,
          balancesSnapshot: balancesSnapshot.accounts,
          depositsummary: this.convertDecimalMapToJSON(financialSummary.deposits),
          withdrawalsSummary: this.convertDecimalMapToJSON(financialSummary.withdrawals),
          betsSummary: this.convertDecimalMapToJSON(financialSummary.bets),
          winsSummary: this.convertDecimalMapToJSON(financialSummary.wins),
          bonusesSummary: this.convertDecimalMapToJSON(financialSummary.bonuses),
          ggrByCurrency: this.convertDecimalMapToJSON(financialSummary.ggr),
          ngrByCurrency: this.convertDecimalMapToJSON(financialSummary.ngr),
          varianceFromPrevious,
          unreconciledCount: unreconciled.count,
          ledgerIntegrityCheck: integrityCheck.isValid,
          exportFilePath,
          completedAt: new Date(),
          errorDetails: !integrityCheck.isValid ? {
            imbalance: integrityCheck.imbalance.toString(),
            accountImbalances: integrityCheck.accountImbalances,
          } : null,
        },
      });

      const result: DailyCloseResult = {
        closeId: dailyClose.id,
        closeDate,
        balancesSnapshot: balancesSnapshot.accounts,
        financialSummary,
        integrityCheck,
        varianceFromPrevious,
        exportFilePath,
      };

      this.logger.log(`Daily close completed successfully for ${closeDate.toISOString()}`);
      return result;

    } catch (error) {
      this.logger.error(`Daily close failed for ${closeDate.toISOString()}: ${error.message}`, error.stack);

      // Update close record with error
      await this.prisma.dailyClose.update({
        where: { id: dailyClose.id },
        data: {
          status: 'FAILED',
          errorDetails: {
            error: error.message,
            stack: error.stack,
          },
          updatedAt: new Date(),
        },
      });

      throw error;
    }
  }

  /**
   * Create snapshots of all account balances at close date
   */
  private async createBalanceSnapshots(dailyCloseId: string, closeDate: Date): Promise<any> {
    const endOfDay = new Date(closeDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all accounts with balances
    const accounts = await this.prisma.ledgerAccount.findMany({
      include: { user: true },
    });

    const snapshots = [];
    
    for (const account of accounts) {
      // Calculate cumulative totals up to close date
      const deposits = await this.prisma.transaction.aggregate({
        where: {
          userId: account.userId,
          currency: account.currency,
          type: 'DEPOSIT',
          createdAt: { lte: endOfDay },
        },
        _sum: { amount: true },
      });

      const withdrawals = await this.prisma.transaction.aggregate({
        where: {
          userId: account.userId,
          currency: account.currency,
          type: 'WITHDRAWAL',
          createdAt: { lte: endOfDay },
        },
        _sum: { amount: true },
      });

      const bets = await this.prisma.transaction.aggregate({
        where: {
          userId: account.userId,
          currency: account.currency,
          type: 'BET',
          createdAt: { lte: endOfDay },
        },
        _sum: { amount: true },
      });

      const wins = await this.prisma.transaction.aggregate({
        where: {
          userId: account.userId,
          currency: account.currency,
          type: 'WIN',
          createdAt: { lte: endOfDay },
        },
        _sum: { amount: true },
      });

      const bonuses = await this.prisma.transaction.aggregate({
        where: {
          userId: account.userId,
          currency: account.currency,
          type: 'BONUS',
          createdAt: { lte: endOfDay },
        },
        _sum: { amount: true },
      });

      const snapshot = await this.prisma.ledgerSnapshot.create({
        data: {
          dailyCloseId,
          userId: account.userId,
          currency: account.currency,
          balance: account.balance,
          locked: account.locked,
          totalDeposits: deposits._sum.amount || new Decimal(0),
          totalWithdrawals: withdrawals._sum.amount?.abs() || new Decimal(0),
          totalBets: bets._sum.amount?.abs() || new Decimal(0),
          totalWins: wins._sum.amount || new Decimal(0),
          totalBonuses: bonuses._sum.amount || new Decimal(0),
        },
      });

      snapshots.push(snapshot);
    }

    const totalUsers = await this.prisma.user.count({
      where: {
        createdAt: { lte: endOfDay },
      },
    });

    const totalTransactions = await this.prisma.transaction.count({
      where: {
        createdAt: { lte: endOfDay },
      },
    });

    return {
      totalUsers,
      totalTransactions,
      accounts: snapshots.map(s => ({
        userId: s.userId,
        currency: s.currency,
        balance: s.balance.toString(),
        locked: s.locked.toString(),
        totalDeposits: s.totalDeposits.toString(),
        totalWithdrawals: s.totalWithdrawals.toString(),
        totalBets: s.totalBets.toString(),
        totalWins: s.totalWins.toString(),
        totalBonuses: s.totalBonuses.toString(),
      })),
    };
  }

  /**
   * Calculate financial summary for the day
   */
  private async calculateFinancialSummary(closeDate: Date): Promise<any> {
    const startOfDay = new Date(closeDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(closeDate);
    endOfDay.setHours(23, 59, 59, 999);

    const currencies: Currency[] = ['BTC', 'ETH', 'USDT', 'USDC', 'USD'];
    const summary = {
      deposits: {} as Record<Currency, Decimal>,
      withdrawals: {} as Record<Currency, Decimal>,
      bets: {} as Record<Currency, Decimal>,
      wins: {} as Record<Currency, Decimal>,
      bonuses: {} as Record<Currency, Decimal>,
      ggr: {} as Record<Currency, Decimal>,
      ngr: {} as Record<Currency, Decimal>,
    };

    for (const currency of currencies) {
      // Deposits for the day
      const depositsResult = await this.prisma.transaction.aggregate({
        where: {
          currency,
          type: 'DEPOSIT',
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      });
      summary.deposits[currency] = depositsResult._sum.amount || new Decimal(0);

      // Withdrawals for the day
      const withdrawalsResult = await this.prisma.transaction.aggregate({
        where: {
          currency,
          type: 'WITHDRAWAL',
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      });
      summary.withdrawals[currency] = withdrawalsResult._sum.amount?.abs() || new Decimal(0);

      // Bets for the day
      const betsResult = await this.prisma.transaction.aggregate({
        where: {
          currency,
          type: 'BET',
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      });
      summary.bets[currency] = betsResult._sum.amount?.abs() || new Decimal(0);

      // Wins for the day
      const winsResult = await this.prisma.transaction.aggregate({
        where: {
          currency,
          type: 'WIN',
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      });
      summary.wins[currency] = winsResult._sum.amount || new Decimal(0);

      // Bonuses for the day
      const bonusesResult = await this.prisma.transaction.aggregate({
        where: {
          currency,
          type: 'BONUS',
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        _sum: { amount: true },
      });
      summary.bonuses[currency] = bonusesResult._sum.amount || new Decimal(0);

      // Calculate GGR (Gross Gaming Revenue) = Bets - Wins
      summary.ggr[currency] = summary.bets[currency].sub(summary.wins[currency]);

      // Calculate NGR (Net Gaming Revenue) = GGR - Bonuses
      summary.ngr[currency] = summary.ggr[currency].sub(summary.bonuses[currency]);
    }

    return summary;
  }

  /**
   * Calculate variance from previous day
   */
  private async calculateVarianceFromPrevious(closeDate: Date, currentSummary: any): Promise<any> {
    const previousDate = new Date(closeDate);
    previousDate.setDate(previousDate.getDate() - 1);

    const previousClose = await this.prisma.dailyClose.findUnique({
      where: { closeDate: previousDate },
    });

    if (!previousClose) {
      return { message: 'No previous day data available' };
    }

    const variance = {};
    const currencies: Currency[] = ['BTC', 'ETH', 'USDT', 'USDC', 'USD'];

    for (const currency of currencies) {
      const currentNGR = currentSummary.ngr[currency] || new Decimal(0);
      const previousNGR = new Decimal(previousClose.ngrByCurrency?.[currency] || 0);
      
      variance[currency] = {
        ngrVariance: currentNGR.sub(previousNGR).toString(),
        ngrVariancePercent: previousNGR.gt(0) 
          ? currentNGR.sub(previousNGR).div(previousNGR).mul(100).toString()
          : 'N/A',
      };
    }

    return variance;
  }

  /**
   * Count unreconciled items
   */
  private async countUnreconciledItems(): Promise<{ count: number; details: any }> {
    const unreconciledPayments = await this.prisma.paymentConfirmation.count({
      where: { reconciliationStatus: 'PENDING' },
    });

    const unreconciledEntries = await this.prisma.reconciliationEntry.count({
      where: { status: 'UNRECONCILED' },
    });

    return {
      count: unreconciledPayments + unreconciledEntries,
      details: {
        unreconciledPayments,
        unreconciledEntries,
      },
    };
  }

  /**
   * Export daily close data to CSV
   */
  private async exportToCSV(dailyCloseId: string, data: any): Promise<string> {
    const exportDir = process.env.DAILY_CLOSE_EXPORT_DIR || './exports';
    await fs.mkdir(exportDir, { recursive: true });

    const filename = `daily-close-${data.closeDate.toISOString().split('T')[0]}.csv`;
    const filepath = path.join(exportDir, filename);

    const csvContent = this.generateCSVContent(data);
    await fs.writeFile(filepath, csvContent, 'utf8');

    return filepath;
  }

  /**
   * Generate CSV content for daily close
   */
  private generateCSVContent(data: any): string {
    let csv = '';

    // Header information
    csv += `Daily Close Report\n`;
    csv += `Date,${data.closeDate.toISOString().split('T')[0]}\n`;
    csv += `Generated,${new Date().toISOString()}\n\n`;

    // Financial Summary
    csv += `Financial Summary\n`;
    csv += `Currency,Deposits,Withdrawals,Bets,Wins,Bonuses,GGR,NGR\n`;
    
    const currencies: Currency[] = ['BTC', 'ETH', 'USDT', 'USDC', 'USD'];
    currencies.forEach(currency => {
      csv += `${currency},`;
      csv += `${data.financialSummary.deposits[currency]?.toString() || '0'},`;
      csv += `${data.financialSummary.withdrawals[currency]?.toString() || '0'},`;
      csv += `${data.financialSummary.bets[currency]?.toString() || '0'},`;
      csv += `${data.financialSummary.wins[currency]?.toString() || '0'},`;
      csv += `${data.financialSummary.bonuses[currency]?.toString() || '0'},`;
      csv += `${data.financialSummary.ggr[currency]?.toString() || '0'},`;
      csv += `${data.financialSummary.ngr[currency]?.toString() || '0'}\n`;
    });

    csv += `\n`;

    // Integrity Check
    csv += `Integrity Check\n`;
    csv += `Status,${data.integrityCheck.isValid ? 'PASSED' : 'FAILED'}\n`;
    csv += `Total Credits,${data.integrityCheck.totalCredits}\n`;
    csv += `Total Debits,${data.integrityCheck.totalDebits}\n`;
    csv += `Imbalance,${data.integrityCheck.imbalance}\n\n`;

    // Account Imbalances (if any)
    if (data.integrityCheck.accountImbalances.length > 0) {
      csv += `Account Imbalances\n`;
      csv += `Account ID,User ID,Currency,Stored Balance,Calculated Balance,Imbalance\n`;
      data.integrityCheck.accountImbalances.forEach(imbalance => {
        csv += `${imbalance.accountId},${imbalance.userId},${imbalance.currency},`;
        csv += `${imbalance.storedBalance},${imbalance.calculatedBalance},${imbalance.imbalance}\n`;
      });
      csv += `\n`;
    }

    return csv;
  }

  private convertDecimalMapToJSON(map: Record<string, Decimal>): Record<string, string> {
    const result = {};
    Object.entries(map).forEach(([key, value]) => {
      result[key] = value.toString();
    });
    return result;
  }
}