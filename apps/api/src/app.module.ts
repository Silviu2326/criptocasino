import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './common/prisma/prisma.module';
import { MetricsModule } from './common/metrics/metrics.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { PaymentsModule } from './payments/payments.module';
import { KycModule } from './kyc/kyc.module';
import { BonusModule } from './bonus/bonus.module';
import { AffiliateModule } from './affiliate/affiliate.module';
import { AdminModule } from './admin/admin.module';
import { ProvablyFairModule } from './provably-fair/provably-fair.module';
import { ResponsibleGamingModule } from './responsible-gaming/responsible-gaming.module';
import { AccountingModule } from './accounting/accounting.module';
import { HealthModule } from './health/health.module';
import { validateConfig } from '@crypto-casino/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      useFactory: (config) => ({
        throttlers: [{
          ttl: config.security.rateLimiting.windowMs,
          limit: config.security.rateLimiting.max,
        }],
        skipIf: (context) => {
          return config.security.rateLimiting.skipSuccessfulRequests && 
                 context.getResponse().statusCode < 400;
        },
      }),
      inject: ['CONFIG'],
    }),
    BullModule.forRootAsync({
      useFactory: (config) => ({
        connection: {
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password,
          db: config.redis.db,
        },
      }),
      inject: ['CONFIG'],
    }),
    LoggerModule.forRootAsync({
      useFactory: (config) => ({
        pinoHttp: {
          level: config.observability.logging.level,
          transport: config.nodeEnv === 'development' ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          } : undefined,
        },
      }),
      inject: ['CONFIG'],
    }),
    TerminusModule,
    PrismaModule,
    MetricsModule,
    AuthModule,
    UsersModule,
    GamesModule,
    PaymentsModule,
    KycModule,
    BonusModule,
    AffiliateModule,
    AdminModule,
    ProvablyFairModule,
    ResponsibleGamingModule,
    AccountingModule,
    HealthModule,
  ],
  providers: [
    {
      provide: 'CONFIG',
      useFactory: () => validateConfig(process.env),
    },
  ],
})
export class AppModule {}