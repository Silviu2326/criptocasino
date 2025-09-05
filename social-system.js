const crypto = require('crypto');
const EventEmitter = require('events');

class SocialSystem extends EventEmitter {
  constructor() {
    super();
    this.userProfiles = new Map();
    this.chatRooms = new Map();
    this.globalChat = new Map();
    this.leaderboards = new Map();
    this.friendships = new Map();
    this.achievements = new Map();
    this.rainEvents = new Map();
    this.initializeDefaultRooms();
    this.initializeLeaderboards();
  }

  initializeDefaultRooms() {
    // Global chat room
    this.chatRooms.set('global', {
      id: 'global',
      name: 'Global Chat',
      type: 'public',
      description: 'General discussion for all players',
      maxUsers: 1000,
      activeUsers: new Set(),
      messages: [],
      moderators: new Set(['system']),
      settings: {
        slowMode: 3, // seconds between messages
        maxMessageLength: 500,
        allowEmojis: true,
        allowImages: false,
        filterProfanity: true
      }
    });

    // VIP chat room
    this.chatRooms.set('vip', {
      id: 'vip',
      name: 'VIP Lounge',
      type: 'vip',
      description: 'Exclusive chat for VIP members',
      minVipLevel: 2,
      maxUsers: 100,
      activeUsers: new Set(),
      messages: [],
      moderators: new Set(['system']),
      settings: {
        slowMode: 1,
        maxMessageLength: 1000,
        allowEmojis: true,
        allowImages: true,
        filterProfanity: false
      }
    });

    // Game-specific rooms
    const games = ['dice', 'crash', 'blackjack', 'roulette', 'plinko'];
    games.forEach(game => {
      this.chatRooms.set(game, {
        id: game,
        name: `${game.charAt(0).toUpperCase() + game.slice(1)} Chat`,
        type: 'game',
        game: game,
        description: `Discussion and tips for ${game} players`,
        maxUsers: 200,
        activeUsers: new Set(),
        messages: [],
        moderators: new Set(['system']),
        settings: {
          slowMode: 2,
          maxMessageLength: 300,
          allowEmojis: true,
          allowImages: false,
          filterProfanity: true
        }
      });
    });
  }

  initializeLeaderboards() {
    // Initialize different types of leaderboards
    const leaderboardTypes = [
      'daily_wagered',
      'weekly_wagered', 
      'monthly_wagered',
      'all_time_wagered',
      'biggest_wins',
      'most_games',
      'highest_multiplier',
      'profit_today',
      'profit_week',
      'profit_month'
    ];

    leaderboardTypes.forEach(type => {
      this.leaderboards.set(type, {
        type,
        entries: [],
        lastUpdated: new Date(),
        prizes: this.getLeaderboardPrizes(type)
      });
    });
  }

  getLeaderboardPrizes(type) {
    const basePrizes = {
      1: { amount: '1.0', currency: 'ETH', bonus: 'Winner Badge' },
      2: { amount: '0.5', currency: 'ETH', bonus: 'Silver Badge' },
      3: { amount: '0.25', currency: 'ETH', bonus: 'Bronze Badge' },
      '4-10': { amount: '0.1', currency: 'ETH', bonus: 'Top 10 Badge' },
      '11-50': { amount: '0.05', currency: 'ETH', bonus: 'Top 50 Badge' }
    };

    // Scale prizes based on leaderboard type
    if (type.includes('monthly') || type.includes('all_time')) {
      return Object.fromEntries(
        Object.entries(basePrizes).map(([rank, prize]) => [
          rank,
          { ...prize, amount: (parseFloat(prize.amount) * 5).toString() }
        ])
      );
    }

    if (type.includes('weekly')) {
      return Object.fromEntries(
        Object.entries(basePrizes).map(([rank, prize]) => [
          rank,
          { ...prize, amount: (parseFloat(prize.amount) * 2).toString() }
        ])
      );
    }

    return basePrizes;
  }

