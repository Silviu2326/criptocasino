import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CryptoService } from '../common/crypto/crypto.service';
import { 
  SeedCommit, 
  SeedReveal, 
  VerifyResult, 
  SeedRotation,
  ProvablyFairConfig 
} from '@crypto-casino/types';

@Injectable()
export class ProvablyFairService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService,
  ) {}

  async commitSeed(userId?: string, clientSeed?: string): Promise<SeedCommit> {
    const serverSeed = this.cryptoService.generateServerSeed();
    const serverSeedHash = this.cryptoService.hashServerSeed(serverSeed);
    const finalClientSeed = clientSeed || this.cryptoService.generateClientSeed();

    const seedCommit = await this.prisma.seedCommit.create({
      data: {
        userId,
        serverSeed,
        serverSeedHash,
        clientSeed: finalClientSeed,
        nonce: 0,
        isRevealed: false,
      },
    });

    return {
      serverSeedHash: seedCommit.serverSeedHash,
      clientSeed: seedCommit.clientSeed!,
    };
  }

  async revealSeed(userId: string): Promise<SeedReveal> {
    const currentSeed = await this.prisma.seedCommit.findFirst({
      where: {
        userId,
        isRevealed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!currentSeed) {
      throw new NotFoundException('No active seed found for user');
    }

    // Mark current seed as revealed
    await this.prisma.seedCommit.update({
      where: { id: currentSeed.id },
      data: {
        isRevealed: true,
        revealedAt: new Date(),
        rotationReason: 'MANUAL',
      },
    });

    // Create new seed for future games
    await this.commitSeed(userId);

    return {
      serverSeed: currentSeed.serverSeed,
      serverSeedHash: currentSeed.serverSeedHash,
    };
  }

  async rotateSeed(userId: string, reason: 'MANUAL' | 'AUTOMATIC' | 'SECURITY'): Promise<SeedRotation> {
    const currentSeed = await this.prisma.seedCommit.findFirst({
      where: {
        userId,
        isRevealed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!currentSeed) {
      throw new NotFoundException('No active seed found for user');
    }

    // Mark current seed as revealed
    await this.prisma.seedCommit.update({
      where: { id: currentSeed.id },
      data: {
        isRevealed: true,
        revealedAt: new Date(),
        rotationReason: reason,
      },
    });

    // Create new seed
    const newSeed = this.cryptoService.generateServerSeed();
    const newSeedHash = this.cryptoService.hashServerSeed(newSeed);

    await this.prisma.seedCommit.create({
      data: {
        userId,
        serverSeed: newSeed,
        serverSeedHash: newSeedHash,
        clientSeed: this.cryptoService.generateClientSeed(),
        nonce: 0,
        isRevealed: false,
      },
    });

    return {
      newServerSeedHash: newSeedHash,
      revealedServerSeed: currentSeed.serverSeed,
      rotationReason: reason,
    };
  }

  async getCurrentSeed(userId: string): Promise<any> {
    const seed = await this.prisma.seedCommit.findFirst({
      where: {
        userId,
        isRevealed: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!seed) {
      // Create new seed if none exists
      return this.commitSeed(userId);
    }

    return {
      serverSeedHash: seed.serverSeedHash,
      clientSeed: seed.clientSeed,
      nonce: seed.nonce,
    };
  }

  async incrementNonce(seedCommitId: string): Promise<number> {
    const updated = await this.prisma.seedCommit.update({
      where: { id: seedCommitId },
      data: { nonce: { increment: 1 } },
    });

    return updated.nonce;
  }

  async verifyResult(dto: VerifyResult): Promise<{ isValid: boolean; computedResult: string }> {
    const computedResult = this.cryptoService.generateProvablyFairResult(
      dto.serverSeed,
      dto.clientSeed,
      dto.nonce
    );

    return {
      isValid: computedResult === dto.expectedResult,
      computedResult,
    };
  }

  async getProvablyFairConfig(): Promise<ProvablyFairConfig> {
    return {
      algorithm: 'HMAC-SHA256',
      version: '1.0',
      description: 'Provably fair system using HMAC-SHA256 with server seed, client seed, and nonce',
    };
  }

  async getUserSeedHistory(userId: string, limit: number = 50): Promise<any[]> {
    const seeds = await this.prisma.seedCommit.findMany({
      where: {
        userId,
        isRevealed: true,
      },
      orderBy: { revealedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        serverSeed: true,
        serverSeedHash: true,
        clientSeed: true,
        nonce: true,
        createdAt: true,
        revealedAt: true,
        rotationReason: true,
      },
    });

    return seeds;
  }

  generateGameResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    gameType: 'DICE' | 'COINFLIP' | 'SLOTS'
  ): any {
    const result = this.cryptoService.generateProvablyFairResult(serverSeed, clientSeed, nonce);
    
    switch (gameType) {
      case 'DICE':
        return this.generateDiceResult(result);
      case 'COINFLIP':
        return this.generateCoinflipResult(result);
      case 'SLOTS':
        return this.generateSlotsResult(result);
      default:
        throw new BadRequestException('Invalid game type');
    }
  }

  private generateDiceResult(hash: string): number {
    // Use first 8 characters for dice roll (0-99.99)
    const decimal = this.cryptoService.convertHexToDecimal(hash, 8);
    return Math.floor(decimal * 10000) / 100; // 0-99.99
  }

  private generateCoinflipResult(hash: string): 'HEADS' | 'TAILS' {
    const decimal = this.cryptoService.convertHexToDecimal(hash, 1);
    return decimal < 0.5 ? 'HEADS' : 'TAILS';
  }

  private generateSlotsResult(hash: string): any {
    const symbols = ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven'];
    const reels = [];

    for (let i = 0; i < 3; i++) {
      const reel = [];
      for (let j = 0; j < 3; j++) {
        const position = (i * 3 + j) * 2;
        const decimal = this.cryptoService.convertHexToDecimal(hash.slice(position, position + 2), 2);
        const symbolIndex = Math.floor(decimal * symbols.length);
        reel.push(symbols[symbolIndex]);
      }
      reels.push(reel);
    }

    return { reels };
  }
}