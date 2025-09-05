import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateDepositIntent, DepositIntent, CreateWithdrawalRequest } from '@crypto-casino/types';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createDepositIntent(userId: string, dto: CreateDepositIntent): Promise<DepositIntent> {
    // Mock implementation - in production would integrate with actual payment providers
    const intent = await this.prisma.depositIntent.create({
      data: {
        userId,
        amount: dto.amount,
        currency: dto.currency,
        provider: dto.provider || 'INTERNAL_WALLET',
        status: 'PENDING',
        paymentAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', // Mock address
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    return {
      id: intent.id,
      userId: intent.userId,
      amount: intent.amount.toString(),
      currency: intent.currency,
      provider: intent.provider,
      status: intent.status,
      paymentAddress: intent.paymentAddress,
      paymentUrl: intent.paymentUrl,
      providerReference: intent.providerReference,
      txHash: intent.txHash,
      confirmations: intent.confirmations,
      requiredConfirmations: intent.requiredConfirmations,
      expiresAt: intent.expiresAt.toISOString(),
      createdAt: intent.createdAt.toISOString(),
      updatedAt: intent.updatedAt.toISOString(),
    };
  }

  async createWithdrawalRequest(userId: string, dto: CreateWithdrawalRequest): Promise<any> {
    // Mock implementation
    const request = await this.prisma.withdrawalRequest.create({
      data: {
        userId,
        amount: dto.amount,
        currency: dto.currency,
        address: dto.address,
        status: 'PENDING',
      },
    });

    return {
      id: request.id,
      userId: request.userId,
      amount: request.amount.toString(),
      currency: request.currency,
      address: request.address,
      status: request.status,
      createdAt: request.createdAt.toISOString(),
    };
  }

  async getUserDeposits(userId: string): Promise<any[]> {
    const deposits = await this.prisma.depositIntent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return deposits.map(deposit => ({
      id: deposit.id,
      amount: deposit.amount.toString(),
      currency: deposit.currency,
      provider: deposit.provider,
      status: deposit.status,
      createdAt: deposit.createdAt.toISOString(),
    }));
  }

  async getUserWithdrawals(userId: string): Promise<any[]> {
    const withdrawals = await this.prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      amount: withdrawal.amount.toString(),
      currency: withdrawal.currency,
      address: withdrawal.address,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt.toISOString(),
    }));
  }
}