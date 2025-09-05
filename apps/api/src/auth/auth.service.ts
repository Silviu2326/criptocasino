import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { EmailService } from '../common/email/email.service';
import { CryptoService } from '../common/crypto/crypto.service';
import { 
  MagicLinkRequest, 
  WalletNonceRequest, 
  WalletVerify, 
  LoginResponse,
  JwtPayload 
} from '@crypto-casino/types';
import { randomBytes, createHash } from 'crypto';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private cryptoService: CryptoService,
  ) {}

  async sendMagicLink(dto: MagicLinkRequest): Promise<{ success: boolean }> {
    const token = randomBytes(32).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    
    // Store the hashed token temporarily (Redis in production)
    await this.prisma.session.create({
      data: {
        id: hashedToken,
        userId: '', // Will be set when verified
        accessToken: '',
        refreshToken: '',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    const magicLink = `${process.env.FRONTEND_URL}/auth/callback?token=${token}&email=${encodeURIComponent(dto.email)}`;
    
    await this.emailService.sendMagicLinkEmail(dto.email, magicLink);
    
    return { success: true };
  }

  async verifyMagicLink(token: string, email: string): Promise<LoginResponse> {
    const hashedToken = createHash('sha256').update(token).digest('hex');
    
    const session = await this.prisma.session.findUnique({
      where: { id: hashedToken },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          emailVerified: true,
        },
      });

      // Create ledger accounts for all currencies
      const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'USD'];
      await Promise.all(
        currencies.map(currency =>
          this.prisma.ledgerAccount.create({
            data: {
              userId: user.id,
              currency: currency as any,
              balance: 0,
              locked: 0,
            },
          })
        )
      );
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user);

    await this.prisma.session.update({
      where: { id: hashedToken },
      data: {
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        isVerified: user.kycStatus === 'VERIFIED',
      },
    };
  }

  async getWalletNonce(dto: WalletNonceRequest): Promise<{ nonce: string }> {
    const nonce = randomBytes(16).toString('hex');
    
    await this.prisma.user.upsert({
      where: { walletAddress: dto.address },
      update: { walletNonce: nonce },
      create: {
        email: `${dto.address}@wallet.local`,
        walletAddress: dto.address,
        walletNonce: nonce,
      },
    });

    return { nonce };
  }

  async verifyWalletSignature(dto: WalletVerify): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress: dto.address },
    });

    if (!user || !user.walletNonce) {
      throw new UnauthorizedException('Invalid wallet address or nonce');
    }

    try {
      const message = `Sign this message to authenticate: ${user.walletNonce}`;
      const recoveredAddress = recoverPersonalSignature({
        data: message,
        signature: dto.signature,
      });

      if (recoveredAddress.toLowerCase() !== dto.address.toLowerCase()) {
        throw new UnauthorizedException('Invalid signature');
      }
    } catch (error) {
      throw new UnauthorizedException('Signature verification failed');
    }

    const { accessToken, refreshToken } = await this.generateTokenPair(user);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        accessToken,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Create ledger accounts if they don't exist
    const existingAccounts = await this.prisma.ledgerAccount.findMany({
      where: { userId: user.id },
    });

    if (existingAccounts.length === 0) {
      const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'USD'];
      await Promise.all(
        currencies.map(currency =>
          this.prisma.ledgerAccount.create({
            data: {
              userId: user.id,
              currency: currency as any,
              balance: 0,
              locked: 0,
            },
          })
        )
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
        walletNonce: null, // Clear nonce after use
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        role: user.role,
        isVerified: user.kycStatus === 'VERIFIED',
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const newTokenPair = await this.generateTokenPair(session.user);

    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        accessToken: newTokenPair.accessToken,
        refreshToken: newTokenPair.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return newTokenPair;
  }

  async logout(userId: string, accessToken: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, accessToken },
      data: { revokedAt: new Date() },
    });
  }

  private async generateTokenPair(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(32).toString('hex');

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}