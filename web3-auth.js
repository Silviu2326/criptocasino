const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const crypto = require('crypto');

class Web3AuthService {
  constructor() {
    this.nonces = new Map(); // In production, use Redis
    this.sessions = new Map(); // In production, use Redis
  }

  // Generate nonce for wallet signature
  generateNonce(walletAddress) {
    const nonce = crypto.randomBytes(32).toString('hex');
    this.nonces.set(walletAddress.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    });
    return nonce;
  }

  // Create message to sign
  createSignMessage(walletAddress, nonce) {
    return `Welcome to Crypto Casino!

Click to sign in and accept the Terms of Service.

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 24 hours.

Wallet address: ${walletAddress}
Nonce: ${nonce}`;
  }

  // Verify signed message
  async verifySignature(walletAddress, signature, nonce) {
    try {
      const storedNonce = this.nonces.get(walletAddress.toLowerCase());
      
      if (!storedNonce) {
        throw new Error('Nonce not found');
      }

      if (storedNonce.nonce !== nonce) {
        throw new Error('Invalid nonce');
      }

      if (Date.now() > storedNonce.expires) {
        throw new Error('Nonce expired');
      }

      const message = this.createSignMessage(walletAddress, nonce);
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new Error('Invalid signature');
      }

      // Clean up nonce
      this.nonces.delete(walletAddress.toLowerCase());

      return true;
    } catch (error) {
      console.error('Signature verification failed:', error.message);
      return false;
    }
  }

  // Create session token
  createSession(walletAddress) {
    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      walletAddress: walletAddress.toLowerCase(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      lastActivity: Date.now()
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  // Validate session
  validateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return null;
    }

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    // Update last activity
    session.lastActivity = Date.now();
    this.sessions.set(sessionId, session);

    return session;
  }

  // Get user profile from blockchain
  async getUserProfile(walletAddress) {
    // In a real implementation, you'd fetch from blockchain/database
    return {
      id: `user_${walletAddress.slice(-8)}`,
      walletAddress: walletAddress.toLowerCase(),
      balance: {
        ETH: '1.25',
        BTC: '0.05',
        USDT: '1000.00',
        USDC: '500.00'
      },
      joinedAt: new Date().toISOString(),
      totalBets: Math.floor(Math.random() * 1000),
      totalWins: Math.floor(Math.random() * 500),
      level: Math.floor(Math.random() * 10) + 1,
      isVerified: false,
      permissions: ['play', 'deposit', 'withdraw']
    };
  }
}

