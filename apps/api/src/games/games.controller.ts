import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { DiceBet, CoinflipBet, SlotsBet } from '@crypto-casino/types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { DiceBetSchema, CoinflipBetSchema, SlotsBetSchema } from '@crypto-casino/types';

@ApiTags('Games')
@Controller('games')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('dice/play')
  @ApiOperation({ summary: 'Play dice game' })
  @ApiResponse({ status: 200, description: 'Game round completed' })
  async playDice(
    @Req() req: any,
    @Body(new ZodValidationPipe(DiceBetSchema)) dto: DiceBet
  ) {
    return this.gamesService.playDice(req.user.id, dto);
  }

  @Post('coinflip/play')
  @ApiOperation({ summary: 'Play coinflip game' })
  @ApiResponse({ status: 200, description: 'Game round completed' })
  async playCoinflip(
    @Req() req: any,
    @Body(new ZodValidationPipe(CoinflipBetSchema)) dto: CoinflipBet
  ) {
    return this.gamesService.playCoinflip(req.user.id, dto);
  }

  @Post('slots/play')
  @ApiOperation({ summary: 'Play slots game' })
  @ApiResponse({ status: 200, description: 'Game round completed' })
  async playSlots(
    @Req() req: any,
    @Body(new ZodValidationPipe(SlotsBetSchema)) dto: SlotsBet
  ) {
    return this.gamesService.playSlots(req.user.id, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user game statistics' })
  @ApiResponse({ status: 200, description: 'Game statistics retrieved' })
  async getStats(@Req() req: any) {
    return this.gamesService.getUserGameStats(req.user.id);
  }
}