import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BonusService {
  constructor(private prisma: PrismaService) {}

  async getAvailableBonuses(): Promise<any[]> {
    const bonuses = await this.prisma.bonus.findMany({
      where: { isActive: true },
    });

    return bonuses.map(bonus => ({
      id: bonus.id,
      type: bonus.type,
      name: bonus.name,
      description: bonus.description,
      amount: bonus.amount?.toString(),
      percentage: bonus.percentage?.toNumber(),
      wageringRequirement: bonus.wageringRequirement.toNumber(),
    }));
  }

  async getUserBonuses(userId: string): Promise<any[]> {
    const grants = await this.prisma.bonusGrant.findMany({
      where: { userId },
      include: { bonus: true },
      orderBy: { grantedAt: 'desc' },
    });

    return grants.map(grant => ({
      id: grant.id,
      bonusName: grant.bonus.name,
      status: grant.status,
      bonusAmount: grant.bonusAmount.toString(),
      wageringProgress: grant.wageringProgress.toString(),
      wageringRequirement: grant.wageringRequirement.toString(),
      expiresAt: grant.expiresAt.toISOString(),
    }));
  }
}