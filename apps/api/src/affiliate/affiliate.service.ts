import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  async getAffiliateSummary(userId: string): Promise<any> {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });

    if (!affiliate) {
      return null;
    }

    return {
      code: affiliate.code,
      status: affiliate.status,
      totalReferrals: affiliate.totalReferrals,
      activeReferrals: affiliate.activeReferrals,
      totalCommission: affiliate.totalCommission.toString(),
      pendingCommission: affiliate.pendingCommission.toString(),
      paidCommission: affiliate.paidCommission.toString(),
    };
  }

  async getAffiliateReferrals(affiliateId: string): Promise<any[]> {
    const attributions = await this.prisma.affiliateAttribution.findMany({
      where: { affiliateId },
      include: { user: true },
      orderBy: { attributedAt: 'desc' },
    });

    return attributions.map(attr => ({
      userId: attr.userId,
      email: attr.user.email,
      attributedAt: attr.attributedAt.toISOString(),
      firstDepositAt: attr.firstDepositAt?.toISOString(),
      totalDeposits: attr.totalDeposits.toString(),
      totalWagered: attr.totalWagered.toString(),
      ngr: attr.ngr.toString(),
    }));
  }
}