import { z } from 'zod';
import { Currency } from './common';

export enum PaymentProvider {
  COINBASE_COMMERCE = 'COINBASE_COMMERCE',
  BTCPAY_SERVER = 'BTCPAY_SERVER',
  NOWPAYMENTS = 'NOWPAYMENTS',
  INTERNAL_WALLET = 'INTERNAL_WALLET',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export const CreateDepositIntentSchema = z.object({
  amount: z.string(),
  currency: z.nativeEnum(Currency),
  provider: z.nativeEnum(PaymentProvider).optional(),
});

export const DepositIntentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.string(),
  currency: z.nativeEnum(Currency),
  provider: z.nativeEnum(PaymentProvider),
  status: z.nativeEnum(PaymentStatus),
  paymentAddress: z.string().optional(),
  paymentUrl: z.string().optional(),
  providerReference: z.string().optional(),
  txHash: z.string().optional(),
  confirmations: z.number().default(0),
  requiredConfirmations: z.number().default(1),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateWithdrawalRequestSchema = z.object({
  amount: z.string(),
  currency: z.nativeEnum(Currency),
  address: z.string(),
  twoFactorCode: z.string().optional(),
});

export const WithdrawalRequestSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.string(),
  currency: z.nativeEnum(Currency),
  address: z.string(),
  status: z.nativeEnum(PaymentStatus),
  adminNotes: z.string().optional(),
  txHash: z.string().optional(),
  fee: z.string().optional(),
  netAmount: z.string().optional(),
  processedBy: z.string().optional(),
  createdAt: z.string().datetime(),
  processedAt: z.string().datetime().optional(),
});

export const PaymentWebhookSchema = z.object({
  provider: z.nativeEnum(PaymentProvider),
  eventType: z.string(),
  reference: z.string(),
  data: z.record(z.unknown()),
  signature: z.string().optional(),
});

export const PaymentCallbackSchema = z.object({
  success: z.boolean(),
  reference: z.string(),
  amount: z.string().optional(),
  currency: z.nativeEnum(Currency).optional(),
  txHash: z.string().optional(),
  confirmations: z.number().optional(),
});

export const AllowedAddressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  currency: z.nativeEnum(Currency),
  address: z.string(),
  label: z.string(),
  isVerified: z.boolean(),
  createdAt: z.string().datetime(),
});

export const AddAllowedAddressSchema = z.object({
  currency: z.nativeEnum(Currency),
  address: z.string(),
  label: z.string(),
});

export type PaymentProviderType = z.infer<typeof DepositIntentSchema>['provider'];
export type PaymentStatusType = z.infer<typeof DepositIntentSchema>['status'];
// export type TransactionTypeType = TransactionType;
export type CreateDepositIntent = z.infer<typeof CreateDepositIntentSchema>;
export type DepositIntent = z.infer<typeof DepositIntentSchema>;
export type CreateWithdrawalRequest = z.infer<typeof CreateWithdrawalRequestSchema>;
export type WithdrawalRequest = z.infer<typeof WithdrawalRequestSchema>;
export type PaymentWebhook = z.infer<typeof PaymentWebhookSchema>;
export type PaymentCallback = z.infer<typeof PaymentCallbackSchema>;
export type AllowedAddress = z.infer<typeof AllowedAddressSchema>;
export type AddAllowedAddress = z.infer<typeof AddAllowedAddressSchema>;