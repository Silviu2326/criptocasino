import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { ProvablyFairModule } from '../provably-fair/provably-fair.module';
import { ResponsibleGamingModule } from '../responsible-gaming/responsible-gaming.module';

@Module({
  imports: [ProvablyFairModule, ResponsibleGamingModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}