import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AccountingService } from './accounting.service';
import { AccountingController } from './accounting.controller';
import { DailyCloseProcessor } from './processors/daily-close.processor';
import { ReconciliationProcessor } from './processors/reconciliation.processor';
import { LedgerService } from './ledger.service';
import { ReconciliationService } from './reconciliation.service';
import { DailyCloseService } from './daily-close.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'daily-close',
    }),
    BullModule.registerQueue({
      name: 'reconciliation',
    }),
  ],
  controllers: [AccountingController],
  providers: [
    AccountingService,
    LedgerService,
    ReconciliationService,
    DailyCloseService,
    DailyCloseProcessor,
    ReconciliationProcessor,
  ],
  exports: [AccountingService, LedgerService, ReconciliationService],
})
export class AccountingModule {}