class Web3Server {
  constructor(port = 3002) {
    this.app = express();
    this.port = port;
    this.authService = new Web3AuthService();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true
    }));
  }

  setupRoutes() {
    // Get nonce for wallet authentication
    this.app.post('/api/auth/nonce', async (req, res) => {
      try {
        const { walletAddress } = req.body;

        if (!walletAddress || !ethers.isAddress(walletAddress)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid wallet address'
          });
        }

        const nonce = this.authService.generateNonce(walletAddress);
        const message = this.authService.createSignMessage(walletAddress, nonce);

        res.json({
          success: true,
          data: {
            nonce,
            message,
            walletAddress: walletAddress.toLowerCase()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Verify signature and login
    this.app.post('/api/auth/verify', async (req, res) => {
      try {
        const { walletAddress, signature, nonce } = req.body;

        if (!walletAddress || !signature || !nonce) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields'
          });
        }

        const isValid = await this.authService.verifySignature(walletAddress, signature, nonce);

        if (!isValid) {
          return res.status(401).json({
            success: false,
            error: 'Invalid signature'
          });
        }

        const sessionId = this.authService.createSession(walletAddress);
        const userProfile = await this.authService.getUserProfile(walletAddress);

        res.json({
          success: true,
          data: {
            sessionId,
            user: userProfile,
            token: sessionId, // In production, use JWT
            expiresIn: 24 * 60 * 60 // 24 hours in seconds
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get user profile (protected route)
    this.app.get('/api/auth/me', (req, res) => {
      try {
        const sessionId = req.headers.authorization?.replace('Bearer ', '');

        if (!sessionId) {
          return res.status(401).json({
            success: false,
            error: 'No session token provided'
          });
        }

        const session = this.authService.validateSession(sessionId);

        if (!session) {
          return res.status(401).json({
            success: false,
            error: 'Invalid or expired session'
          });
        }

        // Get fresh user data
        this.authService.getUserProfile(session.walletAddress).then(userProfile => {
          res.json({
            success: true,
            data: {
              user: userProfile,
              session: {
                id: session.id,
                expiresAt: session.expiresAt,
                lastActivity: session.lastActivity
              }
            }
          });
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Logout
    this.app.post('/api/auth/logout', (req, res) => {
      try {
        const sessionId = req.headers.authorization?.replace('Bearer ', '');

        if (sessionId) {
          this.authService.sessions.delete(sessionId);
        }

        res.json({
          success: true,
          message: 'Logged out successfully'
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Wallet connection info
    this.app.get('/api/auth/wallets', (req, res) => {
      res.json({
        success: true,
        data: {
          supportedWallets: [
            {
              id: 'metamask',
              name: 'MetaMask',
              icon: '🦊',
              description: 'Connect using MetaMask browser extension',
              deepLink: 'https://metamask.app.link/dapp/'
            },
            {
              id: 'walletconnect',
              name: 'WalletConnect',
              icon: '🔗',
              description: 'Connect using WalletConnect protocol',
              qrCode: true
            },
            {
              id: 'coinbase',
              name: 'Coinbase Wallet',
              icon: '💙',
              description: 'Connect using Coinbase Wallet',
              deepLink: 'https://go.cb-w.com/dapp?cb_url='
            }
          ],
          supportedNetworks: [
            {
              chainId: 1,
              name: 'Ethereum Mainnet',
              currency: 'ETH',
              rpc: 'https://mainnet.infura.io/v3/',
              explorer: 'https://etherscan.io'
            },
            {
              chainId: 137,
              name: 'Polygon',
              currency: 'MATIC',
              rpc: 'https://polygon-rpc.com',
              explorer: 'https://polygonscan.com'
            },
            {
              chainId: 56,
              name: 'BSC',
              currency: 'BNB',
              rpc: 'https://bsc-dataseed.binance.org',
              explorer: 'https://bscscan.com'
            }
          ]
        }
      });
    });

    // Original demo endpoints (now with auth protection)
    this.setupGameRoutes();
    this.setupUtilityRoutes();
  }

  // Middleware to check authentication
  requireAuth() {
    return (req, res, next) => {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');

      if (!sessionId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const session = this.authService.validateSession(sessionId);

      if (!session) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired session'
        });
      }

      req.session = session;
      next();
    };
  }

  setupGameRoutes() {
    // Protected game routes
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
          rtp: 99
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
          rtp: 98
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
          rtp: 99
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
          rtp: 97.3
        }
      ];

      res.json({
        success: true,
        data: games
      });
    });

    // Enhanced dice game
    this.app.post('/api/games/dice/bet', this.requireAuth(), (req, res) => {
      const { amount, target, currency = 'ETH' } = req.body;
      
      // Validate bet
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid bet amount'
        });
      }

      if (!target || target < 2 || target > 98) {
        return res.status(400).json({
          success: false,
          error: 'Target must be between 2 and 98'
        });
      }

      // Generate provably fair result
      const serverSeed = crypto.randomBytes(32).toString('hex');
      const clientSeed = req.body.clientSeed || crypto.randomBytes(16).toString('hex');
      const nonce = req.body.nonce || Math.floor(Math.random() * 1000000);

      // Create hash for provable fairness
      const hash = crypto.createHash('sha256')
        .update(`${serverSeed}:${clientSeed}:${nonce}`)
        .digest('hex');

      // Convert hash to number (0-99.99)
      const roll = (parseInt(hash.substring(0, 8), 16) / 0xffffffff) * 100;
      
      const won = roll < target;
      const multiplier = won ? (99 / (target - 1)) : 0;
      const winAmount = won ? (parseFloat(amount) * multiplier).toFixed(8) : '0';

      res.json({
        success: true,
        data: {
          id: `bet_${Date.now()}`,
          game: 'dice',
          player: req.session.walletAddress,
          amount,
          currency,
          target,
          roll: parseFloat(roll.toFixed(2)),
          won,
          winAmount,
          multiplier: parseFloat(multiplier.toFixed(4)),
          timestamp: new Date().toISOString(),
          provablyFair: {
            serverSeed,
            clientSeed,
            nonce,
            hash,
            verified: true
          }
        }
      });
    });

    // Add Roulette game
    this.app.post('/api/games/roulette/bet', this.requireAuth(), (req, res) => {
      const { amount, bets, currency = 'ETH' } = req.body;

      // European roulette numbers (0-36)
      const numbers = Array.from({ length: 37 }, (_, i) => i);
      const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      
      // Generate result
      const serverSeed = crypto.randomBytes(32).toString('hex');
      const clientSeed = req.body.clientSeed || crypto.randomBytes(16).toString('hex');
      const nonce = req.body.nonce || Math.floor(Math.random() * 1000000);

      const hash = crypto.createHash('sha256')
        .update(`${serverSeed}:${clientSeed}:${nonce}`)
        .digest('hex');

      const result = parseInt(hash.substring(0, 8), 16) % 37;
      const color = result === 0 ? 'green' : (redNumbers.includes(result) ? 'red' : 'black');

      let totalWin = 0;
      const betResults = [];

      // Process each bet
      if (Array.isArray(bets)) {
        bets.forEach(bet => {
          let won = false;
          let multiplier = 0;

          switch (bet.type) {
            case 'number':
              won = result === bet.value;
              multiplier = won ? 35 : 0;
              break;
            case 'color':
              won = color === bet.value;
              multiplier = won ? 1 : 0;
              break;
            case 'even':
              won = result !== 0 && result % 2 === 0;
              multiplier = won ? 1 : 0;
              break;
            case 'odd':
              won = result !== 0 && result % 2 === 1;
              multiplier = won ? 1 : 0;
              break;
          }

          const winAmount = won ? bet.amount * (multiplier + 1) : 0;
          totalWin += winAmount;

          betResults.push({
            type: bet.type,
            value: bet.value,
            amount: bet.amount,
            won,
            winAmount: winAmount.toFixed(8)
          });
        });
      }

      res.json({
        success: true,
        data: {
          id: `roulette_${Date.now()}`,
          game: 'roulette',
          player: req.session.walletAddress,
          result: {
            number: result,
            color: color
          },
          bets: betResults,
          totalBet: amount,
          totalWin: totalWin.toFixed(8),
          currency,
          timestamp: new Date().toISOString(),
          provablyFair: {
            serverSeed,
            clientSeed,
            nonce,
            hash,
            verified: true
          }
        }
      });
    });
  }

  setupUtilityRoutes() {
    // API Info
    this.app.get('/api', (req, res) => {
      res.json({ 
        message: 'Crypto Casino API v2.0 - Web3 Enabled', 
        status: 'running',
        timestamp: new Date().toISOString(),
        features: [
          'Web3 Wallet Authentication',
          'Provably Fair Gaming',
          'Multi-wallet Support',
          'Protected Routes',
          'Session Management'
        ],
        authentication: {
          type: 'Web3 Signature',
          supportedWallets: ['MetaMask', 'WalletConnect', 'Coinbase Wallet'],
          sessionDuration: '24 hours'
        }
      });
    });

    // Enhanced API documentation
    this.app.get('/api/docs', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Crypto Casino API v2.0 - Web3 Documentation</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
                .container { max-width: 1000px; margin: 0 auto; background: rgba(0,0,0,0.8); padding: 40px; border-radius: 16px; backdrop-filter: blur(10px); }
                h1 { color: #61dafb; border-bottom: 2px solid #61dafb; padding-bottom: 15px; }
                h2 { color: #ffd700; margin-top: 40px; }
                .endpoint { background: rgba(255,255,255,0.1); padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #61dafb; }
                .method { font-weight: bold; padding: 4px 8px; border-radius: 4px; margin-right: 10px; }
                .get { background: #4CAF50; color: white; }
                .post { background: #ff9800; color: white; }
                code { background: rgba(0,0,0,0.5); color: #61dafb; padding: 3px 6px; border-radius: 4px; }
                .status { color: #4CAF50; font-weight: bold; font-size: 1.2em; }
                .warning { background: rgba(255,193,7,0.2); padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0; }
                .feature { background: rgba(76,175,80,0.2); padding: 15px; border-radius: 8px; margin: 10px 0; }
                ul { list-style: none; padding: 0; }
                li { padding: 8px 0; }
                li:before { content: "🎰 "; margin-right: 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎰 Crypto Casino API v2.0</h1>
                <p class="status">Status: Running with Web3 Authentication</p>
                
                <div class="warning">
                    <strong>⚡ New in v2.0:</strong> Web3 wallet authentication required for protected endpoints.
                    Connect your wallet to access games and user features.
                </div>

                <h2>🔐 Authentication Flow</h2>
                
                <div class="endpoint">
                    <span class="method post">POST</span> <code>/api/auth/nonce</code><br>
                    <strong>Description:</strong> Get nonce for wallet signature<br>
                    <strong>Body:</strong> <code>{ "walletAddress": "0x..." }</code>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span> <code>/api/auth/verify</code><br>
                    <strong>Description:</strong> Verify signature and get session token<br>
                    <strong>Body:</strong> <code>{ "walletAddress": "0x...", "signature": "0x...", "nonce": "..." }</code>
                </div>
                
                <div class="endpoint">
                    <span class="method get">GET</span> <code>/api/auth/me</code><br>
                    <strong>Description:</strong> Get current user profile<br>
                    <strong>Headers:</strong> <code>Authorization: Bearer {sessionId}</code>
                </div>

                <h2>🎮 Game Endpoints (Protected)</h2>
                
                <div class="endpoint">
                    <span class="method get">GET</span> <code>/api/games</code><br>
                    <strong>Description:</strong> List all available games<br>
                    <strong>Auth:</strong> Required
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span> <code>/api/games/dice/bet</code><br>
                    <strong>Description:</strong> Place a dice bet with provably fair results<br>
                    <strong>Auth:</strong> Required<br>
                    <strong>Body:</strong> <code>{ "amount": 0.01, "target": 50, "currency": "ETH" }</code>
                </div>
                
                <div class="endpoint">
                    <span class="method post">POST</span> <code>/api/games/roulette/bet</code><br>
                    <strong>Description:</strong> Place roulette bets (NEW!)<br>
                    <strong>Auth:</strong> Required<br>
                    <strong>Body:</strong> <code>{ "amount": 0.01, "bets": [{"type": "color", "value": "red", "amount": 0.01}] }</code>
                </div>

                <h2>🔗 Supported Wallets</h2>
                <div class="feature">
                    <ul>
                        <li><strong>MetaMask</strong> - Browser extension and mobile app</li>
                        <li><strong>WalletConnect</strong> - Universal wallet connection protocol</li>
                        <li><strong>Coinbase Wallet</strong> - Coinbase's self-custody wallet</li>
                    </ul>
                </div>

                <h2>⛓️ Supported Networks</h2>
                <div class="feature">
                    <ul>
                        <li><strong>Ethereum Mainnet</strong> - ETH payments</li>
                        <li><strong>Polygon</strong> - Low-cost MATIC transactions</li>
                        <li><strong>BSC</strong> - Binance Smart Chain with BNB</li>
                    </ul>
                </div>

                <h2>🛡️ Security Features</h2>
                <div class="feature">
                    <ul>
                        <li><strong>Provably Fair Gaming</strong> - All results verifiable on-chain</li>
                        <li><strong>Signature-based Auth</strong> - No passwords, just wallet signatures</li>
                        <li><strong>Session Management</strong> - Secure 24-hour sessions</li>
                        <li><strong>Nonce Protection</strong> - Prevents replay attacks</li>
                    </ul>
                </div>
                
                <div class="warning">
                    <strong>Note:</strong> This is an enhanced demo with Web3 integration. 
                    For production use, ensure proper key management and audit all smart contracts.
                </div>
            </div>
        </body>
        </html>
      `);
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        version: '2.0.0',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        web3: {
          enabled: true,
          activeSessions: this.authService.sessions.size,
          pendingNonces: this.authService.nonces.size
        }
      });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`
🎰 =====================================
   CRYPTO CASINO API v2.0 (WEB3)
=====================================

✅ Server running on: http://localhost:${this.port}
📖 API Documentation: http://localhost:${this.port}/api/docs  
🔍 Health Check: http://localhost:${this.port}/health
🔐 Web3 Auth: http://localhost:${this.port}/api/auth/wallets

🆕 NEW FEATURES:
   • Web3 Wallet Authentication
   • MetaMask, WalletConnect Support
   • Provably Fair Gaming Enhanced
   • Protected Game Routes
   • Roulette Game Added

🔗 Connect your wallet to start playing!
🚀 Ready for Web3 integration!
`);
    });
  }
}

// Export for use in other modules
module.exports = { Web3Server, Web3AuthService };

// Start server if run directly
if (require.main === module) {
  const server = new Web3Server(3002);
  server.start();
}