const crypto = require('crypto');
const EventEmitter = require('events');

class LiquidityStakingSystem extends EventEmitter {
  constructor(multiCurrencySystem) {
    super();
    this.multiCurrency = multiCurrencySystem;
    this.liquidityPools = new Map();
    this.stakingPools = new Map();
    this.userStakes = new Map(); // walletAddress -> stakes[]
    this.userLiquidity = new Map(); // walletAddress -> liquidity positions[]
    this.rewardDistributions = new Map();
    this.poolConfigs = this.initializePoolConfigs();
    
    this.initializePools();
    this.startRewardDistribution();
  }

  initializePoolConfigs() {
    return {
      // Liquidity Pool configurations
      liquidityPools: {
        'ETH-USDC': {
          pair: ['ETH', 'USDC'],
          fee: 0.003, // 0.3%
          minLiquidity: 100, // USD value
          maxSlippage: 0.05, // 5%
          rewardAPY: 12.5,
          totalValueLocked: 0
        },
        'BTC-USDT': {
          pair: ['BTC', 'USDT'],
          fee: 0.003,
          minLiquidity: 100,
          maxSlippage: 0.05,
          rewardAPY: 11.2,
          totalValueLocked: 0
        },
        'MATIC-ETH': {
          pair: ['MATIC', 'ETH'],
          fee: 0.005, // 0.5% (higher volatility)
          minLiquidity: 50,
          maxSlippage: 0.08,
          rewardAPY: 18.7,
          totalValueLocked: 0
        },
        'BNB-USDC': {
          pair: ['BNB', 'USDC'],
          fee: 0.003,
          minLiquidity: 75,
          maxSlippage: 0.05,
          rewardAPY: 14.3,
          totalValueLocked: 0
        }
      },
      // Staking Pool configurations
      stakingPools: {
        'ETH-STAKE': {
          currency: 'ETH',
          minStake: 0.01,
          maxStake: 100,
          lockPeriods: {
            '30d': { apy: 8.5, multiplier: 1.0 },
            '90d': { apy: 12.0, multiplier: 1.25 },
            '180d': { apy: 16.5, multiplier: 1.5 },
            '365d': { apy: 22.0, multiplier: 2.0 }
          },
          totalStaked: 0,
          activeStakers: 0
        },
        'BTC-STAKE': {
          currency: 'BTC',
          minStake: 0.001,
          maxStake: 10,
          lockPeriods: {
            '30d': { apy: 7.5, multiplier: 1.0 },
            '90d': { apy: 11.0, multiplier: 1.25 },
            '180d': { apy: 15.0, multiplier: 1.5 },
            '365d': { apy: 20.5, multiplier: 2.0 }
          },
          totalStaked: 0,
          activeStakers: 0
        },
        'USDC-STAKE': {
          currency: 'USDC',
          minStake: 100,
          maxStake: 50000,
          lockPeriods: {
            '30d': { apy: 6.0, multiplier: 1.0 },
            '90d': { apy: 8.5, multiplier: 1.15 },
            '180d': { apy: 11.0, multiplier: 1.3 },
            '365d': { apy: 15.0, multiplier: 1.8 }
          },
          totalStaked: 0,
          activeStakers: 0
        },
        'CASINO-NATIVE': {
          currency: 'ETH', // Native casino token representation
          minStake: 0.1,
          maxStake: 1000,
          lockPeriods: {
            '7d': { apy: 25.0, multiplier: 1.0 },
            '30d': { apy: 35.0, multiplier: 1.5 },
            '90d': { apy: 50.0, multiplier: 2.0 },
            '180d': { apy: 75.0, multiplier: 3.0 }
          },
          totalStaked: 0,
          activeStakers: 0,
          bonusRewards: {
            vipBonus: true,
            gameplayBonus: 0.1, // 10% bonus for active players
            loyaltyMultiplier: 1.2
          }
        }
      }
    };
  }

  initializePools() {
    // Initialize liquidity pools
    Object.entries(this.poolConfigs.liquidityPools).forEach(([poolId, config]) => {
      this.liquidityPools.set(poolId, {
        id: poolId,
        ...config,
        reserves: {
          [config.pair[0]]: 1000, // Mock initial liquidity
          [config.pair[1]]: 2100000 // Mock initial liquidity
        },
        totalShares: 1000,
        providers: new Map(),
        volume24h: 0,
        fees24h: 0,
        createdAt: new Date(),
        lastUpdate: new Date()
      });
    });

    // Initialize staking pools
    Object.entries(this.poolConfigs.stakingPools).forEach(([poolId, config]) => {
      this.stakingPools.set(poolId, {
        id: poolId,
        ...config,
        stakes: new Map(),
        totalRewardsDistributed: 0,
        createdAt: new Date(),
        lastRewardDistribution: new Date()
      });
    });
  }

  // LIQUIDITY POOL FUNCTIONS

  // Add liquidity to a pool
  async addLiquidity(walletAddress, poolId, amount0, amount1, slippageTolerance = 0.05) {
    const pool = this.liquidityPools.get(poolId);
    if (!pool) {
      throw new Error(`Liquidity pool ${poolId} not found`);
    }

    const [currency0, currency1] = pool.pair;
    
    // Check user balances
    const balance0 = this.multiCurrency.getUserBalance(walletAddress, currency0);
    const balance1 = this.multiCurrency.getUserBalance(walletAddress, currency1);

    if (balance0 < parseFloat(amount0) || balance1 < parseFloat(amount1)) {
      throw new Error('Insufficient balance for liquidity provision');
    }

    // Calculate optimal amounts based on current pool ratio
    const reserve0 = pool.reserves[currency0];
    const reserve1 = pool.reserves[currency1];
    const ratio = reserve1 / reserve0;
    
    const optimalAmount1 = parseFloat(amount0) * ratio;
    const optimalAmount0 = parseFloat(amount1) / ratio;

    let finalAmount0, finalAmount1;
    
    // Determine final amounts based on slippage tolerance
    if (Math.abs(optimalAmount1 - parseFloat(amount1)) / parseFloat(amount1) <= slippageTolerance) {
      finalAmount0 = parseFloat(amount0);
      finalAmount1 = optimalAmount1;
    } else if (Math.abs(optimalAmount0 - parseFloat(amount0)) / parseFloat(amount0) <= slippageTolerance) {
      finalAmount0 = optimalAmount0;
      finalAmount1 = parseFloat(amount1);
    } else {
      throw new Error('Slippage tolerance exceeded');
    }

    // Calculate LP tokens to mint
    const lpTokens = Math.min(
      (finalAmount0 / reserve0) * pool.totalShares,
      (finalAmount1 / reserve1) * pool.totalShares
    );

    // Deduct tokens from user
    await this.multiCurrency.deductBalance(walletAddress, currency0, finalAmount0, 'liquidity_add');
    await this.multiCurrency.deductBalance(walletAddress, currency1, finalAmount1, 'liquidity_add');

    // Update pool reserves
    pool.reserves[currency0] += finalAmount0;
    pool.reserves[currency1] += finalAmount1;
    pool.totalShares += lpTokens;

    // Record user's liquidity position
    const positionId = `lp_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const position = {
      id: positionId,
      walletAddress,
      poolId,
      lpTokens,
      initialAmounts: {
        [currency0]: finalAmount0,
        [currency1]: finalAmount1
      },
      sharePercent: (lpTokens / pool.totalShares) * 100,
      addedAt: new Date(),
      feesEarned: 0,
      lastRewardClaim: new Date()
    };

    // Update user liquidity positions
    const userPositions = this.userLiquidity.get(walletAddress) || [];
    userPositions.push(position);
    this.userLiquidity.set(walletAddress, userPositions);

    // Update pool providers
    pool.providers.set(walletAddress, (pool.providers.get(walletAddress) || 0) + lpTokens);

    this.emit('liquidityAdded', {
      walletAddress,
      poolId,
      position,
      amounts: { [currency0]: finalAmount0, [currency1]: finalAmount1 }
    });

    return position;
  }

  // Remove liquidity from pool
  async removeLiquidity(walletAddress, positionId, percentage = 100) {
    const userPositions = this.userLiquidity.get(walletAddress) || [];
    const positionIndex = userPositions.findIndex(p => p.id === positionId);
    
    if (positionIndex === -1) {
      throw new Error('Liquidity position not found');
    }

    const position = userPositions[positionIndex];
    const pool = this.liquidityPools.get(position.poolId);
    const [currency0, currency1] = pool.pair;

    const removePercentage = Math.min(100, Math.max(0, percentage)) / 100;
    const lpTokensToRemove = position.lpTokens * removePercentage;
    
    // Calculate amounts to return
    const amount0 = (lpTokensToRemove / pool.totalShares) * pool.reserves[currency0];
    const amount1 = (lpTokensToRemove / pool.totalShares) * pool.reserves[currency1];

    // Update pool reserves
    pool.reserves[currency0] -= amount0;
    pool.reserves[currency1] -= amount1;
    pool.totalShares -= lpTokensToRemove;

    // Return tokens to user
    await this.multiCurrency.addBalance(walletAddress, currency0, amount0, 'liquidity_remove');
    await this.multiCurrency.addBalance(walletAddress, currency1, amount1, 'liquidity_remove');

    // Update position
    if (percentage >= 100) {
      // Remove position entirely
      userPositions.splice(positionIndex, 1);
    } else {
      // Update position
      position.lpTokens -= lpTokensToRemove;
      position.sharePercent = (position.lpTokens / pool.totalShares) * 100;
    }

    this.userLiquidity.set(walletAddress, userPositions);

    const withdrawal = {
      positionId,
      poolId: position.poolId,
      percentage,
      amounts: { [currency0]: amount0, [currency1]: amount1 },
      timestamp: new Date()
    };

    this.emit('liquidityRemoved', { walletAddress, withdrawal });

    return withdrawal;
  }

  // STAKING FUNCTIONS

  // Stake tokens
  async stakeTokens(walletAddress, poolId, amount, lockPeriod) {
    const pool = this.stakingPools.get(poolId);
    if (!pool) {
      throw new Error(`Staking pool ${poolId} not found`);
    }

    const stakeAmount = parseFloat(amount);
    
    if (stakeAmount < pool.minStake || stakeAmount > pool.maxStake) {
      throw new Error(`Stake amount must be between ${pool.minStake} and ${pool.maxStake} ${pool.currency}`);
    }

    if (!pool.lockPeriods[lockPeriod]) {
      throw new Error(`Invalid lock period: ${lockPeriod}`);
    }

    // Check user balance
    const balance = this.multiCurrency.getUserBalance(walletAddress, pool.currency);
    if (balance < stakeAmount) {
      throw new Error(`Insufficient ${pool.currency} balance`);
    }

    // Calculate unlock date
    const lockDays = parseInt(lockPeriod.replace('d', ''));
    const unlockDate = new Date();
    unlockDate.setDate(unlockDate.getDate() + lockDays);

    // Deduct tokens from user
    await this.multiCurrency.deductBalance(walletAddress, pool.currency, stakeAmount, 'staking');

    // Create stake
    const stakeId = `stake_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const stake = {
      id: stakeId,
      walletAddress,
      poolId,
      currency: pool.currency,
      amount: stakeAmount,
      lockPeriod,
      apy: pool.lockPeriods[lockPeriod].apy,
      multiplier: pool.lockPeriods[lockPeriod].multiplier,
      stakedAt: new Date(),
      unlockDate,
      rewardsEarned: 0,
      lastRewardCalculation: new Date(),
      isActive: true,
      autoCompound: false
    };

    // Update pool statistics
    pool.totalStaked += stakeAmount;
    if (!pool.stakes.has(walletAddress)) {
      pool.activeStakers++;
    }
    
    const userPoolStakes = pool.stakes.get(walletAddress) || [];
    userPoolStakes.push(stake);
    pool.stakes.set(walletAddress, userPoolStakes);

    // Update user stakes
    const userStakes = this.userStakes.get(walletAddress) || [];
    userStakes.push(stake);
    this.userStakes.set(walletAddress, userStakes);

    this.emit('tokensStaked', { walletAddress, stake });

    return stake;
  }

  // Unstake tokens
  async unstakeTokens(walletAddress, stakeId, forceUnstake = false) {
    const userStakes = this.userStakes.get(walletAddress) || [];
    const stakeIndex = userStakes.findIndex(s => s.id === stakeId);
    
    if (stakeIndex === -1) {
      throw new Error('Stake not found');
    }

    const stake = userStakes[stakeIndex];
    const pool = this.stakingPools.get(stake.poolId);
    
    if (!stake.isActive) {
      throw new Error('Stake is not active');
    }

    const now = new Date();
    let penaltyFee = 0;

    // Check if stake is still locked
    if (now < stake.unlockDate && !forceUnstake) {
      throw new Error(`Stake is locked until ${stake.unlockDate.toISOString()}`);
    }

    // Calculate penalty for early unstaking
    if (now < stake.unlockDate && forceUnstake) {
      penaltyFee = stake.amount * 0.1; // 10% penalty
    }

    // Calculate final rewards
    const finalRewards = this.calculateStakeRewards(stake, now);
    
    // Calculate final amount to return
    const finalAmount = stake.amount - penaltyFee;
    
    // Update pool statistics
    pool.totalStaked -= stake.amount;
    
    const userPoolStakes = pool.stakes.get(walletAddress) || [];
    const poolStakeIndex = userPoolStakes.findIndex(s => s.id === stakeId);
    if (poolStakeIndex !== -1) {
      userPoolStakes.splice(poolStakeIndex, 1);
      if (userPoolStakes.length === 0) {
        pool.stakes.delete(walletAddress);
        pool.activeStakers--;
      } else {
        pool.stakes.set(walletAddress, userPoolStakes);
      }
    }

    // Return principal and rewards to user
    if (finalAmount > 0) {
      await this.multiCurrency.addBalance(walletAddress, stake.currency, finalAmount, 'unstaking');
    }
    
    if (finalRewards > 0) {
      await this.multiCurrency.addBalance(walletAddress, stake.currency, finalRewards, 'staking_rewards');
    }

    // Mark stake as inactive
    stake.isActive = false;
    stake.unstakedAt = now;
    stake.finalRewards = finalRewards;
    stake.penaltyFee = penaltyFee;

    const unstaking = {
      stakeId,
      originalAmount: stake.amount,
      finalAmount,
      rewards: finalRewards,
      penalty: penaltyFee,
      wasEarlyUnstake: now < stake.unlockDate,
      timestamp: now
    };

    this.emit('tokensUnstaked', { walletAddress, unstaking });

    return unstaking;
  }

