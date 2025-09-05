import { z } from 'zod';
import { Currency } from './common';
import { GameProofSchema } from './provably-fair';

export enum GameType {
  DICE = 'DICE',
  COINFLIP = 'COINFLIP',
  SLOTS = 'SLOTS',
}

export enum GameStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const DiceBetSchema = z.object({
  betAmount: z.string(),
  currency: z.nativeEnum(Currency),
  target: z.number().min(0).max(100),
  isUnder: z.boolean(),
});

export const CoinflipBetSchema = z.object({
  betAmount: z.string(),
  currency: z.nativeEnum(Currency),
  side: z.enum(['HEADS', 'TAILS']),
});

export const SlotsBetSchema = z.object({
  betAmount: z.string(),
  currency: z.nativeEnum(Currency),
  lines: z.number().min(1).max(25).default(1),
});

export const DiceResultSchema = z.object({
  roll: z.number().min(0).max(100),
  target: z.number(),
  isUnder: z.boolean(),
  multiplier: z.number(),
  isWin: z.boolean(),
});

export const CoinflipResultSchema = z.object({
  result: z.enum(['HEADS', 'TAILS']),
  playerChoice: z.enum(['HEADS', 'TAILS']),
  multiplier: z.number(),
  isWin: z.boolean(),
});

export const SlotsSymbol = z.enum(['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven']);

export const SlotsResultSchema = z.object({
  reels: z.array(z.array(SlotsSymbol)).length(3),
  lines: z.array(z.object({
    line: z.number(),
    symbols: z.array(SlotsSymbol).length(3),
    multiplier: z.number(),
  })),
  totalMultiplier: z.number(),
  isWin: z.boolean(),
});

export const GameRoundSchema = z.object({
  id: z.string(),
  userId: z.string(),
  gameType: z.nativeEnum(GameType),
  status: z.nativeEnum(GameStatus),
  betAmount: z.string(),
  currency: z.nativeEnum(Currency),
  multiplier: z.number(),
  winAmount: z.string(),
  result: z.union([DiceResultSchema, CoinflipResultSchema, SlotsResultSchema]),
  proof: GameProofSchema,
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export const GameStatsSchema = z.object({
  totalBets: z.number(),
  totalWagered: z.string(),
  totalWon: z.string(),
  netProfit: z.string(),
  winRate: z.number(),
  biggestWin: z.string(),
  favoriteGame: z.nativeEnum(GameType).optional(),
});

export const GameConfigSchema = z.object({
  gameType: z.nativeEnum(GameType),
  minBet: z.record(z.nativeEnum(Currency), z.string()),
  maxBet: z.record(z.nativeEnum(Currency), z.string()),
  houseEdge: z.number(),
  rtp: z.number(),
  isEnabled: z.boolean(),
  config: z.record(z.unknown()),
});

// export type GameTypeType = GameType;
export type GameStatusType = z.infer<typeof GameRoundSchema>['status'];
export type DiceBet = z.infer<typeof DiceBetSchema>;
export type CoinflipBet = z.infer<typeof CoinflipBetSchema>;
export type SlotsBet = z.infer<typeof SlotsBetSchema>;
export type DiceResult = z.infer<typeof DiceResultSchema>;
export type CoinflipResult = z.infer<typeof CoinflipResultSchema>;
export type SlotsResult = z.infer<typeof SlotsResultSchema>;
export type GameRound = z.infer<typeof GameRoundSchema>;
export type GameStats = z.infer<typeof GameStatsSchema>;
export type GameConfig = z.infer<typeof GameConfigSchema>;