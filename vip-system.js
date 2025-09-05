const crypto = require('crypto');

class VIPSystem {
  constructor() {
    this.userVIPData = new Map();
    this.vipLevels = this.initializeVIPLevels();
    this.vipBenefits = this.initializeVIPBenefits();
    this.personalManagers = this.initializePersonalManagers();
  }

  initializeVIPLevels() {
    return [
      {
        level: 0,
        name: 'Bronze',
        minWagered: 0,
        color: '#cd7f32',
        icon: '🥉',
        requirements: {
          totalWagered: '0 ETH',
          timeframe: 'lifetime'
        }
      },
      {
        level: 1,
        name: 'Silver',
        minWagered: 1, // 1 ETH
        color: '#c0c0c0',
        icon: '🥈',
        requirements: {
          totalWagered: '1 ETH',
          timeframe: 'lifetime'
        }
      },
      {
        level: 2,
        name: 'Gold',
        minWagered: 5, // 5 ETH
        color: '#ffd700',
        icon: '🥇',
        requirements: {
          totalWagered: '5 ETH',
          timeframe: 'lifetime'
        }
      },
      {
        level: 3,
        name: 'Platinum',
        minWagered: 20, // 20 ETH
        color: '#e5e4e2',
        icon: '💎',
        requirements: {
          totalWagered: '20 ETH',
          timeframe: 'lifetime'
        }
      },
      {
        level: 4,
        name: 'Diamond',
        minWagered: 100, // 100 ETH
        color: '#b9f2ff',
        icon: '💠',
        requirements: {
          totalWagered: '100 ETH',
          timeframe: 'lifetime'
        }
      },
      {
        level: 5,
        name: 'Royal',
        minWagered: 500, // 500 ETH
        color: '#800080',
        icon: '👑',
        requirements: {
          totalWagered: '500 ETH',
          timeframe: 'lifetime'
        }
      }
    ];
  }

  initializeVIPBenefits() {
    return {
      0: { // Bronze
        rakeback: 0.5, // 0.5%
        dailyBonus: 0.001, // 0.001 ETH
        weeklyBonus: 0.005, // 0.005 ETH
        monthlyBonus: 0.02, // 0.02 ETH
        withdrawalLimit: 5, // 5 ETH daily
        prioritySupport: false,
        personalManager: false,
        exclusiveBonuses: false,
        birthdayBonus: 0.01, // 0.01 ETH
        lossbackPercentage: 5, // 5%
        customLimits: false
      },
      1: { // Silver
        rakeback: 1.0, // 1%
        dailyBonus: 0.002,
        weeklyBonus: 0.01,
        monthlyBonus: 0.05,
        withdrawalLimit: 10,
        prioritySupport: true,
        personalManager: false,
        exclusiveBonuses: true,
        birthdayBonus: 0.05,
        lossbackPercentage: 8,
        customLimits: false
      },
      2: { // Gold
        rakeback: 1.5, // 1.5%
        dailyBonus: 0.005,
        weeklyBonus: 0.025,
        monthlyBonus: 0.1,
        withdrawalLimit: 25,
        prioritySupport: true,
        personalManager: false,
        exclusiveBonuses: true,
        birthdayBonus: 0.1,
        lossbackPercentage: 10,
        customLimits: true
      },
      3: { // Platinum
        rakeback: 2.0, // 2%
        dailyBonus: 0.01,
        weeklyBonus: 0.05,
        monthlyBonus: 0.25,
        withdrawalLimit: 50,
        prioritySupport: true,
        personalManager: true,
        exclusiveBonuses: true,
        birthdayBonus: 0.25,
        lossbackPercentage: 12,
        customLimits: true
      },
      4: { // Diamond
        rakeback: 2.5, // 2.5%
        dailyBonus: 0.02,
        weeklyBonus: 0.1,
        monthlyBonus: 0.5,
        withdrawalLimit: 100,
        prioritySupport: true,
        personalManager: true,
        exclusiveBonuses: true,
        birthdayBonus: 0.5,
        lossbackPercentage: 15,
        customLimits: true
      },
      5: { // Royal
        rakeback: 3.0, // 3%
        dailyBonus: 0.05,
        weeklyBonus: 0.25,
        monthlyBonus: 1.0,
        withdrawalLimit: 'unlimited',
        prioritySupport: true,
        personalManager: true,
        exclusiveBonuses: true,
        birthdayBonus: 1.0,
        lossbackPercentage: 20,
        customLimits: true
      }
    };
  }

  initializePersonalManagers() {
    return [
      {
        id: 'pm1',
        name: 'Sarah Johnson',
        avatar: '👩‍💼',
        languages: ['English', 'Spanish'],
        timezone: 'UTC-5',
        specialties: ['High Rollers', 'VIP Events'],
        rating: 4.9
      },
      {
        id: 'pm2',
        name: 'Michael Chen',
        avatar: '👨‍💼',
        languages: ['English', 'Mandarin', 'Cantonese'],
        timezone: 'UTC+8',
        specialties: ['Asian Markets', 'Crypto Expertise'],
        rating: 4.8
      },
      {
        id: 'pm3',
        name: 'Emma Rodriguez',
        avatar: '👩‍💼',
        languages: ['English', 'Spanish', 'Portuguese'],
        timezone: 'UTC-3',
        specialties: ['Latin America', 'Tournament Organization'],
        rating: 4.9
      }
    ];
  }

