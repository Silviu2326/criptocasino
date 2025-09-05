const crypto = require('crypto');
const EventEmitter = require('events');

class AffiliateSystem extends EventEmitter {
  constructor(multiCurrencySystem) {
    super();
    this.multiCurrency = multiCurrencySystem;
    this.affiliates = new Map(); // walletAddress -> affiliate data
    this.referrals = new Map(); // referralCode -> affiliate walletAddress
    this.referralHistory = new Map(); // walletAddress -> referred users[]
    this.commissionHistory = new Map(); // walletAddress -> commissions[]
    this.campaigns = new Map();
    this.tiers = this.initializeAffiliateTiers();
    this.commissionRates = this.initializeCommissionRates();
    
    this.startCommissionCalculation();
  }

  initializeAffiliateTiers() {
    return {
      BRONZE: {
        level: 1,
        name: 'Bronze Affiliate',
        icon: '🥉',
        color: '#cd7f32',
        requirements: {
          minReferrals: 0,
          minMonthlyVolume: 0, // ETH
          minActiveReferrals: 0
        },
        benefits: {
          baseCommission: 25, // 25% of house edge
          bonusCommission: 0,
          customLinks: 1,
          analyticsAccess: 'basic',
          payoutFrequency: 'monthly',
          minPayout: 0.01
        }
      },
      SILVER: {
        level: 2,
        name: 'Silver Affiliate',
        icon: '🥈',
        color: '#c0c0c0',
        requirements: {
          minReferrals: 10,
          minMonthlyVolume: 10,
          minActiveReferrals: 5
        },
        benefits: {
          baseCommission: 30,
          bonusCommission: 5,
          customLinks: 3,
          analyticsAccess: 'advanced',
          payoutFrequency: 'bi_weekly',
          minPayout: 0.005,
          personalManager: false
        }
      },
      GOLD: {
        level: 3,
        name: 'Gold Affiliate',
        icon: '🥇',
        color: '#ffd700',
        requirements: {
          minReferrals: 50,
          minMonthlyVolume: 50,
          minActiveReferrals: 25
        },
        benefits: {
          baseCommission: 35,
          bonusCommission: 10,
          customLinks: 5,
          analyticsAccess: 'premium',
          payoutFrequency: 'weekly',
          minPayout: 0.001,
          personalManager: true,
          customBonuses: true
        }
      },
      PLATINUM: {
        level: 4,
        name: 'Platinum Affiliate',
        icon: '💎',
        color: '#e5e4e2',
        requirements: {
          minReferrals: 200,
          minMonthlyVolume: 200,
          minActiveReferrals: 100
        },
        benefits: {
          baseCommission: 40,
          bonusCommission: 15,
          customLinks: 10,
          analyticsAccess: 'enterprise',
          payoutFrequency: 'daily',
          minPayout: 0.0005,
          personalManager: true,
          customBonuses: true,
          brandedLandingPages: true
        }
      },
      DIAMOND: {
        level: 5,
        name: 'Diamond Affiliate',
        icon: '💠',
        color: '#b9f2ff',
        requirements: {
          minReferrals: 500,
          minMonthlyVolume: 1000,
          minActiveReferrals: 250
        },
        benefits: {
          baseCommission: 45,
          bonusCommission: 20,
          customLinks: 'unlimited',
          analyticsAccess: 'enterprise_plus',
          payoutFrequency: 'real_time',
          minPayout: 0,
          personalManager: true,
          customBonuses: true,
          brandedLandingPages: true,
          apiAccess: true,
          whiteLabel: true
        }
      }
    };
  }

