import { z } from 'zod';

export const SeedCommitSchema = z.object({
  serverSeedHash: z.string(),
  clientSeed: z.string().min(1).max(64),
});

export const SeedRevealSchema = z.object({
  serverSeed: z.string(),
  serverSeedHash: z.string(),
});

export const GameProofSchema = z.object({
  serverSeedHash: z.string(),
  clientSeed: z.string(),
  nonce: z.number().positive(),
  result: z.string(),
});

export const VerifyResultSchema = z.object({
  serverSeed: z.string(),
  clientSeed: z.string(),
  nonce: z.number().positive(),
  expectedResult: z.string(),
});

export const ProvablyFairConfigSchema = z.object({
  algorithm: z.literal('HMAC-SHA256'),
  version: z.string(),
  description: z.string(),
});

export const SeedRotationSchema = z.object({
  newServerSeedHash: z.string(),
  revealedServerSeed: z.string(),
  rotationReason: z.enum(['MANUAL', 'AUTOMATIC', 'SECURITY']),
});

export type SeedCommit = z.infer<typeof SeedCommitSchema>;
export type SeedReveal = z.infer<typeof SeedRevealSchema>;
export type GameProof = z.infer<typeof GameProofSchema>;
export type VerifyResult = z.infer<typeof VerifyResultSchema>;
export type ProvablyFairConfig = z.infer<typeof ProvablyFairConfigSchema>;
export type SeedRotation = z.infer<typeof SeedRotationSchema>;