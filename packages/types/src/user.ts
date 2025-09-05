import { z } from 'zod';
import { Country, Currency, UserRole } from './common';

export enum KycStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export const ResponsibleGamingLimitsSchema = z.object({
  dailyDepositLimit: z.number().positive().optional(),
  weeklyDepositLimit: z.number().positive().optional(),
  monthlyDepositLimit: z.number().positive().optional(),
  dailyLossLimit: z.number().positive().optional(),
  weeklyLossLimit: z.number().positive().optional(),
  monthlyLossLimit: z.number().positive().optional(),
  sessionTimeLimit: z.number().positive().optional(), // minutes
});

export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  walletAddress: z.string().nullable(),
  role: z.nativeEnum(UserRole),
  country: z.nativeEnum(Country).optional(),
  dateOfBirth: z.string().datetime().optional(),
  kycStatus: z.nativeEnum(KycStatus),
  isVerified: z.boolean(),
  rgLimits: ResponsibleGamingLimitsSchema.optional(),
  loyaltyTier: z.number().min(1).max(10).default(1),
  loyaltyXp: z.number().min(0).default(0),
  selfExcludedUntil: z.string().datetime().nullable(),
  cooldownUntil: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const UpdateUserProfileSchema = z.object({
  country: z.nativeEnum(Country).optional(),
  dateOfBirth: z.string().datetime().optional(),
  rgLimits: ResponsibleGamingLimitsSchema.optional(),
});

export const SelfExcludeSchema = z.object({
  duration: z.enum(['1d', '7d', '30d', '90d', '365d', 'permanent']),
  reason: z.string().max(500).optional(),
});

export const CooldownSchema = z.object({
  duration: z.enum(['1h', '6h', '24h', '72h']),
});

export const BalanceSchema = z.object({
  currency: z.nativeEnum(Currency),
  available: z.string(), // Decimal as string for precision
  locked: z.string(),
  total: z.string(),
});

export const UserBalancesSchema = z.record(z.nativeEnum(Currency), BalanceSchema);

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['DEPOSIT', 'WITHDRAWAL', 'BET', 'WIN', 'BONUS', 'BONUS_WAGERING']),
  currency: z.nativeEnum(Currency),
  amount: z.string(),
  balanceBefore: z.string(),
  balanceAfter: z.string(),
  reference: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
});

export type KycStatusType = z.infer<typeof UserProfileSchema>['kycStatus'];
export type ResponsibleGamingLimits = z.infer<typeof ResponsibleGamingLimitsSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof UpdateUserProfileSchema>;
export type SelfExclude = z.infer<typeof SelfExcludeSchema>;
export type Cooldown = z.infer<typeof CooldownSchema>;
export type Balance = z.infer<typeof BalanceSchema>;
export type UserBalances = z.infer<typeof UserBalancesSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;