const crypto = require('crypto');

class AdvancedBonusSystem {
  constructor() {
    this.userBonuses = new Map();
    this.bonusTemplates = new Map();
    this.activeBonuses = new Map();
    this.bonusHistory = new Map();
    this.missionTemplates = new Map();
    this.dailyMissions = new Map();
    this.initializeBonusTemplates();
    this.initializeMissionTemplates();
  }

  initializeBonusTemplates() {
    const templates = [
      // Welcome Bonuses
      {
        id: 'welcome_deposit_1',
        name: 'Welcome Bonus 100%',
        description: 'Get 100% match up to 1 ETH on your first deposit',
        type: 'deposit_match',
        category: 'welcome',
        conditions: {
          newUser: true,
          minDeposit: 0.01,
          maxBonus: 1.0,
          matchPercentage: 100
        },
        wagering: {
          requirement: 35, // 35x wagering
          contribution: {
            slots: 100,
            dice: 10,
            blackjack: 5,
            roulette: 10
          },
          maxBet: 0.01,
          timeLimit: 30 // days
        },
        availability: {
          startDate: null,
          endDate: null,
          maxClaims: 1,
          vipLevelRequired: 0
        }
      },
      {
        id: 'welcome_deposit_2',
        name: 'Second Deposit Bonus 75%',
        description: 'Get 75% match up to 1.5 ETH on your second deposit',
        type: 'deposit_match',
        category: 'welcome',
        conditions: {
          depositNumber: 2,
          minDeposit: 0.02,
          maxBonus: 1.5,
          matchPercentage: 75
        },
        wagering: {
          requirement: 30,
          contribution: {
            slots: 100,
            dice: 10,
            blackjack: 5,
            roulette: 10
          },
          maxBet: 0.02,
          timeLimit: 30
        },
        availability: {
          maxClaims: 1,
          vipLevelRequired: 0
        }
      },
      
      // Daily Bonuses
      {
        id: 'daily_login',
        name: 'Daily Login Reward',
        description: 'Claim your daily free spins and bonus',
        type: 'daily',
        category: 'daily',
        conditions: {
          cooldown: 24 * 60 * 60 * 1000, // 24 hours
          consecutiveDays: 1
        },
        rewards: [
          { day: 1, type: 'free_spins', amount: 10, game: 'slots' },
          { day: 2, type: 'bonus_balance', amount: 0.001, currency: 'ETH' },
          { day: 3, type: 'free_spins', amount: 15, game: 'slots' },
          { day: 4, type: 'bonus_balance', amount: 0.002, currency: 'ETH' },
          { day: 5, type: 'free_spins', amount: 20, game: 'slots' },
          { day: 6, type: 'bonus_balance', amount: 0.003, currency: 'ETH' },
          { day: 7, type: 'mega_bonus', amount: 0.01, currency: 'ETH', multiplier: 2 }
        ],
        wagering: {
          requirement: 1,
          timeLimit: 7
        }
      },

      // Reload Bonuses
      {
        id: 'weekend_reload',
        name: 'Weekend Reload Bonus',
        description: '50% match up to 0.5 ETH every weekend',
        type: 'reload',
        category: 'weekly',
        conditions: {
          weekendOnly: true,
          minDeposit: 0.01,
          maxBonus: 0.5,
          matchPercentage: 50
        },
        wagering: {
          requirement: 25,
          contribution: {
            slots: 100,
            dice: 15,
            blackjack: 10,
            roulette: 15
          },
          timeLimit: 7
        },
        availability: {
          maxClaimsPerWeek: 1,
          vipLevelRequired: 1
        }
      },

      // Loss Back Bonuses
      {
        id: 'weekly_lossback',
        name: 'Weekly Loss Back',
        description: 'Get back 10% of your weekly losses',
        type: 'lossback',
        category: 'weekly',
        conditions: {
          minLoss: 0.1,
          maxLossback: 2.0,
          lossbackPercentage: 10
        },
        wagering: {
          requirement: 3,
          timeLimit: 14
        },
        availability: {
          maxClaimsPerWeek: 1,
          vipLevelRequired: 0
        }
      },

      // VIP Exclusive Bonuses
      {
        id: 'vip_monthly',
        name: 'VIP Monthly Bonus',
        description: 'Exclusive monthly bonus for VIP members',
        type: 'vip_exclusive',
        category: 'monthly',
        conditions: {
          vipLevelRequired: 2,
          minWageredLastMonth: 5
        },
        rewards: [
          { vipLevel: 2, amount: 0.1, currency: 'ETH' },
          { vipLevel: 3, amount: 0.25, currency: 'ETH' },
          { vipLevel: 4, amount: 0.5, currency: 'ETH' },
          { vipLevel: 5, amount: 1.0, currency: 'ETH' }
        ],
        wagering: {
          requirement: 5,
          timeLimit: 30
        }
      },

      // Achievement Bonuses
      {
        id: 'big_win_bonus',
        name: 'Big Win Celebration',
        description: 'Bonus for hitting a big multiplier',
        type: 'achievement',
        category: 'achievement',
        conditions: {
          minMultiplier: 100,
          minWinAmount: 1.0
        },
        rewards: {
          type: 'percentage',
          percentage: 5, // 5% of win amount
          maxBonus: 0.5
        },
        wagering: {
          requirement: 1,
          timeLimit: 7
        }
      },

      // Referral Bonuses
      {
        id: 'referral_bonus',
        name: 'Referral Bonus',
        description: 'Earn bonuses for referring friends',
        type: 'referral',
        category: 'referral',
        rewards: {
          referrer: { amount: 0.05, currency: 'ETH', wagering: 10 },
          referee: { amount: 0.02, currency: 'ETH', wagering: 15 }
        },
        conditions: {
          minRefereeDeposit: 0.01,
          minRefereeWager: 0.1
        }
      }
    ];

    templates.forEach(template => {
      this.bonusTemplates.set(template.id, template);
    });
  }