  // Calculate stake rewards
  calculateStakeRewards(stake, currentDate = new Date()) {
    if (!stake.isActive) return stake.rewardsEarned;

    const stakingDuration = Math.min(
      currentDate.getTime() - stake.lastRewardCalculation.getTime(),
      stake.unlockDate.getTime() - stake.stakedAt.getTime()
    );

    const stakingDays = stakingDuration / (1000 * 60 * 60 * 24);
    const yearlyRewards = (stake.amount * stake.apy) / 100;
    const newRewards = (yearlyRewards * stakingDays) / 365;

    return stake.rewardsEarned + newRewards * stake.multiplier;
  }

  // Auto-compound stake rewards
  async compoundStakeRewards(walletAddress, stakeId) {
    const userStakes = this.userStakes.get(walletAddress) || [];
    const stake = userStakes.find(s => s.id === stakeId);
    
    if (!stake || !stake.isActive) {
      throw new Error('Active stake not found');
    }

    const currentRewards = this.calculateStakeRewards(stake);
    const newRewards = currentRewards - stake.rewardsEarned;

    if (newRewards <= 0) {
      throw new Error('No rewards available for compounding');
    }

    // Add rewards to stake principal
    stake.amount += newRewards;
    stake.rewardsEarned = 0;
    stake.lastRewardCalculation = new Date();

    // Update pool total
    const pool = this.stakingPools.get(stake.poolId);
    pool.totalStaked += newRewards;

    this.emit('rewardsCompounded', {
      walletAddress,
      stakeId,
      compoundedAmount: newRewards,
      newPrincipal: stake.amount
    });

    return {
      stakeId,
      compoundedAmount: newRewards,
      newPrincipal: stake.amount,
      timestamp: new Date()
    };
  }

  // Start automated reward distribution
  startRewardDistribution() {
    setInterval(() => {
      this.distributeRewards();
    }, 60000); // Every minute
  }

  distributeRewards() {
    // Distribute liquidity pool fees
    this.liquidityPools.forEach((pool, poolId) => {
      const dailyFeeReward = pool.fees24h * 0.8; // 80% of fees to LPs
      if (dailyFeeReward > 0) {
        pool.providers.forEach((lpTokens, walletAddress) => {
          const userShare = lpTokens / pool.totalShares;
          const userReward = dailyFeeReward * userShare;
          
          if (userReward > 0.001) { // Minimum reward threshold
            // Add rewards in pool's base currency
            this.multiCurrency.addBalance(
              walletAddress, 
              pool.pair[0], 
              userReward, 
              'liquidity_rewards'
            );
          }
        });
        
        pool.fees24h = 0; // Reset daily fees
      }
    });

    // Update stake rewards (calculated on demand when accessed)
    this.emit('rewardsDistributed', { timestamp: new Date() });
  }

