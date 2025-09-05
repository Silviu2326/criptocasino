// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// User types
export interface User {
  id: string;
  email: string;
  username?: string;
  verified: boolean;
  vipLevel: number;
  balance: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Game types
export interface GameResult {
  id: string;
  game: string;
  amount: string;
  currency: string;
  multiplier: number;
  profit: string;
  timestamp: string;
  result: any;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

export interface DiceResult {
  result: number;
  target: number;
  isUnder: boolean;
  multiplier: number;
  win: boolean;
  seeds: {
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    serverSeedHash: string;
  };
}

// Provably Fair types
export interface Seeds {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  serverSeedHash: string;
}