  initializeCommissionRates() {
    return {
      // Game-specific commission rates (percentage of house edge)
      dice: { base: 100, vipBonus: 10 },
      crash: { base: 100, vipBonus: 15 },
      blackjack: { base: 80, vipBonus: 10 },
      slots: { base: 120, vipBonus: 20 },
      poker: { base: 90, vipBonus: 15 },
      
      // Special event bonuses
      tournaments: { rate: 150, duration: '24h' },
      newPlayer: { bonus: 200, duration: '30d' }, // 200% of normal rate for 30 days
      
      // Volume-based bonuses
      volumeBonuses: [
        { threshold: 100, bonus: 5 }, // +5% for 100+ ETH monthly volume
        { threshold: 500, bonus: 10 }, // +10% for 500+ ETH monthly volume
        { threshold: 1000, bonus: 15 }, // +15% for 1000+ ETH monthly volume
        { threshold: 5000, bonus: 25 }  // +25% for 5000+ ETH monthly volume
      ]
    };
  }

  // Register as affiliate
  async registerAffiliate(walletAddress, referrerCode = null) {
    if (this.affiliates.has(walletAddress)) {
      throw new Error('User is already registered as an affiliate');
    }

    // Generate unique referral code
    const referralCode = this.generateReferralCode(walletAddress);
    
    const affiliate = {
      walletAddress,
      referralCode,
      registeredAt: new Date(),
      tier: 'BRONZE',
      isActive: true,
      isApproved: true, // Auto-approve for demo
      
      // Statistics
      stats: {
        totalReferrals: 0,
        activeReferrals: 0,
        totalVolume: 0,
        monthlyVolume: 0,
        totalCommissions: 0,
        monthlyCommissions: 0,
        conversionRate: 0,
        avgPlayerValue: 0,
        topPerformingGames: []
      },
      
      // Settings
      settings: {
        payoutMethod: 'crypto',
        preferredCurrency: 'ETH',
        autoWithdraw: false,
        emailNotifications: true,
        webhookUrl: null
      },
      
      // Campaign data
      campaigns: [],
      customLinks: [`https://casino.demo/${referralCode}`],
      
      // Referrer information
      referredBy: referrerCode ? this.referrals.get(referrerCode) : null
    };

    this.affiliates.set(walletAddress, affiliate);
    this.referrals.set(referralCode, walletAddress);
    this.referralHistory.set(walletAddress, []);
    this.commissionHistory.set(walletAddress, []);

    // If referred by another affiliate, add to their referral history
    if (affiliate.referredBy) {
      const referrerHistory = this.referralHistory.get(affiliate.referredBy) || [];
      referrerHistory.push({
        walletAddress,
        type: 'affiliate',
        registeredAt: new Date(),
        isActive: true
      });
      this.referralHistory.set(affiliate.referredBy, referrerHistory);
    }

    this.emit('affiliateRegistered', { walletAddress, affiliate });
    
    return affiliate;
  }

  // Generate unique referral code
  generateReferralCode(walletAddress) {
    const base = walletAddress.slice(-8).toLowerCase();
    const random = crypto.randomBytes(2).toString('hex');
    let code = `${base}${random}`;
    
    // Ensure uniqueness
    while (this.referrals.has(code)) {
      code = `${base}${crypto.randomBytes(2).toString('hex')}`;
    }
    
    return code;
  }

  // Process player referral
  async processPlayerReferral(playerWallet, referralCode, playerData = {}) {
    const affiliateWallet = this.referrals.get(referralCode);
    if (!affiliateWallet) {
      throw new Error('Invalid referral code');
    }

    const affiliate = this.affiliates.get(affiliateWallet);
    if (!affiliate || !affiliate.isActive) {
      throw new Error('Affiliate is not active');
    }

    // Check if player is already referred
    const existingReferral = Array.from(this.referralHistory.values())
      .flat()
      .find(r => r.walletAddress === playerWallet && r.type === 'player');
    
    if (existingReferral) {
      throw new Error('Player is already referred by another affiliate');
    }

    // Create referral record
    const referral = {
      walletAddress: playerWallet,
      type: 'player',
      registeredAt: new Date(),
      referralSource: referralCode,
      isActive: true,
      firstDeposit: null,
      totalDeposited: 0,
      totalWagered: 0,
      totalVolume: 0,
      lastActivity: new Date(),
      playerData: {
        ...playerData,
        registrationIP: playerData.ip || 'unknown',
        userAgent: playerData.userAgent || 'unknown',
        country: playerData.country || 'unknown'
      }
    };

    // Add to affiliate's referral history
    const affiliateReferrals = this.referralHistory.get(affiliateWallet) || [];
    affiliateReferrals.push(referral);
    this.referralHistory.set(affiliateWallet, affiliateReferrals);

    // Update affiliate stats
    affiliate.stats.totalReferrals++;
    affiliate.stats.activeReferrals++;

    this.emit('playerReferred', {
      affiliateWallet,
      playerWallet,
      referralCode,
      referral
    });

    return referral;
  }