  // Get user's liquidity positions
  getUserLiquidityPositions(walletAddress) {
    const positions = this.userLiquidity.get(walletAddress) || [];
    
    return positions.map(position => {
      const pool = this.liquidityPools.get(position.poolId);
      const [currency0, currency1] = pool.pair;
      
      // Calculate current value
      const currentAmount0 = (position.lpTokens / pool.totalShares) * pool.reserves[currency0];
      const currentAmount1 = (position.lpTokens / pool.totalShares) * pool.reserves[currency1];
      
      const initialUSD = this.multiCurrency.convertToUSD(position.initialAmounts[currency0], currency0) +
                        this.multiCurrency.convertToUSD(position.initialAmounts[currency1], currency1);
      const currentUSD = this.multiCurrency.convertToUSD(currentAmount0, currency0) +
                        this.multiCurrency.convertToUSD(currentAmount1, currency1);
      
      return {
        ...position,
        currentAmounts: {
          [currency0]: currentAmount0,
          [currency1]: currentAmount1
        },
        currentUSDValue: currentUSD,
        initialUSDValue: initialUSD,
        impermanentLoss: ((currentUSD - initialUSD) / initialUSD * 100).toFixed(2),
        apy: pool.rewardAPY,
        pool: {
          id: pool.id,
          pair: pool.pair,
          totalValueLocked: pool.totalValueLocked
        }
      };
    });
  }

  // Get user's stakes
  getUserStakes(walletAddress) {
    const stakes = this.userStakes.get(walletAddress) || [];
    
    return stakes.map(stake => {
      const currentRewards = this.calculateStakeRewards(stake);
      const daysRemaining = stake.isActive ? 
        Math.max(0, Math.ceil((stake.unlockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0;
      
      return {
        ...stake,
        currentRewards,
        daysRemaining,
        totalValue: stake.amount + currentRewards,
        canUnstake: new Date() >= stake.unlockDate,
        roi: ((currentRewards / stake.amount) * 100).toFixed(2)
      };
    });
  }

  // Get all pool information
  getAllPools() {
    const liquidityPools = Array.from(this.liquidityPools.values()).map(pool => ({
      id: pool.id,
      type: 'liquidity',
      pair: pool.pair,
      fee: pool.fee,
      apy: pool.rewardAPY,
      totalValueLocked: this.multiCurrency.convertToUSD(pool.reserves[pool.pair[0]], pool.pair[0]) +
                       this.multiCurrency.convertToUSD(pool.reserves[pool.pair[1]], pool.pair[1]),
      volume24h: pool.volume24h,
      providers: pool.providers.size
    }));

    const stakingPools = Array.from(this.stakingPools.values()).map(pool => ({
      id: pool.id,
      type: 'staking',
      currency: pool.currency,
      minStake: pool.minStake,
      maxStake: pool.maxStake,
      lockPeriods: pool.lockPeriods,
      totalStaked: pool.totalStaked,
      totalValueLocked: this.multiCurrency.convertToUSD(pool.totalStaked, pool.currency),
      activeStakers: pool.activeStakers,
      bonusRewards: pool.bonusRewards || null
    }));

    return {
      liquidityPools,
      stakingPools,
      totalValueLocked: [...liquidityPools, ...stakingPools]
        .reduce((sum, pool) => sum + pool.totalValueLocked, 0)
    };
  }

  // Get system statistics
  getSystemStatistics() {
    const allPools = this.getAllPools();
    const totalUsers = new Set([
      ...this.userLiquidity.keys(),
      ...this.userStakes.keys()
    ]).size;

    return {
      totalValueLocked: allPools.totalValueLocked,
      totalUsers,
      liquidityPools: {
        count: allPools.liquidityPools.length,
        totalTVL: allPools.liquidityPools.reduce((sum, p) => sum + p.totalValueLocked, 0)
      },
      stakingPools: {
        count: allPools.stakingPools.length,
        totalTVL: allPools.stakingPools.reduce((sum, p) => sum + p.totalValueLocked, 0),
        totalStakers: allPools.stakingPools.reduce((sum, p) => sum + p.activeStakers, 0)
      },
      generatedAt: new Date().toISOString()
    };
  }
}

module.exports = LiquidityStakingSystem;