import { z } from 'zod';
import { KycStatus } from './user';

export enum DocumentType {
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  NATIONAL_ID = 'NATIONAL_ID',
  PROOF_OF_ADDRESS = 'PROOF_OF_ADDRESS',
  SELFIE = 'SELFIE',
}

export enum AmlRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  PROHIBITED = 'PROHIBITED',
}

export const KycDocumentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(DocumentType),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  s3Key: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
  uploadedAt: z.string().datetime(),
  reviewedAt: z.string().datetime().optional(),
  reviewedBy: z.string().optional(),
});

export const SubmitKycDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  file: z.any(), // File object in frontend
});

export const KycCaseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.nativeEnum(KycStatus),
  submittedAt: z.string().datetime().optional(),
  reviewedAt: z.string().datetime().optional(),
  reviewedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  riskLevel: z.nativeEnum(AmlRiskLevel),
  documents: z.array(KycDocumentSchema),
  notes: z.array(z.object({
    id: z.string(),
    note: z.string(),
    createdBy: z.string(),
    createdAt: z.string().datetime(),
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const AmlAlertSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(['SUSPICIOUS_TRANSACTION', 'PEP', 'SANCTIONS', 'HIGH_RISK_COUNTRY', 'VELOCITY']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string(),
  data: z.record(z.unknown()),
  status: z.enum(['OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE']),
  assignedTo: z.string().optional(),
  resolvedBy: z.string().optional(),
  resolvedAt: z.string().datetime().optional(),
  resolution: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const KycReviewSchema = z.object({
  caseId: z.string(),
  status: z.nativeEnum(KycStatus),
  rejectionReason: z.string().optional(),
  riskLevel: z.nativeEnum(AmlRiskLevel),
  notes: z.string().optional(),
});

export const AmlCheckRequestSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  dateOfBirth: z.string(),
  nationality: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    country: z.string(),
    postalCode: z.string(),
  }),
});

export const AmlCheckResponseSchema = z.object({
  reference: z.string(),
  riskLevel: z.nativeEnum(AmlRiskLevel),
  matches: z.array(z.object({
    type: z.enum(['PEP', 'SANCTIONS', 'ADVERSE_MEDIA']),
    confidence: z.number(),
    description: z.string(),
  })),
  summary: z.string(),
});

export type DocumentTypeType = z.infer<typeof KycDocumentSchema>['type'];
// export type AmlRiskLevelType = AmlRiskLevel;
export type KycDocument = z.infer<typeof KycDocumentSchema>;
export type SubmitKycDocument = z.infer<typeof SubmitKycDocumentSchema>;
export type KycCase = z.infer<typeof KycCaseSchema>;
export type AmlAlert = z.infer<typeof AmlAlertSchema>;
export type KycReview = z.infer<typeof KycReviewSchema>;
export type AmlCheckRequest = z.infer<typeof AmlCheckRequestSchema>;
export type AmlCheckResponse = z.infer<typeof AmlCheckResponseSchema>;