  // Calculate user's VIP level based on total wagered
  calculateVIPLevel(totalWagered) {
    for (let i = this.vipLevels.length - 1; i >= 0; i--) {
      if (totalWagered >= this.vipLevels[i].minWagered) {
        return this.vipLevels[i];
      }
    }
    return this.vipLevels[0]; // Default to Bronze
  }

  // Get user VIP status
  async getUserVIPStatus(walletAddress) {
    let userData = this.userVIPData.get(walletAddress);
    
    if (!userData) {
      // Initialize new user data
      userData = {
        walletAddress,
        totalWagered: Math.random() * 10, // Mock data
        currentLevel: 0,
        joinedAt: new Date(),
        lastActive: new Date(),
        vipPoints: Math.floor(Math.random() * 1000),
        personalManagerId: null,
        achievements: [],
        exclusiveOffers: [],
        statistics: {
          gamesPlayed: Math.floor(Math.random() * 1000),
          biggestWin: Math.random() * 50,
          favoriteGame: 'dice',
          winRate: Math.random() * 100,
          averageBet: Math.random() * 0.1
        }
      };
      
      this.userVIPData.set(walletAddress, userData);
    }

    // Calculate current level
    const currentLevel = this.calculateVIPLevel(userData.totalWagered);
    userData.currentLevel = currentLevel.level;

    // Assign personal manager if eligible
    if (currentLevel.level >= 3 && !userData.personalManagerId) {
      userData.personalManagerId = this.assignPersonalManager(userData);
    }

    // Calculate progress to next level
    const nextLevel = this.vipLevels[currentLevel.level + 1];
    const progress = nextLevel ? 
      ((userData.totalWagered - currentLevel.minWagered) / (nextLevel.minWagered - currentLevel.minWagered)) * 100 : 100;

    return {
      user: userData,
      currentLevel,
      nextLevel,
      benefits: this.vipBenefits[currentLevel.level],
      progress: Math.min(100, Math.max(0, progress)),
      progressToNext: nextLevel ? (nextLevel.minWagered - userData.totalWagered) : 0,
      personalManager: userData.personalManagerId ? 
        this.personalManagers.find(pm => pm.id === userData.personalManagerId) : null,
      achievements: this.getAchievements(userData),
      exclusiveOffers: this.getExclusiveOffers(userData)
    };
  }

  assignPersonalManager(userData) {
    // Simple round-robin assignment
    const availableManagers = this.personalManagers.filter(pm => pm.rating >= 4.8);
    const randomIndex = Math.floor(Math.random() * availableManagers.length);
    return availableManagers[randomIndex].id;
  }

  getAchievements(userData) {
    const achievements = [];
    
    if (userData.totalWagered >= 1) {
      achievements.push({
        id: 'first_eth',
        name: 'First ETH Wagered',
        description: 'Wagered your first 1 ETH',
        icon: '🥇',
        unlockedAt: new Date(),
        reward: '0.01 ETH Bonus'
      });
    }

    if (userData.statistics.gamesPlayed >= 100) {
      achievements.push({
        id: 'century_player',
        name: 'Century Player',
        description: 'Played 100 games',
        icon: '🎲',
        unlockedAt: new Date(),
        reward: '50 Free Spins'
      });
    }

    if (userData.statistics.biggestWin >= 10) {
      achievements.push({
        id: 'big_winner',
        name: 'Big Winner',
        description: 'Won more than 10 ETH in a single game',
        icon: '💰',
        unlockedAt: new Date(),
        reward: '20% Rakeback Boost'
      });
    }

    return achievements;
  }

  getExclusiveOffers(userData) {
    const offers = [];
    const level = userData.currentLevel;

    if (level >= 1) {
      offers.push({
        id: 'silver_weekly',
        title: 'Silver Weekly Reload',
        description: '50% match bonus up to 1 ETH every week',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        minLevel: 1,
        claimed: false
      });
    }

    if (level >= 2) {
      offers.push({
        id: 'gold_tournament',
        title: 'Exclusive Gold Tournament',
        description: 'Weekly tournament with 10 ETH prize pool',
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        minLevel: 2,
        claimed: false
      });
    }

    if (level >= 4) {
      offers.push({
        id: 'diamond_event',
        title: 'Diamond VIP Event',
        description: 'Exclusive live event with luxury prizes',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        minLevel: 4,
        claimed: false
      });
    }

    return offers;
  }

