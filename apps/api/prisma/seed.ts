import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create game configurations
  const gameConfigs = [
    {
      gameType: 'DICE',
      minBet: {
        BTC: '0.00001',
        ETH: '0.0001',
        USDT: '0.1',
        USDC: '0.1',
        USD: '0.1',
      },
      maxBet: {
        BTC: '1',
        ETH: '10',
        USDT: '1000',
        USDC: '1000',
        USD: '1000',
      },
      houseEdge: 0.01,
      rtp: 0.99,
      isEnabled: true,
      config: {
        minTarget: 2,
        maxTarget: 98,
      },
    },
    {
      gameType: 'COINFLIP',
      minBet: {
        BTC: '0.00001',
        ETH: '0.0001',
        USDT: '0.1',
        USDC: '0.1',
        USD: '0.1',
      },
      maxBet: {
        BTC: '1',
        ETH: '10',
        USDT: '1000',
        USDC: '1000',
        USD: '1000',
      },
      houseEdge: 0.01,
      rtp: 0.99,
      isEnabled: true,
      config: {
        payout: 1.98,
      },
    },
    {
      gameType: 'SLOTS',
      minBet: {
        BTC: '0.00001',
        ETH: '0.0001',
        USDT: '0.1',
        USDC: '0.1',
        USD: '0.1',
      },
      maxBet: {
        BTC: '0.1',
        ETH: '1',
        USDT: '100',
        USDC: '100',
        USD: '100',
      },
      houseEdge: 0.05,
      rtp: 0.95,
      isEnabled: true,
      config: {
        maxLines: 25,
        symbols: ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven'],
      },
    },
  ];

  for (const config of gameConfigs) {
    await prisma.gameConfig.upsert({
      where: { gameType: config.gameType as any },
      update: config,
      create: config,
    });
  }

  // Create system settings
  const settings = [
    { key: 'SITE_NAME', value: 'Crypto Casino', type: 'STRING', description: 'Site name', category: 'GENERAL', isPublic: true },
    { key: 'MAINTENANCE_MODE', value: 'false', type: 'BOOLEAN', description: 'Maintenance mode', category: 'GENERAL', isPublic: true },
    { key: 'REGISTRATION_ENABLED', value: 'true', type: 'BOOLEAN', description: 'Allow new registrations', category: 'GENERAL', isPublic: true },
    { key: 'MIN_WITHDRAWAL_AMOUNT', value: '10', type: 'NUMBER', description: 'Minimum withdrawal amount', category: 'PAYMENTS', isPublic: false },
    { key: 'MAX_WITHDRAWAL_AMOUNT', value: '10000', type: 'NUMBER', description: 'Maximum withdrawal amount', category: 'PAYMENTS', isPublic: false },
    { key: 'AUTO_SEED_ROTATION_BETS', value: '1000', type: 'NUMBER', description: 'Auto rotate seeds after X bets', category: 'PROVABLY_FAIR', isPublic: true },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { ...setting, updatedBy: 'system' },
      create: { ...setting, updatedBy: 'system' },
    });
  }

  // Create sample bonuses
  const bonuses = [
    {
      type: 'WELCOME',
      name: 'Welcome Bonus',
      description: 'Get 100% bonus on your first deposit up to $100',
      currency: 'USD',
      percentage: 100,
      wageringRequirement: 30,
      maxWinAmount: 1000,
      minDepositAmount: 10,
      validForHours: 24 * 7, // 7 days
      maxUses: 1,
      termsAndConditions: 'Bonus valid for 7 days. 30x wagering requirement applies.',
      isActive: true,
    },
    {
      type: 'DEPOSIT',
      name: 'Reload Bonus',
      description: 'Get 50% bonus on deposits over $50',
      currency: 'USD',
      percentage: 50,
      wageringRequirement: 25,
      maxWinAmount: 500,
      minDepositAmount: 50,
      validForHours: 24 * 30, // 30 days
      termsAndConditions: 'Bonus available weekly. 25x wagering requirement applies.',
      promoCode: 'RELOAD50',
      isActive: true,
    },
    {
      type: 'CASHBACK',
      name: 'Weekly Cashback',
      description: 'Get 10% cashback on your losses',
      currency: 'USD',
      percentage: 10,
      wageringRequirement: 5,
      validForHours: 24 * 7, // 7 days
      termsAndConditions: 'Cashback calculated weekly. 5x wagering requirement applies.',
      isActive: true,
    },
  ];

  for (const bonus of bonuses) {
    await prisma.bonus.create({
      data: bonus as any,
    });
  }

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@crypto-casino.local' },
    update: {},
    create: {
      email: 'demo@crypto-casino.local',
      emailVerified: true,
      role: 'USER',
      country: 'US',
      kycStatus: 'VERIFIED',
      isActive: true,
      loyaltyTier: 1,
      loyaltyXp: 0,
    },
  });

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@crypto-casino.local' },
    update: {},
    create: {
      email: 'admin@crypto-casino.local',
      emailVerified: true,
      role: 'ADMIN',
      country: 'US',
      kycStatus: 'VERIFIED',
      isActive: true,
      loyaltyTier: 10,
      loyaltyXp: 50000,
    },
  });

  // Create ledger accounts for demo user
  const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'USD'];
  
  for (const currency of currencies) {
    await prisma.ledgerAccount.upsert({
      where: {
        userId_currency: {
          userId: demoUser.id,
          currency: currency as any,
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        currency: currency as any,
        balance: currency === 'USD' ? 1000 : currency === 'USDT' ? 1000 : currency === 'USDC' ? 1000 : currency === 'BTC' ? 0.1 : 1,
        locked: 0,
      },
    });

    // Create accounts for admin too
    await prisma.ledgerAccount.upsert({
      where: {
        userId_currency: {
          userId: adminUser.id,
          currency: currency as any,
        },
      },
      update: {},
      create: {
        userId: adminUser.id,
        currency: currency as any,
        balance: currency === 'USD' ? 10000 : currency === 'USDT' ? 10000 : currency === 'USDC' ? 10000 : currency === 'BTC' ? 1 : 10,
        locked: 0,
      },
    });
  }

  // Create demo responsible gaming settings
  await prisma.responsibleGaming.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      dailyDepositLimit: 500,
      weeklyDepositLimit: 2000,
      monthlyDepositLimit: 5000,
      dailyLossLimit: 200,
      weeklyLossLimit: 1000,
      monthlyLossLimit: 3000,
      sessionTimeLimit: 240, // 4 hours
    },
  });

  // Create initial server seed for provably fair
  const crypto = require('crypto');
  const serverSeed = crypto.randomBytes(32).toString('hex');
  const serverSeedHash = crypto.createHash('sha256').update(serverSeed).digest('hex');
  const clientSeed = crypto.randomBytes(16).toString('hex');

  await prisma.seedCommit.create({
    data: {
      userId: demoUser.id,
      serverSeed,
      serverSeedHash,
      clientSeed,
      nonce: 0,
      isRevealed: false,
    },
  });

  await prisma.seedCommit.create({
    data: {
      userId: adminUser.id,
      serverSeed: crypto.randomBytes(32).toString('hex'),
      serverSeedHash: crypto.createHash('sha256').update(crypto.randomBytes(32).toString('hex')).digest('hex'),
      clientSeed: crypto.randomBytes(16).toString('hex'),
      nonce: 0,
      isRevealed: false,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Demo user: demo@crypto-casino.local');
  console.log('👨‍💼 Admin user: admin@crypto-casino.local');
  console.log('🎰 Games configured with test limits');
  console.log('💰 Demo balances added');
  console.log('🎁 Sample bonuses created');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });