import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  Body, 
  UseGuards,
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { DailyCloseService } from './daily-close.service';
import { ReconciliationService } from './reconciliation.service';
import { LedgerService } from './ledger.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Admin - Accounting')
@Controller('admin/accounting')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class AccountingController {
  constructor(
    private accountingService: AccountingService,
    private dailyCloseService: DailyCloseService,
    private reconciliationService: ReconciliationService,
    private ledgerService: LedgerService,
  ) {}

  // Daily Close Endpoints
  @Get('close/:date')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get daily close for specific date' })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'Daily close data retrieved' })
  @ApiResponse({ status: 404, description: 'Daily close not found' })
  async getDailyClose(@Param('date') dateStr: string) {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const dailyClose = await this.accountingService.getDailyClose(date);
      
      if (!dailyClose) {
        throw new NotFoundException(`Daily close for ${dateStr} not found`);
      }

      return dailyClose;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Post('close/run')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Trigger daily close process' })
  @ApiResponse({ status: 202, description: 'Daily close job queued' })
  async triggerDailyClose(
    @Body() body: { 
      date: string; 
      force?: boolean; 
      includeReconciliation?: boolean 
    }
  ) {
    try {
      const date = new Date(body.date);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const job = await this.accountingService.queueDailyClose(
        date, 
        body.force || false,
        body.includeReconciliation !== false
      );

      return {
        success: true,
        jobId: job.id,
        message: 'Daily close process started',
        date: body.date,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('close/status/:jobId')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get daily close job status' })
  @ApiParam({ name: 'jobId', description: 'Job ID from close trigger' })
  @ApiResponse({ status: 200, description: 'Job status retrieved' })
  async getDailyCloseStatus(@Param('jobId') jobId: string) {
    const status = await this.accountingService.getDailyCloseJobStatus(jobId);
    return status;
  }

  @Get('closes')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get daily close history' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of records to return' })
  @ApiResponse({ status: 200, description: 'Daily close history retrieved' })
  async getDailyCloseHistory(
    @Query('from') fromDate?: string,
    @Query('to') toDate?: string,
    @Query('limit') limit?: string
  ) {
    const from = fromDate ? new Date(fromDate) : undefined;
    const to = toDate ? new Date(toDate) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : 30;

    return await this.accountingService.getDailyCloseHistory(from, to, limitNum);
  }

  // Reconciliation Endpoints
  @Post('reconcile/run')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Run reconciliation process' })
  @ApiResponse({ status: 202, description: 'Reconciliation job queued' })
  async runReconciliation(
    @Body() body: { 
      date: string; 
      type?: 'FULL' | 'DEPOSITS' | 'WITHDRAWALS';
      force?: boolean 
    }
  ) {
    try {
      const date = new Date(body.date);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const job = await this.accountingService.queueReconciliation(
        date,
        body.type || 'FULL',
        body.force || false
      );

      return {
        success: true,
        jobId: job.id,
        message: 'Reconciliation process started',
        date: body.date,
        type: body.type || 'FULL',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('reconcile/pending')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get pending reconciliation items' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items to return' })
  @ApiResponse({ status: 200, description: 'Pending reconciliation items retrieved' })
  async getPendingReconciliation(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return await this.reconciliationService.getPendingReconciliationItems(limitNum);
  }

  @Post('reconcile/:entryId/resolve')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Mark reconciliation entry as resolved' })
  @ApiParam({ name: 'entryId', description: 'Reconciliation entry ID' })
  @ApiResponse({ status: 200, description: 'Reconciliation entry marked as resolved' })
  async resolveReconciliationEntry(
    @Param('entryId') entryId: string,
    @Body() body: { resolution: string },
    @Query('resolvedBy') resolvedBy: string = 'admin'
  ) {
    await this.reconciliationService.resolveReconciliationEntry(
      entryId,
      resolvedBy,
      body.resolution
    );

    return {
      success: true,
      message: 'Reconciliation entry marked as resolved',
    };
  }

  @Get('reconcile/stats')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get reconciliation statistics' })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Reconciliation statistics retrieved' })
  async getReconciliationStats(
    @Query('from') fromDate?: string,
    @Query('to') toDate?: string
  ) {
    const from = fromDate ? new Date(fromDate) : undefined;
    const to = toDate ? new Date(toDate) : undefined;

    return await this.reconciliationService.getReconciliationStats(from, to);
  }

  // Ledger Integrity Endpoints
  @Get('ledger/integrity')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Verify ledger integrity' })
  @ApiResponse({ status: 200, description: 'Ledger integrity check completed' })
  async verifyLedgerIntegrity() {
    const result = await this.ledgerService.verifyLedgerIntegrity();
    return {
      ...result,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ledger/balance/:userId')
  @Roles('ADMIN', 'COMPLIANCE', 'SUPPORT')
  @ApiOperation({ summary: 'Get user account summary with integrity check' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User account summary retrieved' })
  async getUserAccountSummary(@Param('userId') userId: string) {
    return await this.ledgerService.getAccountSummary(userId);
  }

  // Financial Reports
  @Get('reports/financial')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get financial reports' })
  @ApiQuery({ name: 'from', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'currency', required: false, description: 'Filter by currency' })
  @ApiResponse({ status: 200, description: 'Financial report generated' })
  async getFinancialReport(
    @Query('from') fromDate: string,
    @Query('to') toDate: string,
    @Query('currency') currency?: string
  ) {
    if (!fromDate || !toDate) {
      throw new BadRequestException('Both from and to dates are required');
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    return await this.accountingService.generateFinancialReport(from, to, currency);
  }

  // Export Endpoints
  @Get('export/daily-close/:date')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Export daily close to CSV' })
  @ApiParam({ name: 'date', description: 'Date in YYYY-MM-DD format' })
  @ApiResponse({ status: 200, description: 'CSV export URL returned' })
  async exportDailyClose(@Param('date') dateStr: string) {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const exportUrl = await this.accountingService.exportDailyCloseToCSV(date);
      
      return {
        success: true,
        exportUrl,
        date: dateStr,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // System Health
  @Get('health')
  @Roles('ADMIN', 'COMPLIANCE')
  @ApiOperation({ summary: 'Get accounting system health status' })
  @ApiResponse({ status: 200, description: 'System health status' })
  async getAccountingHealth() {
    return await this.accountingService.getSystemHealth();
  }
}