  // Process bet and calculate commissions
  async processBet(playerWallet, betAmount, currency, gameType, gameResult) {
    // Find which affiliate referred this player
    let affiliateWallet = null;
    let referral = null;

    for (const [wallet, referrals] of this.referralHistory.entries()) {
      const playerReferral = referrals.find(r => 
        r.walletAddress === playerWallet && 
        r.type === 'player' && 
        r.isActive
      );
      
      if (playerReferral) {
        affiliateWallet = wallet;
        referral = playerReferral;
        break;
      }
    }

    if (!affiliateWallet || !referral) {
      return null; // Player not referred by any affiliate
    }

    const affiliate = this.affiliates.get(affiliateWallet);
    if (!affiliate || !affiliate.isActive) {
      return null;
    }

    // Calculate house edge (simplified)
    const houseEdgeRates = {
      dice: 0.01,    // 1%
      crash: 0.01,   // 1%
      blackjack: 0.005, // 0.5%
      slots: 0.05,   // 5%
      poker: 0.025   // 2.5%
    };

    const houseEdgeRate = houseEdgeRates[gameType] || 0.02;
    const betAmountNumber = parseFloat(betAmount);
    const houseEdge = betAmountNumber * houseEdgeRate;

    // Calculate base commission
    const commissionRates = this.commissionRates[gameType] || this.commissionRates.dice;
    const tierData = this.tiers[affiliate.tier];
    const baseCommissionRate = tierData.benefits.baseCommission / 100; // Convert to decimal
    
    let totalCommissionRate = baseCommissionRate * (commissionRates.base / 100);
    
    // Add tier bonus
    totalCommissionRate += (tierData.benefits.bonusCommission / 100);
    
    // Add volume bonuses
    const monthlyVolume = affiliate.stats.monthlyVolume;
    for (const bonus of this.commissionRates.volumeBonuses) {
      if (monthlyVolume >= bonus.threshold) {
        totalCommissionRate += (bonus.bonus / 100);
      }
    }

    // Add new player bonus (if within 30 days of referral)
    const daysSinceReferral = (new Date() - referral.registeredAt) / (1000 * 60 * 60 * 24);
    if (daysSinceReferral <= 30) {
      totalCommissionRate *= (this.commissionRates.newPlayer.bonus / 100);
    }

    const commissionAmount = houseEdge * totalCommissionRate;

    // Convert to preferred currency if different
    const finalCommissionAmount = currency === affiliate.settings.preferredCurrency ?
      commissionAmount :
      this.multiCurrency.convertCurrency(commissionAmount, currency, affiliate.settings.preferredCurrency);

    // Create commission record
    const commission = {
      id: `comm_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      affiliateWallet,
      playerWallet,
      gameType,
      betAmount: betAmountNumber,
      betCurrency: currency,
      houseEdge,
      commissionRate: totalCommissionRate,
      commissionAmount: finalCommissionAmount,
      commissionCurrency: affiliate.settings.preferredCurrency,
      gameResult,
      createdAt: new Date(),
      status: 'pending',
      paidAt: null
    };

    // Add to commission history
    const commissions = this.commissionHistory.get(affiliateWallet) || [];
    commissions.push(commission);
    this.commissionHistory.set(affiliateWallet, commissions);

    // Update affiliate stats
    const usdValue = this.multiCurrency.convertToUSD(betAmountNumber, currency);
    affiliate.stats.totalVolume += usdValue;
    affiliate.stats.monthlyVolume += usdValue;
    affiliate.stats.totalCommissions += this.multiCurrency.convertToUSD(finalCommissionAmount, affiliate.settings.preferredCurrency);

    // Update referral stats
    referral.totalWagered += betAmountNumber;
    referral.totalVolume += usdValue;
    referral.lastActivity = new Date();

    this.emit('commissionGenerated', {
      affiliateWallet,
      commission,
      affiliate
    });

    // Check for tier upgrades
    this.checkTierUpgrade(affiliateWallet);

    return commission;
  }

  // Check if affiliate qualifies for tier upgrade
  checkTierUpgrade(affiliateWallet) {
    const affiliate = this.affiliates.get(affiliateWallet);
    if (!affiliate) return;

    const currentTier = this.tiers[affiliate.tier];
    const stats = affiliate.stats;

    // Find highest tier the affiliate qualifies for
    let newTier = affiliate.tier;
    
    Object.entries(this.tiers).forEach(([tierName, tierData]) => {
      if (tierData.level > currentTier.level) {
        const meets = stats.totalReferrals >= tierData.requirements.minReferrals &&
                     stats.monthlyVolume >= tierData.requirements.minMonthlyVolume &&
                     stats.activeReferrals >= tierData.requirements.minActiveReferrals;
        
        if (meets) {
          newTier = tierName;
        }
      }
    });

    if (newTier !== affiliate.tier) {
      const oldTier = affiliate.tier;
      affiliate.tier = newTier;
      
      this.emit('tierUpgraded', {
        affiliateWallet,
        oldTier,
        newTier,
        affiliate
      });
    }
  }

  // Process commission payouts
  async processCommissionPayouts() {
    for (const [affiliateWallet, commissions] of this.commissionHistory.entries()) {
      const affiliate = this.affiliates.get(affiliateWallet);
      if (!affiliate || !affiliate.isActive) continue;

      const pendingCommissions = commissions.filter(c => c.status === 'pending');
      if (pendingCommissions.length === 0) continue;

      const totalPending = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
      const tierData = this.tiers[affiliate.tier];
      
      // Check if minimum payout threshold is met
      if (totalPending < tierData.benefits.minPayout) continue;

      // Check payout frequency
      const lastPayout = commissions
        .filter(c => c.status === 'paid')
        .sort((a, b) => b.paidAt - a.paidAt)[0];
      
      const shouldPayout = this.shouldProcessPayout(lastPayout?.paidAt, tierData.benefits.payoutFrequency);
      if (!shouldPayout) continue;

      // Process payout
      try {
        await this.multiCurrency.addBalance(
          affiliateWallet,
          affiliate.settings.preferredCurrency,
          totalPending,
          'affiliate_commission',
          {
            commissionsCount: pendingCommissions.length,
            payoutPeriod: tierData.benefits.payoutFrequency
          }
        );

        // Mark commissions as paid
        pendingCommissions.forEach(commission => {
          commission.status = 'paid';
          commission.paidAt = new Date();
        });

        this.emit('commissionsPaid', {
          affiliateWallet,
          amount: totalPending,
          currency: affiliate.settings.preferredCurrency,
          commissionsCount: pendingCommissions.length
        });

      } catch (error) {
        console.error(`Failed to process payout for ${affiliateWallet}:`, error);
      }
    }
  }

  // Check if payout should be processed based on frequency
  shouldProcessPayout(lastPayoutDate, frequency) {
    if (!lastPayoutDate) return true;

    const now = new Date();
    const lastPayout = new Date(lastPayoutDate);
    const daysSince = (now - lastPayout) / (1000 * 60 * 60 * 24);

    switch (frequency) {
      case 'real_time': return true;
      case 'daily': return daysSince >= 1;
      case 'weekly': return daysSince >= 7;
      case 'bi_weekly': return daysSince >= 14;
      case 'monthly': return daysSince >= 30;
      default: return false;
    }
  }

  // Create marketing campaign
  createCampaign(affiliateWallet, campaignData) {
    const affiliate = this.affiliates.get(affiliateWallet);
    if (!affiliate) {
      throw new Error('Affiliate not found');
    }

    const campaignId = `camp_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const campaign = {
      id: campaignId,
      affiliateWallet,
      name: campaignData.name,
      description: campaignData.description || '',
      type: campaignData.type || 'general', // general, social, email, etc.
      
      // Tracking
      customCode: campaignData.customCode || `${affiliate.referralCode}_${campaignId.slice(-4)}`,
      landingPageUrl: campaignData.landingPageUrl || null,
      trackingParameters: campaignData.trackingParameters || {},
      
      // Campaign settings
      startDate: new Date(campaignData.startDate || Date.now()),
      endDate: campaignData.endDate ? new Date(campaignData.endDate) : null,
      isActive: true,
      
      // Performance data
      stats: {
        clicks: 0,
        registrations: 0,
        deposits: 0,
        totalVolume: 0,
        commissions: 0,
        conversionRate: 0
      },
      
      createdAt: new Date()
    };

    // Add to campaigns map
    this.campaigns.set(campaignId, campaign);
    
    // Add to affiliate's campaigns
    affiliate.campaigns.push(campaignId);

    this.emit('campaignCreated', { affiliateWallet, campaign });

    return campaign;
  }

  // Track campaign click
  trackCampaignClick(campaignId, clickData = {}) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign || !campaign.isActive) return;

