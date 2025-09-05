import { z } from 'zod';
import { UserRole } from './common';

export const MagicLinkRequestSchema = z.object({
  email: z.string().email(),
  redirectUrl: z.string().url().optional(),
});

export const MagicLinkCallbackSchema = z.object({
  token: z.string(),
});

export const WalletNonceRequestSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export const WalletVerifySchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string(),
  nonce: z.string(),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    walletAddress: z.string().nullable(),
    role: z.nativeEnum(UserRole),
    isVerified: z.boolean(),
  }),
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
  iat: z.number(),
  exp: z.number(),
});

export type MagicLinkRequest = z.infer<typeof MagicLinkRequestSchema>;
export type MagicLinkCallback = z.infer<typeof MagicLinkCallbackSchema>;
export type WalletNonceRequest = z.infer<typeof WalletNonceRequestSchema>;
export type WalletVerify = z.infer<typeof WalletVerifySchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshToken = z.infer<typeof RefreshTokenSchema>;
export type TokenPair = z.infer<typeof TokenPairSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;