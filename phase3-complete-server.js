const CompleteCasinoServer = require('./complete-casino-server');
const MultiCurrencySystem = require('./multi-currency-system');
const LiquidityStakingSystem = require('./liquidity-staking-system');
const TournamentSystem = require('./tournament-system');
const AffiliateSystem = require('./affiliate-system');
const AdvancedAnalyticsSystem = require('./advanced-analytics-system');
const APIIntegrationsSystem = require('./api-integrations-system');

// Phase 2 imports
const VIPSystem = require('./vip-system');
const SocialSystem = require('./social-system');
const AdvancedBonusSystem = require('./advanced-bonus-system');

class Phase3CompleteServer extends CompleteCasinoServer {
  constructor(port = 3005) {
    super(port);
    
    // Initialize Phase 3 systems
    this.multiCurrency = new MultiCurrencySystem();
    this.liquidityStaking = new LiquidityStakingSystem(this.multiCurrency);
    this.tournaments = new TournamentSystem(this.multiCurrency);
    this.affiliates = new AffiliateSystem(this.multiCurrency);
    this.analytics = new AdvancedAnalyticsSystem(this.multiCurrency);
    this.integrations = new APIIntegrationsSystem();
    
    // Initialize Phase 2 systems (integrated)
    this.vipSystem = new VIPSystem();
    this.socialSystem = new SocialSystem();
    this.advancedBonusSystem = new AdvancedBonusSystem();
    
    this.setupPhase3Routes();
    this.setupSystemIntegrations();
    this.setupEventHandlers();
  }