    campaign.stats.clicks++;
    
    this.emit('campaignClick', {
      campaignId,
      campaign,
      clickData: {
        timestamp: new Date(),
        ip: clickData.ip || 'unknown',
        userAgent: clickData.userAgent || 'unknown',
        referrer: clickData.referrer || 'direct'
      }
    });
  }

  // Get affiliate dashboard data
  getAffiliateDashboard(walletAddress) {
    const affiliate = this.affiliates.get(walletAddress);
    if (!affiliate) {
      throw new Error('Affiliate not found');
    }

    const referrals = this.referralHistory.get(walletAddress) || [];
    const commissions = this.commissionHistory.get(walletAddress) || [];
    
    // Calculate recent performance
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recent30DayCommissions = commissions.filter(c => c.createdAt >= last30Days);
    const recent7DayCommissions = commissions.filter(c => c.createdAt >= last7Days);

    const pendingCommissions = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    // Get campaign performance
    const campaignPerformance = affiliate.campaigns.map(campaignId => {
      const campaign = this.campaigns.get(campaignId);
      return campaign ? {
        id: campaign.id,
        name: campaign.name,
        stats: campaign.stats,
        isActive: campaign.isActive
      } : null;
    }).filter(c => c !== null);

    return {
      affiliate: {
        tier: affiliate.tier,
        tierData: this.tiers[affiliate.tier],
        referralCode: affiliate.referralCode,
        customLinks: affiliate.customLinks,
        isActive: affiliate.isActive
      },
      stats: {
        ...affiliate.stats,
        pendingCommissions,
        last30DayCommissions: recent30DayCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
        last7DayCommissions: recent7DayCommissions.reduce((sum, c) => sum + c.commissionAmount, 0)
      },
      referrals: {
        total: referrals.length,
        active: referrals.filter(r => r.isActive).length,
        recent: referrals.filter(r => r.registeredAt >= last30Days).length
      },
      campaigns: campaignPerformance,
      recentCommissions: commissions
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 10)
        .map(c => ({
          id: c.id,
          amount: c.commissionAmount,
          currency: c.commissionCurrency,
          gameType: c.gameType,
          createdAt: c.createdAt,
          status: c.status
        })),
      nextTier: this.getNextTierInfo(affiliate.tier, affiliate.stats)
    };
  }

  // Get next tier information and requirements
  getNextTierInfo(currentTier, stats) {
    const currentLevel = this.tiers[currentTier].level;
    let nextTier = null;

    Object.entries(this.tiers).forEach(([tierName, tierData]) => {
      if (tierData.level === currentLevel + 1) {
        nextTier = {
          name: tierName,
          data: tierData,
          progress: {
            referrals: Math.min(100, (stats.totalReferrals / tierData.requirements.minReferrals) * 100),
            monthlyVolume: Math.min(100, (stats.monthlyVolume / tierData.requirements.minMonthlyVolume) * 100),
            activeReferrals: Math.min(100, (stats.activeReferrals / tierData.requirements.minActiveReferrals) * 100)
          }
        };
      }
    });

    return nextTier;
  }

  // Start commission calculation scheduler
  startCommissionCalculation() {
    // Process payouts every hour
    setInterval(() => {
      this.processCommissionPayouts();
    }, 60 * 60 * 1000);

    // Reset monthly stats on the 1st of each month
    setInterval(() => {
      const now = new Date();
      if (now.getDate() === 1) {
        this.resetMonthlyStats();
      }
    }, 24 * 60 * 60 * 1000);
  }

  // Reset monthly statistics
  resetMonthlyStats() {
    this.affiliates.forEach(affiliate => {
      affiliate.stats.monthlyVolume = 0;
      affiliate.stats.monthlyCommissions = 0;
    });

    this.emit('monthlyStatsReset', { timestamp: new Date() });
  }

  // Get top performing affiliates
  getTopAffiliates(limit = 10, metric = 'totalCommissions') {
    const affiliatesArray = Array.from(this.affiliates.values())
      .filter(a => a.isActive)
      .map(affiliate => {
        const commissions = this.commissionHistory.get(affiliate.walletAddress) || [];
        const referrals = this.referralHistory.get(affiliate.walletAddress) || [];
        
        return {
          walletAddress: affiliate.walletAddress.substring(0, 6) + '...' + affiliate.walletAddress.slice(-4),
          tier: affiliate.tier,
          stats: affiliate.stats,
          totalCommissions: commissions.reduce((sum, c) => sum + (c.status === 'paid' ? c.commissionAmount : 0), 0),
          totalReferrals: referrals.length,
          registeredAt: affiliate.registeredAt
        };
      })
      .sort((a, b) => b.stats[metric] - a.stats[metric])
      .slice(0, limit);

    return affiliatesArray;
  }

  // Get system statistics
  getSystemStatistics() {
    const totalAffiliates = this.affiliates.size;
    const activeAffiliates = Array.from(this.affiliates.values()).filter(a => a.isActive).length;
    
    const tierDistribution = {};
    Object.keys(this.tiers).forEach(tier => {
      tierDistribution[tier] = Array.from(this.affiliates.values()).filter(a => a.tier === tier).length;
    });

    const totalCommissions = Array.from(this.commissionHistory.values())
      .flat()
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + this.multiCurrency.convertToUSD(c.commissionAmount, c.commissionCurrency), 0);

    const totalReferrals = Array.from(this.referralHistory.values())
      .flat()
      .filter(r => r.type === 'player').length;

    const activeCampaigns = Array.from(this.campaigns.values()).filter(c => c.isActive).length;

    return {
      totalAffiliates,
      activeAffiliates,
      tierDistribution,
      totalCommissions,
      totalReferrals,
      activeCampaigns,
      conversionRate: totalReferrals > 0 ? ((totalReferrals / totalAffiliates) * 100).toFixed(2) : '0.00',
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = AffiliateSystem;