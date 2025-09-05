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

export const KycProvidersConfigSchema = z.object({
  sumSub: z.object({
    appToken: z.string(),
    secretKey: z.string(),
    baseUrl: z.string().default('https://api.sumsub.com'),
  }).optional(),
  jumio: z.object({
    apiToken: z.string(),
    apiSecret: z.string(),
    baseUrl: z.string().default('https://api.jumio.com'),
  }).optional(),
});

export const ObservabilityConfigSchema = z.object({
  prometheus: z.object({
    enabled: z.boolean().default(true),
    port: z.number().default(9090),
    path: z.string().default('/metrics'),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    format: z.enum(['json', 'pretty']).default('json'),
  }),
});

export const SecurityConfigSchema = z.object({
  encryptionKey: z.string().min(32),
  rateLimiting: z.object({
    windowMs: z.number().default(900000), // 15 minutes
    max: z.number().default(100),
    skipSuccessfulRequests: z.boolean().default(true),
  }),
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]),
    credentials: z.boolean().default(true),
  }),
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
  kycProviders: KycProvidersConfigSchema,
  observability: ObservabilityConfigSchema,
  security: SecurityConfigSchema,
});

export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export type RedisConfig = z.infer<typeof RedisConfigSchema>;
export type JwtConfig = z.infer<typeof JwtConfigSchema>;
export type EmailConfig = z.infer<typeof EmailConfigSchema>;
export type S3Config = z.infer<typeof S3ConfigSchema>;
export type PaymentProvidersConfig = z.infer<typeof PaymentProvidersConfigSchema>;
export type KycProvidersConfig = z.infer<typeof KycProvidersConfigSchema>;
export type ObservabilityConfig = z.infer<typeof ObservabilityConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type AppConfig = z.infer<typeof AppConfigSchema>;

export const validateConfig = (env: Record<string, any>): AppConfig => {
  const config = {
    nodeEnv: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    host: env.HOST,
    baseUrl: env.BASE_URL,
    frontendUrl: env.FRONTEND_URL,
    database: {
      host: env.DATABASE_HOST,
      port: parseInt(env.DATABASE_PORT, 10),
      database: env.DATABASE_NAME,
      username: env.DATABASE_USER,
      password: env.DATABASE_PASSWORD,
      ssl: env.DATABASE_SSL === 'true',
    },
    redis: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT, 10),
      password: env.REDIS_PASSWORD,
      db: parseInt(env.REDIS_DB, 10),
    },
    jwt: {
      secret: env.JWT_SECRET,
      accessTokenExpiry: env.JWT_ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: env.JWT_REFRESH_TOKEN_EXPIRY,
      issuer: env.JWT_ISSUER,
    },
    email: {
      host: env.EMAIL_HOST,
      port: parseInt(env.EMAIL_PORT, 10),
      secure: env.EMAIL_SECURE === 'true',
      auth: env.EMAIL_USER ? {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      } : undefined,
      from: env.EMAIL_FROM,
    },
    s3: {
      endpoint: env.S3_ENDPOINT,
      region: env.S3_REGION,
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      bucket: env.S3_BUCKET,
      forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
    },
    paymentProviders: {
      coinbaseCommerce: env.COINBASE_COMMERCE_API_KEY ? {
        apiKey: env.COINBASE_COMMERCE_API_KEY,
        webhookSecret: env.COINBASE_COMMERCE_WEBHOOK_SECRET,
        baseUrl: env.COINBASE_COMMERCE_BASE_URL,
      } : undefined,
      btcPayServer: env.BTCPAY_SERVER_API_KEY ? {
        baseUrl: env.BTCPAY_SERVER_BASE_URL,
        apiKey: env.BTCPAY_SERVER_API_KEY,
        storeId: env.BTCPAY_SERVER_STORE_ID,
        webhookSecret: env.BTCPAY_SERVER_WEBHOOK_SECRET,
      } : undefined,
      nowPayments: env.NOW_PAYMENTS_API_KEY ? {
        apiKey: env.NOW_PAYMENTS_API_KEY,
        baseUrl: env.NOW_PAYMENTS_BASE_URL,
        ipnSecret: env.NOW_PAYMENTS_IPN_SECRET,
      } : undefined,
    },
    kycProviders: {
      sumSub: env.SUMSUB_APP_TOKEN ? {
        appToken: env.SUMSUB_APP_TOKEN,
        secretKey: env.SUMSUB_SECRET_KEY,
        baseUrl: env.SUMSUB_BASE_URL,
      } : undefined,
      jumio: env.JUMIO_API_TOKEN ? {
        apiToken: env.JUMIO_API_TOKEN,
        apiSecret: env.JUMIO_API_SECRET,
        baseUrl: env.JUMIO_BASE_URL,
      } : undefined,
    },
    observability: {
      prometheus: {
        enabled: env.PROMETHEUS_ENABLED !== 'false',
        port: parseInt(env.PROMETHEUS_PORT, 10),
        path: env.PROMETHEUS_PATH,
      },
      logging: {
        level: env.LOG_LEVEL,
        format: env.LOG_FORMAT,
      },
    },
    security: {
      encryptionKey: env.ENCRYPTION_KEY,
      rateLimiting: {
        windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
        max: parseInt(env.RATE_LIMIT_MAX, 10),
        skipSuccessfulRequests: env.RATE_LIMIT_SKIP_SUCCESS === 'true',
      },
      cors: {
        origin: env.CORS_ORIGIN?.split(',') || env.CORS_ORIGIN,
        credentials: env.CORS_CREDENTIALS !== 'false',
      },
    },
  };

  return AppConfigSchema.parse(config);
};