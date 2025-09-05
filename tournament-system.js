const crypto = require('crypto');
const EventEmitter = require('events');

class TournamentSystem extends EventEmitter {
  constructor(multiCurrencySystem) {
    super();
    this.multiCurrency = multiCurrencySystem;
    this.tournaments = new Map();
    this.participants = new Map(); // tournamentId -> participants[]
    this.leaderboards = new Map(); // tournamentId -> leaderboard
    this.tournaments_history = new Map();
    this.tournamentTemplates = this.initializeTournamentTemplates();
    
    this.startTournamentScheduler();
  }

  initializeTournamentTemplates() {
    return {
      // Daily Tournaments
      daily_dice: {
        name: 'Daily Dice Championship',
        description: 'Roll your way to victory in this high-stakes dice tournament',
        gameType: 'dice',
        format: 'leaderboard',
        duration: 24 * 60 * 60 * 1000, // 24 hours
        entryFee: { amount: 0.01, currency: 'ETH' },
        minParticipants: 10,
        maxParticipants: 500,
        prizePool: {
          currency: 'ETH',
          guaranteed: 5.0,
          distribution: [
            { position: 1, percentage: 40, bonus: 'Diamond VIP Status' },
            { position: 2, percentage: 25, bonus: 'Platinum VIP Status' },
            { position: 3, percentage: 15, bonus: 'Gold VIP Status' },
            { positions: [4, 10], percentage: 15 },
            { positions: [11, 50], percentage: 5 }
          ]
        },
        schedule: 'daily',
        startTime: '00:00',
        rebuyAllowed: false,
        late_registration: 2 * 60 * 60 * 1000 // 2 hours
      },

      weekly_crash: {
        name: 'Weekly Crash Legends',
        description: 'Survive the longest in our weekly crash tournament',
        gameType: 'crash',
        format: 'elimination',
        duration: 7 * 24 * 60 * 60 * 1000, // 7 days
        entryFee: { amount: 0.05, currency: 'ETH' },
        minParticipants: 50,
        maxParticipants: 1000,
        prizePool: {
          currency: 'ETH',
          guaranteed: 50.0,
          distribution: [
            { position: 1, percentage: 50, bonus: 'Royal VIP + Rolex' },
            { position: 2, percentage: 25, bonus: 'Diamond VIP + iPhone' },
            { position: 3, percentage: 12, bonus: 'Platinum VIP + AirPods' },
            { positions: [4, 10], percentage: 10 },
            { positions: [11, 50], percentage: 3 }
          ]
        },
        schedule: 'weekly',
        startTime: 'monday_00:00',
        rebuyAllowed: true,
        rebuyLimit: 3,
        late_registration: 24 * 60 * 60 * 1000 // 24 hours
      },

      monthly_blackjack: {
        name: 'Monthly Blackjack Masters',
        description: 'The ultimate blackjack tournament for true masters',
        gameType: 'blackjack',
        format: 'bracket',
        duration: 30 * 24 * 60 * 60 * 1000, // 30 days
        entryFee: { amount: 0.1, currency: 'ETH' },
        minParticipants: 128,
        maxParticipants: 512,
        prizePool: {
          currency: 'ETH',
          guaranteed: 200.0,
          distribution: [
            { position: 1, percentage: 60, bonus: 'Royal VIP + Tesla Model S' },
            { position: 2, percentage: 20, bonus: 'Diamond VIP + $10k Cash' },
            { position: 3, percentage: 10, bonus: 'Platinum VIP + $5k Cash' },
            { position: 4, percentage: 5, bonus: 'Gold VIP + $2k Cash' },
            { positions: [5, 8], percentage: 3 },
            { positions: [9, 16], percentage: 2 }
          ]
        },
        schedule: 'monthly',
        startTime: 'first_sunday_12:00',
        rebuyAllowed: false,
        late_registration: 7 * 24 * 60 * 60 * 1000, // 7 days
        bracketType: 'single_elimination'
      },

      vip_exclusive: {
        name: 'VIP Exclusive Championship',
        description: 'Elite tournament for Diamond and Royal VIP members only',
        gameType: 'mixed',
        format: 'multi_stage',
        duration: 7 * 24 * 60 * 60 * 1000,
        entryFee: { amount: 1.0, currency: 'ETH' },
        minParticipants: 20,
        maxParticipants: 100,
        vipRequirement: 4, // Diamond level or above
        prizePool: {
          currency: 'ETH',
          guaranteed: 100.0,
          distribution: [
            { position: 1, percentage: 50, bonus: 'Lamborghini + Royal Status' },
            { position: 2, percentage: 30, bonus: 'Rolex + Diamond Status' },
            { position: 3, percentage: 15, bonus: '$25k Cash + Platinum Status' },
            { positions: [4, 10], percentage: 5 }
          ]
        },
        schedule: 'special',
        rebuyAllowed: false,
        stages: [
          { name: 'Qualification', gameType: 'dice', duration: 2 * 24 * 60 * 60 * 1000 },
          { name: 'Semi-Finals', gameType: 'blackjack', duration: 2 * 24 * 60 * 60 * 1000 },
          { name: 'Finals', gameType: 'crash', duration: 3 * 24 * 60 * 60 * 1000 }
        ]
      },

      freeroll_beginners: {
        name: 'Beginners Freeroll',
        description: 'Free tournament for new players - no entry fee required!',
        gameType: 'dice',
        format: 'leaderboard',
        duration: 12 * 60 * 60 * 1000, // 12 hours
        entryFee: { amount: 0, currency: 'FREE' },
        minParticipants: 5,
        maxParticipants: 1000,
        prizePool: {
          currency: 'ETH',
          guaranteed: 1.0,
          distribution: [
            { position: 1, percentage: 50 },
            { position: 2, percentage: 25 },
            { position: 3, percentage: 15 },
            { positions: [4, 10], percentage: 10 }
          ]
        },
        schedule: 'twice_daily',
        startTime: ['08:00', '20:00'],
        rebuyAllowed: false,
        newPlayersOnly: true
      }
    };
  }

