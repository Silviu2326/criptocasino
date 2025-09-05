import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UserProfile, UserBalances } from '@crypto-casino/types';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { responsibleGaming: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      walletAddress: user.walletAddress,
      role: user.role,
      country: user.country,
      dateOfBirth: user.dateOfBirth?.toISOString(),
      kycStatus: user.kycStatus,
      isVerified: user.kycStatus === 'VERIFIED',
      rgLimits: user.responsibleGaming ? {
        dailyDepositLimit: user.responsibleGaming.dailyDepositLimit?.toNumber(),
        weeklyDepositLimit: user.responsibleGaming.weeklyDepositLimit?.toNumber(),
        monthlyDepositLimit: user.responsibleGaming.monthlyDepositLimit?.toNumber(),
        dailyLossLimit: user.responsibleGaming.dailyLossLimit?.toNumber(),
        weeklyLossLimit: user.responsibleGaming.weeklyLossLimit?.toNumber(),
        monthlyLossLimit: user.responsibleGaming.monthlyLossLimit?.toNumber(),
        sessionTimeLimit: user.responsibleGaming.sessionTimeLimit,
      } : undefined,
      loyaltyTier: user.loyaltyTier,
      loyaltyXp: user.loyaltyXp,
      selfExcludedUntil: user.selfExcludedUntil?.toISOString() || null,
      cooldownUntil: user.cooldownUntil?.toISOString() || null,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async getUserBalances(userId: string): Promise<UserBalances> {
    const accounts = await this.prisma.ledgerAccount.findMany({
      where: { userId },
    });

    const balances: UserBalances = {};

    accounts.forEach(account => {
      balances[account.currency] = {
        currency: account.currency,
        available: account.balance.toString(),
        locked: account.locked.toString(),
        total: account.balance.add(account.locked).toString(),
      };
    });

    return balances;
  }
}