  // Calculate and apply rakeback
  calculateRakeback(walletAddress, lossAmount) {
    const vipStatus = this.getUserVIPStatus(walletAddress);
    const benefits = vipStatus.benefits;
    
    const rakebackAmount = (lossAmount * benefits.rakeback) / 100;
    
    return {
      originalLoss: lossAmount,
      rakebackPercentage: benefits.rakeback,
      rakebackAmount,
      netLoss: lossAmount - rakebackAmount,
      vipLevel: vipStatus.currentLevel.name
    };
  }

  // Get VIP leaderboard
  getVIPLeaderboard(limit = 100) {
    const allUsers = Array.from(this.userVIPData.values())
      .sort((a, b) => b.totalWagered - a.totalWagered)
      .slice(0, limit)
      .map((user, index) => {
        const level = this.calculateVIPLevel(user.totalWagered);
        return {
          rank: index + 1,
          walletAddress: user.walletAddress.substring(0, 6) + '...' + user.walletAddress.slice(-4),
          vipLevel: level,
          totalWagered: user.totalWagered,
          vipPoints: user.vipPoints,
          gamesPlayed: user.statistics.gamesPlayed,
          winRate: user.statistics.winRate.toFixed(1) + '%'
        };
      });

    return {
      leaderboard: allUsers,
      totalVIPUsers: this.userVIPData.size,
      generatedAt: new Date().toISOString()
    };
  }

  // VIP Events System
  getVIPEvents(userLevel = 0) {
    const allEvents = [
      {
        id: 'weekly_tournament',
        title: 'Weekly VIP Tournament',
        description: 'Compete with other VIP players for amazing prizes',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        minLevel: 1,
        prizePool: '50 ETH',
        maxParticipants: 500,
        currentParticipants: 127,
        games: ['dice', 'crash', 'blackjack'],
        rewards: {
          1: '20 ETH + Diamond Status',
          2: '15 ETH + Platinum Status',
          3: '10 ETH + Gold Status',
          '4-10': '1 ETH each',
          '11-50': '0.1 ETH each'
        }
      },
      {
        id: 'diamond_exclusive',
        title: 'Diamond Members Exclusive Event',
        description: 'Ultra-exclusive event for Diamond and Royal members only',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        minLevel: 4,
        prizePool: '100 ETH',
        maxParticipants: 50,
        currentParticipants: 12,
        games: ['all'],
        rewards: {
          1: '50 ETH + Rolex Watch + Crypto Visa Card',
          2: '25 ETH + MacBook Pro',
          3: '15 ETH + iPhone Pro',
          '4-10': '2 ETH + AirPods Pro',
          '11-50': '0.5 ETH + VIP Merch'
        }
      },
      {
        id: 'monthly_cashback',
        title: 'Monthly Cashback Celebration',
        description: 'Extra cashback rewards for all VIP members',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        minLevel: 0,
        prizePool: '200 ETH Total Cashback',
        maxParticipants: 'unlimited',
        currentParticipants: 'all VIP members',
        games: ['all'],
        rewards: {
          'All': 'Double rakeback for the month'
        }
      }
    ];

    return allEvents.filter(event => userLevel >= event.minLevel);
  }

  // Generate VIP statistics
  getVIPStatistics() {
    const usersByLevel = {};
    let totalWagered = 0;
    let totalVIPPoints = 0;

    // Initialize counters
    this.vipLevels.forEach(level => {
      usersByLevel[level.name] = 0;
    });

    // Count users by level
    Array.from(this.userVIPData.values()).forEach(user => {
      const level = this.calculateVIPLevel(user.totalWagered);
      usersByLevel[level.name]++;
      totalWagered += user.totalWagered;
      totalVIPPoints += user.vipPoints;
    });

    return {
      totalVIPUsers: this.userVIPData.size,
      usersByLevel,
      totalWagered,
      averageWagered: this.userVIPData.size > 0 ? totalWagered / this.userVIPData.size : 0,
      totalVIPPoints,
      averageVIPPoints: this.userVIPData.size > 0 ? totalVIPPoints / this.userVIPData.size : 0,
      personalManagersActive: this.personalManagers.length,
      generatedAt: new Date().toISOString()
    };
  }

  // Upgrade user wagered amount (for testing/demo)
  addWageredAmount(walletAddress, amount) {
    let userData = this.userVIPData.get(walletAddress);
    if (!userData) {
      userData = {
        walletAddress,
        totalWagered: 0,
        currentLevel: 0,
        joinedAt: new Date(),
        lastActive: new Date(),
        vipPoints: 0,
        personalManagerId: null,
        achievements: [],
        exclusiveOffers: [],
        statistics: {
          gamesPlayed: 0,
          biggestWin: 0,
          favoriteGame: 'dice',
          winRate: 0,
          averageBet: 0
        }
      };
    }

    userData.totalWagered += amount;
    userData.vipPoints += Math.floor(amount * 100); // 100 points per ETH wagered
    userData.lastActive = new Date();
    
    this.userVIPData.set(walletAddress, userData);

    return this.getUserVIPStatus(walletAddress);
  }
}

module.exports = VIPSystem;