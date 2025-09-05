import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Currency } from '@crypto-casino/types';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ResponsibleGamingService {
  constructor(private prisma: PrismaService) {}

  async validateBet(userId: string, betAmount: string, currency: Currency): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { responsibleGaming: true },
    });

    if (!user) return;

    // Check if user is self-excluded
    if (user.selfExcludedUntil && user.selfExcludedUntil > new Date()) {
      throw new ForbiddenException('Account is self-excluded until ' + user.selfExcludedUntil.toISOString());
    }

    // Check cooldown
    if (user.cooldownUntil && user.cooldownUntil > new Date()) {
      throw new ForbiddenException('Account is in cooldown until ' + user.cooldownUntil.toISOString());
    }

    const rgLimits = user.responsibleGaming;
    if (!rgLimits) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Check deposit limits
    if (rgLimits.dailyDepositLimit) {
      const todayDeposits = await this.getTotalDeposits(userId, currency, today);
      if (todayDeposits.add(betAmount).gt(rgLimits.dailyDepositLimit)) {
        throw new ForbiddenException('Daily deposit limit exceeded');
      }
    }

    if (rgLimits.weeklyDepositLimit) {
      const weekDeposits = await this.getTotalDeposits(userId, currency, thisWeek);
      if (weekDeposits.add(betAmount).gt(rgLimits.weeklyDepositLimit)) {
        throw new ForbiddenException('Weekly deposit limit exceeded');
      }
    }

    if (rgLimits.monthlyDepositLimit) {
      const monthDeposits = await this.getTotalDeposits(userId, currency, thisMonth);
      if (monthDeposits.add(betAmount).gt(rgLimits.monthlyDepositLimit)) {
        throw new ForbiddenException('Monthly deposit limit exceeded');
      }
    }

    // Check loss limits
    if (rgLimits.dailyLossLimit) {
      const todayLoss = await this.getTotalLoss(userId, currency, today);
      if (todayLoss.add(betAmount).gt(rgLimits.dailyLossLimit)) {
        throw new ForbiddenException('Daily loss limit would be exceeded');
      }
    }

    if (rgLimits.weeklyLossLimit) {
      const weekLoss = await this.getTotalLoss(userId, currency, thisWeek);
      if (weekLoss.add(betAmount).gt(rgLimits.weeklyLossLimit)) {
        throw new ForbiddenException('Weekly loss limit would be exceeded');
      }
    }

    if (rgLimits.monthlyLossLimit) {
      const monthLoss = await this.getTotalLoss(userId, currency, thisMonth);
      if (monthLoss.add(betAmount).gt(rgLimits.monthlyLossLimit)) {
        throw new ForbiddenException('Monthly loss limit would be exceeded');
      }
    }
  }

  private async getTotalDeposits(userId: string, currency: Currency, since: Date): Promise<Decimal> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        userId,
        currency,
        type: 'DEPOSIT',
        createdAt: { gte: since },
      },
      _sum: { amount: true },
    });

    return result._sum.amount || new Decimal(0);
  }

  private async getTotalLoss(userId: string, currency: Currency, since: Date): Promise<Decimal> {
    const bets = await this.prisma.transaction.aggregate({
      where: {
        userId,
        currency,
        type: 'BET',
        createdAt: { gte: since },
      },
      _sum: { amount: true },
    });

    const wins = await this.prisma.transaction.aggregate({
      where: {
        userId,
        currency,
        type: 'WIN',
        createdAt: { gte: since },
      },
      _sum: { amount: true },
    });

    const betAmount = bets._sum.amount || new Decimal(0);
    const winAmount = wins._sum.amount || new Decimal(0);

    return betAmount.abs().sub(winAmount);
  }
}