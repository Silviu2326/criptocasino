import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { ProvablyFairService } from '../provably-fair/provably-fair.service';
import { ResponsibleGamingService } from '../responsible-gaming/responsible-gaming.service';
import { 
  DiceBet, 
  CoinflipBet, 
  SlotsBet, 
  GameRound, 
  GameStats,
  GameType,
  Currency 
} from '@crypto-casino/types';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private provablyFairService: ProvablyFairService,
    private responsibleGamingService: ResponsibleGamingService,
  ) {}

  async playDice(userId: string, dto: DiceBet): Promise<GameRound> {
    await this.validateBet(userId, dto.betAmount, dto.currency);

    const seedInfo = await this.provablyFairService.getCurrentSeed(userId);
    const seedCommit = await this.prisma.seedCommit.findFirst({
      where: { serverSeedHash: seedInfo.serverSeedHash, userId },
    });

    if (!seedCommit) {
      throw new BadRequestException('Invalid seed state');
    }

    const nonce = await this.provablyFairService.incrementNonce(seedCommit.id);
    const roll = this.provablyFairService.generateGameResult(
      seedCommit.serverSeed,
      seedCommit.clientSeed!,
      nonce,
      'DICE'
    );

    const isWin = dto.isUnder ? roll < dto.target : roll > dto.target;
    const multiplier = isWin ? this.calculateDiceMultiplier(dto.target, dto.isUnder) : 0;
    const winAmount = new Decimal(dto.betAmount).mul(multiplier);

    const gameRound = await this.prisma.gameRound.create({
      data: {
        userId,
        seedCommitId: seedCommit.id,
        gameType: 'DICE',
        status: 'COMPLETED',
        betAmount: new Decimal(dto.betAmount),
        currency: dto.currency,
        multiplier: new Decimal(multiplier),
        winAmount,
        nonce,
        result: {
          roll,
          target: dto.target,
          isUnder: dto.isUnder,
          multiplier,
          isWin,
        },
        completedAt: new Date(),
      },
    });

    await this.processGameResult(userId, dto.currency, dto.betAmount, winAmount.toString(), gameRound.id);

    return this.formatGameRound(gameRound);
  }

  async playCoinflip(userId: string, dto: CoinflipBet): Promise<GameRound> {
    await this.validateBet(userId, dto.betAmount, dto.currency);

    const seedInfo = await this.provablyFairService.getCurrentSeed(userId);
    const seedCommit = await this.prisma.seedCommit.findFirst({
      where: { serverSeedHash: seedInfo.serverSeedHash, userId },
    });

    if (!seedCommit) {
      throw new BadRequestException('Invalid seed state');
    }

    const nonce = await this.provablyFairService.incrementNonce(seedCommit.id);
    const result = this.provablyFairService.generateGameResult(
      seedCommit.serverSeed,
      seedCommit.clientSeed!,
      nonce,
      'COINFLIP'
    );

    const isWin = result === dto.side;
    const multiplier = isWin ? 1.98 : 0; // 1% house edge
    const winAmount = new Decimal(dto.betAmount).mul(multiplier);

    const gameRound = await this.prisma.gameRound.create({
      data: {
        userId,
        seedCommitId: seedCommit.id,
        gameType: 'COINFLIP',
        status: 'COMPLETED',
        betAmount: new Decimal(dto.betAmount),
        currency: dto.currency,
        multiplier: new Decimal(multiplier),
        winAmount,
        nonce,
        result: {
          result,
          playerChoice: dto.side,
          multiplier,
          isWin,
        },
        completedAt: new Date(),
      },
    });

    await this.processGameResult(userId, dto.currency, dto.betAmount, winAmount.toString(), gameRound.id);

    return this.formatGameRound(gameRound);
  }

  async playSlots(userId: string, dto: SlotsBet): Promise<GameRound> {
    await this.validateBet(userId, dto.betAmount, dto.currency);

    const seedInfo = await this.provablyFairService.getCurrentSeed(userId);
    const seedCommit = await this.prisma.seedCommit.findFirst({
      where: { serverSeedHash: seedInfo.serverSeedHash, userId },
    });

    if (!seedCommit) {
      throw new BadRequestException('Invalid seed state');
    }

    const nonce = await this.provablyFairService.incrementNonce(seedCommit.id);
    const slotsResult = this.provablyFairService.generateGameResult(
      seedCommit.serverSeed,
      seedCommit.clientSeed!,
      nonce,
      'SLOTS'
    );

    const { multiplier, lines } = this.calculateSlotsResult(slotsResult.reels, dto.lines);
    const isWin = multiplier > 0;
    const winAmount = new Decimal(dto.betAmount).mul(multiplier);

    const gameRound = await this.prisma.gameRound.create({
      data: {
        userId,
        seedCommitId: seedCommit.id,
        gameType: 'SLOTS',
        status: 'COMPLETED',
        betAmount: new Decimal(dto.betAmount),
        currency: dto.currency,
        multiplier: new Decimal(multiplier),
        winAmount,
        nonce,
        result: {
          reels: slotsResult.reels,
          lines,
          totalMultiplier: multiplier,
          isWin,
        },
        completedAt: new Date(),
      },
    });

    await this.processGameResult(userId, dto.currency, dto.betAmount, winAmount.toString(), gameRound.id);

    return this.formatGameRound(gameRound);
  }

  async getUserGameStats(userId: string): Promise<GameStats> {
    const stats = await this.prisma.gameRound.groupBy({
      by: ['gameType'],
      where: { userId, status: 'COMPLETED' },
      _count: { _all: true },
      _sum: { betAmount: true, winAmount: true },
    });

    const totalStats = stats.reduce(
      (acc, stat) => ({
        totalBets: acc.totalBets + stat._count._all,
        totalWagered: acc.totalWagered.add(stat._sum.betAmount || 0),
        totalWon: acc.totalWon.add(stat._sum.winAmount || 0),
      }),
      {
        totalBets: 0,
        totalWagered: new Decimal(0),
        totalWon: new Decimal(0),
      }
    );

    const biggestWin = await this.prisma.gameRound.findFirst({
      where: { userId, status: 'COMPLETED' },
      orderBy: { winAmount: 'desc' },
      select: { winAmount: true },
    });

    const winCount = await this.prisma.gameRound.count({
      where: { userId, status: 'COMPLETED', winAmount: { gt: 0 } },
    });

    return {
      totalBets: totalStats.totalBets,
      totalWagered: totalStats.totalWagered.toString(),
      totalWon: totalStats.totalWon.toString(),
      netProfit: totalStats.totalWon.sub(totalStats.totalWagered).toString(),
      winRate: totalStats.totalBets > 0 ? winCount / totalStats.totalBets : 0,
      biggestWin: biggestWin?.winAmount.toString() || '0',
      favoriteGame: stats.length > 0 
        ? stats.reduce((a, b) => (a._count._all > b._count._all ? a : b)).gameType as GameType
        : undefined,
    };
  }

  private async validateBet(userId: string, betAmount: string, currency: Currency): Promise<void> {
    // Check responsible gaming limits
    await this.responsibleGamingService.validateBet(userId, betAmount, currency);

    // Check user balance
    const account = await this.prisma.ledgerAccount.findUnique({
      where: { userId_currency: { userId, currency } },
    });

    if (!account || account.balance.lt(betAmount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Check game limits
    const gameConfig = await this.prisma.gameConfig.findUnique({
      where: { gameType: 'DICE' }, // This should be dynamic based on game type
    });

    if (!gameConfig?.isEnabled) {
      throw new ForbiddenException('Game is currently disabled');
    }

    const minBet = gameConfig.minBet[currency];
    const maxBet = gameConfig.maxBet[currency];

    if (new Decimal(betAmount).lt(minBet) || new Decimal(betAmount).gt(maxBet)) {
      throw new BadRequestException(`Bet amount must be between ${minBet} and ${maxBet} ${currency}`);
    }
  }

  private async processGameResult(
    userId: string,
    currency: Currency,
    betAmount: string,
    winAmount: string,
    gameRoundId: string
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Deduct bet amount
      await tx.ledgerAccount.update({
        where: { userId_currency: { userId, currency } },
        data: { balance: { decrement: new Decimal(betAmount) } },
      });

      // Create bet transaction
      await tx.transaction.create({
        data: {
          userId,
          type: 'BET',
          currency,
          amount: new Decimal(betAmount).neg(),
          balanceBefore: new Decimal(0), // Will be updated
          balanceAfter: new Decimal(0), // Will be updated
          reference: gameRoundId,
        },
      });

      // Add winnings if any
      if (new Decimal(winAmount).gt(0)) {
        await tx.ledgerAccount.update({
          where: { userId_currency: { userId, currency } },
          data: { balance: { increment: new Decimal(winAmount) } },
        });

        await tx.transaction.create({
          data: {
            userId,
            type: 'WIN',
            currency,
            amount: new Decimal(winAmount),
            balanceBefore: new Decimal(0), // Will be updated
            balanceAfter: new Decimal(0), // Will be updated
            reference: gameRoundId,
          },
        });
      }
    });
  }

  private calculateDiceMultiplier(target: number, isUnder: boolean): number {
    const winChance = isUnder ? target : (100 - target);
    const houseEdge = 0.01; // 1%
    return (100 / winChance) * (1 - houseEdge);
  }

  private calculateSlotsResult(reels: string[][], activeLines: number): { multiplier: number; lines: any[] } {
    const paytable = {
      seven: { 3: 100, 2: 10, 1: 2 },
      bar: { 3: 50, 2: 5, 1: 1 },
      bell: { 3: 25, 2: 3 },
      plum: { 3: 15, 2: 2 },
      orange: { 3: 10, 2: 2 },
      lemon: { 3: 8, 2: 1 },
      cherry: { 3: 5, 1: 1 },
    };

    const lines = [];
    let totalMultiplier = 0;

    // Check each active payline
    for (let line = 0; line < Math.min(activeLines, 25); line++) {
      const lineSymbols = this.getLineSymbols(reels, line);
      const multiplier = this.calculateLineMultiplier(lineSymbols, paytable);
      
      if (multiplier > 0) {
        lines.push({
          line,
          symbols: lineSymbols,
          multiplier,
        });
        totalMultiplier += multiplier;
      }
    }

    return { multiplier: totalMultiplier, lines };
  }

  private getLineSymbols(reels: string[][], lineIndex: number): string[] {
    // Simplified: just use middle row for all lines
    return [reels[0][1], reels[1][1], reels[2][1]];
  }

  private calculateLineMultiplier(symbols: string[], paytable: any): number {
    const symbolCounts = {};
    symbols.forEach(symbol => {
      symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
    });

    let maxMultiplier = 0;
    Object.entries(symbolCounts).forEach(([symbol, count]) => {
      if (paytable[symbol] && paytable[symbol][count as number]) {
        maxMultiplier = Math.max(maxMultiplier, paytable[symbol][count as number]);
      }
    });

    return maxMultiplier;
  }

  private formatGameRound(gameRound: any): GameRound {
    return {
      id: gameRound.id,
      userId: gameRound.userId,
      gameType: gameRound.gameType,
      status: gameRound.status,
      betAmount: gameRound.betAmount.toString(),
      currency: gameRound.currency,
      multiplier: gameRound.multiplier.toNumber(),
      winAmount: gameRound.winAmount.toString(),
      result: gameRound.result,
      proof: {
        serverSeedHash: '', // Will be populated
        clientSeed: '',
        nonce: gameRound.nonce,
        result: '',
      },
      createdAt: gameRound.createdAt.toISOString(),
      completedAt: gameRound.completedAt?.toISOString(),
    };
  }
}