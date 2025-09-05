import { Global, Module } from '@nestjs/common';
import { AccountingMetrics } from './accounting.metrics';
import { MetricsService } from './metrics.service';

@Global()
@Module({
  providers: [AccountingMetrics, MetricsService],
  exports: [AccountingMetrics, MetricsService],
})
export class MetricsModule {}