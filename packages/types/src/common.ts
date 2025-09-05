import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const ResponseMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    meta: ResponseMetaSchema.optional(),
    message: z.string().optional(),
  });

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export const HealthCheckSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  uptime: z.number(),
  version: z.string(),
  services: z.record(z.enum(['healthy', 'unhealthy', 'degraded'])),
});

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  COMPLIANCE = 'COMPLIANCE',
  AFFILIATE = 'AFFILIATE',
  SUPPORT = 'SUPPORT',
}

export enum Currency {
  BTC = 'BTC',
  ETH = 'ETH',
  USDT = 'USDT',
  USDC = 'USDC',
  USD = 'USD',
}

export enum Country {
  ES = 'ES',
  US = 'US',
  GB = 'GB',
  CA = 'CA',
  AU = 'AU',
  DE = 'DE',
  FR = 'FR',
  IT = 'IT',
  BR = 'BR',
  MX = 'MX',
}

export type Pagination = z.infer<typeof PaginationSchema>;
export type ResponseMeta = z.infer<typeof ResponseMetaSchema>;
export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;