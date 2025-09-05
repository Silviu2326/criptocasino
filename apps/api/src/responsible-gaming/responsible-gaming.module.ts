import { Module } from '@nestjs/common';
import { ResponsibleGamingService } from './responsible-gaming.service';

@Module({
  providers: [ResponsibleGamingService],
  exports: [ResponsibleGamingService],
})
export class ResponsibleGamingModule {}