  initializeMissionTemplates() {
    const missions = [
      {
        id: 'daily_wager',
        name: 'Daily Wager Challenge',
        description: 'Wager 0.1 ETH today',
        type: 'wager',
        difficulty: 'easy',
        target: 0.1,
        reward: { type: 'free_spins', amount: 25 },
        resetDaily: true
      },
      {
        id: 'win_streak',
        name: 'Win Streak Master',
        description: 'Win 5 games in a row',
        type: 'streak',
        difficulty: 'medium',
        target: 5,
        reward: { type: 'bonus_balance', amount: 0.005, currency: 'ETH' },
        resetDaily: true
      },
      {
        id: 'game_explorer',
        name: 'Game Explorer',
        description: 'Play 3 different games today',
        type: 'variety',
        difficulty: 'easy',
        target: 3,
        reward: { type: 'xp', amount: 500 },
        resetDaily: true
      },
      {
        id: 'high_roller',
        name: 'High Roller Challenge',
        description: 'Place a bet of 0.05 ETH or higher',
        type: 'single_bet',
        difficulty: 'hard',
        target: 0.05,
        reward: { type: 'bonus_balance', amount: 0.01, currency: 'ETH' },
        resetDaily: true
      },
      {
        id: 'lucky_number',
        name: 'Lucky Number Seven',
        description: 'Win with a multiplier containing the number 7',
        type: 'special',
        difficulty: 'medium',
        target: 'contains_7',
        reward: { type: 'free_spins', amount: 77 },
        resetDaily: true
      }
    ];

    missions.forEach(mission => {
      this.missionTemplates.set(mission.id, mission);
    });
  }

