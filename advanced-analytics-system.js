const crypto = require('crypto');
const EventEmitter = require('events');

class AdvancedAnalyticsSystem extends EventEmitter {
  constructor(multiCurrencySystem) {
    super();
    this.multiCurrency = multiCurrencySystem;
    this.playerMetrics = new Map(); // walletAddress -> metrics
    this.gameMetrics = new Map(); // gameType -> metrics
    this.dailyMetrics = new Map(); // date -> daily stats
    this.cohortAnalysis = new Map(); // cohort -> analysis
    this.predictiveModels = new Map(); // model type -> model data
    this.realTimeMetrics = this.initializeRealTimeMetrics();
    this.alertRules = this.initializeAlertRules();
    this.reports = new Map(); // reportId -> report data
    
    this.startMetricsCollection();
  }

  initializeRealTimeMetrics() {
    return {
      activeUsers: 0,
      totalBets: 0,
      totalVolume: 0,
      totalPayouts: 0,
      houseEdge: 0,
      popularGames: new Map(),
      hourlyStats: Array(24).fill(null).map((_, hour) => ({
        hour,
        users: 0,
        bets: 0,
        volume: 0
      })),
      lastUpdate: new Date()
    };
  }

  initializeAlertRules() {
    return {
      suspiciousActivity: {
        enabled: true,
        conditions: {
          maxBetsPerMinute: 100,
          maxWinStreakLength: 15,
          suspiciousWinRate: 80, // %
          unusualBettingPattern: true
        },
        actions: ['log', 'notify_admin', 'flag_account']
      },
      
      businessAlerts: {
        enabled: true,
        conditions: {
          dailyVolumeThreshold: 10000, // USD
          hourlyLossThreshold: 1000, // USD
          playerRetentionThreshold: 60, // %
          gamePerformanceThreshold: -20 // % variance
        },
        actions: ['email', 'dashboard_alert', 'slack_notification']
      },

      securityAlerts: {
        enabled: true,
        conditions: {
          multipleAccountsPerIP: 5,
          rapidAccountCreation: 10, // per hour
          largeWithdrawalRequests: 50, // ETH
          unusualLoginPatterns: true
        },
        actions: ['security_team', 'temporary_restriction', 'manual_review']
      }
    };
  }

  // Track player behavior and metrics
  trackPlayerActivity(walletAddress, activityType, activityData) {
    let playerMetrics = this.playerMetrics.get(walletAddress);
    
    if (!playerMetrics) {
      playerMetrics = this.initializePlayerMetrics(walletAddress);
      this.playerMetrics.set(walletAddress, playerMetrics);
    }

    const now = new Date();
    
    // Update last activity
    playerMetrics.lastActivity = now;
    playerMetrics.sessionsToday++;

    // Track specific activity types
    switch (activityType) {
      case 'bet':
        this.trackBetActivity(playerMetrics, activityData, now);
        break;
      case 'deposit':
        this.trackDepositActivity(playerMetrics, activityData, now);
        break;
      case 'withdrawal':
        this.trackWithdrawalActivity(playerMetrics, activityData, now);
        break;
      case 'login':
        this.trackLoginActivity(playerMetrics, activityData, now);
        break;
      case 'game_session':
        this.trackGameSession(playerMetrics, activityData, now);
        break;
    }

    // Update real-time metrics
    this.updateRealTimeMetrics(activityType, activityData);

    // Check for alerts
    this.checkAlertConditions(walletAddress, playerMetrics, activityType, activityData);

    this.emit('playerActivityTracked', {
      walletAddress,
      activityType,
      activityData,
      playerMetrics
    });
  }

  initializePlayerMetrics(walletAddress) {
    return {
      walletAddress,
      registrationDate: new Date(),
      lastActivity: new Date(),
      
      // Behavioral metrics
      totalSessions: 0,
      sessionsToday: 0,
      avgSessionDuration: 0,
      totalPlayTime: 0,
      
      // Financial metrics
      totalDeposited: 0,
      totalWithdrawn: 0,
      netPosition: 0,
      lifetimeValue: 0,
      avgBetSize: 0,
      totalVolume: 0,
      
      // Game metrics
      gamePreferences: new Map(),
      favoriteGame: null,
      winRate: 0,
      totalBets: 0,
      totalWins: 0,
      biggestWin: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      
      // Risk metrics
      riskScore: 0,
      suspiciousFlags: [],
      unusualPatterns: [],
      
      // Engagement metrics
      daysSinceLastLogin: 0,
      loginStreak: 0,
      churnRisk: 'low',
      engagementScore: 100,
      
      // Cohort data
      cohort: this.getCohortFromDate(new Date()),
      
      // Predictive scores
      predictions: {
        churnProbability: 0,
        lifetimeValuePrediction: 0,
        nextBetSizePrediction: 0,
        preferredGames: []
      }
    };
  }

