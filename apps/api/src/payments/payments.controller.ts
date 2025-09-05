import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateDepositIntent, CreateWithdrawalRequest } from '@crypto-casino/types';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateDepositIntentSchema, CreateWithdrawalRequestSchema } from '@crypto-casino/types';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('deposits')
  @ApiOperation({ summary: 'Create deposit intent' })
  @ApiResponse({ status: 201, description: 'Deposit intent created successfully' })
  async createDepositIntent(
    @Req() req: any,
    @Body(new ZodValidationPipe(CreateDepositIntentSchema)) dto: CreateDepositIntent
  ) {
    return this.paymentsService.createDepositIntent(req.user.id, dto);
  }

  @Post('withdrawals')
  @ApiOperation({ summary: 'Request withdrawal' })
  @ApiResponse({ status: 201, description: 'Withdrawal request created successfully' })
  async createWithdrawalRequest(
    @Req() req: any,
    @Body(new ZodValidationPipe(CreateWithdrawalRequestSchema)) dto: CreateWithdrawalRequest
  ) {
    return this.paymentsService.createWithdrawalRequest(req.user.id, dto);
  }

  @Get('deposits')
  @ApiOperation({ summary: 'Get user deposits' })
  @ApiResponse({ status: 200, description: 'Deposits retrieved successfully' })
  async getUserDeposits(@Req() req: any) {
    return this.paymentsService.getUserDeposits(req.user.id);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'Get user withdrawals' })
  @ApiResponse({ status: 200, description: 'Withdrawals retrieved successfully' })
  async getUserWithdrawals(@Req() req: any) {
    return this.paymentsService.getUserWithdrawals(req.user.id);
  }
}