  // User Profile Management
  async createUserProfile(walletAddress, initialData = {}) {
    const profile = {
      walletAddress,
      username: initialData.username || this.generateUsername(walletAddress),
      avatar: initialData.avatar || this.getRandomAvatar(),
      bio: initialData.bio || '',
      country: initialData.country || null,
      joinedAt: new Date(),
      lastActive: new Date(),
      level: 1,
      xp: 0,
      achievements: [],
      badges: ['newcomer'],
      friends: new Set(),
      following: new Set(),
      followers: new Set(),
      blockedUsers: new Set(),
      statistics: {
        gamesPlayed: 0,
        totalWagered: 0,
        totalWon: 0,
        biggestWin: 0,
        currentStreak: 0,
        bestStreak: 0,
        favoriteGame: null,
        winRate: 0
      },
      preferences: {
        showOnline: true,
        allowFriendRequests: true,
        allowDirectMessages: true,
        showStatistics: true,
        notifications: {
          friendRequests: true,
          messages: true,
          achievements: true,
          rainEvents: true
        }
      },
      privacy: {
        profileVisibility: 'public', // public, friends, private
        statisticsVisibility: 'public',
        showBigWins: true
      }
    };

    this.userProfiles.set(walletAddress, profile);
    return profile;
  }

  generateUsername(walletAddress) {
    const prefixes = ['Crypto', 'Lucky', 'High', 'Moon', 'Diamond', 'Golden', 'Royal', 'Elite'];
    const suffixes = ['Player', 'Roller', 'Winner', 'Shark', 'Whale', 'Tiger', 'Legend', 'King'];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = walletAddress.slice(-4);
    
    return `${prefix}${suffix}${number}`;
  }

  getRandomAvatar() {
    const avatars = ['🎰', '🎲', '🃏', '💎', '🎯', '🏆', '🦄', '🔥', '⚡', '🌟', '🎪', '🎭'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  async getUserProfile(walletAddress) {
    let profile = this.userProfiles.get(walletAddress);
    
    if (!profile) {
      profile = await this.createUserProfile(walletAddress);
    }

    // Update last active
    profile.lastActive = new Date();
    
    return {
      ...profile,
      friends: Array.from(profile.friends),
      following: Array.from(profile.following),
      followers: Array.from(profile.followers),
      isOnline: Date.now() - profile.lastActive.getTime() < 5 * 60 * 1000 // 5 minutes
    };
  }

  // Chat System
  async sendMessage(walletAddress, roomId, content, type = 'text') {
    const room = this.chatRooms.get(roomId);
    if (!room) {
      throw new Error('Chat room not found');
    }

    const user = await this.getUserProfile(walletAddress);
    
    // Check permissions
    if (room.type === 'vip' && user.level < room.minVipLevel) {
      throw new Error('VIP access required');
    }

    // Check rate limiting
    const now = Date.now();
    const userMessages = room.messages.filter(
      msg => msg.userId === walletAddress && now - msg.timestamp.getTime() < 60000
    );

    if (userMessages.length >= 10) {
      throw new Error('Rate limit exceeded');
    }

    // Check slow mode
    const lastMessage = room.messages
      .filter(msg => msg.userId === walletAddress)
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (lastMessage && now - lastMessage.timestamp.getTime() < room.settings.slowMode * 1000) {
      throw new Error(`Slow mode active. Please wait ${room.settings.slowMode} seconds between messages`);
    }

    // Create message
    const message = {
      id: crypto.randomUUID(),
      userId: walletAddress,
      username: user.username,
      avatar: user.avatar,
      content: this.filterMessage(content, room.settings),
      type,
      timestamp: new Date(),
      reactions: new Map(),
      mentions: this.extractMentions(content),
      replyTo: null
    };

    // Add to room
    room.messages.push(message);
    room.activeUsers.add(walletAddress);

    // Keep only last 1000 messages per room
    if (room.messages.length > 1000) {
      room.messages = room.messages.slice(-1000);
    }

    // Emit message event
    this.emit('message', {
      roomId,
      message,
      user
    });

    return message;
  }

  filterMessage(content, settings) {
    if (!settings.filterProfanity) return content;

    const profanityWords = ['spam', 'scam', 'fake', 'rigged']; // Basic filter
    let filtered = content;

    profanityWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(word.length));
    });

