import { z } from 'zod';
import { Currency } from './common';

export enum BonusType {
  WELCOME = 'WELCOME',
  DEPOSIT = 'DEPOSIT',
  CASHBACK = 'CASHBACK',
  FREE_SPINS = 'FREE_SPINS',
  LOYALTY = 'LOYALTY',
  REFERRAL = 'REFERRAL',
}

export enum BonusStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  FORFEITED = 'FORFEITED',
  CANCELLED = 'CANCELLED',
}

export const BonusSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(BonusType),
  name: z.string(),
  description: z.string(),
  currency: z.nativeEnum(Currency),
  amount: z.string(),
  percentage: z.number().optional(),
  wageringRequirement: z.number(),
  maxWinAmount: z.string().optional(),
  minDepositAmount: z.string().optional(),
  validForHours: z.number(),
  maxUses: z.number().optional(),
  currentUses: z.number().default(0),
  isActive: z.boolean(),
  eligibleCountries: z.array(z.string()).optional(),
  excludedCountries: z.array(z.string()).optional(),
  eligibleGames: z.array(z.string()).optional(),
  termsAndConditions: z.string(),
  promoCode: z.string().optional(),
  createdAt: z.string().datetime(),
  validUntil: z.string().datetime().optional(),
});

export const BonusGrantSchema = z.object({
  id: z.string(),
  userId: z.string(),
  bonusId: z.string(),
  status: z.nativeEnum(BonusStatus),
  bonusAmount: z.string(),
  wageringRequirement: z.string(),
  wageringProgress: z.string().default('0'),
  maxWinAmount: z.string().optional(),
  grantedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  forfeitedAt: z.string().datetime().optional(),
});

export const ClaimBonusSchema = z.object({
  bonusId: z.string(),
  promoCode: z.string().optional(),
});

export const WageringProgressSchema = z.object({
  bonusGrantId: z.string(),
  gameRoundId: z.string(),
  betAmount: z.string(),
  wageringContribution: z.string(),
  progressBefore: z.string(),
  progressAfter: z.string(),
  createdAt: z.string().datetime(),
});

export const CreateBonusSchema = z.object({
  type: z.nativeEnum(BonusType),
  name: z.string().min(1),
  description: z.string().min(1),
  currency: z.nativeEnum(Currency),
  amount: z.string().optional(),
  percentage: z.number().min(0).max(100).optional(),
  wageringRequirement: z.number().min(1),
  maxWinAmount: z.string().optional(),
  minDepositAmount: z.string().optional(),
  validForHours: z.number().min(1),
  maxUses: z.number().positive().optional(),
  eligibleCountries: z.array(z.string()).optional(),
  excludedCountries: z.array(z.string()).optional(),
  eligibleGames: z.array(z.string()).optional(),
  termsAndConditions: z.string().min(1),
  promoCode: z.string().optional(),
  validUntil: z.string().datetime().optional(),
});

export const BonusStatsSchema = z.object({
  totalBonuses: z.number(),
  activeBonuses: z.number(),
  completedBonuses: z.number(),
  totalBonusAmount: z.string(),
  totalWagered: z.string(),
  averageWageringProgress: z.number(),
});

export type BonusTypeType = z.infer<typeof BonusSchema>['type'];
export type BonusStatusType = z.infer<typeof BonusGrantSchema>['status'];
export type Bonus = z.infer<typeof BonusSchema>;
export type BonusGrant = z.infer<typeof BonusGrantSchema>;
export type ClaimBonus = z.infer<typeof ClaimBonusSchema>;
export type WageringProgress = z.infer<typeof WageringProgressSchema>;
export type CreateBonus = z.infer<typeof CreateBonusSchema>;
export type BonusStats = z.infer<typeof BonusStatsSchema>;