import { Module } from '@nestjs/common';
import { ProvablyFairService } from './provably-fair.service';
import { ProvablyFairController } from './provably-fair.controller';
import { CryptoService } from '../common/crypto/crypto.service';

@Module({
  controllers: [ProvablyFairController],
  providers: [ProvablyFairService, CryptoService],
  exports: [ProvablyFairService],
})
export class ProvablyFairModule {}