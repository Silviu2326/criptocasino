import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface VIPGame {
  id: number
  title: string
  type: string
  minBet: string
  maxBet: string
  players: number
  jackpot: string
  status: 'active' | 'waiting' | 'exclusive'
  nextRound: string
  icon: string
  description: string
  exclusiveFeatures: string[]
}

interface VIPRoom {
  id: number
  name: string
  game: string
  players: number
  minEntry: string
  status: 'open' | 'playing' | 'full'
  host?: string
  prize: string
}

interface VIPStats {
  level: number
  totalWagered: string
  biggestWin: string
  exclusiveGames: number
  vipSince: string
  monthlyBonus: string
}

export default function VIPGamesPage() {
  const [activeTab, setActiveTab] = useState<'games' | 'rooms' | 'benefits'>('games')
  const [selectedGame, setSelectedGame] = useState<VIPGame | null>(null)
  const [vipStats] = useState<VIPStats>({
    level: 7,
    totalWagered: '847.5432',
    biggestWin: '125.7890',
    exclusiveGames: 234,
    vipSince: '2023-06-15',
    monthlyBonus: '5.0000'
  })

  // Mock VIP games data
  const vipGames: VIPGame[] = [
    {
      id: 1,
      title: "Diamond Crash",
      type: "Crash",
      minBet: "1.0000",
      maxBet: "100.0000",
      players: 47,
      jackpot: "500.0000",
      status: 'active',
      nextRound: '30s',
      icon: '💎',
      description: "Exclusive high-stakes crash game with 10x higher limits",
      exclusiveFeatures: ['No house edge', '500x max multiplier', 'Instant withdrawals', 'Private leaderboard']
    },
    {
      id: 2,
      title: "Platinum Dice",
      type: "Dice",
      minBet: "0.5000",
      maxBet: "50.0000",
      players: 23,
      jackpot: "250.0000",
      status: 'active',
      nextRound: 'Live',
      icon: '🎲',
      description: "Premium dice game with enhanced odds and exclusive bonuses",
      exclusiveFeatures: ['99.5% RTP', 'Bonus multipliers', 'VIP-only jackpot', 'Custom bet strategies']
    },
    {
      id: 3,
      title: "Royal Roulette",
      type: "Roulette",
      minBet: "2.0000",
      maxBet: "200.0000",
      players: 89,
      jackpot: "1000.0000",
      status: 'exclusive',
      nextRound: '2m',
      icon: '👑',
      description: "The most exclusive roulette table with royal rewards",
      exclusiveFeatures: ['Zero house edge', 'Progressive jackpot', 'VIP chat room', 'Special betting options']
    },
    {
      id: 4,
      title: "Elite Poker",
      type: "Poker",
      minBet: "5.0000",
      maxBet: "500.0000",
      players: 6,
      jackpot: "2500.0000",
      status: 'waiting',
      nextRound: '5m',
      icon: '♠️',
      description: "High-stakes poker room for VIP players only",
      exclusiveFeatures: ['No rake', 'Tournament entry', 'Private tables', 'Pro dealers']
    },
    {
      id: 5,
      title: "Whale Baccarat",
      type: "Baccarat",
      minBet: "10.0000",
      maxBet: "1000.0000",
      players: 12,
      jackpot: "5000.0000",
      status: 'active',
      nextRound: 'Live',
      icon: '🐋',
      description: "Ultra high-roller baccarat for the biggest players",
      exclusiveFeatures: ['No limits mode', 'Side bets', 'VIP concierge', 'Rebate program']
    }
  ]

  const vipRooms: VIPRoom[] = [
    {
      id: 1,
      name: "Diamond Lounge",
      game: "Mixed Games",
      players: 8,
      minEntry: "10.0000",
      status: 'open',
      host: "CryptoWhale",
      prize: "100.0000"
    },
    {
      id: 2,
      name: "Platinum Suite",
      game: "Crash Tournament",
      players: 15,
      minEntry: "5.0000",
      status: 'playing',
      prize: "75.0000"
    },
    {
      id: 3,
      name: "Royal Chamber",
      game: "Poker Night",
      players: 6,
      minEntry: "25.0000",
      status: 'full',
      host: "HighRoller99",
      prize: "300.0000"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-500 to-emerald-600'
      case 'waiting': return 'bg-gradient-to-r from-yellow-500 to-orange-600'
      case 'exclusive': return 'bg-gradient-to-r from-purple-500 to-pink-600'
      case 'open': return 'bg-gradient-to-r from-blue-500 to-cyan-600'
      case 'playing': return 'bg-gradient-to-r from-red-500 to-pink-600'
      case 'full': return 'bg-gradient-to-r from-gray-500 to-gray-600'
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const calculateVIPProgress = () => {
    const currentLevel = vipStats.level
    const nextLevelRequirement = (currentLevel + 1) * 100 // 100 BTC per level
    const currentWagered = parseFloat(vipStats.totalWagered)
    const progress = (currentWagered % 100) // Progress within current level
    return (progress / 100) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">
      {/* Animated premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold-900/10 via-purple-900/10 to-gold-900/10 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-gold-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '10s'}}></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s', animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/3 to-purple-600/3 rounded-full blur-3xl animate-spin-slow"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Home
          </Link>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 via-gold-500 to-yellow-500 rounded-3xl mb-6 shadow-2xl animate-pulse">
            <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.86-2h8.28l.5-3-2.64-2.14L12 14l-2-5.14L7.36 11l.5 3zM19 19c0 1-1 2-2 2H7c-1 0-2-1-2-2h14z"/>
            </svg>
          </div>
          
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-gold-500 to-yellow-400 bg-clip-text text-transparent animate-shimmer">VIP LOUNGE</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Exclusive high-stakes games for our <span className="font-semibold text-yellow-400">most valued players</span>. No limits, maximum rewards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main VIP Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* VIP Status Dashboard */}
            <div className="bg-gradient-to-br from-purple-900/30 to-gold-900/30 backdrop-blur-xl rounded-3xl p-8 border border-gold-400/30 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <svg className="w-8 h-8 mr-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                  VIP Level {vipStats.level} - Diamond Elite
                </h2>
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-gold-600 text-black font-bold rounded-full">
                  LIFETIME MEMBER
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-yellow-400 mb-2">{vipStats.totalWagered}</div>
                  <div className="text-sm text-gray-400">Total Wagered (BTC)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400 mb-2">{vipStats.biggestWin}</div>
                  <div className="text-sm text-gray-400">Biggest Win (BTC)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400 mb-2">{vipStats.exclusiveGames}</div>
                  <div className="text-sm text-gray-400">VIP Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">{vipStats.monthlyBonus}</div>
                  <div className="text-sm text-gray-400">Monthly Bonus (BTC)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-pink-400 mb-2">15%</div>
                  <div className="text-sm text-gray-400">Cashback Rate</div>
                </div>
              </div>

              {/* VIP Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress to Level {vipStats.level + 1}</span>
                  <span className="text-yellow-400 font-bold">{calculateVIPProgress().toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 via-gold-500 to-yellow-400 h-3 rounded-full transition-all duration-1000 animate-shimmer"
                    style={{ width: `${calculateVIPProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* VIP Content Tabs */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gold-400/20 shadow-2xl">
              <div className="flex flex-wrap justify-center mb-8 bg-gray-800/30 rounded-2xl p-2">
                {(['games', 'rooms', 'benefits'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex-1 min-w-32
                      ${activeTab === tab 
                        ? 'bg-gradient-to-r from-yellow-500 to-gold-600 text-black shadow-lg transform scale-105' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {tab === 'games' ? '👑 VIP Games' : 
                     tab === 'rooms' ? '🏆 Private Rooms' : 
                     '💎 Benefits'}
                  </button>
                ))}
              </div>

              {/* VIP Games Tab */}
              {activeTab === 'games' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {vipGames.map((game) => (
                    <div
                      key={game.id}
                      className="relative group bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-lg rounded-2xl p-6 border border-gold-600/20 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20"
                      onClick={() => setSelectedGame(game)}
                    >
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(game.status)} text-white`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${game.status === 'active' ? 'animate-pulse bg-white' : 'bg-white/70'}`}></div>
                        {game.status.toUpperCase()}
                      </div>

                      <div className="flex items-center space-x-4 mb-4">
                        <div className="text-5xl">{game.icon}</div>
                        <div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                            {game.title}
                          </h3>
                          <div className="text-sm text-gray-400">{game.type} • {game.players} players</div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-6 leading-relaxed">{game.description}</p>

                      <div className="space-y-3">
                        {/* Jackpot */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Current Jackpot:</span>
                          <span className="text-yellow-400 font-bold text-xl animate-pulse">{game.jackpot} BTC</span>
                        </div>

                        {/* Betting Range */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Bet Range:</span>
                          <span className="text-white font-semibold">
                            {game.minBet} - {game.maxBet} BTC
                          </span>
                        </div>

                        {/* Next Round */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Next Round:</span>
                          <span className={`font-bold ${
                            game.nextRound === 'Live' ? 'text-green-400 animate-pulse' : 'text-blue-400'
                          }`}>
                            {game.nextRound}
                          </span>
                        </div>

                        {/* Exclusive Features */}
                        <div className="pt-3 border-t border-gray-700">
                          <div className="text-xs text-gray-400 mb-2">EXCLUSIVE FEATURES:</div>
                          <div className="flex flex-wrap gap-2">
                            {game.exclusiveFeatures.slice(0, 2).map((feature, index) => (
                              <span key={index} className="px-2 py-1 bg-gold-900/30 text-yellow-400 rounded text-xs font-semibold">
                                {feature}
                              </span>
                            ))}
                            {game.exclusiveFeatures.length > 2 && (
                              <span className="px-2 py-1 bg-gray-700/30 text-gray-400 rounded text-xs">
                                +{game.exclusiveFeatures.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <button className="w-full mt-6 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-gold-600 text-black font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30">
                        PLAY NOW
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Private Rooms Tab */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  {vipRooms.map((room) => (
                    <div key={room.id} className="bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-lg rounded-2xl p-6 border border-gold-600/20 hover:border-yellow-400/30 transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1">{room.name}</h3>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-400">Game: <span className="text-yellow-400 font-semibold">{room.game}</span></span>
                            {room.host && <span className="text-gray-400">Host: <span className="text-purple-400 font-semibold">{room.host}</span></span>}
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-bold ${getStatusBadge(room.status)} text-white`}>
                          {room.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">{room.players}</div>
                          <div className="text-xs text-gray-400">Players</div>
                        </div>
                        <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-400">{room.minEntry}</div>
                          <div className="text-xs text-gray-400">Min Entry (BTC)</div>
                        </div>
                        <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">{room.prize}</div>
                          <div className="text-xs text-gray-400">Prize Pool (BTC)</div>
                        </div>
                      </div>

                      {room.status === 'open' && (
                        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105">
                          JOIN ROOM
                        </button>
                      )}
                      {room.status === 'playing' && (
                        <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-400 hover:to-pink-500 transition-all duration-300 transform hover:scale-105">
                          SPECTATE
                        </button>
                      )}
                      {room.status === 'full' && (
                        <div className="w-full py-3 bg-gray-600 text-gray-300 font-bold rounded-xl text-center">
                          ROOM FULL
                        </div>
                      )}
                    </div>
                  ))}

                  <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-gold-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105">
                    CREATE PRIVATE ROOM
                  </button>
                </div>
              )}

              {/* Benefits Tab */}
              {activeTab === 'benefits' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-lg rounded-2xl p-6 border border-gold-600/20">
                      <div className="text-3xl mb-4">💰</div>
                      <h3 className="text-xl font-bold text-white mb-3">Increased Limits</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Max bet: 1000 BTC
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          No withdrawal limits
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Instant processing
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-lg rounded-2xl p-6 border border-gold-600/20">
                      <div className="text-3xl mb-4">🎁</div>
                      <h3 className="text-xl font-bold text-white mb-3">Exclusive Bonuses</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          15% cashback daily
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Monthly bonus: 5 BTC
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Birthday surprise gifts
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-lg rounded-2xl p-6 border border-gold-600/20">
                      <div className="text-3xl mb-4">⚡</div>
                      <h3 className="text-xl font-bold text-white mb-3">Priority Service</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          24/7 VIP support
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Personal account manager
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Direct phone line
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900/20 to-gold-900/20 backdrop-blur-lg rounded-2xl p-6 border border-gold-600/20">
                      <div className="text-3xl mb-4">🏆</div>
                      <h3 className="text-xl font-bold text-white mb-3">Special Access</h3>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          VIP-only tournaments
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Early game releases
                        </li>
                        <li className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Exclusive NFT drops
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/30 to-gold-900/30 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/30 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">🎉 Special VIP Events</h3>
                    <p className="text-gray-300 mb-6">Join exclusive real-world events, luxury trips, and meet-ups with other VIP members!</p>
                    <button className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-gold-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-gold-500 transition-all duration-300 transform hover:scale-105">
                      VIEW UPCOMING EVENTS
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* VIP Host Card */}
            <div className="bg-gradient-to-br from-yellow-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-6 border border-yellow-400/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-500 to-gold-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your VIP Host</h3>
                <div className="text-yellow-400 font-bold text-lg mb-1">Sarah Martinez</div>
                <div className="text-sm text-gray-400 mb-4">Available 24/7</div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Call Now
                </button>
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"/>
                  </svg>
                  Live Chat
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.293a1 1 0 00-1.414 0L10 10.586 8.707 9.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 11.414l1.293 1.293a1 1 0 001.414 0l4-4a1 1 0 000-1.414z" clipRule="evenodd"/>
                </svg>
                Today's Stats
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Games Played:</span>
                  <span className="text-white font-bold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Wagered:</span>
                  <span className="text-yellow-400 font-bold">23.4567 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit/Loss:</span>
                  <span className="text-green-400 font-bold">+5.7890 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cashback Earned:</span>
                  <span className="text-purple-400 font-bold">3.5185 BTC</span>
                </div>
              </div>
            </div>

            {/* VIP Rewards */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Available Rewards
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Weekly Reload</span>
                    <span className="text-green-400 text-xs font-bold">READY</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded hover:from-purple-400 hover:to-pink-500 transition-all duration-300 text-sm">
                    Claim 10 BTC
                  </button>
                </div>

                <div className="p-3 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Loss Recovery</span>
                    <span className="text-yellow-400 text-xs font-bold">2.5 BTC</span>
                  </div>
                  <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 text-sm">
                    Activate
                  </button>
                </div>

                <div className="p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">Birthday Bonus</span>
                    <span className="text-gray-400 text-xs">In 45 days</span>
                  </div>
                  <div className="w-full py-2 bg-gray-600 text-gray-300 font-bold rounded text-center text-sm">
                    Coming Soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Detail Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-purple-900/95 to-gold-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-400/30">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{selectedGame.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedGame.title}</h2>
                  <div className="text-lg text-gray-300">{selectedGame.type} • VIP Exclusive</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedGame(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed text-lg">{selectedGame.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-yellow-900/30 to-gold-900/30 rounded-xl">
                <div className="text-3xl font-bold text-yellow-400 mb-1 animate-pulse">{selectedGame.jackpot}</div>
                <div className="text-sm text-gray-400">Current Jackpot (BTC)</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl">
                <div className="text-3xl font-bold text-purple-400 mb-1">{selectedGame.players}</div>
                <div className="text-sm text-gray-400">Players Online</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Exclusive VIP Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedGame.exclusiveFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-800/30 rounded-lg">
                    <svg className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-gold-600 text-black font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30">
                PLAY NOW - {selectedGame.minBet} BTC MIN
              </button>
              <button
                onClick={() => setSelectedGame(null)}
                className="px-6 py-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}