import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LedgerService } from '../ledger.service';
import { Currency, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('Ledger Integration Tests', () => {
  let service: LedgerService;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        LedgerService,
        PrismaService,
      ],
    }).compile();

    service = module.get<LedgerService>(LedgerService);
    prisma = module.get<PrismaService>(PrismaService);

    // Clean database before tests
    await prisma.ledgerEntry.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.ledgerAccount.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Clean up after tests
    await prisma.ledgerEntry.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.ledgerAccount.deleteMany({});
    await prisma.user.deleteMany({});
    await module.close();
  });

  beforeEach(async () => {
    // Clean between tests
    await prisma.ledgerEntry.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.ledgerAccount.deleteMany({});
    await prisma.user.deleteMany({
      where: { id: { not: 'house-account' } }
    });
  });

  describe('Double-Entry Bookkeeping', () => {
    it('should create balanced ledger entries for deposit', async () => {
      const userId = 'test-user-1';
      await createTestUser(userId);

      const transaction = await service.executeTransaction({
        userId,
        type: 'DEPOSIT',
        currency: 'USD',
        amount: new Decimal(100),
        description: 'Test deposit',
        reference: 'test-deposit-1',
      });

      // Verify transaction was created
      expect(transaction.transaction).toBeDefined();
      expect(transaction.transaction.amount.toString()).toBe('100');
      expect(transaction.transaction.type).toBe('DEPOSIT');

      // Verify ledger entries balance
      const entries = await prisma.ledgerEntry.findMany({
        where: { transactionId: transaction.transaction.id },
      });

      expect(entries).toHaveLength(1);
      expect(entries[0].amount.toString()).toBe('100');

      // Verify account balances
      const userAccount = await prisma.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency: 'USD' } },
      });
      expect(userAccount?.balance.toString()).toBe('100');
    });

    it('should maintain balance integrity across multiple transactions', async () => {
      const userId = 'test-user-2';
      await createTestUser(userId);

      // Initial deposit
      await service.executeTransaction({
        userId,
        type: 'DEPOSIT',
        currency: 'USD',
        amount: new Decimal(1000),
        description: 'Initial deposit',
      });

      // Multiple transactions
      const transactions = [
        { type: 'BET' as TransactionType, amount: new Decimal(100) },
        { type: 'WIN' as TransactionType, amount: new Decimal(150) },
        { type: 'BET' as TransactionType, amount: new Decimal(50) },
        { type: 'WITHDRAWAL' as TransactionType, amount: new Decimal(200) },
      ];

      let expectedBalance = new Decimal(1000);
      
      for (const tx of transactions) {
        await service.executeTransaction({
          userId,
          type: tx.type,
          currency: 'USD',
          amount: tx.amount,
          description: `Test ${tx.type}`,
        });

        // Update expected balance
        if (['BET', 'WITHDRAWAL', 'BONUS_WAGERING'].includes(tx.type)) {
          expectedBalance = expectedBalance.sub(tx.amount);
        } else {
          expectedBalance = expectedBalance.add(tx.amount);
        }

        // Verify balance matches expectation
        const account = await prisma.ledgerAccount.findUnique({
          where: { userId_currency: { userId, currency: 'USD' } },
        });
        expect(account?.balance.toString()).toBe(expectedBalance.toString());
      }

      // Verify ledger integrity
      const integrityCheck = await service.verifyLedgerIntegrity();
      expect(integrityCheck.isValid).toBe(true);
    });

    it('should prevent negative balances', async () => {
      const userId = 'test-user-3';
      await createTestUser(userId);

      // Small initial deposit
      await service.executeTransaction({
        userId,
        type: 'DEPOSIT',
        currency: 'USD',
        amount: new Decimal(50),
        description: 'Small deposit',
      });

      // Try to withdraw more than available
      await expect(
        service.executeTransaction({
          userId,
          type: 'WITHDRAWAL',
          currency: 'USD',
          amount: new Decimal(100),
          description: 'Overdraft attempt',
        })
      ).rejects.toThrow('Insufficient balance');

      // Balance should remain unchanged
      const account = await prisma.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency: 'USD' } },
      });
      expect(account?.balance.toString()).toBe('50');
    });

    it('should handle concurrent transactions safely', async () => {
      const userId = 'test-user-4';
      await createTestUser(userId);

      // Initial deposit
      await service.executeTransaction({
        userId,
        type: 'DEPOSIT',
        currency: 'USD',
        amount: new Decimal(1000),
        description: 'Initial deposit',
      });

      // Concurrent bet transactions
      const concurrentBets = Array.from({ length: 10 }, (_, i) => 
        service.executeTransaction({
          userId,
          type: 'BET',
          currency: 'USD',
          amount: new Decimal(50),
          description: `Concurrent bet ${i + 1}`,
        })
      );

      const results = await Promise.allSettled(concurrentBets);
      
      // Some transactions should succeed, some might fail due to insufficient balance
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected').length;

      expect(successes + failures).toBe(10);
      
      // Final balance should be non-negative and consistent
      const account = await prisma.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency: 'USD' } },
      });
      expect(account?.balance.gte(0)).toBe(true);

      // Verify ledger integrity after concurrent operations
      const integrityCheck = await service.verifyLedgerIntegrity();
      expect(integrityCheck.isValid).toBe(true);
    });

    it('should handle balance locking correctly', async () => {
      const userId = 'test-user-5';
      await createTestUser(userId);

      // Initial deposit
      await service.executeTransaction({
        userId,
        type: 'DEPOSIT',
        currency: 'USD',
        amount: new Decimal(500),
        description: 'Initial deposit',
      });

      // Lock some balance
      await service.lockBalance(userId, 'USD', new Decimal(200));

      // Verify locked balance
      const account = await prisma.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency: 'USD' } },
      });
      expect(account?.balance.toString()).toBe('300');
      expect(account?.locked.toString()).toBe('200');

      // Try to spend more than available (should fail)
      await expect(
        service.executeTransaction({
          userId,
          type: 'BET',
          currency: 'USD',
          amount: new Decimal(400),
          description: 'Should fail',
        })
      ).rejects.toThrow('Insufficient balance');

      // Unlock balance
      await service.unlockBalance(userId, 'USD', new Decimal(200));

      // Verify balance is unlocked
      const unlockedAccount = await prisma.ledgerAccount.findUnique({
        where: { userId_currency: { userId, currency: 'USD' } },
      });
      expect(unlockedAccount?.balance.toString()).toBe('500');
      expect(unlockedAccount?.locked.toString()).toBe('0');
    });
  });

  describe('Ledger Integrity Verification', () => {
    it('should detect account imbalances', async () => {
      const userId = 'test-user-6';
      await createTestUser(userId);

      // Create normal transactions
      await service.executeTransaction({
        userId,
        type: 'DEPOSIT',
        currency: 'USD',
        amount: new Decimal(100),
        description: 'Test deposit',
      });

      // Manually corrupt an account balance (simulate DB corruption)
      await prisma.ledgerAccount.update({
        where: { userId_currency: { userId, currency: 'USD' } },
        data: { balance: new Decimal(999) }, // Incorrect balance
      });

      // Integrity check should detect the imbalance
      const integrityCheck = await service.verifyLedgerIntegrity();
      expect(integrityCheck.isValid).toBe(false);
      expect(integrityCheck.accountImbalances.length).toBeGreaterThan(0);

      const imbalance = integrityCheck.accountImbalances.find(
        i => i.userId === userId
      );
      expect(imbalance).toBeDefined();
      expect(imbalance?.imbalance.toString()).toBe('899'); // 999 - 100
    });

    it('should verify system-wide balance integrity', async () => {
      const users = ['user-a', 'user-b', 'user-c'];
      
      // Create users and accounts
      for (const userId of users) {
        await createTestUser(userId);
        
        // Various transactions
        await service.executeTransaction({
          userId,
          type: 'DEPOSIT',
          currency: 'USD',
          amount: new Decimal(1000),
          description: 'Initial deposit',
        });

        await service.executeTransaction({
          userId,
          type: 'BET',
          currency: 'USD',
          amount: new Decimal(100),
          description: 'Test bet',
        });
      }

      // System-wide integrity check
      const integrityCheck = await service.verifyLedgerIntegrity();
      expect(integrityCheck.isValid).toBe(true);
      expect(integrityCheck.totalCredits.equals(integrityCheck.totalDebits)).toBe(true);
      expect(integrityCheck.accountImbalances).toHaveLength(0);
    });
  });

  // Helper functions
  async function createTestUser(userId: string) {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@test.com`,
        role: 'USER',
      },
    });
  }
});