  // Main bonus claiming logic
  async claimBonus(walletAddress, bonusId, data = {}) {
    const template = this.bonusTemplates.get(bonusId);
    if (!template) {
      throw new Error('Bonus template not found');
    }

    // Check eligibility
    const eligibility = await this.checkBonusEligibility(walletAddress, template, data);
    if (!eligibility.eligible) {
      throw new Error(eligibility.reason);
    }

    // Calculate bonus amount
    const bonusAmount = this.calculateBonusAmount(template, data);
    
    // Create bonus instance
    const bonus = {
      id: crypto.randomUUID(),
      templateId: bonusId,
      walletAddress,
      name: template.name,
      type: template.type,
      status: 'active',
      bonusAmount: bonusAmount.amount,
      currency: bonusAmount.currency || 'ETH',
      wageringRequired: bonusAmount.amount * template.wagering.requirement,
      wageringCompleted: 0,
      maxBet: template.wagering?.maxBet || 999,
      validUntil: new Date(Date.now() + (template.wagering?.timeLimit || 30) * 24 * 60 * 60 * 1000),
      claimedAt: new Date(),
      metadata: {
        ...data,
        originalData: bonusAmount
      }
    };

    // Store bonus
    this.activeBonuses.set(bonus.id, bonus);
    
    // Update user bonus data
    let userBonuses = this.userBonuses.get(walletAddress) || {
      activeBonuses: [],
      claimedBonuses: [],
      totalBonusReceived: 0,
      totalWagered: 0
    };

    userBonuses.activeBonuses.push(bonus.id);
    userBonuses.totalBonusReceived += bonusAmount.amount;
    this.userBonuses.set(walletAddress, userBonuses);

    return bonus;
  }

  async checkBonusEligibility(walletAddress, template, data) {
    const userBonuses = this.userBonuses.get(walletAddress) || { claimedBonuses: [] };
    
    // Check if already claimed
    if (template.availability?.maxClaims) {
      const claimedCount = userBonuses.claimedBonuses.filter(
        b => b.templateId === template.id
      ).length;
      
      if (claimedCount >= template.availability.maxClaims) {
        return { eligible: false, reason: 'Maximum claims exceeded' };
      }
    }

    // Check VIP level requirement
    if (template.availability?.vipLevelRequired > (data.vipLevel || 0)) {
      return { 
        eligible: false, 
        reason: `VIP level ${template.availability.vipLevelRequired} required` 
      };
    }

    // Check time-based conditions
    if (template.type === 'daily') {
      const lastClaim = userBonuses.claimedBonuses
        .filter(b => b.templateId === template.id)
        .sort((a, b) => new Date(b.claimedAt) - new Date(a.claimedAt))[0];

      if (lastClaim) {
        const timeSinceLastClaim = Date.now() - new Date(lastClaim.claimedAt).getTime();
        if (timeSinceLastClaim < template.conditions.cooldown) {
          return { 
            eligible: false, 
            reason: 'Cooldown period active',
            nextAvailable: new Date(new Date(lastClaim.claimedAt).getTime() + template.conditions.cooldown)
          };
        }
      }
    }

    // Check deposit conditions
    if (template.type === 'deposit_match') {
      if (data.depositAmount < template.conditions.minDeposit) {
        return { 
          eligible: false, 
          reason: `Minimum deposit of ${template.conditions.minDeposit} ETH required` 
        };
      }
    }

    // Check weekend condition
    if (template.conditions?.weekendOnly) {
      const now = new Date();
      const day = now.getUTCDay();
      if (day !== 0 && day !== 6) { // Not Sunday (0) or Saturday (6)
        return { eligible: false, reason: 'Weekend only bonus' };
      }
    }

    return { eligible: true };
  }

  calculateBonusAmount(template, data) {
    let amount = 0;
    let currency = 'ETH';

    switch (template.type) {
      case 'deposit_match':
        amount = Math.min(
          data.depositAmount * (template.conditions.matchPercentage / 100),
          template.conditions.maxBonus
        );
        break;

      case 'daily':
        const consecutiveDays = data.consecutiveDays || 1;
        const dayReward = template.rewards.find(r => r.day === Math.min(consecutiveDays, 7));
        return { amount: dayReward.amount, currency: dayReward.currency || currency, type: dayReward.type };

      case 'lossback':
        amount = Math.min(
          data.lossAmount * (template.conditions.lossbackPercentage / 100),
          template.conditions.maxLossback
        );
        break;

      case 'vip_exclusive':
        const vipReward = template.rewards.find(r => r.vipLevel === data.vipLevel);
        if (vipReward) {
          amount = vipReward.amount;
          currency = vipReward.currency;
        }
        break;

      case 'achievement':
        if (template.rewards.type === 'percentage') {
          amount = Math.min(
            data.winAmount * (template.rewards.percentage / 100),
            template.rewards.maxBonus
          );
        }
        break;

      case 'referral':
        const isReferrer = data.isReferrer;
        const reward = isReferrer ? template.rewards.referrer : template.rewards.referee;
        amount = reward.amount;
        currency = reward.currency;
        break;

      default:
        amount = template.amount || 0;
    }

    return { amount, currency };
  }

