import crypto from 'crypto'

export interface GameSeeds {
  serverSeed: string
  serverSeedHash: string
  clientSeed: string
  nonce: number
}

export interface GameResult {
  result: number
  seeds: GameSeeds
  isVerified: boolean
}

export class ProvablyFair {
  /**
   * Generate a random server seed
   */
  static generateServerSeed(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Create hash of server seed
   */
  static hashServerSeed(serverSeed: string): string {
    return crypto.createHash('sha256').update(serverSeed).digest('hex')
  }

  /**
   * Generate a random client seed
   */
  static generateClientSeed(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  /**
   * Generate game result using HMAC-SHA256
   */
  static generateResult(serverSeed: string, clientSeed: string, nonce: number): string {
    const message = `${clientSeed}:${nonce}`
    return crypto.createHmac('sha256', serverSeed).update(message).digest('hex')
  }

  /**
   * Convert hex result to number between 0 and max
   */
  static hexToNumber(hex: string, max: number = 10000): number {
    let result = 0
    
    // Use first 8 characters of hex
    for (let i = 0; i < 8; i++) {
      result = result * 16 + parseInt(hex.charAt(i), 16)
    }
    
    return result % max
  }

  /**
   * Verify a game result
   */
  static verifyResult(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    expectedResult: string
  ): boolean {
    const actualResult = this.generateResult(serverSeed, clientSeed, nonce)
    return actualResult === expectedResult
  }

  /**
   * Play Dice game
   */
  static playDice(seeds: GameSeeds, target: number, isUnder: boolean): {
    result: number
    win: boolean
    multiplier: number
  } {
    const hex = this.generateResult(seeds.serverSeed, seeds.clientSeed, seeds.nonce)
    const result = this.hexToNumber(hex) / 100 // Convert to 0-99.99
    
    const win = isUnder ? result < target : result > target
    
    // Calculate multiplier based on odds
    const winChance = isUnder ? target : (100 - target)
    const houseEdge = 0.01 // 1%
    const multiplier = win ? (100 - houseEdge) / winChance : 0
    
    return {
      result: Math.floor(result * 100) / 100, // Round to 2 decimals
      win,
      multiplier: Math.floor(multiplier * 100) / 100
    }
  }

  /**
   * Play Coinflip game
   */
  static playCoinflip(seeds: GameSeeds, choice: 'heads' | 'tails'): {
    result: 'heads' | 'tails'
    win: boolean
    multiplier: number
  } {
    const hex = this.generateResult(seeds.serverSeed, seeds.clientSeed, seeds.nonce)
    const result = this.hexToNumber(hex, 2) === 0 ? 'heads' : 'tails'
    
    const win = result === choice
    const multiplier = win ? 1.98 : 0 // 1% house edge
    
    return {
      result,
      win,
      multiplier
    }
  }

  /**
   * Play Crash game
   */
  static playCrash(seeds: GameSeeds): {
    crashPoint: number
    multiplier: number
  } {
    const hex = this.generateResult(seeds.serverSeed, seeds.clientSeed, seeds.nonce)
    
    // Convert hex to number for crash calculation
    const hexNum = parseInt(hex.substring(0, 8), 16)
    
    // Calculate crash point using exponential distribution
    // This ensures proper house edge and realistic crash points
    const e = 2 ** 32
    const crashPoint = Math.max(1, Math.floor((100 * e - hexNum) / (e - hexNum)))
    
    return {
      crashPoint: Math.min(crashPoint / 100, 100), // Max 100x
      multiplier: Math.min(crashPoint / 100, 100)
    }
  }

  /**
   * Create verification URL for external verification
   */
  static createVerificationUrl(
    serverSeed: string,
    clientSeed: string,
    nonce: number,
    game: string
  ): string {
    const params = new URLSearchParams({
      serverSeed,
      clientSeed,
      nonce: nonce.toString(),
      game
    })
    
    return `/verify?${params.toString()}`
  }

  /**
   * Batch verify multiple games
   */
  static batchVerify(games: Array<{
    serverSeed: string
    clientSeed: string
    nonce: number
    expectedResult: string
  }>): boolean[] {
    return games.map(game => 
      this.verifyResult(
        game.serverSeed,
        game.clientSeed,
        game.nonce,
        game.expectedResult
      )
    )
  }
}

// Helper class for managing game seeds
export class SeedManager {
  private static instance: SeedManager
  private currentSeeds: GameSeeds | null = null

  static getInstance(): SeedManager {
    if (!SeedManager.instance) {
      SeedManager.instance = new SeedManager()
    }
    return SeedManager.instance
  }

  generateNewSeeds(): GameSeeds {
    const serverSeed = ProvablyFair.generateServerSeed()
    const clientSeed = ProvablyFair.generateClientSeed()
    
    this.currentSeeds = {
      serverSeed,
      serverSeedHash: ProvablyFair.hashServerSeed(serverSeed),
      clientSeed,
      nonce: 0
    }
    
    return this.currentSeeds
  }

  getCurrentSeeds(): GameSeeds | null {
    return this.currentSeeds
  }

  incrementNonce(): void {
    if (this.currentSeeds) {
      this.currentSeeds.nonce += 1
    }
  }

  updateClientSeed(clientSeed: string): void {
    if (this.currentSeeds) {
      this.currentSeeds.clientSeed = clientSeed
    }
  }

  shouldRotateSeeds(): boolean {
    // Rotate seeds every 100 games for security
    return this.currentSeeds !== null && this.currentSeeds.nonce >= 100
  }
}

// Type definitions for game results
export interface DiceResult {
  result: number
  target: number
  isUnder: boolean
  win: boolean
  multiplier: number
  seeds: GameSeeds
}

export interface CoinflipResult {
  result: 'heads' | 'tails'
  choice: 'heads' | 'tails'
  win: boolean
  multiplier: number
  seeds: GameSeeds
}

export interface CrashResult {
  crashPoint: number
  cashOutAt?: number
  win: boolean
  multiplier: number
  seeds: GameSeeds
}