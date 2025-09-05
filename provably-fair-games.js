const crypto = require('crypto');

class ProvablyFairGames {
  constructor() {
    this.games = {};
  }

  // Generate provably fair hash
  generateHash(serverSeed, clientSeed, nonce) {
    return crypto.createHash('sha256')
      .update(`${serverSeed}:${clientSeed}:${nonce}`)
      .digest('hex');
  }

  // Convert hash to float between 0 and 1
  hashToFloat(hash, index = 0) {
    return parseInt(hash.substring(index * 8, (index + 1) * 8), 16) / 0xffffffff;
  }

  // Blackjack Game
  playBlackjack(bet) {
    const { amount, currency = 'ETH', clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Create deck and shuffle
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let deck = [];
    
    suits.forEach(suit => {
      ranks.forEach(rank => {
        deck.push({ rank, suit, value: this.getCardValue(rank) });
      });
    });

    // Shuffle deck using hash
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(this.hashToFloat(hash, i % 8) * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Deal initial cards
    const playerHand = [deck[0], deck[2]];
    const dealerHand = [deck[1], deck[3]];
    let cardIndex = 4;

    const result = {
      id: `blackjack_${Date.now()}`,
      game: 'blackjack',
      amount,
      currency,
      playerHand,
      dealerHand: [dealerHand[0]], // Only show first dealer card initially
      playerScore: this.calculateHandValue(playerHand),
      dealerScore: this.calculateHandValue([dealerHand[0]]),
      actions: ['hit', 'stand'],
      status: 'playing',
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        verified: true
      }
    };

    // Check for natural blackjack
    if (this.calculateHandValue(playerHand) === 21) {
      result.dealerHand = dealerHand;
      result.dealerScore = this.calculateHandValue(dealerHand);
      
      if (this.calculateHandValue(dealerHand) === 21) {
        result.outcome = 'push';
        result.winAmount = amount;
        result.multiplier = 1;
      } else {
        result.outcome = 'blackjack';
        result.winAmount = (parseFloat(amount) * 2.5).toFixed(8);
        result.multiplier = 2.5;
      }
      result.status = 'completed';
    }

    return result;
  }

  getCardValue(rank) {
    if (['J', 'Q', 'K'].includes(rank)) return 10;
    if (rank === 'A') return 11;
    return parseInt(rank);
  }

  calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    hand.forEach(card => {
      if (card.rank === 'A') {
        aces++;
        value += 11;
      } else {
        value += card.value;
      }
    });

    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    return value;
  }

  // Plinko Game
  playPlinko(bet) {
    const { amount, currency = 'ETH', risk = 'medium', rows = 16, clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Define multipliers based on risk level
    const multipliers = {
      low: [
        [1000, 130, 26, 9, 4, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 4, 9, 26, 130, 1000]
      ],
      medium: [
        [1000, 170, 43, 17, 8, 3, 1.5, 1, 0.7, 0.7, 0.7, 0.4, 0.7, 0.7, 0.7, 1, 1.5, 3, 8, 17, 43, 170, 1000]
      ],
      high: [
        [1000, 420, 110, 41, 10, 5, 1.5, 1, 0.5, 0.3, 0.5, 0.3, 0.3, 0.5, 0.3, 0.5, 1, 1.5, 5, 10, 41, 110, 420, 1000]
      ]
    };

    const gameMultipliers = multipliers[risk][0];
    let position = Math.floor(gameMultipliers.length / 2); // Start in middle

    // Simulate ball path
    const path = [];
    for (let i = 0; i < rows; i++) {
      const direction = this.hashToFloat(hash, i % 8) < 0.5 ? -1 : 1;
      position += direction * 0.5;
      path.push({
        row: i + 1,
        position: position,
        direction: direction === -1 ? 'left' : 'right'
      });
    }

    // Final position determines multiplier
    const finalIndex = Math.max(0, Math.min(gameMultipliers.length - 1, Math.floor(position)));
    const multiplier = gameMultipliers[finalIndex] || 0;
    const winAmount = (parseFloat(amount) * multiplier).toFixed(8);

    return {
      id: `plinko_${Date.now()}`,
      game: 'plinko',
      amount,
      currency,
      risk,
      rows,
      path,
      finalPosition: finalIndex,
      multiplier,
      winAmount,
      won: multiplier > 0,
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        verified: true
      }
    };
  }