  // Wagering system
  async processWager(walletAddress, gameResult) {
    const userBonuses = this.userBonuses.get(walletAddress) || { activeBonuses: [] };
    const updates = [];

    for (const bonusId of userBonuses.activeBonuses) {
      const bonus = this.activeBonuses.get(bonusId);
      if (!bonus || bonus.status !== 'active') continue;

      const template = this.bonusTemplates.get(bonus.templateId);
      if (!template) continue;

      // Check max bet limit
      if (gameResult.amount > bonus.maxBet) {
        bonus.status = 'voided';
        bonus.voidReason = 'Max bet exceeded';
        updates.push({ bonusId, status: 'voided', reason: 'Max bet exceeded' });
        continue;
      }

      // Check expiry
      if (Date.now() > bonus.validUntil.getTime()) {
        bonus.status = 'expired';
        updates.push({ bonusId, status: 'expired' });
        continue;
      }

      // Calculate wagering contribution
      const contribution = this.calculateWageringContribution(
        template,
        gameResult.game,
        gameResult.amount
      );

      bonus.wageringCompleted += contribution;

      // Check if wagering is complete
      if (bonus.wageringCompleted >= bonus.wageringRequired) {
        bonus.status = 'completed';
        bonus.completedAt = new Date();
        updates.push({ 
          bonusId, 
          status: 'completed', 
          bonusReleased: bonus.bonusAmount 
        });

        // Move to history
        this.addToHistory(walletAddress, bonus);
        
        // Remove from active
        userBonuses.activeBonuses = userBonuses.activeBonuses.filter(id => id !== bonusId);
      } else {
        updates.push({ 
          bonusId, 
          wageringProgress: (bonus.wageringCompleted / bonus.wageringRequired * 100).toFixed(1) + '%',
          remainingWagering: (bonus.wageringRequired - bonus.wageringCompleted).toFixed(4)
        });
      }
    }

    this.userBonuses.set(walletAddress, userBonuses);
    return updates;
  }

  calculateWageringContribution(template, game, betAmount) {
    const contributions = template.wagering?.contribution || { default: 100 };
    const percentage = contributions[game] || contributions.default || 100;
    return betAmount * (percentage / 100);
  }

  addToHistory(walletAddress, bonus) {
    let history = this.bonusHistory.get(walletAddress) || [];
    history.push({
      ...bonus,
      archivedAt: new Date()
    });
    
    // Keep only last 100 bonuses
    if (history.length > 100) {
      history = history.slice(-100);
    }
    
    this.bonusHistory.set(walletAddress, history);
  }

  // Daily missions system
  generateDailyMissions(walletAddress, vipLevel = 0, difficulty = 'mixed') {
    const availableMissions = Array.from(this.missionTemplates.values());
    let selectedMissions = [];

    if (difficulty === 'mixed') {
      // Select mix of difficulties
      selectedMissions.push(
        ...this.selectMissionsByDifficulty(availableMissions, 'easy', 2),
        ...this.selectMissionsByDifficulty(availableMissions, 'medium', 1),
        ...this.selectMissionsByDifficulty(availableMissions, 'hard', vipLevel >= 2 ? 1 : 0)
      );
    } else {
      selectedMissions = this.selectMissionsByDifficulty(availableMissions, difficulty, 3);
    }

    const dailyMissions = selectedMissions.map(template => ({
      id: crypto.randomUUID(),
      templateId: template.id,
      walletAddress,
      name: template.name,
      description: template.description,
      type: template.type,
      target: template.target,
      progress: 0,
      completed: false,
      reward: template.reward,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }));

    this.dailyMissions.set(walletAddress, dailyMissions);
    return dailyMissions;
  }

