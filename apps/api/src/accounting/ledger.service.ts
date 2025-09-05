import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Currency, TransactionType, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface LedgerTransactionRequest {
  userId: string;
  type: TransactionType;
  currency: Currency;
  amount: Decimal;
  description: string;
  reference?: string;
  metadata?: Record<string, any>;
  counterpartyUserId?: string; // For transfers between users
}

export interface LedgerEntry {
  accountId: string;
  amount: Decimal;
  description: string;
}

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Execute a ledger transaction with double-entry bookkeeping invariants
   * Every transaction MUST create exactly 2 balanced ledger entries
   */
  async executeTransaction(request: LedgerTransactionRequest): Promise<any> {
    // Validate request
    if (request.amount.equals(0)) {
      throw new BadRequestException('Transaction amount cannot be zero');
    }

    const isDebit = ['WITHDRAWAL', 'BET', 'BONUS_WAGERING'].includes(request.type);
    const isCredit = ['DEPOSIT', 'WIN', 'BONUS'].includes(request.type);

    if (!isDebit && !isCredit) {
      throw new BadRequestException(`Invalid transaction type: ${request.type}`);
    }

    return await this.prisma.$transaction(async (tx) => {
      // Get or create user accounts
      const userAccount = await this.getOrCreateAccount(tx, request.userId, request.currency);
      
      // Check for sufficient balance on debits
      if (isDebit && userAccount.balance.lt(request.amount.abs())) {
        throw new ConflictException('Insufficient balance for transaction');
      }

      // Create the main transaction record
      const balanceBefore = userAccount.balance;
      const transactionAmount = isDebit ? request.amount.neg() : request.amount;
      const balanceAfter = balanceBefore.add(transactionAmount);

      const transaction = await tx.transaction.create({
        data: {
          userId: request.userId,
          type: request.type,
          currency: request.currency,
          amount: transactionAmount,
          balanceBefore,
          balanceAfter,
          reference: request.reference,
          metadata: request.metadata || {},
        },
      });

      // Determine ledger entry structure based on transaction type
      let creditEntry: LedgerEntry;
      let debitEntry: LedgerEntry;

      const houseAccount = await this.getOrCreateHouseAccount(tx, request.currency);

      if (isDebit) {
        // User pays (debit user, credit house)
        debitEntry = {
          accountId: userAccount.id,
          amount: request.amount.abs(),
          description: request.description,
        };
        creditEntry = {
          accountId: houseAccount.id,
          amount: request.amount.abs(),
          description: request.description,
        };
      } else {
        // User receives (debit house, credit user)
        debitEntry = {
          accountId: houseAccount.id,
          amount: request.amount.abs(),
          description: request.description,
        };
        creditEntry = {
          accountId: userAccount.id,
          amount: request.amount.abs(),
          description: request.description,
        };
      }

      // Create exactly 2 balanced ledger entries
      const ledgerEntries = await Promise.all([
        tx.ledgerEntry.create({
          data: {
            userId: request.userId,
            transactionId: transaction.id,
            creditAccountId: creditEntry.accountId,
            debitAccountId: debitEntry.accountId,
            amount: creditEntry.amount,
            description: creditEntry.description,
            metadata: request.metadata || {},
          },
        }),
      ]);

      // Update account balances atomically
      await tx.ledgerAccount.update({
        where: { id: userAccount.id },
        data: { 
          balance: isDebit 
            ? { decrement: request.amount.abs() }
            : { increment: request.amount.abs() }
        },
      });

      // Update house account balance
      await tx.ledgerAccount.update({
        where: { id: houseAccount.id },
        data: { 
          balance: isDebit 
            ? { increment: request.amount.abs() }
            : { decrement: request.amount.abs() }
        },
      });

      // Verify invariants after transaction
      await this.verifyAccountBalance(tx, userAccount.id);
      await this.verifyAccountBalance(tx, houseAccount.id);

      return {
        transaction,
        ledgerEntries,
        balanceBefore,
        balanceAfter,
      };
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      timeout: 10000,
    });
  }

  /**
   * Verify that all ledger entries for an account sum to the current balance
   */
  async verifyAccountBalance(tx: any, accountId: string): Promise<boolean> {
    const account = await tx.ledgerAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error(`Account ${accountId} not found`);
    }

    // Sum all credits to this account
    const creditSum = await tx.ledgerEntry.aggregate({
      where: { creditAccountId: accountId },
      _sum: { amount: true },
    });

    // Sum all debits from this account  
    const debitSum = await tx.ledgerEntry.aggregate({
      where: { debitAccountId: accountId },
      _sum: { amount: true },
    });

    const credits = creditSum._sum.amount || new Decimal(0);
    const debits = debitSum._sum.amount || new Decimal(0);
    const calculatedBalance = credits.sub(debits);

    // Allow small precision differences (due to decimal arithmetic)
    const difference = account.balance.sub(calculatedBalance).abs();
    const tolerance = new Decimal('0.00000001'); // 1 satoshi tolerance

    if (difference.gt(tolerance)) {
      throw new Error(
        `Account ${accountId} balance mismatch: stored=${account.balance}, calculated=${calculatedBalance}, difference=${difference}`
      );
    }

    return true;
  }

  /**
   * Verify ledger integrity across all accounts
   */
  async verifyLedgerIntegrity(): Promise<{
    isValid: boolean;
    totalCredits: Decimal;
    totalDebits: Decimal;
    imbalance: Decimal;
    accountImbalances: Array<{
      accountId: string;
      userId: string;
      currency: Currency;
      storedBalance: Decimal;
      calculatedBalance: Decimal;
      imbalance: Decimal;
    }>;
  }> {
    const result = await this.prisma.$transaction(async (tx) => {
      // Check that total credits = total debits across all ledger entries
      const totalCredits = await tx.ledgerEntry.aggregate({
        _sum: { amount: true },
      });

      const totalDebits = await tx.ledgerEntry.aggregate({
        _sum: { amount: true },
      });

      const creditSum = totalCredits._sum.amount || new Decimal(0);
      const debitSum = totalDebits._sum.amount || new Decimal(0);
      const systemImbalance = creditSum.sub(debitSum);

      // Check individual account balances
      const accounts = await tx.ledgerAccount.findMany({
        include: { user: true },
      });

      const accountImbalances = [];

      for (const account of accounts) {
        try {
          await this.verifyAccountBalance(tx, account.id);
        } catch (error) {
          // Calculate the actual imbalance
          const creditSum = await tx.ledgerEntry.aggregate({
            where: { creditAccountId: account.id },
            _sum: { amount: true },
          });

          const debitSum = await tx.ledgerEntry.aggregate({
            where: { debitAccountId: account.id },
            _sum: { amount: true },
          });

          const credits = creditSum._sum.amount || new Decimal(0);
          const debits = debitSum._sum.amount || new Decimal(0);
          const calculatedBalance = credits.sub(debits);

          accountImbalances.push({
            accountId: account.id,
            userId: account.userId,
            currency: account.currency,
            storedBalance: account.balance,
            calculatedBalance,
            imbalance: account.balance.sub(calculatedBalance),
          });
        }
      }

      return {
        isValid: systemImbalance.abs().lt(new Decimal('0.00000001')) && accountImbalances.length === 0,
        totalCredits: creditSum,
        totalDebits: debitSum,
        imbalance: systemImbalance,
        accountImbalances,
      };
    });

    return result;
  }

  /**
   * Lock account balance for pending transactions
   */
  async lockBalance(userId: string, currency: Currency, amount: Decimal): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const account = await tx.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency } },
      });

      if (!account) {
        throw new Error(`Account not found for user ${userId} and currency ${currency}`);
      }

      if (account.balance.lt(amount)) {
        throw new ConflictException('Insufficient balance to lock');
      }

      await tx.ledgerAccount.update({
        where: { id: account.id },
        data: {
          balance: { decrement: amount },
          locked: { increment: amount },
        },
      });
    });
  }

  /**
   * Unlock previously locked balance
   */
  async unlockBalance(userId: string, currency: Currency, amount: Decimal): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const account = await tx.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency } },
      });

      if (!account) {
        throw new Error(`Account not found for user ${userId} and currency ${currency}`);
      }

      if (account.locked.lt(amount)) {
        throw new Error('Insufficient locked balance to unlock');
      }

      await tx.ledgerAccount.update({
        where: { id: account.id },
        data: {
          balance: { increment: amount },
          locked: { decrement: amount },
        },
      });
    });
  }

  private async getOrCreateAccount(tx: any, userId: string, currency: Currency) {
    const account = await tx.ledgerAccount.findUnique({
      where: { userId_currency: { userId, currency } },
    });

    if (account) {
      return account;
    }

    return await tx.ledgerAccount.create({
      data: {
        userId,
        currency,
        balance: new Decimal(0),
        locked: new Decimal(0),
      },
    });
  }

  private async getOrCreateHouseAccount(tx: any, currency: Currency) {
    const HOUSE_USER_ID = 'house-account';
    
    // Ensure house user exists
    await tx.user.upsert({
      where: { id: HOUSE_USER_ID },
      update: {},
      create: {
        id: HOUSE_USER_ID,
        email: 'house@crypto-casino.local',
        role: 'ADMIN',
      },
    });

    return await tx.ledgerAccount.upsert({
      where: { userId_currency: { userId: HOUSE_USER_ID, currency } },
      update: {},
      create: {
        userId: HOUSE_USER_ID,
        currency,
        balance: new Decimal(0),
        locked: new Decimal(0),
      },
    });
  }

  /**
   * Get account balance summary including pending transactions
   */
  async getAccountSummary(userId: string): Promise<any> {
    const accounts = await this.prisma.ledgerAccount.findMany({
      where: { userId },
    });

    const summary = {};
    
    for (const account of accounts) {
      const pendingTransactions = await this.prisma.transaction.count({
        where: {
          userId,
          currency: account.currency,
          // Could add status field to track pending vs completed
        },
      });

      summary[account.currency] = {
        available: account.balance,
        locked: account.locked,
        total: account.balance.add(account.locked),
        pendingTransactions,
      };
    }

    return summary;
  }
}