import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliateService } from './affiliate.service';

@ApiTags('Affiliate')
@Controller('affiliates')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get affiliate summary' })
  @ApiResponse({ status: 200, description: 'Affiliate summary retrieved successfully' })
  async getSummary(@Req() req: any) {
    return this.affiliateService.getAffiliateSummary(req.user.id);
  }

  @Get('referrals')
  @ApiOperation({ summary: 'Get affiliate referrals' })
  @ApiResponse({ status: 200, description: 'Referrals retrieved successfully' })
  async getReferrals(@Req() req: any) {
    const affiliate = await this.affiliateService.getAffiliateSummary(req.user.id);
    if (!affiliate) {
      return [];
    }
    return this.affiliateService.getAffiliateReferrals(req.user.id);
  }
}