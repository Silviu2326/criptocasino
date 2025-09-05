const crypto = require('crypto');
const EventEmitter = require('events');

class MultiCurrencySystem extends EventEmitter {
  constructor() {
    super();
    this.supportedCurrencies = this.initializeCurrencies();
    this.exchangeRates = new Map();
    this.userBalances = new Map(); // walletAddress -> {currency -> amount}
    this.transactionHistory = new Map();
    this.currencyConfigs = this.initializeCurrencyConfigs();
    this.priceFeeds = new Map();
    
    this.startPriceFeedUpdates();
  }

  initializeCurrencies() {
    return {
      ETH: {
        symbol: 'ETH',
        name: 'Ethereum',
        decimals: 18,
        icon: '⟠',
        color: '#627EEA',
        type: 'native',
        network: 'ethereum',
        contractAddress: null,
        minDeposit: 0.001,
        maxDeposit: 100,
        withdrawalFee: 0.002,
        confirmationsRequired: 12
      },
      BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        decimals: 8,
        icon: '₿',
        color: '#F7931A',
        type: 'native',
        network: 'bitcoin',
        contractAddress: null,
        minDeposit: 0.0001,
        maxDeposit: 10,
        withdrawalFee: 0.0005,
        confirmationsRequired: 6
      },
      USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        icon: '💵',
        color: '#2775CA',
        type: 'erc20',
        network: 'ethereum',
        contractAddress: '0xA0b86a33E6417b1bB3d395Af99b32Afe7c4cf2C6',
        minDeposit: 1,
        maxDeposit: 50000,
        withdrawalFee: 2,
        confirmationsRequired: 12
      },
      USDT: {
        symbol: 'USDT',
        name: 'Tether',
        decimals: 6,
        icon: '💰',
        color: '#26A17B',
        type: 'erc20',
        network: 'ethereum',
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        minDeposit: 1,
        maxDeposit: 50000,
        withdrawalFee: 5,
        confirmationsRequired: 12
      },
      MATIC: {
        symbol: 'MATIC',
        name: 'Polygon',
        decimals: 18,
        icon: '🔮',
        color: '#8247E5',
        type: 'native',
        network: 'polygon',
        contractAddress: null,
        minDeposit: 1,
        maxDeposit: 10000,
        withdrawalFee: 0.1,
        confirmationsRequired: 50
      },
      BNB: {
        symbol: 'BNB',
        name: 'Binance Coin',
        decimals: 18,
        icon: '🟡',
        color: '#F3BA2F',
        type: 'native',
        network: 'bsc',
        contractAddress: null,
        minDeposit: 0.01,
        maxDeposit: 1000,
        withdrawalFee: 0.001,
        confirmationsRequired: 15
      },
      DOGE: {
        symbol: 'DOGE',
        name: 'Dogecoin',
        decimals: 8,
        icon: '🐕',
        color: '#C2A633',
        type: 'native',
        network: 'dogecoin',
        contractAddress: null,
        minDeposit: 1,
        maxDeposit: 100000,
        withdrawalFee: 1,
        confirmationsRequired: 6
      },
      LTC: {
        symbol: 'LTC',
        name: 'Litecoin',
        decimals: 8,
        icon: '🥈',
        color: '#BFBBBB',
        type: 'native',
        network: 'litecoin',
        contractAddress: null,
        minDeposit: 0.001,
        maxDeposit: 500,
        withdrawalFee: 0.001,
        confirmationsRequired: 6
      }
    };
  }

  initializeCurrencyConfigs() {
    return {
      defaultCurrency: 'ETH',
      baseCurrency: 'USD', // For price calculations
      priceUpdateInterval: 30000, // 30 seconds
      maxSlippageTolerance: 0.05, // 5%
      autoConversionEnabled: true,
      supportedNetworks: ['ethereum', 'bitcoin', 'polygon', 'bsc', 'dogecoin', 'litecoin'],
      crossChainEnabled: true
    };
  }

  // Mock price feed - in production would connect to real APIs
  startPriceFeedUpdates() {
    const updatePrices = () => {
      // Mock exchange rates (USD base)
      this.exchangeRates.set('ETH', 2100 + (Math.random() - 0.5) * 200);
      this.exchangeRates.set('BTC', 42000 + (Math.random() - 0.5) * 4000);
      this.exchangeRates.set('USDC', 1.00);
      this.exchangeRates.set('USDT', 1.00 + (Math.random() - 0.5) * 0.02);
      this.exchangeRates.set('MATIC', 0.85 + (Math.random() - 0.5) * 0.1);
      this.exchangeRates.set('BNB', 320 + (Math.random() - 0.5) * 30);
      this.exchangeRates.set('DOGE', 0.08 + (Math.random() - 0.5) * 0.01);
      this.exchangeRates.set('LTC', 75 + (Math.random() - 0.5) * 8);

      this.emit('priceUpdate', Object.fromEntries(this.exchangeRates));
    };

    updatePrices();
    setInterval(updatePrices, this.currencyConfigs.priceUpdateInterval);
  }

  // Get user balance for specific currency
  getUserBalance(walletAddress, currency) {
    const userBalances = this.userBalances.get(walletAddress) || {};
    return parseFloat(userBalances[currency] || '0');
  }

  // Get all user balances
  getAllUserBalances(walletAddress) {
    const userBalances = this.userBalances.get(walletAddress) || {};
    const balances = {};
    
    Object.keys(this.supportedCurrencies).forEach(currency => {
      const amount = parseFloat(userBalances[currency] || '0');
      const usdValue = this.convertToUSD(amount, currency);
      
      balances[currency] = {
        amount: amount.toFixed(8),
        usdValue: usdValue.toFixed(2),
        currency: this.supportedCurrencies[currency]
      };
    });

    // Calculate total portfolio value
    const totalUSD = Object.values(balances).reduce((sum, bal) => sum + parseFloat(bal.usdValue), 0);
    
    return {
      balances,
      totalUSD: totalUSD.toFixed(2),
      timestamp: new Date().toISOString()
    };
  }

  // Add balance to user account
  async addBalance(walletAddress, currency, amount, reason = 'deposit', metadata = {}) {
    if (!this.supportedCurrencies[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const currentBalances = this.userBalances.get(walletAddress) || {};
    const currentAmount = parseFloat(currentBalances[currency] || '0');
    const newAmount = currentAmount + parseFloat(amount);

    currentBalances[currency] = newAmount.toFixed(8);
    this.userBalances.set(walletAddress, currentBalances);

    // Record transaction
    const transaction = {
      id: `tx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      walletAddress,
      currency,
      amount: parseFloat(amount),
      type: 'credit',
      reason,
      balanceBefore: currentAmount,
      balanceAfter: newAmount,
      usdValue: this.convertToUSD(parseFloat(amount), currency),
      timestamp: new Date().toISOString(),
      metadata
    };

    this.recordTransaction(transaction);
    this.emit('balanceUpdate', { walletAddress, currency, transaction });

    return transaction;
  }

  // Deduct balance from user account
  async deductBalance(walletAddress, currency, amount, reason = 'withdrawal', metadata = {}) {
    if (!this.supportedCurrencies[currency]) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    const currentBalances = this.userBalances.get(walletAddress) || {};
    const currentAmount = parseFloat(currentBalances[currency] || '0');

    if (currentAmount < parseFloat(amount)) {
      throw new Error(`Insufficient ${currency} balance. Required: ${amount}, Available: ${currentAmount}`);
    }

    const newAmount = currentAmount - parseFloat(amount);
    currentBalances[currency] = newAmount.toFixed(8);
    this.userBalances.set(walletAddress, currentBalances);

    // Record transaction
    const transaction = {
      id: `tx_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      walletAddress,
      currency,
      amount: -parseFloat(amount),
      type: 'debit',
      reason,
      balanceBefore: currentAmount,
      balanceAfter: newAmount,
      usdValue: -this.convertToUSD(parseFloat(amount), currency),
      timestamp: new Date().toISOString(),
      metadata
    };

    this.recordTransaction(transaction);
    this.emit('balanceUpdate', { walletAddress, currency, transaction });

    return transaction;
  }

  // Convert amount from one currency to another
  convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return parseFloat(amount);
    
    const fromRate = this.exchangeRates.get(fromCurrency);
    const toRate = this.exchangeRates.get(toCurrency);
    
    if (!fromRate || !toRate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} or ${toCurrency}`);
    }

    // Convert through USD
    const usdAmount = parseFloat(amount) * fromRate;
    const convertedAmount = usdAmount / toRate;
    
    return parseFloat(convertedAmount.toFixed(8));
  }

  // Convert amount to USD
  convertToUSD(amount, currency) {
    const rate = this.exchangeRates.get(currency);
    if (!rate) return 0;
    return parseFloat(amount) * rate;
  }

  // Process a bet in any supported currency
  async processBet(walletAddress, currency, amount, gameType, gameData = {}) {
    const betAmount = parseFloat(amount);
    
    // Check if user has sufficient balance
    const currentBalance = this.getUserBalance(walletAddress, currency);
    if (currentBalance < betAmount) {
      throw new Error(`Insufficient ${currency} balance for bet`);
    }

    // Deduct bet amount
    await this.deductBalance(walletAddress, currency, betAmount, 'bet', {
      gameType,
      gameData
    });

    return {
      betId: `bet_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      walletAddress,
      currency,
      amount: betAmount,
      gameType,
      timestamp: new Date().toISOString()
    };
  }

  // Process winnings in any supported currency
  async processWinnings(walletAddress, currency, amount, gameType, gameData = {}) {
    const winAmount = parseFloat(amount);
    
    if (winAmount <= 0) return null;

    // Add winnings to balance
    const transaction = await this.addBalance(walletAddress, currency, winAmount, 'winnings', {
      gameType,
      gameData
    });

    return {
      payoutId: transaction.id,
      walletAddress,
      currency,
      amount: winAmount,
      gameType,
      timestamp: new Date().toISOString()
    };
  }

  // Record transaction history
  recordTransaction(transaction) {
    const userTransactions = this.transactionHistory.get(transaction.walletAddress) || [];
    userTransactions.unshift(transaction);
    
    // Keep only last 1000 transactions per user
    if (userTransactions.length > 1000) {
      userTransactions.splice(1000);
    }
    
    this.transactionHistory.set(transaction.walletAddress, userTransactions);
  }

  // Get user transaction history
  getTransactionHistory(walletAddress, options = {}) {
    const {
      currency = null,
      type = null,
      limit = 100,
      offset = 0
    } = options;

    let transactions = this.transactionHistory.get(walletAddress) || [];

    // Apply filters
    if (currency) {
      transactions = transactions.filter(tx => tx.currency === currency);
    }
    
    if (type) {
      transactions = transactions.filter(tx => tx.type === type);
    }

    // Apply pagination
    const total = transactions.length;
    const paginatedTransactions = transactions.slice(offset, offset + limit);

    return {
      transactions: paginatedTransactions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    };
  }

  // Get portfolio performance
  getPortfolioPerformance(walletAddress, timeframe = '24h') {
    const userBalances = this.getAllUserBalances(walletAddress);
    const transactions = this.getTransactionHistory(walletAddress, { limit: 1000 });
    
    // Calculate performance metrics
    const now = new Date();
    const timeframMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = new Date(now.getTime() - timeframMs[timeframe]);
    const recentTransactions = transactions.transactions.filter(tx => 
      new Date(tx.timestamp) > cutoffTime
    );

    const deposits = recentTransactions
      .filter(tx => tx.reason === 'deposit')
      .reduce((sum, tx) => sum + tx.usdValue, 0);

    const withdrawals = recentTransactions
      .filter(tx => tx.reason === 'withdrawal')
      .reduce((sum, tx) => sum + Math.abs(tx.usdValue), 0);

    const bets = recentTransactions
      .filter(tx => tx.reason === 'bet')
      .reduce((sum, tx) => sum + Math.abs(tx.usdValue), 0);

    const winnings = recentTransactions
      .filter(tx => tx.reason === 'winnings')
      .reduce((sum, tx) => sum + tx.usdValue, 0);

    const netGambling = winnings - bets;
    const totalVolume = bets;

    return {
      timeframe,
      currentPortfolioUSD: parseFloat(userBalances.totalUSD),
      deposits,
      withdrawals,
      totalVolume,
      netGambling,
      netGamblingPercent: bets > 0 ? ((netGambling / bets) * 100).toFixed(2) : '0.00',
      transactionCount: recentTransactions.length,
      topCurrency: this.getTopCurrencyByVolume(recentTransactions),
      performance: {
        profitable: netGambling > 0,
        roi: deposits > 0 ? ((netGambling / deposits) * 100).toFixed(2) : '0.00'
      }
    };
  }

  getTopCurrencyByVolume(transactions) {
    const currencyVolumes = {};
    
    transactions.forEach(tx => {
      if (!currencyVolumes[tx.currency]) {
        currencyVolumes[tx.currency] = 0;
      }
      currencyVolumes[tx.currency] += Math.abs(tx.usdValue);
    });

    const topCurrency = Object.entries(currencyVolumes)
      .sort(([,a], [,b]) => b - a)[0];

    return topCurrency ? {
      currency: topCurrency[0],
      volume: topCurrency[1].toFixed(2)
    } : null;
  }

  // Get exchange rates for all currencies
  getExchangeRates() {
    const rates = {};
    this.exchangeRates.forEach((rate, currency) => {
      rates[currency] = {
        usd: rate,
        currency: this.supportedCurrencies[currency],
        lastUpdate: new Date().toISOString()
      };
    });
    return rates;
  }

  // Get system statistics
  getSystemStatistics() {
    const totalUsers = this.userBalances.size;
    let totalValueUSD = 0;
    const currencyDistribution = {};

    // Initialize currency distribution
    Object.keys(this.supportedCurrencies).forEach(currency => {
      currencyDistribution[currency] = {
        totalAmount: 0,
        totalUsers: 0,
        totalUSDValue: 0
      };
    });

    // Calculate totals
    this.userBalances.forEach((balances) => {
      Object.entries(balances).forEach(([currency, amount]) => {
        const numAmount = parseFloat(amount);
        const usdValue = this.convertToUSD(numAmount, currency);
        
        if (numAmount > 0) {
          currencyDistribution[currency].totalAmount += numAmount;
          currencyDistribution[currency].totalUsers += 1;
          currencyDistribution[currency].totalUSDValue += usdValue;
          totalValueUSD += usdValue;
        }
      });
    });

    return {
      totalUsers,
      totalValueUSD: totalValueUSD.toFixed(2),
      supportedCurrencies: Object.keys(this.supportedCurrencies).length,
      currencyDistribution,
      exchangeRates: this.getExchangeRates(),
      generatedAt: new Date().toISOString()
    };
  }

  // Initialize user with demo balances
  initializeDemoUser(walletAddress) {
    const demoBalances = {
      ETH: (Math.random() * 2 + 0.1).toFixed(8),
      BTC: (Math.random() * 0.05 + 0.001).toFixed(8),
      USDC: (Math.random() * 1000 + 100).toFixed(2),
      USDT: (Math.random() * 500 + 50).toFixed(2),
      MATIC: (Math.random() * 1000 + 10).toFixed(2),
      BNB: (Math.random() * 10 + 1).toFixed(4),
      DOGE: (Math.random() * 10000 + 100).toFixed(0),
      LTC: (Math.random() * 5 + 0.1).toFixed(4)
    };

    this.userBalances.set(walletAddress, demoBalances);

    // Record initial transactions
    Object.entries(demoBalances).forEach(([currency, amount]) => {
      this.recordTransaction({
        id: `tx_init_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        walletAddress,
        currency,
        amount: parseFloat(amount),
        type: 'credit',
        reason: 'demo_initialization',
        balanceBefore: 0,
        balanceAfter: parseFloat(amount),
        usdValue: this.convertToUSD(parseFloat(amount), currency),
        timestamp: new Date().toISOString(),
        metadata: { source: 'demo' }
      });
    });

    return this.getAllUserBalances(walletAddress);
  }
}

module.exports = MultiCurrencySystem;