import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProvablyFairService } from './provably-fair.service';
import { VerifyResult, SeedCommit } from '@crypto-casino/types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { VerifyResultSchema, SeedCommitSchema } from '@crypto-casino/types';

@ApiTags('Provably Fair')
@Controller('provably-fair')
export class ProvablyFairController {
  constructor(private readonly provablyFairService: ProvablyFairService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get provably fair configuration' })
  @ApiResponse({ status: 200, description: 'Configuration retrieved successfully' })
  async getConfig() {
    return this.provablyFairService.getProvablyFairConfig();
  }

  @Post('seed/commit')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Commit new server seed' })
  @ApiResponse({ status: 201, description: 'Seed committed successfully' })
  async commitSeed(
    @Req() req: any,
    @Body(new ZodValidationPipe(SeedCommitSchema)) dto: SeedCommit
  ) {
    return this.provablyFairService.commitSeed(req.user.id, dto.clientSeed);
  }

  @Post('seed/reveal')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reveal current server seed and rotate' })
  @ApiResponse({ status: 200, description: 'Seed revealed successfully' })
  async revealSeed(@Req() req: any) {
    return this.provablyFairService.revealSeed(req.user.id);
  }

  @Get('seed/current')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current active seed information' })
  @ApiResponse({ status: 200, description: 'Current seed information' })
  async getCurrentSeed(@Req() req: any) {
    return this.provablyFairService.getCurrentSeed(req.user.id);
  }

  @Get('seed/history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user seed history' })
  @ApiResponse({ status: 200, description: 'Seed history retrieved successfully' })
  async getSeedHistory(
    @Req() req: any,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.provablyFairService.getUserSeedHistory(req.user.id, limitNum);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify game result independently' })
  @ApiResponse({ status: 200, description: 'Result verification completed' })
  async verifyResult(
    @Body(new ZodValidationPipe(VerifyResultSchema)) dto: VerifyResult
  ) {
    return this.provablyFairService.verifyResult(dto);
  }
}