import { z } from 'zod';

export const DatabaseConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(5432),
  database: z.string(),
  username: z.string(),
  password: z.string(),
  ssl: z.boolean().default(false),
});

export const RedisConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(6379),
  password: z.string().optional(),
  db: z.number().default(0),
});

export const JwtConfigSchema = z.object({
  secret: z.string().min(32),
  accessTokenExpiry: z.string().default('15m'),
  refreshTokenExpiry: z.string().default('7d'),
  issuer: z.string().default('crypto-casino'),
});

export const EmailConfigSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().default(1025),
  secure: z.boolean().default(false),
  auth: z.object({
    user: z.string().optional(),
    pass: z.string().optional(),
  }).optional(),
  from: z.string().email(),
});

export const S3ConfigSchema = z.object({
  endpoint: z.string(),
  region: z.string().default('us-east-1'),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
  bucket: z.string(),
  forcePathStyle: z.boolean().default(true),
});

export const PaymentProvidersConfigSchema = z.object({
  coinbaseCommerce: z.object({
    apiKey: z.string(),
    webhookSecret: z.string(),
    baseUrl: z.string().default('https://api.commerce.coinbase.com'),
  }).optional(),
  btcPayServer: z.object({
    baseUrl: z.string(),
    apiKey: z.string(),
    storeId: z.string(),
    webhookSecret: z.string(),
  }).optional(),
  nowPayments: z.object({
    apiKey: z.string(),
    baseUrl: z.string().default('https://api.nowpayments.io'),
    ipnSecret: z.string(),
  }).optional(),
});

export const AppConfigSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.number().default(3001),
  host: z.string().default('0.0.0.0'),
  baseUrl: z.string().url(),
  frontendUrl: z.string().url(),
  database: DatabaseConfigSchema,
  redis: RedisConfigSchema,
  jwt: JwtConfigSchema,
  email: EmailConfigSchema,
  s3: S3ConfigSchema,
  paymentProviders: PaymentProvidersConfigSchema,
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type RedisConfig = z.infer<typeof RedisConfigSchema>;
export type JwtConfig = z.infer<typeof JwtConfigSchema>;
export type EmailConfig = z.infer<typeof EmailConfigSchema>;
export type S3Config = z.infer<typeof S3ConfigSchema>;
export type PaymentProvidersConfig = z.infer<typeof PaymentProvidersConfigSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;