  trackBetActivity(playerMetrics, betData, timestamp) {
    const { amount, currency, gameType, result, multiplier } = betData;
    const usdAmount = this.multiCurrency.convertToUSD(amount, currency);
    
    playerMetrics.totalBets++;
    playerMetrics.totalVolume += usdAmount;
    
    // Update game preferences
    const gameStats = playerMetrics.gamePreferences.get(gameType) || {
      bets: 0,
      volume: 0,
      wins: 0,
      biggestWin: 0
    };
    
    gameStats.bets++;
    gameStats.volume += usdAmount;
    
    if (result.won) {
      playerMetrics.totalWins++;
      playerMetrics.currentWinStreak++;
      gameStats.wins++;
      
      const winAmount = result.winAmount || 0;
      const usdWinAmount = this.multiCurrency.convertToUSD(winAmount, currency);
      
      if (usdWinAmount > playerMetrics.biggestWin) {
        playerMetrics.biggestWin = usdWinAmount;
      }
      
      if (usdWinAmount > gameStats.biggestWin) {
        gameStats.biggestWin = usdWinAmount;
      }
      
      if (playerMetrics.currentWinStreak > playerMetrics.longestWinStreak) {
        playerMetrics.longestWinStreak = playerMetrics.currentWinStreak;
      }
    } else {
      playerMetrics.currentWinStreak = 0;
    }
    
    playerMetrics.gamePreferences.set(gameType, gameStats);
    
    // Update averages
    playerMetrics.winRate = (playerMetrics.totalWins / playerMetrics.totalBets) * 100;
    playerMetrics.avgBetSize = playerMetrics.totalVolume / playerMetrics.totalBets;
    
    // Update favorite game
    let mostPlayedGame = null;
    let maxBets = 0;
    
    playerMetrics.gamePreferences.forEach((stats, game) => {
      if (stats.bets > maxBets) {
        maxBets = stats.bets;
        mostPlayedGame = game;
      }
    });
    
    playerMetrics.favoriteGame = mostPlayedGame;
  }

  trackDepositActivity(playerMetrics, depositData, timestamp) {
    const { amount, currency } = depositData;
    const usdAmount = this.multiCurrency.convertToUSD(amount, currency);
    
    playerMetrics.totalDeposited += usdAmount;
    playerMetrics.netPosition += usdAmount;
    playerMetrics.lifetimeValue += usdAmount;
  }

  trackWithdrawalActivity(playerMetrics, withdrawalData, timestamp) {
    const { amount, currency } = withdrawalData;
    const usdAmount = this.multiCurrency.convertToUSD(amount, currency);
    
    playerMetrics.totalWithdrawn += usdAmount;
    playerMetrics.netPosition -= usdAmount;
  }

  trackLoginActivity(playerMetrics, loginData, timestamp) {
    const today = new Date().toDateString();
    const lastLoginDate = new Date(playerMetrics.lastActivity).toDateString();
    
    if (today !== lastLoginDate) {
      playerMetrics.loginStreak = lastLoginDate === new Date(Date.now() - 86400000).toDateString() ? 
        playerMetrics.loginStreak + 1 : 1;
    }
    
    playerMetrics.daysSinceLastLogin = 0;
  }

  trackGameSession(playerMetrics, sessionData, timestamp) {
    const { duration, gamesPlayed, startTime, endTime } = sessionData;
    
    playerMetrics.totalSessions++;
    playerMetrics.totalPlayTime += duration;
    playerMetrics.avgSessionDuration = playerMetrics.totalPlayTime / playerMetrics.totalSessions;
  }

