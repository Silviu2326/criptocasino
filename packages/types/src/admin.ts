import { z } from 'zod';
import { Currency, UserRole } from './common';

export const AdminDashboardStatsSchema = z.object({
  totalUsers: z.number(),
  newUsersToday: z.number(),
  activeUsers24h: z.number(),
  totalDeposits: z.record(z.nativeEnum(Currency), z.string()),
  totalWithdrawals: z.record(z.nativeEnum(Currency), z.string()),
  pendingWithdrawals: z.number(),
  pendingKycCases: z.number(),
  totalBets: z.number(),
  totalWagered: z.record(z.nativeEnum(Currency), z.string()),
  totalWinnings: z.record(z.nativeEnum(Currency), z.string()),
  ggr: z.record(z.nativeEnum(Currency), z.string()), // Gross Gaming Revenue
  ngr: z.record(z.nativeEnum(Currency), z.string()), // Net Gaming Revenue
  averageSessionTime: z.number(),
  conversionRate: z.number(),
});

export const AdminUserSummarySchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.nativeEnum(UserRole),
  kycStatus: z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']),
  country: z.string().optional(),
  totalDeposits: z.string(),
  totalWithdrawals: z.string(),
  totalWagered: z.string(),
  netProfit: z.string(),
  lastLoginAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  isActive: z.boolean(),
  isSuspended: z.boolean(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export const UpdateUserSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  kycStatus: z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED']).optional(),
  notes: z.string().optional(),
});

export const AuditLogSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  adminId: z.string(),
  action: z.string(),
  resource: z.string(),
  resourceId: z.string().optional(),
  details: z.record(z.unknown()),
  ipAddress: z.string(),
  userAgent: z.string(),
  createdAt: z.string().datetime(),
});

export const SystemSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
  type: z.enum(['STRING', 'NUMBER', 'BOOLEAN', 'JSON']),
  description: z.string(),
  category: z.string(),
  isPublic: z.boolean(),
  updatedAt: z.string().datetime(),
  updatedBy: z.string(),
});

export const UpdateSystemSettingSchema = z.object({
  value: z.string(),
});

export const GameConfigUpdateSchema = z.object({
  gameType: z.enum(['DICE', 'COINFLIP', 'SLOTS']),
  minBet: z.record(z.nativeEnum(Currency), z.string()).optional(),
  maxBet: z.record(z.nativeEnum(Currency), z.string()).optional(),
  houseEdge: z.number().min(0).max(10).optional(),
  isEnabled: z.boolean().optional(),
  config: z.record(z.unknown()).optional(),
});

export const SeedRotationRequestSchema = z.object({
  reason: z.enum(['MANUAL', 'AUTOMATIC', 'SECURITY']),
  newServerSeed: z.string().optional(),
});

export const AdminReportRequestSchema = z.object({
  type: z.enum(['FINANCIAL', 'USER_ACTIVITY', 'GAME_PERFORMANCE', 'KYC', 'AFFILIATE']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  currency: z.nativeEnum(Currency).optional(),
  format: z.enum(['JSON', 'CSV', 'PDF']).default('JSON'),
  filters: z.record(z.unknown()).optional(),
});

export const FinancialReportSchema = z.object({
  period: z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
  deposits: z.record(z.nativeEnum(Currency), z.object({
    count: z.number(),
    amount: z.string(),
  })),
  withdrawals: z.record(z.nativeEnum(Currency), z.object({
    count: z.number(),
    amount: z.string(),
  })),
  bets: z.object({
    count: z.number(),
    totalWagered: z.record(z.nativeEnum(Currency), z.string()),
    totalWinnings: z.record(z.nativeEnum(Currency), z.string()),
  }),
  revenue: z.record(z.nativeEnum(Currency), z.object({
    ggr: z.string(),
    ngr: z.string(),
    margin: z.number(),
  })),
  bonuses: z.record(z.nativeEnum(Currency), z.object({
    issued: z.string(),
    wagered: z.string(),
    forfeited: z.string(),
  })),
});

export const SecurityAlertSchema = z.object({
  id: z.string(),
  type: z.enum(['MULTIPLE_ACCOUNTS', 'SUSPICIOUS_BETTING', 'RAPID_DEPOSITS', 'UNUSUAL_WITHDRAWAL']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  userId: z.string(),
  description: z.string(),
  data: z.record(z.unknown()),
  status: z.enum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE']),
  assignedTo: z.string().optional(),
  createdAt: z.string().datetime(),
  resolvedAt: z.string().datetime().optional(),
});

export type AdminDashboardStats = z.infer<typeof AdminDashboardStatsSchema>;
export type AdminUserSummary = z.infer<typeof AdminUserSummarySchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type SystemSetting = z.infer<typeof SystemSettingSchema>;
export type UpdateSystemSetting = z.infer<typeof UpdateSystemSettingSchema>;
export type GameConfigUpdate = z.infer<typeof GameConfigUpdateSchema>;
export type SeedRotationRequest = z.infer<typeof SeedRotationRequestSchema>;
export type AdminReportRequest = z.infer<typeof AdminReportRequestSchema>;
export type FinancialReport = z.infer<typeof FinancialReportSchema>;
export type SecurityAlert = z.infer<typeof SecurityAlertSchema>;