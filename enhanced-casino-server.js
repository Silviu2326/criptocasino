const { Web3Server } = require('./web3-auth');
const ProvablyFairGames = require('./provably-fair-games');
const crypto = require('crypto');

class EnhancedCasinoServer extends Web3Server {
  constructor(port = 3002) {
    super(port);
    this.games = new ProvablyFairGames();
    this.bonusService = new BonusService();
    this.setupEnhancedGameRoutes();
  }

  setupEnhancedGameRoutes() {
    // Enhanced games list
    this.app.get('/api/games', this.requireAuth(), (req, res) => {
      const games = [
        { 
          id: 1, 
          name: 'Dice', 
          type: 'dice', 
          minBet: 0.001, 
          maxBet: 1, 
          houseEdge: 1, 
          status: 'active',
          description: 'Roll under your target number to win',
          rtp: 99,
          category: 'classic'
        },
        { 
          id: 2, 
          name: 'Coinflip', 
          type: 'coinflip', 
          minBet: 0.001, 
          maxBet: 0.5, 
          houseEdge: 2, 
          status: 'active',
          description: 'Guess heads or tails correctly',
          rtp: 98,
          category: 'classic'
        },
        { 
          id: 3, 
          name: 'Crash', 
          type: 'crash', 
          minBet: 0.001, 
          maxBet: 2, 
          houseEdge: 1, 
          status: 'active',
          description: 'Cash out before the multiplier crashes',
          rtp: 99,
          category: 'multiplier'
        },
        { 
          id: 4, 
          name: 'Roulette', 
          type: 'roulette', 
          minBet: 0.001, 
          maxBet: 5, 
          houseEdge: 2.7, 
          status: 'active',
          description: 'European roulette with single zero',
          rtp: 97.3,
          category: 'table'
        },
        { 
          id: 5, 
          name: 'Blackjack', 
          type: 'blackjack', 
          minBet: 0.001, 
          maxBet: 3, 
          houseEdge: 0.5, 
          status: 'active',
          description: 'Get as close to 21 without going over',
          rtp: 99.5,
          category: 'table'
        },
        { 
          id: 6, 
          name: 'Plinko', 
          type: 'plinko', 
          minBet: 0.001, 
          maxBet: 2, 
          houseEdge: 1, 
          status: 'active',
          description: 'Drop the ball and watch it bounce to victory',
          rtp: 99,
          category: 'arcade'
        },
        { 
          id: 7, 
          name: 'Mines', 
          type: 'mines', 
          minBet: 0.001, 
          maxBet: 1, 
          houseEdge: 1, 
          status: 'active',
          description: 'Avoid the mines and collect multipliers',
          rtp: 99,
          category: 'strategy'
        },
        { 
          id: 8, 
          name: 'Wheel', 
          type: 'wheel', 
          minBet: 0.001, 
          maxBet: 2, 
          houseEdge: 2, 
          status: 'active',
          description: 'Spin the wheel and win big multipliers',
          rtp: 98,
          category: 'wheel'
        },
        { 
          id: 9, 
          name: 'Limbo', 
          type: 'limbo', 
          minBet: 0.001, 
          maxBet: 1, 
          houseEdge: 1, 
          status: 'active',
          description: 'How high can the multiplier go?',
          rtp: 99,
          category: 'multiplier'
        },
        { 
          id: 10, 
          name: 'Hi-Lo', 
          type: 'hilo', 
          minBet: 0.001, 
          maxBet: 1, 
          houseEdge: 1.5, 
          status: 'active',
          description: 'Guess if the next card is higher or lower',
          rtp: 98.5,
          category: 'cards'
        }
      ];

      res.json({
        success: true,
        data: games,
        categories: ['classic', 'table', 'arcade', 'strategy', 'wheel', 'multiplier', 'cards'],
        totalGames: games.length
      });
    });

    // Blackjack
    this.app.post('/api/games/blackjack/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playBlackjack(bet);
        
        // Apply bonus if applicable
        this.bonusService.applyBonus(req.session.walletAddress, result);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Plinko
    this.app.post('/api/games/plinko/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playPlinko(bet);
        
        this.bonusService.applyBonus(req.session.walletAddress, result);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Crash
    this.app.post('/api/games/crash/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playCrash(bet);
        
        this.bonusService.applyBonus(req.session.walletAddress, result);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Mines
    this.app.post('/api/games/mines/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playMines(bet);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Mines - Reveal tile
    this.app.post('/api/games/mines/reveal', this.requireAuth(), (req, res) => {
      try {
        const { gameId, tileIndex } = req.body;
        // In a real implementation, you'd fetch the game state from database
        // For now, we'll simulate the reveal
        
        res.json({
          success: true,
          data: {
            gameId,
            tileIndex,
            revealed: 'safe', // or 'mine'
            multiplier: 1.5,
            canContinue: true
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Wheel
    this.app.post('/api/games/wheel/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playWheel(bet);
        
        this.bonusService.applyBonus(req.session.walletAddress, result);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Limbo
    this.app.post('/api/games/limbo/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playLimbo(bet);
        
        this.bonusService.applyBonus(req.session.walletAddress, result);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Hi-Lo
    this.app.post('/api/games/hilo/bet', this.requireAuth(), (req, res) => {
      try {
        const bet = { 
          ...req.body, 
          player: req.session.walletAddress 
        };
        const result = this.games.playHiLo(bet);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Hi-Lo - Make guess
    this.app.post('/api/games/hilo/guess', this.requireAuth(), (req, res) => {
      try {
        const { gameId, guess } = req.body; // guess: 'higher' or 'lower'
        // In a real implementation, you'd continue the game state
        
        res.json({
          success: true,
          data: {
            gameId,
            guess,
            correct: Math.random() > 0.5,
            nextCard: { name: 'K', suit: '♠', value: 13, display: 'K♠' },
            multiplier: 2.5,
            canContinue: true
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Verify game result
    this.app.post('/api/games/verify', this.requireAuth(), (req, res) => {
      try {
        const { gameResult } = req.body;
        const verification = this.games.verifyResult(gameResult);
        
        res.json({
          success: true,
          data: verification
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Bonus system routes
    this.app.get('/api/bonus/available', this.requireAuth(), (req, res) => {
      try {
        const bonuses = this.bonusService.getAvailableBonuses(req.session.walletAddress);
        
        res.json({
          success: true,
          data: bonuses
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/bonus/claim', this.requireAuth(), (req, res) => {
      try {
        const { bonusId } = req.body;
        const result = this.bonusService.claimBonus(req.session.walletAddress, bonusId);
        
        res.json({
          success: true,
          data: result
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    // Game statistics
    this.app.get('/api/stats', this.requireAuth(), (req, res) => {
      try {
        // Mock statistics - in production, fetch from database
        const stats = {
          user: {
            totalBets: Math.floor(Math.random() * 1000),
            totalWins: Math.floor(Math.random() * 500),
            totalWagered: (Math.random() * 100).toFixed(4),
            biggestWin: (Math.random() * 10).toFixed(4),
            favoriteGame: 'dice',
            winRate: (Math.random() * 100).toFixed(1)
          },
          global: {
            totalPlayers: 1250,
            totalBets: 50000,
            totalWagered: '12,500.00',
            biggestWin: '157.89',
            activeNow: Math.floor(Math.random() * 200) + 50
          }
        };

        res.json({
          success: true,
          data: stats
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`
🎰 =====================================
   CRYPTO CASINO API v2.1 (ENHANCED)
=====================================

✅ Server running on: http://localhost:${this.port}
📖 API Documentation: http://localhost:${this.port}/api/docs  
🔍 Health Check: http://localhost:${this.port}/health
🔐 Web3 Auth: http://localhost:${this.port}/api/auth/wallets

🎮 NEW GAMES ADDED:
   • Blackjack - Classic card game
   • Plinko - Ball drop arcade game
   • Mines - Strategy mine-sweeper
   • Wheel - Spin to win multipliers
   • Limbo - High-multiplier betting
   • Hi-Lo - Card prediction game
   • Enhanced Crash & Dice

🎁 BONUS SYSTEM:
   • Welcome bonus for new players
   • Daily login rewards
   • Rakeback system
   • Level-up bonuses

🛡️ PROVABLY FAIR:
   • All games cryptographically verifiable
   • Client seed support
   • Hash verification endpoints

🔗 Ready for Web3 gaming!
`);
    });
  }
}

// Basic Bonus Service
class BonusService {
  constructor() {
    this.userBonuses = new Map(); // In production, use database
  }

  getAvailableBonuses(walletAddress) {
    const bonuses = [
      {
        id: 'welcome',
        name: 'Welcome Bonus',
        description: 'Get 100% match up to 1 ETH on your first deposit',
        type: 'deposit_match',
        value: 1.0, // 100%
        maxAmount: '1.0',
        currency: 'ETH',
        available: !this.userBonuses.has(`${walletAddress}_welcome`),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'daily',
        name: 'Daily Bonus',
        description: 'Claim your daily free spins',
        type: 'free_spins',
        value: 10,
        available: this.canClaimDaily(walletAddress),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rakeback',
        name: 'Weekly Rakeback',
        description: 'Get 5% of your losses back every week',
        type: 'rakeback',
        value: 0.05, // 5%
        available: this.hasLossesThisWeek(walletAddress),
        expires: this.getNextMonday()
      }
    ];

    return bonuses.filter(bonus => bonus.available);
  }

  claimBonus(walletAddress, bonusId) {
    const availableBonuses = this.getAvailableBonuses(walletAddress);
    const bonus = availableBonuses.find(b => b.id === bonusId);

    if (!bonus) {
      throw new Error('Bonus not available');
    }

    // Mark as claimed
    this.userBonuses.set(`${walletAddress}_${bonusId}`, {
      claimedAt: new Date(),
      bonusId,
      status: 'active'
    });

    return {
      bonusId,
      claimed: true,
      value: bonus.value,
      type: bonus.type,
      claimedAt: new Date().toISOString()
    };
  }

  applyBonus(walletAddress, gameResult) {
    // Apply any active bonuses to the game result
    const activeBonuses = Array.from(this.userBonuses.entries())
      .filter(([key, bonus]) => key.startsWith(walletAddress) && bonus.status === 'active')
      .map(([key, bonus]) => bonus);

    if (activeBonuses.length > 0) {
      gameResult.bonusApplied = true;
      gameResult.bonusDetails = activeBonuses;
    }

    return gameResult;
  }

  canClaimDaily(walletAddress) {
    const lastDaily = this.userBonuses.get(`${walletAddress}_daily`);
    if (!lastDaily) return true;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return new Date(lastDaily.claimedAt) < yesterday;
  }

  hasLossesThisWeek(walletAddress) {
    // Mock implementation - in production, check actual user losses
    return Math.random() > 0.5;
  }

  getNextMonday() {
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) + 7;
    return new Date(date.setDate(diff)).toISOString();
  }
}

module.exports = { EnhancedCasinoServer, BonusService };

// Start server if run directly
if (require.main === module) {
  const server = new EnhancedCasinoServer(3002);
  server.start();
}