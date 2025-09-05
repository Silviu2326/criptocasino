import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailService } from '../common/email/email.service';
import { CryptoService } from '../common/crypto/crypto.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (config) => ({
        secret: config.jwt.secret,
        signOptions: {
          expiresIn: config.jwt.accessTokenExpiry,
          issuer: config.jwt.issuer,
        },
      }),
      inject: ['CONFIG'],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, EmailService, CryptoService],
  exports: [AuthService],
})
export class AuthModule {}