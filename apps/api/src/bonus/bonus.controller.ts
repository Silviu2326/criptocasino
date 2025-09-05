import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BonusService } from './bonus.service';

@ApiTags('Bonus')
@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @Get('available')
  @ApiOperation({ summary: 'Get available bonuses' })
  @ApiResponse({ status: 200, description: 'Available bonuses retrieved successfully' })
  async getAvailableBonuses() {
    return this.bonusService.getAvailableBonuses();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user bonuses' })
  @ApiResponse({ status: 200, description: 'User bonuses retrieved successfully' })
  async getUserBonuses(@Req() req: any) {
    return this.bonusService.getUserBonuses(req.user.id);
  }
}