  // Create a tournament from template
  async createTournament(templateId, customOptions = {}) {
    const template = this.tournamentTemplates[templateId];
    if (!template) {
      throw new Error(`Tournament template ${templateId} not found`);
    }

    const tournamentId = `tournament_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const startTime = new Date(customOptions.startTime || Date.now() + 60000); // Default 1 minute from now
    
    const tournament = {
      id: tournamentId,
      ...template,
      ...customOptions,
      status: 'registration',
      startTime,
      endTime: new Date(startTime.getTime() + template.duration),
      registrationEndTime: new Date(startTime.getTime() + (template.late_registration || 0)),
      createdAt: new Date(),
      currentParticipants: 0,
      actualPrizePool: template.prizePool.guaranteed,
      currentStage: template.stages ? 0 : null,
      bracket: null,
      settings: {
        autoStart: true,
        payoutThreshold: 0.8, // 80% of min participants needed to guarantee payout
        cancelThreshold: 0.3 // Below 30% of min participants will cancel tournament
      }
    };

    // Initialize bracket if needed
    if (template.format === 'bracket') {
      tournament.bracket = this.generateBracket(template.maxParticipants, template.bracketType);
    }

    this.tournaments.set(tournamentId, tournament);
    this.participants.set(tournamentId, []);
    this.leaderboards.set(tournamentId, []);

    this.emit('tournamentCreated', tournament);
    
    return tournament;
  }

  // Register user for tournament
  async registerForTournament(walletAddress, tournamentId, vipLevel = 0) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    // Check tournament status
    if (tournament.status !== 'registration') {
      throw new Error('Tournament registration is closed');
    }

    // Check registration deadline
    if (new Date() > tournament.registrationEndTime) {
      throw new Error('Registration period has ended');
    }

    // Check participant limit
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      throw new Error('Tournament is full');
    }

    // Check VIP requirement
    if (tournament.vipRequirement && vipLevel < tournament.vipRequirement) {
      throw new Error(`This tournament requires VIP level ${tournament.vipRequirement} or higher`);
    }

    // Check if user already registered
    const participants = this.participants.get(tournamentId);
    if (participants.some(p => p.walletAddress === walletAddress)) {
      throw new Error('User already registered for this tournament');
    }

    // Check new players only restriction
    if (tournament.newPlayersOnly) {
      // In a real implementation, you'd check user's account age/activity
      // For now, we'll allow all registrations
    }

    // Process entry fee
    let feeTransaction = null;
    if (tournament.entryFee.amount > 0) {
      const balance = this.multiCurrency.getUserBalance(walletAddress, tournament.entryFee.currency);
      if (balance < tournament.entryFee.amount) {
        throw new Error(`Insufficient ${tournament.entryFee.currency} balance for entry fee`);
      }

      feeTransaction = await this.multiCurrency.deductBalance(
        walletAddress,
        tournament.entryFee.currency,
        tournament.entryFee.amount,
        'tournament_entry',
        { tournamentId, tournamentName: tournament.name }
      );

      // Add to prize pool (minus house fee)
      const houseFee = tournament.entryFee.amount * 0.1; // 10% house fee
      const prizePoolContribution = tournament.entryFee.amount - houseFee;
      tournament.actualPrizePool += prizePoolContribution;
    }

    // Create participant record
    const participant = {
      walletAddress,
      registeredAt: new Date(),
      vipLevel,
      entryFeeTransaction: feeTransaction?.id,
      score: 0,
      gamesPlayed: 0,
      currentRound: 1,
      isActive: true,
      rebuys: 0,
      stats: {
        totalBet: 0,
        totalWon: 0,
        biggestWin: 0,
        longestStreak: 0,
        currentStreak: 0
      }
    };

    participants.push(participant);
    tournament.currentParticipants++;

    this.emit('userRegistered', { tournamentId, walletAddress, participant });

    // Check if tournament should auto-start
    if (tournament.currentParticipants >= tournament.minParticipants && 
        tournament.settings.autoStart && 
        new Date() >= tournament.startTime) {
      await this.startTournament(tournamentId);
    }

    return participant;
  }

  // Start tournament
  async startTournament(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    if (tournament.status !== 'registration') {
      throw new Error('Tournament cannot be started');
    }

    // Check minimum participants
    if (tournament.currentParticipants < tournament.minParticipants) {
      if (tournament.currentParticipants < tournament.minParticipants * tournament.settings.cancelThreshold) {
        return await this.cancelTournament(tournamentId);
      }
    }

    tournament.status = 'active';
    tournament.actualStartTime = new Date();

    // Initialize leaderboard
    const participants = this.participants.get(tournamentId);
    const leaderboard = participants.map(p => ({
      walletAddress: p.walletAddress,
      score: 0,
      position: 0,
      ...p.stats
    }));
    
    this.leaderboards.set(tournamentId, leaderboard);

    // Setup bracket if needed
    if (tournament.format === 'bracket') {
      tournament.bracket = this.generateBracket(tournament.currentParticipants, tournament.bracketType);
      this.seedBracket(tournamentId);
    }

    this.emit('tournamentStarted', tournament);

    // Schedule tournament end
    setTimeout(() => {
      this.endTournament(tournamentId);
    }, tournament.duration);

    return tournament;
  }

  // Update participant score
  async updateParticipantScore(tournamentId, walletAddress, gameResult) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status !== 'active') {
      return;
    }

    const participants = this.participants.get(tournamentId);
    const participant = participants.find(p => p.walletAddress === walletAddress && p.isActive);
    
    if (!participant) {
      return;
    }

    const leaderboard = this.leaderboards.get(tournamentId);
    const leaderboardEntry = leaderboard.find(l => l.walletAddress === walletAddress);

    // Calculate score based on game type and tournament format
    const scoreIncrease = this.calculateTournamentScore(tournament, gameResult);
    
    participant.score += scoreIncrease;
    participant.gamesPlayed++;
    participant.stats.totalBet += gameResult.betAmount || 0;
    participant.stats.totalWon += gameResult.winAmount || 0;
    
    if (gameResult.winAmount > participant.stats.biggestWin) {
      participant.stats.biggestWin = gameResult.winAmount;
    }

    // Update streaks
    if (gameResult.won) {
      participant.stats.currentStreak++;
      if (participant.stats.currentStreak > participant.stats.longestStreak) {
        participant.stats.longestStreak = participant.stats.currentStreak;
      }
    } else {
      participant.stats.currentStreak = 0;
    }

    // Update leaderboard
    if (leaderboardEntry) {
      leaderboardEntry.score = participant.score;
      leaderboardEntry.totalBet = participant.stats.totalBet;
      leaderboardEntry.totalWon = participant.stats.totalWon;
      leaderboardEntry.biggestWin = participant.stats.biggestWin;
      leaderboardEntry.longestStreak = participant.stats.longestStreak;
    }

    // Sort and update positions
    this.updateLeaderboardPositions(tournamentId);

    this.emit('scoreUpdated', {
      tournamentId,
      walletAddress,
      newScore: participant.score,
      scoreIncrease,
      gameResult
    });
  }

  // Calculate tournament score based on game result
  calculateTournamentScore(tournament, gameResult) {
    const baseScore = gameResult.winAmount || 0;
    let multiplier = 1;

    // Game-specific scoring
    switch (tournament.gameType) {
      case 'dice':
        multiplier = gameResult.multiplier || 1;
        break;
      case 'crash':
        multiplier = gameResult.multiplier || 1;
        break;
      case 'blackjack':
        if (gameResult.isBlackjack) multiplier = 2;
        else if (gameResult.won) multiplier = 1;
        break;
      case 'mixed':
        multiplier = 1.5; // Bonus for mixed game tournaments
        break;
    }

    // Bonus for consecutive wins
    if (gameResult.streak > 5) {
      multiplier *= 1 + (gameResult.streak * 0.1);
    }

    return baseScore * multiplier;
  }

  // Update leaderboard positions
  updateLeaderboardPositions(tournamentId) {
    const leaderboard = this.leaderboards.get(tournamentId);
    
    // Sort by score (descending)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Update positions
    leaderboard.forEach((entry, index) => {
      entry.position = index + 1;
    });

    this.leaderboards.set(tournamentId, leaderboard);
  }

  // End tournament
  async endTournament(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament || tournament.status === 'finished') {
      return;
    }

    tournament.status = 'finished';
    tournament.endedAt = new Date();

    // Final leaderboard update
    this.updateLeaderboardPositions(tournamentId);
    const finalLeaderboard = this.leaderboards.get(tournamentId);

    // Calculate and distribute prizes
    const prizeDistribution = await this.distributePrizes(tournamentId);

    // Move to history
    this.tournaments_history.set(tournamentId, {
      ...tournament,
      finalLeaderboard,
      prizeDistribution
    });

    this.emit('tournamentEnded', {
      tournamentId,
      tournament,
      finalLeaderboard,
      prizeDistribution
    });

    return {
      tournament,
      finalLeaderboard,
      prizeDistribution
    };
  }

  // Distribute tournament prizes
  async distributePrizes(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    const leaderboard = this.leaderboards.get(tournamentId);
    
    if (!tournament || !leaderboard.length) {
      return [];
    }

    const prizeDistribution = [];
    const totalPrizePool = tournament.actualPrizePool;

    for (const prizeRule of tournament.prizePool.distribution) {
      let positions = [];
      
      if (prizeRule.position) {
        positions = [prizeRule.position];
      } else if (prizeRule.positions) {
        const [start, end] = prizeRule.positions;
        positions = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }

      const prizePerPosition = (totalPrizePool * prizeRule.percentage / 100) / positions.length;

      for (const position of positions) {
        const winner = leaderboard.find(l => l.position === position);
        if (!winner) continue;

        const prize = {
          position,
          walletAddress: winner.walletAddress,
          amount: prizePerPosition,
          currency: tournament.prizePool.currency,
          bonus: prizeRule.bonus || null,
          timestamp: new Date()
        };

        // Distribute the prize
        if (prizePerPosition > 0) {
          await this.multiCurrency.addBalance(
            winner.walletAddress,
            tournament.prizePool.currency,
            prizePerPosition,
            'tournament_prize',
            {
              tournamentId,
              tournamentName: tournament.name,
              position,
              bonus: prize.bonus
            }
          );
        }

        prizeDistribution.push(prize);
      }
    }

    return prizeDistribution;
  }

  // Generate tournament bracket
  generateBracket(participantCount, bracketType = 'single_elimination') {
    const bracketSize = Math.pow(2, Math.ceil(Math.log2(participantCount)));
    const rounds = Math.log2(bracketSize);
    
    const bracket = {
      type: bracketType,
      size: bracketSize,
      rounds: rounds,
      matches: []
    };

    // Generate matches for each round
    for (let round = 1; round <= rounds; round++) {
      const matchesInRound = Math.pow(2, rounds - round);
      
      for (let match = 1; match <= matchesInRound; match++) {
        bracket.matches.push({
          id: `R${round}M${match}`,
          round,
          match,
          player1: null,
          player2: null,
          winner: null,
          status: 'pending',
          scheduledTime: null,
          completedTime: null
        });
      }
    }

    return bracket;
  }

  // Seed bracket with participants
  seedBracket(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    const participants = this.participants.get(tournamentId);
    
    if (!tournament.bracket) return;

    // Shuffle participants for random seeding
    const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
    
    // Assign to first round matches
    const firstRoundMatches = tournament.bracket.matches.filter(m => m.round === 1);
    
    for (let i = 0; i < shuffledParticipants.length && i < firstRoundMatches.length * 2; i++) {
      const matchIndex = Math.floor(i / 2);
      const playerSlot = i % 2 === 0 ? 'player1' : 'player2';
      
      if (firstRoundMatches[matchIndex]) {
        firstRoundMatches[matchIndex][playerSlot] = shuffledParticipants[i].walletAddress;
      }
    }
  }

  // Cancel tournament
  async cancelTournament(tournamentId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) {
      throw new Error('Tournament not found');
    }

    tournament.status = 'cancelled';
    tournament.cancelledAt = new Date();

    // Refund entry fees
    const participants = this.participants.get(tournamentId);
    const refunds = [];

    for (const participant of participants) {
      if (participant.entryFeeTransaction && tournament.entryFee.amount > 0) {
        const refund = await this.multiCurrency.addBalance(
          participant.walletAddress,
          tournament.entryFee.currency,
          tournament.entryFee.amount,
          'tournament_refund',
          { tournamentId, tournamentName: tournament.name }
        );
        
        refunds.push({
          walletAddress: participant.walletAddress,
          amount: tournament.entryFee.amount,
          currency: tournament.entryFee.currency,
          refundTransaction: refund.id
        });
      }
    }

    this.emit('tournamentCancelled', { tournamentId, tournament, refunds });

    return { tournament, refunds };
  }

  // Get active tournaments
  getActiveTournaments() {
    return Array.from(this.tournaments.values())
      .filter(t => t.status === 'active' || t.status === 'registration')
      .map(tournament => ({
        ...tournament,
        participantCount: tournament.currentParticipants,
        timeRemaining: tournament.status === 'active' ? 
          Math.max(0, tournament.endTime.getTime() - Date.now()) : 
          Math.max(0, tournament.startTime.getTime() - Date.now()),
        registrationTimeRemaining: tournament.status === 'registration' ?
          Math.max(0, tournament.registrationEndTime.getTime() - Date.now()) : 0
      }));
  }

  // Get tournament leaderboard
  getTournamentLeaderboard(tournamentId, limit = 100) {
    const tournament = this.tournaments.get(tournamentId);
    const leaderboard = this.leaderboards.get(tournamentId);
    
    if (!tournament || !leaderboard) {
      return null;
    }

    return {
      tournamentId,
      tournamentName: tournament.name,
      status: tournament.status,
      leaderboard: leaderboard.slice(0, limit).map(entry => ({
        position: entry.position,
        walletAddress: entry.walletAddress.substring(0, 6) + '...' + entry.walletAddress.slice(-4),
        score: entry.score,
        totalBet: entry.totalBet,
        totalWon: entry.totalWon,
        biggestWin: entry.biggestWin,
        longestStreak: entry.longestStreak
      })),
      totalParticipants: leaderboard.length,
      prizePool: tournament.actualPrizePool,
      timeRemaining: tournament.status === 'active' ? 
        Math.max(0, tournament.endTime.getTime() - Date.now()) : 0
    };
  }

  // Get user's tournament history
  getUserTournamentHistory(walletAddress) {
    const userTournaments = [];

    // Active tournaments
    this.tournaments.forEach(tournament => {
      const participants = this.participants.get(tournament.id);
      const participant = participants?.find(p => p.walletAddress === walletAddress);
      
      if (participant) {
        const leaderboard = this.leaderboards.get(tournament.id);
        const position = leaderboard?.find(l => l.walletAddress === walletAddress)?.position;
        
        userTournaments.push({
          ...tournament,
          userStats: participant,
          currentPosition: position,
          status: tournament.status
        });
      }
    });

    // Historical tournaments
    this.tournaments_history.forEach(tournament => {
      const participant = tournament.finalLeaderboard?.find(l => l.walletAddress === walletAddress);
      
      if (participant) {
        const prize = tournament.prizeDistribution?.find(p => p.walletAddress === walletAddress);
        
        userTournaments.push({
          ...tournament,
          finalPosition: participant.position,
          prize: prize || null
        });
      }
    });

    return userTournaments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Start tournament scheduler
  startTournamentScheduler() {
    setInterval(() => {
      this.checkScheduledTournaments();
    }, 60000); // Check every minute
  }

  // Check for scheduled tournaments
  checkScheduledTournaments() {
    const now = new Date();
    
    Object.entries(this.tournamentTemplates).forEach(([templateId, template]) => {
      if (template.schedule === 'daily') {
        this.checkDailyTournament(templateId, template);
      } else if (template.schedule === 'weekly') {
        this.checkWeeklyTournament(templateId, template);
      } else if (template.schedule === 'monthly') {
        this.checkMonthlyTournament(templateId, template);
      } else if (template.schedule === 'twice_daily') {
        this.checkTwiceDailyTournament(templateId, template);
      }
    });

    // Auto-start tournaments that reached start time
    this.tournaments.forEach(tournament => {
      if (tournament.status === 'registration' && 
          now >= tournament.startTime && 
          tournament.currentParticipants >= tournament.minParticipants) {
        this.startTournament(tournament.id);
      }
    });
  }

  checkDailyTournament(templateId, template) {
    // Check if there's already an active daily tournament of this type today
    const today = new Date().toDateString();
    const existingToday = Array.from(this.tournaments.values())
      .some(t => t.name === template.name && 
                 new Date(t.createdAt).toDateString() === today);
    
    if (!existingToday) {
      const startTime = new Date();
      const [hour, minute] = template.startTime.split(':');
      startTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
      
      if (startTime <= new Date()) {
        startTime.setDate(startTime.getDate() + 1); // Tomorrow if time already passed
      }
      
      this.createTournament(templateId, { startTime });
    }
  }

  checkTwiceDailyTournament(templateId, template) {
    const today = new Date().toDateString();
    template.startTime.forEach(timeStr => {
      const tournamentName = `${template.name} ${timeStr}`;
      const existingToday = Array.from(this.tournaments.values())
        .some(t => t.name === tournamentName && 
                   new Date(t.createdAt).toDateString() === today);
      
      if (!existingToday) {
        const startTime = new Date();
        const [hour, minute] = timeStr.split(':');
        startTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
        
        if (startTime <= new Date()) {
          startTime.setDate(startTime.getDate() + 1);
        }
        
        this.createTournament(templateId, { 
          name: tournamentName,
          startTime 
        });
      }
    });
  }

  // Get system statistics
  getSystemStatistics() {
    const activeTournaments = Array.from(this.tournaments.values())
      .filter(t => t.status === 'active' || t.status === 'registration');
    
    const totalParticipants = Array.from(this.participants.values())
      .reduce((sum, participants) => sum + participants.length, 0);
    
    const totalPrizePool = Array.from(this.tournaments.values())
      .reduce((sum, tournament) => sum + tournament.actualPrizePool, 0);

    return {
      activeTournaments: activeTournaments.length,
      totalParticipants,
      totalPrizePool,
      completedTournaments: this.tournaments_history.size,
      tournamentTypes: Object.keys(this.tournamentTemplates).length,
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = TournamentSystem;