  // Crash Game
  playCrash(bet) {
    const { amount, currency = 'ETH', target = 2.0, clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Generate crash point using hash
    const e = 2 ** 32;
    const h = parseInt(hash.substring(0, 8), 16);
    const crashPoint = Math.floor((100 * e - h) / (e - h)) / 100;

    const won = crashPoint >= target;
    const winAmount = won ? (parseFloat(amount) * target).toFixed(8) : '0';

    // Generate multiplier progression
    const progression = [];
    const steps = Math.min(Math.floor(crashPoint * 10), 100);
    
    for (let i = 1; i <= steps; i++) {
      const currentMultiplier = 1 + (i / 10);
      progression.push({
        time: i * 100, // milliseconds
        multiplier: parseFloat(currentMultiplier.toFixed(2))
      });
      
      if (currentMultiplier >= crashPoint) break;
    }

    return {
      id: `crash_${Date.now()}`,
      game: 'crash',
      amount,
      currency,
      target,
      crashPoint: parseFloat(crashPoint.toFixed(2)),
      progression,
      won,
      winAmount,
      multiplier: won ? target : 0,
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        verified: true
      }
    };
  }

  // Mines Game
  playMines(bet) {
    const { amount, currency = 'ETH', mines = 3, tiles = 25, clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Generate mine positions
    const minePositions = new Set();
    let hashIndex = 0;

    while (minePositions.size < mines && hashIndex < 8) {
      const position = Math.floor(this.hashToFloat(hash, hashIndex) * tiles);
      minePositions.add(position);
      hashIndex++;
    }

    // Calculate multipliers for each safe tile revealed
    const baseMultiplier = 1.01;
    const multipliers = [];
    for (let i = 1; i <= tiles - mines; i++) {
      const multiplier = Math.pow(tiles / (tiles - mines - i + 1), 0.99);
      multipliers.push(parseFloat(multiplier.toFixed(4)));
    }

    return {
      id: `mines_${Date.now()}`,
      game: 'mines',
      amount,
      currency,
      mines,
      tiles,
      minePositions: Array.from(minePositions),
      multipliers,
      revealedTiles: [],
      status: 'playing',
      currentMultiplier: 1,
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        minePositions: Array.from(minePositions), // For verification
        verified: true
      }
    };
  }

  // Wheel Game
  playWheel(bet) {
    const { amount, currency = 'ETH', risk = 'medium', segments = 50, clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Define segment multipliers based on risk
    const riskMultipliers = {
      low: { max: 9.9, distribution: [1.2, 1.2, 1.2, 1.5, 1.5, 1.8, 1.8, 2, 3, 9.9] },
      medium: { max: 19.8, distribution: [1.5, 1.5, 1.8, 1.8, 2, 2, 3, 5, 9.9, 19.8] },
      high: { max: 39.6, distribution: [1.8, 2, 2, 3, 3, 5, 9.9, 19.8, 29.7, 39.6] }
    };

    const { max, distribution } = riskMultipliers[risk];
    
    // Generate wheel segments
    const wheelSegments = [];
    const segmentSize = segments / distribution.length;
    
    distribution.forEach((multiplier, index) => {
      for (let i = 0; i < segmentSize; i++) {
        wheelSegments.push({
          id: wheelSegments.length,
          multiplier,
          color: this.getSegmentColor(multiplier, max)
        });
      }
    });

    // Determine winning segment
    const spinResult = this.hashToFloat(hash) * segments;
    const winningSegment = Math.floor(spinResult);
    const multiplier = wheelSegments[winningSegment].multiplier;
    const winAmount = (parseFloat(amount) * multiplier).toFixed(8);

    return {
      id: `wheel_${Date.now()}`,
      game: 'wheel',
      amount,
      currency,
      risk,
      segments,
      wheelSegments,
      spinResult: parseFloat(spinResult.toFixed(2)),
      winningSegment,
      multiplier,
      winAmount,
      won: multiplier > 1,
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        verified: true
      }
    };
  }