  selectMissionsByDifficulty(missions, difficulty, count) {
    const filtered = missions.filter(m => m.difficulty === difficulty);
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  updateMissionProgress(walletAddress, gameResult) {
    const missions = this.dailyMissions.get(walletAddress) || [];
    const updates = [];

    missions.forEach(mission => {
      if (mission.completed || Date.now() > mission.expiresAt.getTime()) return;

      let progressAdded = 0;

      switch (mission.type) {
        case 'wager':
          progressAdded = gameResult.amount;
          break;
        case 'streak':
          // This would be updated based on win/loss tracking
          if (gameResult.won) {
            progressAdded = 1; // This should be current streak, not 1
          }
          break;
        case 'variety':
          // Track unique games played
          progressAdded = mission.gamesPlayed?.includes(gameResult.game) ? 0 : 1;
          if (progressAdded) {
            mission.gamesPlayed = (mission.gamesPlayed || []).concat(gameResult.game);
          }
          break;
        case 'single_bet':
          if (gameResult.amount >= mission.target) {
            progressAdded = mission.target; // Complete the mission
          }
          break;
        case 'special':
          if (mission.target === 'contains_7' && gameResult.multiplier?.toString().includes('7')) {
            progressAdded = 1;
          }
          break;
      }

      mission.progress += progressAdded;

      if (mission.progress >= mission.target) {
        mission.completed = true;
        mission.completedAt = new Date();
        updates.push({
          missionId: mission.id,
          completed: true,
          reward: mission.reward
        });
      } else {
        updates.push({
          missionId: mission.id,
          progress: mission.progress,
          target: mission.target,
          percentage: Math.min(100, (mission.progress / mission.target * 100)).toFixed(1)
        });
      }
    });

    return updates;
  }

  // Get user bonus summary
  getUserBonusSummary(walletAddress) {
    const userBonuses = this.userBonuses.get(walletAddress) || { 
      activeBonuses: [], 
      totalBonusReceived: 0 
    };
    
    const activeBonuses = userBonuses.activeBonuses.map(id => this.activeBonuses.get(id)).filter(Boolean);
    const history = this.bonusHistory.get(walletAddress) || [];
    const missions = this.dailyMissions.get(walletAddress) || [];

    return {
      activeBonuses: activeBonuses.map(bonus => ({
        id: bonus.id,
        name: bonus.name,
        type: bonus.type,
        amount: bonus.bonusAmount,
        currency: bonus.currency,
        wageringProgress: (bonus.wageringCompleted / bonus.wageringRequired * 100).toFixed(1),
        wageringRemaining: (bonus.wageringRequired - bonus.wageringCompleted).toFixed(4),
        validUntil: bonus.validUntil,
        status: bonus.status
      })),
      availableBonuses: this.getAvailableBonuses(walletAddress),
      dailyMissions: missions.filter(m => !m.completed && Date.now() <= m.expiresAt.getTime()),
      completedMissions: missions.filter(m => m.completed),
      statistics: {
        totalBonusReceived: userBonuses.totalBonusReceived,
        activeBonusCount: activeBonuses.length,
        completedBonusCount: history.length,
        completedMissionsToday: missions.filter(m => m.completed).length
      }
    };
  }

  getAvailableBonuses(walletAddress, vipLevel = 0) {
    const available = [];

    for (const [id, template] of this.bonusTemplates) {
      // Basic availability check
      if (template.availability?.vipLevelRequired > vipLevel) continue;

      // Check if user can claim this bonus
      const eligibility = this.checkBonusEligibility(walletAddress, template, { vipLevel });
      
      if (eligibility.eligible) {
        available.push({
          id,
          name: template.name,
          description: template.description,
          type: template.type,
          category: template.category,
          conditions: template.conditions,
          wagering: template.wagering
        });
      }
    }

    return available;
  }
}

module.exports = AdvancedBonusSystem;