  // Update real-time metrics
  updateRealTimeMetrics(activityType, activityData) {
    const now = new Date();
    const currentHour = now.getHours();
    
    switch (activityType) {
      case 'bet':
        this.realTimeMetrics.totalBets++;
        this.realTimeMetrics.totalVolume += this.multiCurrency.convertToUSD(activityData.amount, activityData.currency);
        this.realTimeMetrics.hourlyStats[currentHour].bets++;
        this.realTimeMetrics.hourlyStats[currentHour].volume += this.multiCurrency.convertToUSD(activityData.amount, activityData.currency);
        
        // Track popular games
        const gameCount = this.realTimeMetrics.popularGames.get(activityData.gameType) || 0;
        this.realTimeMetrics.popularGames.set(activityData.gameType, gameCount + 1);
        break;
        
      case 'login':
        this.realTimeMetrics.hourlyStats[currentHour].users++;
        break;
    }
    
    this.realTimeMetrics.lastUpdate = now;
  }

  // Cohort analysis
  getCohortFromDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  }

  generateCohortAnalysis(cohortId) {
    const cohortUsers = Array.from(this.playerMetrics.values())
      .filter(player => player.cohort === cohortId);
    
    if (cohortUsers.length === 0) {
      return null;
    }

    const analysis = {
      cohortId,
      totalUsers: cohortUsers.length,
      registrationPeriod: cohortId,
      
      // Retention analysis
      retention: this.calculateCohortRetention(cohortUsers),
      
      // Revenue analysis
      revenue: {
        totalRevenue: cohortUsers.reduce((sum, player) => sum + player.lifetimeValue, 0),
        avgRevenuePerUser: 0,
        revenueByPeriod: this.calculateRevenueByPeriod(cohortUsers)
      },
      
      // Engagement metrics
      engagement: {
        avgSessionsPerUser: cohortUsers.reduce((sum, player) => sum + player.totalSessions, 0) / cohortUsers.length,
        avgSessionDuration: cohortUsers.reduce((sum, player) => sum + player.avgSessionDuration, 0) / cohortUsers.length,
        churnRate: (cohortUsers.filter(player => player.churnRisk === 'high').length / cohortUsers.length) * 100
      },
      
      // Game preferences
      gamePreferences: this.analyzeCohortGamePreferences(cohortUsers),
      
      generatedAt: new Date()
    };

    analysis.revenue.avgRevenuePerUser = analysis.revenue.totalRevenue / analysis.totalUsers;
    
    this.cohortAnalysis.set(cohortId, analysis);
    return analysis;
  }

  calculateCohortRetention(cohortUsers) {
    const periods = [1, 7, 30, 60, 90, 180, 365]; // days
    const retention = {};
    
    periods.forEach(period => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - period);
      
      const activeUsers = cohortUsers.filter(player => 
        new Date(player.lastActivity) >= cutoffDate
      ).length;
      
      retention[`day_${period}`] = {
        activeUsers,
        rate: (activeUsers / cohortUsers.length) * 100
      };
    });
    
    return retention;
  }

  calculateRevenueByPeriod(cohortUsers) {
    // This would typically involve more detailed transaction analysis
    // For now, we'll provide a simplified version
    const periods = ['week_1', 'week_2', 'week_3', 'week_4', 'month_2', 'month_3'];
    const revenue = {};
    
    periods.forEach(period => {
      // Simplified calculation - would need transaction history for accuracy
      const avgRevenue = cohortUsers.reduce((sum, player) => sum + player.lifetimeValue, 0) / periods.length;
      revenue[period] = avgRevenue;
    });
    
    return revenue;
  }

  analyzeCohortGamePreferences(cohortUsers) {
    const gameStats = new Map();
    
    cohortUsers.forEach(player => {
      player.gamePreferences.forEach((stats, gameType) => {
        const existing = gameStats.get(gameType) || { players: 0, totalBets: 0, totalVolume: 0 };
        existing.players++;
        existing.totalBets += stats.bets;
        existing.totalVolume += stats.volume;
        gameStats.set(gameType, existing);
      });
    });
    
    return Array.from(gameStats.entries()).map(([gameType, stats]) => ({
      gameType,
      playersCount: stats.players,
      penetrationRate: (stats.players / cohortUsers.length) * 100,
      avgBetsPerPlayer: stats.totalBets / stats.players,
      avgVolumePerPlayer: stats.totalVolume / stats.players
    })).sort((a, b) => b.penetrationRate - a.penetrationRate);
  }

  // Predictive analytics
  updatePredictiveModels() {
    // Churn prediction model
    this.updateChurnPrediction();
    
    // Lifetime value prediction
    this.updateLifetimeValuePrediction();
    
    // Game recommendation model
    this.updateGameRecommendationModel();
  }

  updateChurnPrediction() {
    this.playerMetrics.forEach((player, walletAddress) => {
      const daysSinceLastActivity = (new Date() - new Date(player.lastActivity)) / (1000 * 60 * 60 * 24);
      const sessionFrequency = player.totalSessions / Math.max(1, daysSinceLastActivity);
      const engagementTrend = this.calculateEngagementTrend(player);
      
      // Simple churn prediction model (in production, would use ML)
      let churnProbability = 0;
      
      if (daysSinceLastActivity > 7) churnProbability += 30;
      if (daysSinceLastActivity > 14) churnProbability += 40;
      if (sessionFrequency < 0.1) churnProbability += 20;
      if (engagementTrend < 0) churnProbability += 10;
      
      churnProbability = Math.min(100, churnProbability);
      
      player.predictions.churnProbability = churnProbability;
      player.churnRisk = churnProbability > 70 ? 'high' : 
                        churnProbability > 40 ? 'medium' : 'low';
    });
  }

  calculateEngagementTrend(player) {
    // Simplified engagement trend calculation
    const recentSessions = player.sessionsToday;
    const avgSessions = player.totalSessions / Math.max(1, player.daysSinceLastLogin || 1);
    
    return ((recentSessions - avgSessions) / avgSessions) * 100;
  }

  updateLifetimeValuePrediction() {
    this.playerMetrics.forEach((player, walletAddress) => {
      const daysSinceRegistration = (new Date() - new Date(player.registrationDate)) / (1000 * 60 * 60 * 24);
      const dailyValue = player.lifetimeValue / Math.max(1, daysSinceRegistration);
      const projectedLTV = dailyValue * 365; // Project to 1 year
      
      player.predictions.lifetimeValuePrediction = projectedLTV;
    });
  }

  updateGameRecommendationModel() {
    this.playerMetrics.forEach((player, walletAddress) => {
      const gameScores = new Map();
      
      // Score based on current preferences and similar players
      player.gamePreferences.forEach((stats, gameType) => {
        const score = (stats.wins / stats.bets) * stats.volume;
        gameScores.set(gameType, score);
      });
      
      // Sort and get top recommendations
      const recommendations = Array.from(gameScores.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([gameType]) => gameType);
      
      player.predictions.preferredGames = recommendations;
    });
  }

  // Alert system
  checkAlertConditions(walletAddress, playerMetrics, activityType, activityData) {
    const alerts = [];
    
    // Check suspicious activity alerts
    if (this.alertRules.suspiciousActivity.enabled) {
      alerts.push(...this.checkSuspiciousActivity(walletAddress, playerMetrics, activityType, activityData));
    }
    
    // Check business alerts
    if (this.alertRules.businessAlerts.enabled) {
      alerts.push(...this.checkBusinessAlerts(walletAddress, playerMetrics, activityType, activityData));
    }
    
    // Check security alerts
    if (this.alertRules.securityAlerts.enabled) {
      alerts.push(...this.checkSecurityAlerts(walletAddress, playerMetrics, activityType, activityData));
    }
    
    // Process alerts
    alerts.forEach(alert => {
      this.processAlert(alert);
    });
  }

  checkSuspiciousActivity(walletAddress, playerMetrics, activityType, activityData) {
    const alerts = [];
    const conditions = this.alertRules.suspiciousActivity.conditions;
    
    // Check win rate
    if (playerMetrics.winRate > conditions.suspiciousWinRate && playerMetrics.totalBets > 50) {
      alerts.push({
        type: 'suspicious_win_rate',
        severity: 'high',
        walletAddress,
        details: {
          winRate: playerMetrics.winRate,
          totalBets: playerMetrics.totalBets
        }
      });
    }
    
    // Check win streak
    if (playerMetrics.currentWinStreak > conditions.maxWinStreakLength) {
      alerts.push({
        type: 'unusual_win_streak',
        severity: 'medium',
        walletAddress,
        details: {
          currentStreak: playerMetrics.currentWinStreak,
          longestStreak: playerMetrics.longestWinStreak
        }
      });
    }
    
    return alerts;
  }

  checkBusinessAlerts(walletAddress, playerMetrics, activityType, activityData) {
    const alerts = [];
    // Business alert logic would go here
    return alerts;
  }

  checkSecurityAlerts(walletAddress, playerMetrics, activityType, activityData) {
    const alerts = [];
    // Security alert logic would go here
    return alerts;
  }

  processAlert(alert) {
    const actions = this.alertRules[alert.type]?.actions || ['log'];
    
    actions.forEach(action => {
      switch (action) {
        case 'log':
          console.log(`ALERT [${alert.severity}]: ${alert.type}`, alert.details);
          break;
        case 'notify_admin':
          this.emit('adminAlert', alert);
          break;
        case 'flag_account':
          this.flagAccount(alert.walletAddress, alert.type);
          break;
      }
    });
  }

  flagAccount(walletAddress, reason) {
    const playerMetrics = this.playerMetrics.get(walletAddress);
    if (playerMetrics) {
      playerMetrics.suspiciousFlags.push({
        reason,
        timestamp: new Date(),
        resolved: false
      });
    }
  }

  // Report generation
  generateReport(reportType, options = {}) {
    const reportId = `report_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    let reportData;
    
    switch (reportType) {
      case 'player_summary':
        reportData = this.generatePlayerSummaryReport(options);
        break;
      case 'game_performance':
        reportData = this.generateGamePerformanceReport(options);
        break;
      case 'financial_overview':
        reportData = this.generateFinancialOverviewReport(options);
        break;
      case 'cohort_analysis':
        reportData = this.generateCohortAnalysisReport(options);
        break;
      case 'churn_analysis':
        reportData = this.generateChurnAnalysisReport(options);
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
    
    const report = {
      id: reportId,
      type: reportType,
      generatedAt: new Date(),
      options,
      data: reportData
    };
    
    this.reports.set(reportId, report);
    return report;
  }

  generatePlayerSummaryReport(options) {
    const players = Array.from(this.playerMetrics.values());
    const totalPlayers = players.length;
    const activePlayers = players.filter(p => {
      const daysSince = (new Date() - new Date(p.lastActivity)) / (1000 * 60 * 60 * 24);
      return daysSince <= 30;
    }).length;
    
    return {
      totalPlayers,
      activePlayers: {
        count: activePlayers,
        percentage: (activePlayers / totalPlayers) * 100
      },
      playerSegments: {
        highValue: players.filter(p => p.lifetimeValue > 1000).length,
        mediumValue: players.filter(p => p.lifetimeValue >= 100 && p.lifetimeValue <= 1000).length,
        lowValue: players.filter(p => p.lifetimeValue < 100).length
      },
      churnRisk: {
        high: players.filter(p => p.churnRisk === 'high').length,
        medium: players.filter(p => p.churnRisk === 'medium').length,
        low: players.filter(p => p.churnRisk === 'low').length
      },
      avgLifetimeValue: players.reduce((sum, p) => sum + p.lifetimeValue, 0) / totalPlayers,
      avgSessionDuration: players.reduce((sum, p) => sum + p.avgSessionDuration, 0) / totalPlayers
    };
  }

  generateGamePerformanceReport(options) {
    const gameStats = new Map();
    
    this.playerMetrics.forEach(player => {
      player.gamePreferences.forEach((stats, gameType) => {
        const existing = gameStats.get(gameType) || {
          totalBets: 0,
          totalVolume: 0,
          totalWins: 0,
          uniquePlayers: new Set(),
          totalRevenue: 0
        };
        
        existing.totalBets += stats.bets;
        existing.totalVolume += stats.volume;
        existing.totalWins += stats.wins;
        existing.uniquePlayers.add(player.walletAddress);
        
        gameStats.set(gameType, existing);
      });
    });
    
    return Array.from(gameStats.entries()).map(([gameType, stats]) => ({
      gameType,
      totalBets: stats.totalBets,
      totalVolume: stats.totalVolume,
      uniquePlayers: stats.uniquePlayers.size,
      winRate: (stats.totalWins / stats.totalBets) * 100,
      avgBetSize: stats.totalVolume / stats.totalBets,
      popularity: (stats.uniquePlayers.size / this.playerMetrics.size) * 100
    })).sort((a, b) => b.totalVolume - a.totalVolume);
  }

  generateFinancialOverviewReport(options) {
    const players = Array.from(this.playerMetrics.values());
    
    const totalDeposits = players.reduce((sum, p) => sum + p.totalDeposited, 0);
    const totalWithdrawals = players.reduce((sum, p) => sum + p.totalWithdrawn, 0);
    const totalVolume = players.reduce((sum, p) => sum + p.totalVolume, 0);
    
    return {
      totalDeposits,
      totalWithdrawals,
      netRevenue: totalDeposits - totalWithdrawals,
      totalVolume,
      grossGamingRevenue: totalVolume * 0.02, // Assuming 2% house edge
      playerCount: players.length,
      avgDepositPerPlayer: totalDeposits / players.length,
      avgVolumePerPlayer: totalVolume / players.length
    };
  }

  generateCohortAnalysisReport(options) {
    const cohorts = new Set();
    this.playerMetrics.forEach(player => cohorts.add(player.cohort));
    
    const cohortData = Array.from(cohorts).map(cohortId => {
      return this.generateCohortAnalysis(cohortId);
    }).filter(cohort => cohort !== null);
    
    return {
      totalCohorts: cohortData.length,
      cohorts: cohortData.sort((a, b) => new Date(b.registrationPeriod) - new Date(a.registrationPeriod))
    };
  }

  generateChurnAnalysisReport(options) {
    const players = Array.from(this.playerMetrics.values());
    const churnedPlayers = players.filter(p => p.churnRisk === 'high');
    const atRiskPlayers = players.filter(p => p.churnRisk === 'medium');
    
    return {
      totalPlayers: players.length,
      churnedPlayers: {
        count: churnedPlayers.length,
        rate: (churnedPlayers.length / players.length) * 100
      },
      atRiskPlayers: {
        count: atRiskPlayers.length,
        rate: (atRiskPlayers.length / players.length) * 100
      },
      churnReasons: this.analyzeChurnReasons(churnedPlayers),
      preventionRecommendations: this.generateChurnPreventionRecommendations(atRiskPlayers)
    };
  }

  analyzeChurnReasons(churnedPlayers) {
    // Simplified churn reason analysis
    return {
      inactivity: churnedPlayers.filter(p => p.daysSinceLastLogin > 30).length,
      lowEngagement: churnedPlayers.filter(p => p.engagementScore < 30).length,
      negativeBalance: churnedPlayers.filter(p => p.netPosition < -100).length
    };
  }

  generateChurnPreventionRecommendations(atRiskPlayers) {
    return [
      'Implement re-engagement email campaigns',
      'Offer personalized bonuses based on game preferences',
      'Create targeted retention tournaments',
      'Improve customer support response times',
      'Develop mobile app push notifications for inactive users'
    ];
  }

  // Start metrics collection
  startMetricsCollection() {
    // Update predictive models daily
    setInterval(() => {
      this.updatePredictiveModels();
    }, 24 * 60 * 60 * 1000);
    
    // Reset daily metrics at midnight
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        this.resetDailyMetrics();
      }
    }, 60 * 1000);
  }

  resetDailyMetrics() {
    this.playerMetrics.forEach(player => {
      player.sessionsToday = 0;
    });
    
    // Store yesterday's metrics
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateKey = yesterday.toISOString().split('T')[0];
    
    this.dailyMetrics.set(dateKey, {
      ...this.realTimeMetrics,
      date: yesterday
    });
    
    // Reset real-time metrics
    this.realTimeMetrics = this.initializeRealTimeMetrics();
  }

  // Get system statistics
  getSystemStatistics() {
    const totalPlayers = this.playerMetrics.size;
    const reports = this.reports.size;
    const cohorts = new Set();
    this.playerMetrics.forEach(player => cohorts.add(player.cohort));
    
    return {
      totalPlayers,
      activeCohorts: cohorts.size,
      totalReports: reports,
      alertRules: Object.keys(this.alertRules).length,
      realTimeMetrics: this.realTimeMetrics,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = AdvancedAnalyticsSystem;