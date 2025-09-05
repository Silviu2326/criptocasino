import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  Req, 
  Query 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { 
  MagicLinkRequest, 
  WalletNonceRequest, 
  WalletVerify, 
  RefreshToken,
  LoginResponse 
} from '@crypto-casino/types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { 
  MagicLinkRequestSchema, 
  WalletNonceRequestSchema, 
  WalletVerifySchema, 
  RefreshTokenSchema 
} from '@crypto-casino/types';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  @ApiOperation({ summary: 'Send magic link for email authentication' })
  @ApiResponse({ status: 200, description: 'Magic link sent successfully' })
  async sendMagicLink(
    @Body(new ZodValidationPipe(MagicLinkRequestSchema)) dto: MagicLinkRequest
  ) {
    return this.authService.sendMagicLink(dto);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Verify magic link token' })
  @ApiResponse({ status: 200, description: 'Authentication successful', type: LoginResponse })
  async verifyMagicLink(
    @Query('token') token: string,
    @Query('email') email: string
  ): Promise<LoginResponse> {
    return this.authService.verifyMagicLink(token, email);
  }

  @Post('wallet/nonce')
  @ApiOperation({ summary: 'Get nonce for wallet signature' })
  @ApiResponse({ status: 200, description: 'Nonce generated successfully' })
  async getWalletNonce(
    @Body(new ZodValidationPipe(WalletNonceRequestSchema)) dto: WalletNonceRequest
  ) {
    return this.authService.getWalletNonce(dto);
  }

  @Post('wallet/verify')
  @ApiOperation({ summary: 'Verify wallet signature' })
  @ApiResponse({ status: 200, description: 'Wallet authentication successful', type: LoginResponse })
  async verifyWalletSignature(
    @Body(new ZodValidationPipe(WalletVerifySchema)) dto: WalletVerify
  ): Promise<LoginResponse> {
    return this.authService.verifyWalletSignature(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  async refreshToken(
    @Body(new ZodValidationPipe(RefreshTokenSchema)) dto: RefreshToken
  ) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() req: any) {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(req.user.id, accessToken);
    return { success: true };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  async getProfile(@Req() req: any) {
    return req.user;
  }
}