    return filtered;
  }

  extractMentions(content) {
    const mentions = [];
    const mentionRegex = /@(\w+)/g;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  async getChatMessages(roomId, limit = 50, before = null) {
    const room = this.chatRooms.get(roomId);
    if (!room) {
      throw new Error('Chat room not found');
    }

    let messages = room.messages;

    if (before) {
      const beforeIndex = messages.findIndex(msg => msg.id === before);
      if (beforeIndex > 0) {
        messages = messages.slice(0, beforeIndex);
      }
    }

    return messages.slice(-limit).map(msg => ({
      ...msg,
      reactions: Object.fromEntries(msg.reactions)
    }));
  }

  // Rain System (Tip Distribution)
  async createRainEvent(creatorWallet, totalAmount, currency, participantCount = 10) {
    const rainId = crypto.randomUUID();
    const creator = await this.getUserProfile(creatorWallet);

    const rainEvent = {
      id: rainId,
      creator: {
        wallet: creatorWallet,
        username: creator.username,
        avatar: creator.avatar
      },
      totalAmount: parseFloat(totalAmount),
      currency,
      participantCount,
      participants: new Set(),
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60000), // 1 minute to join
      message: `${creator.username} is making it rain! ${totalAmount} ${currency} for ${participantCount} lucky players! 🌧️💰`
    };

    this.rainEvents.set(rainId, rainEvent);

    // Broadcast rain event
    this.emit('rainEvent', rainEvent);

    // Auto-complete after expiry
    setTimeout(() => {
      this.completeRainEvent(rainId);
    }, 60000);

    return rainEvent;
  }

  async joinRainEvent(rainId, walletAddress) {
    const rainEvent = this.rainEvents.get(rainId);
    if (!rainEvent) {
      throw new Error('Rain event not found');
    }

    if (rainEvent.status !== 'active') {
      throw new Error('Rain event is not active');
    }

    if (Date.now() > rainEvent.expiresAt.getTime()) {
      throw new Error('Rain event has expired');
    }

    if (rainEvent.participants.has(walletAddress)) {
      throw new Error('Already joined this rain event');
    }

    if (rainEvent.participants.size >= rainEvent.participantCount) {
      throw new Error('Rain event is full');
    }

    const user = await this.getUserProfile(walletAddress);
    rainEvent.participants.add(walletAddress);

    this.emit('rainJoin', {
      rainId,
      user: { wallet: walletAddress, username: user.username, avatar: user.avatar },
      participantsCount: rainEvent.participants.size,
      spotsRemaining: rainEvent.participantCount - rainEvent.participants.size
    });

    // Auto-complete if full
    if (rainEvent.participants.size >= rainEvent.participantCount) {
      setTimeout(() => this.completeRainEvent(rainId), 1000);
    }

    return {
      joined: true,
      spotsRemaining: rainEvent.participantCount - rainEvent.participants.size
    };
  }

  completeRainEvent(rainId) {
    const rainEvent = this.rainEvents.get(rainId);
    if (!rainEvent || rainEvent.status !== 'active') {
      return;
    }

    rainEvent.status = 'completed';
    const participantArray = Array.from(rainEvent.participants);
    const amountPerUser = rainEvent.totalAmount / participantArray.length;

    const results = participantArray.map(wallet => ({
      wallet,
      amount: amountPerUser.toFixed(8),
      currency: rainEvent.currency
    }));

    rainEvent.results = results;

    this.emit('rainComplete', {
      rainId,
      results,
      totalAmount: rainEvent.totalAmount,
      currency: rainEvent.currency,
      participantCount: participantArray.length
    });

    // Clean up after 5 minutes
    setTimeout(() => {
      this.rainEvents.delete(rainId);
    }, 5 * 60 * 1000);

    return results;
  }

  // Leaderboard System
  updateLeaderboards(walletAddress, gameData) {
    const updates = [];

    // Update daily wagered
    this.updateLeaderboard('daily_wagered', walletAddress, gameData.amount, 'sum');
    updates.push('daily_wagered');

    // Update weekly wagered
    this.updateLeaderboard('weekly_wagered', walletAddress, gameData.amount, 'sum');
    updates.push('weekly_wagered');

    // Update monthly wagered
    this.updateLeaderboard('monthly_wagered', walletAddress, gameData.amount, 'sum');
    updates.push('monthly_wagered');

    // Update all-time wagered
    this.updateLeaderboard('all_time_wagered', walletAddress, gameData.amount, 'sum');
    updates.push('all_time_wagered');

    if (gameData.won) {
      // Update biggest wins if this is a significant win
      this.updateLeaderboard('biggest_wins', walletAddress, parseFloat(gameData.winAmount), 'max');
      updates.push('biggest_wins');

      // Update profit leaderboards
      const profit = parseFloat(gameData.winAmount) - gameData.amount;
      this.updateLeaderboard('profit_today', walletAddress, profit, 'sum');
      this.updateLeaderboard('profit_week', walletAddress, profit, 'sum');
      this.updateLeaderboard('profit_month', walletAddress, profit, 'sum');
      updates.push('profit_today', 'profit_week', 'profit_month');
    }

    // Update games count
    this.updateLeaderboard('most_games', walletAddress, 1, 'sum');
    updates.push('most_games');

    return updates;
  }

  updateLeaderboard(type, walletAddress, value, operation = 'sum') {
    const leaderboard = this.leaderboards.get(type);
    if (!leaderboard) return;

    let entry = leaderboard.entries.find(e => e.walletAddress === walletAddress);
    
    if (!entry) {
      const user = this.userProfiles.get(walletAddress);
      entry = {
        walletAddress,
        username: user?.username || this.generateUsername(walletAddress),
        avatar: user?.avatar || this.getRandomAvatar(),
        value: 0,
        lastUpdated: new Date()
      };
      leaderboard.entries.push(entry);
    }

    // Apply operation
    switch (operation) {
      case 'sum':
        entry.value += value;
        break;
      case 'max':
        entry.value = Math.max(entry.value, value);
        break;
      case 'min':
        entry.value = Math.min(entry.value, value);
        break;
      default:
        entry.value = value;
    }

    entry.lastUpdated = new Date();

    // Sort and keep top 1000
    leaderboard.entries.sort((a, b) => b.value - a.value);
    if (leaderboard.entries.length > 1000) {
      leaderboard.entries = leaderboard.entries.slice(0, 1000);
    }

    leaderboard.lastUpdated = new Date();
  }

  getLeaderboard(type, limit = 100, userWallet = null) {
    const leaderboard = this.leaderboards.get(type);
    if (!leaderboard) {
      throw new Error('Leaderboard not found');
    }

    const topEntries = leaderboard.entries.slice(0, limit).map((entry, index) => ({
      rank: index + 1,
      walletAddress: entry.walletAddress.substring(0, 6) + '...' + entry.walletAddress.slice(-4),
      username: entry.username,
      avatar: entry.avatar,
      value: this.formatLeaderboardValue(type, entry.value),
      lastUpdated: entry.lastUpdated
    }));

    let userRank = null;
    if (userWallet) {
      const userIndex = leaderboard.entries.findIndex(e => e.walletAddress === userWallet);
      if (userIndex !== -1) {
        const userEntry = leaderboard.entries[userIndex];
        userRank = {
          rank: userIndex + 1,
          username: userEntry.username,
          avatar: userEntry.avatar,
          value: this.formatLeaderboardValue(type, userEntry.value),
          lastUpdated: userEntry.lastUpdated
        };
      }
    }

    return {
      type,
      title: this.getLeaderboardTitle(type),
      entries: topEntries,
      userRank,
      totalEntries: leaderboard.entries.length,
      lastUpdated: leaderboard.lastUpdated,
      prizes: leaderboard.prizes,
      resetSchedule: this.getResetSchedule(type)
    };
  }

  formatLeaderboardValue(type, value) {
    if (type.includes('wagered') || type.includes('wins') || type.includes('profit')) {
      return `${value.toFixed(4)} ETH`;
    }
    if (type.includes('games')) {
      return value.toString();
    }
    if (type.includes('multiplier')) {
      return `${value.toFixed(2)}x`;
    }
    return value.toString();
  }

  getLeaderboardTitle(type) {
    const titles = {
      daily_wagered: 'Daily High Rollers',
      weekly_wagered: 'Weekly Warriors', 
      monthly_wagered: 'Monthly Legends',
      all_time_wagered: 'Hall of Fame',
      biggest_wins: 'Biggest Wins Ever',
      most_games: 'Most Active Players',
      highest_multiplier: 'Highest Multipliers',
      profit_today: 'Today\'s Profit Leaders',
      profit_week: 'Weekly Profit Kings',
      profit_month: 'Monthly Profit Champions'
    };
    return titles[type] || type;
  }

  getResetSchedule(type) {
    if (type.includes('daily')) return 'Resets every day at midnight UTC';
    if (type.includes('weekly')) return 'Resets every Monday at midnight UTC';
    if (type.includes('monthly')) return 'Resets on the 1st of every month';
    return 'Never resets';
  }

  // Achievement System
  checkAchievements(walletAddress, eventData) {
    const user = this.userProfiles.get(walletAddress);
    if (!user) return [];

    const newAchievements = [];
    const achievements = this.getAvailableAchievements();

    achievements.forEach(achievement => {
      if (user.achievements.includes(achievement.id)) return; // Already earned

      if (this.checkAchievementCondition(achievement, user, eventData)) {
        user.achievements.push(achievement.id);
        user.xp += achievement.xp;
        
        // Check for level up
        const newLevel = Math.floor(user.xp / 1000) + 1;
        if (newLevel > user.level) {
          user.level = newLevel;
          newAchievements.push({
            type: 'level_up',
            id: `level_${newLevel}`,
            title: `Level ${newLevel} Reached!`,
            description: `You've reached level ${newLevel}`,
            icon: '🆙',
            xp: 0
          });
        }

        newAchievements.push(achievement);
        
        this.emit('achievement', {
          walletAddress,
          achievement,
          user
        });
      }
    });

    return newAchievements;
  }

  getAvailableAchievements() {
    return [
      {
        id: 'first_win',
        title: 'First Win',
        description: 'Win your first game',
        icon: '🎉',
        xp: 100,
        condition: { type: 'first_win' }
      },
      {
        id: 'high_roller',
        title: 'High Roller',
        description: 'Wager more than 1 ETH in a single game',
        icon: '💎',
        xp: 500,
        condition: { type: 'single_wager', amount: 1 }
      },
      {
        id: 'lucky_seven',
        title: 'Lucky Seven',
        description: 'Win 7 games in a row',
        icon: '🍀',
        xp: 750,
        condition: { type: 'win_streak', count: 7 }
      },
      {
        id: 'whale',
        title: 'Whale',
        description: 'Wager more than 100 ETH total',
        icon: '🐋',
        xp: 2000,
        condition: { type: 'total_wagered', amount: 100 }
      }
    ];
  }

  checkAchievementCondition(achievement, user, eventData) {
    const condition = achievement.condition;

    switch (condition.type) {
      case 'first_win':
        return eventData.won && user.statistics.totalWon === 0;
      
      case 'single_wager':
        return eventData.amount >= condition.amount;
      
      case 'win_streak':
        return user.statistics.currentStreak >= condition.count;
      
      case 'total_wagered':
        return user.statistics.totalWagered >= condition.amount;
      
      default:
        return false;
    }
  }
}

module.exports = SocialSystem;