  getSegmentColor(multiplier, maxMultiplier) {
    const ratio = multiplier / maxMultiplier;
    if (ratio < 0.2) return 'green';
    if (ratio < 0.4) return 'blue';
    if (ratio < 0.6) return 'purple';
    if (ratio < 0.8) return 'orange';
    return 'red';
  }

  // Limbo Game
  playLimbo(bet) {
    const { amount, currency = 'ETH', target = 2.0, clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Generate result using 4 bytes of hash for higher precision
    const result = (parseInt(hash.substring(0, 8), 16) / 0xffffffff) * 1000000;
    const limboResult = Math.max(1.00, result / 10000);

    const won = limboResult >= target;
    const winAmount = won ? (parseFloat(amount) * target).toFixed(8) : '0';

    return {
      id: `limbo_${Date.now()}`,
      game: 'limbo',
      amount,
      currency,
      target,
      result: parseFloat(limboResult.toFixed(2)),
      won,
      winAmount,
      multiplier: won ? target : 0,
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        verified: true
      }
    };
  }

  // Hi-Lo Game
  playHiLo(bet) {
    const { amount, currency = 'ETH', clientSeed, nonce = Math.floor(Math.random() * 1000000) } = bet;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const hash = this.generateHash(serverSeed, clientSeed || crypto.randomBytes(16).toString('hex'), nonce);

    // Generate deck of cards
    const cards = [];
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = [
      { name: 'A', value: 1 }, { name: '2', value: 2 }, { name: '3', value: 3 },
      { name: '4', value: 4 }, { name: '5', value: 5 }, { name: '6', value: 6 },
      { name: '7', value: 7 }, { name: '8', value: 8 }, { name: '9', value: 9 },
      { name: '10', value: 10 }, { name: 'J', value: 11 }, 
      { name: 'Q', value: 12 }, { name: 'K', value: 13 }
    ];

    suits.forEach(suit => {
      ranks.forEach(rank => {
        cards.push({ ...rank, suit, display: `${rank.name}${suit}` });
      });
    });

    // Shuffle and get first card
    const cardIndex = Math.floor(this.hashToFloat(hash, 0) * cards.length);
    const currentCard = cards[cardIndex];

    // Calculate multipliers
    const higherCards = cards.filter(card => card.value > currentCard.value).length;
    const lowerCards = cards.filter(card => card.value < currentCard.value).length;
    const equalCards = cards.filter(card => card.value === currentCard.value).length - 1; // Exclude current card

    const higherMultiplier = higherCards > 0 ? (cards.length - 1) / higherCards * 0.95 : 0;
    const lowerMultiplier = lowerCards > 0 ? (cards.length - 1) / lowerCards * 0.95 : 0;

    return {
      id: `hilo_${Date.now()}`,
      game: 'hilo',
      amount,
      currency,
      currentCard,
      round: 1,
      score: 0,
      multipliers: {
        higher: parseFloat(higherMultiplier.toFixed(2)),
        lower: parseFloat(lowerMultiplier.toFixed(2))
      },
      cardsRemaining: {
        higher: higherCards,
        lower: lowerCards,
        equal: equalCards
      },
      status: 'playing',
      timestamp: new Date().toISOString(),
      provablyFair: {
        serverSeed,
        clientSeed: clientSeed || crypto.randomBytes(16).toString('hex'),
        nonce,
        hash,
        verified: true
      }
    };
  }

  // Verify game result
  verifyResult(gameResult) {
    const { serverSeed, clientSeed, nonce } = gameResult.provablyFair;
    const expectedHash = this.generateHash(serverSeed, clientSeed, nonce);
    
    return {
      verified: expectedHash === gameResult.provablyFair.hash,
      expectedHash,
      actualHash: gameResult.provablyFair.hash,
      serverSeed,
      clientSeed,
      nonce
    };
  }
}

module.exports = ProvablyFairGames;