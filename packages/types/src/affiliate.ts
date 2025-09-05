import { z } from 'zod';
import { Currency } from './common';

export enum AffiliateStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED',
}

export enum CommissionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  TIERED = 'TIERED',
}

export const AffiliateSchema = z.object({
  id: z.string(),
  userId: z.string(),
  code: z.string(),
  status: z.nativeEnum(AffiliateStatus),
  commissionType: z.nativeEnum(CommissionType),
  commissionRate: z.number(),
  tier: z.number().min(1).max(5).default(1),
  totalReferrals: z.number().default(0),
  activeReferrals: z.number().default(0),
  totalCommission: z.string().default('0'),
  pendingCommission: z.string().default('0'),
  paidCommission: z.string().default('0'),
  lastPayoutAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AffiliateApplicationSchema = z.object({
  businessName: z.string().optional(),
  website: z.string().url().optional(),
  promotionMethods: z.array(z.string()),
  monthlyTraffic: z.number().optional(),
  experience: z.string(),
  additionalInfo: z.string().optional(),
});

export const AffiliateAttributionSchema = z.object({
  id: z.string(),
  affiliateId: z.string(),
  userId: z.string(),
  source: z.enum(['CODE', 'LINK', 'COOKIE']),
  attributedAt: z.string().datetime(),
  firstDepositAt: z.string().datetime().optional(),
  isActive: z.boolean(),
  totalDeposits: z.string().default('0'),
  totalWagered: z.string().default('0'),
  ngr: z.string().default('0'), // Net Gaming Revenue
});

export const AffiliateCommissionSchema = z.object({
  id: z.string(),
  affiliateId: z.string(),
  attributionId: z.string(),
  period: z.string(), // YYYY-MM format
  currency: z.nativeEnum(Currency),
  ngr: z.string(),
  commissionRate: z.number(),
  commissionAmount: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'PAID', 'REJECTED']),
  calculatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().optional(),
  paidAt: z.string().datetime().optional(),
});

export const AffiliatePayoutSchema = z.object({
  id: z.string(),
  affiliateId: z.string(),
  period: z.string(),
  currency: z.nativeEnum(Currency),
  totalAmount: z.string(),
  commissions: z.array(z.string()), // Commission IDs
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  paymentMethod: z.string(),
  paymentDetails: z.record(z.unknown()),
  requestedAt: z.string().datetime(),
  processedAt: z.string().datetime().optional(),
});

export const AffiliateSummarySchema = z.object({
  totalReferrals: z.number(),
  activeReferrals: z.number(),
  totalClicks: z.number(),
  conversionRate: z.number(),
  totalCommission: z.string(),
  pendingCommission: z.string(),
  paidCommission: z.string(),
  currentMonthCommission: z.string(),
  topPerformingLinks: z.array(z.object({
    link: z.string(),
    clicks: z.number(),
    conversions: z.number(),
    commission: z.string(),
  })),
});

export const AffiliateStatsSchema = z.object({
  period: z.string(),
  referrals: z.number(),
  newReferrals: z.number(),
  deposits: z.string(),
  wagered: z.string(),
  ngr: z.string(),
  commission: z.string(),
});

export const CreateAffiliateCodeSchema = z.object({
  code: z.string().min(3).max(20).regex(/^[a-zA-Z0-9]+$/),
  commissionType: z.nativeEnum(CommissionType),
  commissionRate: z.number().min(0).max(50),
});

export type AffiliateStatusType = z.infer<typeof AffiliateSchema>['status'];
// export type CommissionTypeType = CommissionType;
export type Affiliate = z.infer<typeof AffiliateSchema>;
export type AffiliateApplication = z.infer<typeof AffiliateApplicationSchema>;
export type AffiliateAttribution = z.infer<typeof AffiliateAttributionSchema>;
export type AffiliateCommission = z.infer<typeof AffiliateCommissionSchema>;
export type AffiliatePayout = z.infer<typeof AffiliatePayoutSchema>;
export type AffiliateSummary = z.infer<typeof AffiliateSummarySchema>;
export type AffiliateStats = z.infer<typeof AffiliateStatsSchema>;
export type CreateAffiliateCode = z.infer<typeof CreateAffiliateCodeSchema>;