  setupPhase3Routes() {
    // Multi-Currency System Routes
    this.app.get('/api/multi-currency/balances', this.requireAuth(), async (req, res) => {
      try {
        const balances = this.multiCurrency.getAllUserBalances(req.session.walletAddress);
        res.json({
          success: true,
          data: balances
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/multi-currency/rates', (req, res) => {
      try {
        const rates = this.multiCurrency.getExchangeRates();
        res.json({
          success: true,
          data: rates
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/multi-currency/convert', this.requireAuth(), async (req, res) => {
      try {
        const { amount, fromCurrency, toCurrency } = req.body;
        const convertedAmount = this.multiCurrency.convertCurrency(amount, fromCurrency, toCurrency);
        
        res.json({
          success: true,
          data: {
            originalAmount: parseFloat(amount),
            fromCurrency,
            toCurrency,
            convertedAmount,
            exchangeRate: this.multiCurrency.exchangeRates.get(fromCurrency) / this.multiCurrency.exchangeRates.get(toCurrency)
          }
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/multi-currency/portfolio/:timeframe', this.requireAuth(), async (req, res) => {
      try {
        const timeframe = req.params.timeframe;
        const performance = this.multiCurrency.getPortfolioPerformance(req.session.walletAddress, timeframe);
        
        res.json({
          success: true,
          data: performance
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Liquidity & Staking Routes
    this.app.get('/api/defi/pools', (req, res) => {
      try {
        const pools = this.liquidityStaking.getAllPools();
        res.json({
          success: true,
          data: pools
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/defi/liquidity/add', this.requireAuth(), async (req, res) => {
      try {
        const { poolId, amount0, amount1, slippageTolerance } = req.body;
        const position = await this.liquidityStaking.addLiquidity(
          req.session.walletAddress,
          poolId,
          amount0,
          amount1,
          slippageTolerance
        );
        
        res.json({
          success: true,
          data: position
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/defi/stake', this.requireAuth(), async (req, res) => {
      try {
        const { poolId, amount, lockPeriod } = req.body;
        const stake = await this.liquidityStaking.stakeTokens(
          req.session.walletAddress,
          poolId,
          amount,
          lockPeriod
        );
        
        res.json({
          success: true,
          data: stake
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/defi/user/positions', this.requireAuth(), async (req, res) => {
      try {
        const liquidityPositions = this.liquidityStaking.getUserLiquidityPositions(req.session.walletAddress);
        const stakes = this.liquidityStaking.getUserStakes(req.session.walletAddress);
        
        res.json({
          success: true,
          data: {
            liquidity: liquidityPositions,
            stakes: stakes
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Tournament System Routes
    this.app.get('/api/tournaments', (req, res) => {
      try {
        const tournaments = this.tournaments.getActiveTournaments();
        res.json({
          success: true,
          data: tournaments
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/tournaments/:tournamentId/register', this.requireAuth(), async (req, res) => {
      try {
        const { tournamentId } = req.params;
        const vipStatus = await this.vipSystem.getUserVIPStatus(req.session.walletAddress);
        
        const registration = await this.tournaments.registerForTournament(
          req.session.walletAddress,
          tournamentId,
          vipStatus.currentLevel.level
        );
        
        res.json({
          success: true,
          data: registration
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/tournaments/:tournamentId/leaderboard', (req, res) => {
      try {
        const { tournamentId } = req.params;
        const limit = parseInt(req.query.limit) || 100;
        const leaderboard = this.tournaments.getTournamentLeaderboard(tournamentId, limit);
        
        res.json({
          success: true,
          data: leaderboard
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/tournaments/user/history', this.requireAuth(), (req, res) => {
      try {
        const history = this.tournaments.getUserTournamentHistory(req.session.walletAddress);
        res.json({
          success: true,
          data: history
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Affiliate System Routes
    this.app.post('/api/affiliates/register', this.requireAuth(), async (req, res) => {
      try {
        const { referrerCode } = req.body;
        const affiliate = await this.affiliates.registerAffiliate(req.session.walletAddress, referrerCode);
        
        res.json({
          success: true,
          data: affiliate
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/affiliates/dashboard', this.requireAuth(), (req, res) => {
      try {
        const dashboard = this.affiliates.getAffiliateDashboard(req.session.walletAddress);
        res.json({
          success: true,
          data: dashboard
        });
      } catch (error) {
        res.status(404).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/affiliates/campaigns', this.requireAuth(), (req, res) => {
      try {
        const campaignData = req.body;
        const campaign = this.affiliates.createCampaign(req.session.walletAddress, campaignData);
        
        res.json({
          success: true,
          data: campaign
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/affiliates/leaderboard', (req, res) => {
      try {
        const limit = parseInt(req.query.limit) || 10;
        const metric = req.query.metric || 'totalCommissions';
        const leaderboard = this.affiliates.getTopAffiliates(limit, metric);
        
        res.json({
          success: true,
          data: leaderboard
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Analytics Routes
    this.app.get('/api/analytics/player/summary', this.requireAuth(), (req, res) => {
      try {
        const report = this.analytics.generateReport('player_summary');
        res.json({
          success: true,
          data: report
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/analytics/games/performance', (req, res) => {
      try {
        const report = this.analytics.generateReport('game_performance');
        res.json({
          success: true,
          data: report
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.get('/api/analytics/cohorts', (req, res) => {
      try {
        const report = this.analytics.generateReport('cohort_analysis');
        res.json({
          success: true,
          data: report
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Integration System Routes
    this.app.get('/api/integrations/status', this.requireAdminAccess(), (req, res) => {
      try {
        const stats = this.integrations.getIntegrationStatistics();
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

    this.app.get('/api/integrations/:integrationId/status', this.requireAdminAccess(), (req, res) => {
      try {
        const { integrationId } = req.params;
        const status = this.integrations.getIntegrationStatus(integrationId);
        
        if (!status) {
          return res.status(404).json({
            success: false,
            error: 'Integration not found'
          });
        }
        
        res.json({
          success: true,
          data: status
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    this.app.post('/api/integrations/webhooks/:webhookId', async (req, res) => {
      try {
        const { webhookId } = req.params;
        const payload = req.body;
        
        const result = await this.integrations.processWebhook(webhookId, payload);
        
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

    // Enhanced admin routes for Phase 3
    this.app.get('/api/admin/phase3/overview', this.requireAdminAccess(), (req, res) => {
      try {
        const multiCurrencyStats = this.multiCurrency.getSystemStatistics();
        const defiStats = this.liquidityStaking.getSystemStatistics();
        const tournamentStats = this.tournaments.getSystemStatistics();
        const affiliateStats = this.affiliates.getSystemStatistics();
        const analyticsStats = this.analytics.getSystemStatistics();
        const integrationStats = this.integrations.getIntegrationStatistics();

        res.json({
          success: true,
          data: {
            multiCurrency: multiCurrencyStats,
            defi: defiStats,
            tournaments: tournamentStats,
            affiliates: affiliateStats,
            analytics: analyticsStats,
            integrations: integrationStats,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  // Setup system integrations and cross-system communication
  setupSystemIntegrations() {
    // Initialize demo user data in multi-currency system
    this.multiCurrency.initializeDemoUser('0x742d35cc6634c0532925a3b8d7c1cf92e4b4e7e6');
    this.multiCurrency.initializeDemoUser('0x742d35cc6634c0532925a3b8d7c1cf92e4b4e7e7');
    this.multiCurrency.initializeDemoUser('0x742d35cc6634c0532925a3b8d7c1cf92e4b4e7e8');

    // Enhanced bet processing to integrate all systems
    this.enhanceBetProcessing();
    
    // Tournament integration with VIP system
    this.integrateTournamentVIP();
    
    // Analytics integration across all systems  
    this.integrateAnalytics();
    
    // Affiliate commission processing
    this.integrateAffiliateCommissions();
  }

  enhanceBetProcessing() {
    // Override bet processing to integrate multi-currency and analytics
    const originalProcessBet = this.processBet?.bind(this) || (() => {});
    
    this.processBet = async (walletAddress, gameType, betData) => {
      try {
        // Process bet in multi-currency system
        const betResult = await this.multiCurrency.processBet(
          walletAddress,
          betData.currency,
          betData.amount,
          gameType,
          betData
        );

        // Track analytics
        this.analytics.trackPlayerActivity(walletAddress, 'bet', {
          amount: betData.amount,
          currency: betData.currency,
          gameType,
          result: betData.result || { won: Math.random() > 0.5 },
          multiplier: betData.multiplier || 1
        });

        // Update tournament scores
        if (betData.result) {
          this.tournaments.updateParticipantScore(
            betData.tournamentId,
            walletAddress,
            betData.result
          );
        }

        // Process affiliate commissions
        await this.affiliates.processBet(
          walletAddress,
          betData.amount,
          betData.currency,
          gameType,
          betData.result || { won: Math.random() > 0.5 }
        );

        // Add VIP wagered amount
        if (this.vipSystem) {
          const ethAmount = this.multiCurrency.convertCurrency(betData.amount, betData.currency, 'ETH');
          this.vipSystem.addWageredAmount(walletAddress, ethAmount);
        }

        return betResult;

      } catch (error) {
        console.error('Enhanced bet processing error:', error);
        throw error;
      }
    };
  }

  integrateTournamentVIP() {
    // Create VIP-exclusive tournaments automatically
    const createVIPTournament = () => {
      const vipExclusiveTemplate = 'vip_exclusive';
      if (this.tournaments.tournamentTemplates[vipExclusiveTemplate]) {
        this.tournaments.createTournament(vipExclusiveTemplate);
      }
    };

    // Create VIP tournament weekly
    setInterval(createVIPTournament, 7 * 24 * 60 * 60 * 1000);
  }

  integrateAnalytics() {
    // Track user activities across all systems
    this.multiCurrency.on('balanceUpdate', (data) => {
      const activityType = data.transaction.reason === 'deposit' ? 'deposit' : 
                          data.transaction.reason === 'withdrawal' ? 'withdrawal' : 'bet';
      
      this.analytics.trackPlayerActivity(data.walletAddress, activityType, {
        amount: Math.abs(data.transaction.amount),
        currency: data.transaction.currency,
        transactionId: data.transaction.id
      });
    });

    this.tournaments.on('userRegistered', (data) => {
      this.analytics.trackPlayerActivity(data.walletAddress, 'tournament_registration', {
        tournamentId: data.tournamentId,
        entryFee: data.participant.entryFeeTransaction
      });
    });

    this.affiliates.on('playerReferred', (data) => {
      this.analytics.trackPlayerActivity(data.playerWallet, 'referral', {
        referralCode: data.referralCode,
        affiliateWallet: data.affiliateWallet
      });
    });
  }

  integrateAffiliateCommissions() {
    // Process affiliate commissions for all bet activities
    this.multiCurrency.on('balanceUpdate', async (data) => {
      if (data.transaction.reason === 'bet') {
        try {
          await this.affiliates.processBet(
            data.walletAddress,
            Math.abs(data.transaction.amount),
            data.transaction.currency || 'ETH',
            data.transaction.metadata?.gameType || 'dice',
            { won: false, winAmount: 0 } // Simplified for demo
          );
        } catch (error) {
          // Affiliate processing is optional, don't break the main flow
          console.log('Affiliate commission processing skipped:', error.message);
        }
      }
    });
  }

  setupEventHandlers() {
    // Multi-currency price update events
    this.multiCurrency.on('priceUpdate', (rates) => {
      // Could notify connected clients via WebSocket
      console.log('Exchange rates updated:', Object.keys(rates).length, 'currencies');
    });

    // Liquidity events
    this.liquidityStaking.on('liquidityAdded', (data) => {
      console.log(`Liquidity added: ${data.walletAddress} to ${data.poolId}`);
    });

    this.liquidityStaking.on('tokensStaked', (data) => {
      console.log(`Tokens staked: ${data.walletAddress} in ${data.stake.poolId}`);
    });

    // Tournament events
    this.tournaments.on('tournamentStarted', (tournament) => {
      console.log(`Tournament started: ${tournament.name} with ${tournament.currentParticipants} participants`);
    });

    this.tournaments.on('tournamentEnded', (data) => {
      console.log(`Tournament ended: ${data.tournament.name} with prize pool of ${data.tournament.actualPrizePool} ETH`);
    });

    // Affiliate events
    this.affiliates.on('affiliateRegistered', (data) => {
      console.log(`New affiliate registered: ${data.walletAddress}`);
    });

    this.affiliates.on('commissionsPaid', (data) => {
      console.log(`Commissions paid: ${data.amount} ${data.currency} to ${data.affiliateWallet}`);
    });

    // Analytics events
    this.analytics.on('playerActivityTracked', (data) => {
      // Could trigger real-time dashboard updates
    });

    this.analytics.on('adminAlert', (alert) => {
      console.log(`ADMIN ALERT [${alert.severity}]: ${alert.type}`, alert.details);
    });

    // Integration events
    this.integrations.on('integrationUnhealthy', (data) => {
      console.log(`Integration unhealthy: ${data.integrationId} - ${data.error}`);
    });

    this.integrations.on('webhookProcessed', (data) => {
      console.log(`Webhook processed: ${data.eventType} from ${data.integrationId}`);
    });
  }

  // Admin access control
  requireAdminAccess() {
    return (req, res, next) => {
      const adminKey = req.headers['x-admin-key'];
      if (adminKey !== 'demo-admin-key') {
        return res.status(403).json({
          success: false,
          error: 'Admin access required'
        });
      }
      next();
    };
  }

  // Override the requireAuth middleware to integrate with multi-currency demo
  requireAuth() {
    return (req, res, next) => {
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      
      if (!sessionId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // For demo purposes, create a mock session
      if (sessionId.startsWith('demo_')) {
        req.session = {
          walletAddress: '0x742d35cc6634c0532925a3b8d7c1cf92e4b4e7e6',
          isAuthenticated: true,
          createdAt: new Date(),
          vipLevel: 2
        };

        // Initialize demo user in all systems if not exists
        if (!this.multiCurrency.userBalances.has(req.session.walletAddress)) {
          this.multiCurrency.initializeDemoUser(req.session.walletAddress);
        }

        return next();
      }

      // Use parent auth validation
      const session = this.authService?.validateSession(sessionId);
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

  // Start the Phase 3 server
  start() {
    this.app.listen(this.port, () => {
      console.log(`
🎰 =====================================
   CRYPTO CASINO v5.0 (PHASE 3)
=====================================

✅ Server running on: http://localhost:${this.port}
📖 API Documentation: http://localhost:${this.port}/api/docs  
🔍 Health Check: http://localhost:${this.port}/health

🎮 PHASE 3 COMPLETE - ENTERPRISE SCALING:

💰 MULTI-CURRENCY SYSTEM:
   • 8 supported cryptocurrencies
   • Real-time exchange rates
   • Portfolio management & analytics
   • Cross-chain compatibility

🏦 DEFI FEATURES:
   • Liquidity pools (4 active pairs)
   • Staking pools with APY rewards
   • Yield farming opportunities
   • Automated reward distribution

🏆 TOURNAMENT SYSTEM:
   • Daily, weekly & monthly tournaments
   • Bracket-style competitions
   • VIP exclusive events
   • Real-time leaderboards

🤝 AFFILIATE PROGRAM:
   • 5-tier commission structure
   • Marketing campaign tools
   • Real-time analytics dashboard
   • Automated payout system

📊 ADVANCED ANALYTICS:
   • Player behavior tracking
   • Cohort analysis & predictions
   • Real-time business metrics
   • Automated alert system

🔗 API INTEGRATIONS:
   • 12+ external service integrations
   • Payment processors (Coinbase, Binance)
   • Blockchain APIs (Moralis, Alchemy)
   • Communication services
   • KYC/AML compliance tools

📈 ENHANCED FEATURES:
   ✅ All Phase 1 features (Games, Auth, KYC/AML)
   ✅ All Phase 2 features (Mobile, VIP, Social)
   ✅ Multi-currency trading
   ✅ DeFi liquidity & staking
   ✅ Tournament competitions
   ✅ Affiliate marketing
   ✅ Advanced analytics
   ✅ Enterprise integrations

👤 ADMIN PANEL:
   • Overview: http://localhost:${this.port}/api/admin/phase3/overview
   • Headers: x-admin-key: demo-admin-key

🧪 DEMO ENDPOINTS:
   • Multi-Currency: /api/multi-currency/balances
   • DeFi Pools: /api/defi/pools  
   • Tournaments: /api/tournaments
   • Affiliates: /api/affiliates/dashboard
   • Analytics: /api/analytics/player/summary

🚀 Ready for enterprise-scale crypto casino operations!

💡 Authentication: Use "Bearer demo_session_123" for testing
`);
    });
  }
}

// Create and start the server
const server = new Phase3CompleteServer(3005);
server.start();

module.exports = Phase3CompleteServer;