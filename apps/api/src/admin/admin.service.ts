import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(): Promise<any> {
    const totalUsers = await this.prisma.user.count();
    const activeUsers24h = await this.prisma.user.count({
      where: {
        lastLoginAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    const totalBets = await this.prisma.gameRound.count();
    
    return {
      totalUsers,
      newUsersToday: 0, // Mock
      activeUsers24h,
      totalBets,
      pendingWithdrawals: 0,
      pendingKycCases: 0,
      totalDeposits: { USD: '0', BTC: '0', ETH: '0' },
      totalWithdrawals: { USD: '0', BTC: '0', ETH: '0' },
      totalWagered: { USD: '0', BTC: '0', ETH: '0' },
      totalWinnings: { USD: '0', BTC: '0', ETH: '0' },
      ggr: { USD: '0', BTC: '0', ETH: '0' },
      ngr: { USD: '0', BTC: '0', ETH: '0' },
      averageSessionTime: 0,
      conversionRate: 0,
    };
  }

  async getUsers(page: number = 1, limit: number = 50): Promise<any> {
    const users = await this.prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.user.count();

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        kycStatus: user.kycStatus,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}