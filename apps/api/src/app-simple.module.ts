import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from '@crypto-casino/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
  ],
  providers: [
    {
      provide: 'CONFIG',
      useFactory: () => validateConfig(process.env),
    },
  ],
})
export class AppSimpleModule {}