const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.static('public'));

// Demo data
const demoUser = {
  id: 'demo-user-1',
  email: 'demo@crypto-casino.local',
  username: 'demo',
  balance: {
    BTC: '0.05',
    ETH: '1.25',
    USDT: '1000.00'
  },
  stats: {
    totalBets: 150,
    totalWins: 87,
    winRate: 58,
    highestWin: '500.00'
  }
};

const demoGames = [
  { id: 1, name: 'Dice', type: 'dice', minBet: 0.001, maxBet: 1, houseEdge: 1, status: 'active' },
  { id: 2, name: 'Coinflip', type: 'coinflip', minBet: 0.001, maxBet: 0.5, houseEdge: 2, status: 'active' },
  { id: 3, name: 'Crash', type: 'crash', minBet: 0.001, maxBet: 2, houseEdge: 1, status: 'active' },
  { id: 4, name: 'Slots', type: 'slots', minBet: 0.01, maxBet: 10, houseEdge: 3, status: 'active' },
];

const demoTransactions = [
  { id: 1, type: 'bet', amount: '-0.01', currency: 'BTC', game: 'Dice', timestamp: new Date() },
  { id: 2, type: 'win', amount: '+0.02', currency: 'BTC', game: 'Dice', timestamp: new Date() },
  { id: 3, type: 'deposit', amount: '+0.05', currency: 'BTC', method: 'Wallet', timestamp: new Date() },
];

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Crypto Casino API v1.0', 
    status: 'running',
    timestamp: new Date().toISOString(),
    features: [
      'User authentication',
      'Game management', 
      'Balance tracking',
      'Transaction history',
      'Provably fair gaming'
    ]
  });
});

// API Documentation (simple HTML page)
app.get('/api/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Crypto Casino API Documentation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 30px; }
            .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { font-weight: bold; color: #27ae60; }
            code { background: #2c3e50; color: #ecf0f1; padding: 2px 5px; border-radius: 3px; }
            .status { color: #27ae60; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎰 Crypto Casino API</h1>
            <p class="status">Status: Running (Demo Mode)</p>
            
            <h2>Available Endpoints</h2>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api</code><br>
                <strong>Description:</strong> API status and information
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/user/profile</code><br>
                <strong>Description:</strong> Get demo user profile and balances
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/games</code><br>
                <strong>Description:</strong> List all available games
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> <code>/api/transactions</code><br>
                <strong>Description:</strong> Get transaction history
            </div>
            
            <div class="endpoint">
                <span class="method">POST</span> <code>/api/games/dice/bet</code><br>
                <strong>Description:</strong> Place a dice bet (demo)
            </div>
            
            <h2>Demo Features</h2>
            <ul>
                <li>✅ REST API endpoints</li>
                <li>✅ CORS enabled</li>
                <li>✅ JSON responses</li>
                <li>✅ Demo user data</li>
                <li>✅ Game simulation</li>
                <li>❌ Database (requires Docker)</li>
                <li>❌ Authentication (requires Redis)</li>
                <li>❌ Real payments (requires blockchain)</li>
            </ul>
            
            <p><strong>Note:</strong> This is a simplified demo version. For full functionality with database, 
            authentication, and payment processing, please install Docker and run the complete setup.</p>
        </div>
    </body>
    </html>
  `);
});

// User routes
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    data: demoUser
  });
});

// Games routes
app.get('/api/games', (req, res) => {
  res.json({
    success: true,
    data: demoGames
  });
});

// Transactions routes
app.get('/api/transactions', (req, res) => {
  res.json({
    success: true,
    data: demoTransactions,
    meta: {
      total: demoTransactions.length,
      page: 1,
      limit: 20
    }
  });
});

// Demo game bet
app.post('/api/games/dice/bet', (req, res) => {
  const { amount, target, currency = 'BTC' } = req.body;
  
  // Simulate dice roll
  const roll = Math.floor(Math.random() * 100) + 1;
  const won = roll < target;
  const multiplier = won ? (99 / (target - 1)) : 0;
  const winAmount = won ? (parseFloat(amount) * multiplier).toFixed(8) : '0';
  
  res.json({
    success: true,
    data: {
      id: `bet-${Date.now()}`,
      game: 'dice',
      amount,
      currency,
      target,
      roll,
      won,
      winAmount,
      multiplier: multiplier.toFixed(2),
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed: 'demo-server-seed',
        clientSeed: 'demo-client-seed',
        nonce: Math.floor(Math.random() * 1000)
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
🎰 =====================================
   CRYPTO CASINO API (DEMO MODE)
=====================================

✅ Server running on: http://localhost:${PORT}
📖 API Documentation: http://localhost:${PORT}/api/docs  
🔍 Health Check: http://localhost:${PORT}/health
⚡ Demo Endpoints: http://localhost:${PORT}/api

📝 Note: This is a simplified demo version.
   For full functionality, install Docker and run the complete setup.

🚀 Ready to accept requests!
`);
});

module.exports = app;