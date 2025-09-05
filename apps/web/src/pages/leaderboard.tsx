import React, { useState } from 'react'
import Layout from '../components/Layout'

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('daily')
  const [gameFilter, setGameFilter] = useState('all')

  // Mock data for leaderboard
  const leaderboardData = [
    { rank: 1, player: '0xAB5...3E2', game: 'Dice', wagered: '12.5 BTC', profit: '+3.2 BTC', winRate: '68%', avatarColor: 'from-orange-500 to-red-500' },
    { rank: 2, player: '0x7C9...1D4', game: 'Crash', wagered: '8.3 BTC', profit: '+2.8 BTC', winRate: '71%', avatarColor: 'from-blue-500 to-purple-500' },
    { rank: 3, player: '0x2F4...8A9', game: 'Coinflip', wagered: '15.2 BTC', profit: '+2.1 BTC', winRate: '55%', avatarColor: 'from-green-500 to-teal-500' },
    { rank: 4, player: '0x9E1...5B7', game: 'Dice', wagered: '6.7 BTC', profit: '+1.9 BTC', winRate: '62%', avatarColor: 'from-purple-500 to-pink-500' },
    { rank: 5, player: '0x4D8...2C6', game: 'Crash', wagered: '9.1 BTC', profit: '+1.5 BTC', winRate: '59%', avatarColor: 'from-yellow-500 to-orange-500' },
    { rank: 6, player: '0x8A2...7F3', game: 'Coinflip', wagered: '4.5 BTC', profit: '+1.2 BTC', winRate: '52%', avatarColor: 'from-cyan-500 to-blue-500' },
    { rank: 7, player: '0x6B5...9E1', game: 'Dice', wagered: '7.8 BTC', profit: '+0.9 BTC', winRate: '48%', avatarColor: 'from-pink-500 to-rose-500' },
    { rank: 8, player: '0x3C7...4D8', game: 'Crash', wagered: '5.2 BTC', profit: '+0.7 BTC', winRate: '45%', avatarColor: 'from-indigo-500 to-purple-500' },
    { rank: 9, player: '0x1F9...6A5', game: 'Coinflip', wagered: '3.9 BTC', profit: '+0.5 BTC', winRate: '51%', avatarColor: 'from-emerald-500 to-green-500' },
    { rank: 10, player: '0x5E3...8B2', game: 'Dice', wagered: '2.1 BTC', profit: '+0.3 BTC', winRate: '47%', avatarColor: 'from-gray-500 to-gray-600' },
  ]

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-slate-400 text-black'
      case 3:
        return 'bg-gradient-to-r from-orange-600 to-amber-700 text-white'
      default:
        return 'bg-gray-800 text-gray-300'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm2.86-2h8.28l.5-3.02l-2.63-2.3L12 6l-2.01 2.68l-2.63 2.3L7.86 14zM19 19c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2h14z"/>
          </svg>
        )
      case 2:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="12" cy="12" r="5"/>
          </svg>
        )
      case 3:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )
      default:
        return `#${rank}`
    }
  }

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6 shadow-2xl animate-float">
              <svg className="w-14 h-14 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                LEADERBOARD
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Compete with players worldwide and climb to the top for exclusive rewards
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="glass rounded-2xl p-6 text-center backdrop-blur-xl border border-gray-700/50">
              <div className="text-3xl font-black text-yellow-400 mb-2">$50M+</div>
              <div className="text-gray-400 text-sm">Total Wagered</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center backdrop-blur-xl border border-gray-700/50">
              <div className="text-3xl font-black text-green-400 mb-2">12,847</div>
              <div className="text-gray-400 text-sm">Active Players</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center backdrop-blur-xl border border-gray-700/50">
              <div className="text-3xl font-black text-blue-400 mb-2">$125K</div>
              <div className="text-gray-400 text-sm">Today's Prizes</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center backdrop-blur-xl border border-gray-700/50">
              <div className="text-3xl font-black text-purple-400 mb-2">24h</div>
              <div className="text-gray-400 text-sm">Next Reset</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
            {/* Time Filter */}
            <div className="flex space-x-2">
              {['daily', 'weekly', 'monthly', 'all-time'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    timeFilter === filter
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                      : 'glass hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Game Filter */}
            <div className="flex space-x-2">
              {['all', 'dice', 'crash', 'coinflip'].map((game) => (
                <button
                  key={game}
                  onClick={() => setGameFilter(game)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    gameFilter === game
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'glass hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {game === 'all' ? 'All Games' : game.charAt(0).toUpperCase() + game.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="glass rounded-3xl backdrop-blur-xl border border-gray-700/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 p-6 border-b border-gray-700/50 bg-black/30">
              <div className="text-gray-400 font-semibold">Rank</div>
              <div className="col-span-2 text-gray-400 font-semibold">Player</div>
              <div className="text-gray-400 font-semibold">Game</div>
              <div className="text-gray-400 font-semibold text-right">Wagered</div>
              <div className="text-gray-400 font-semibold text-right">Profit</div>
              <div className="text-gray-400 font-semibold text-right">Win Rate</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-700/30">
              {leaderboardData.map((player, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-7 gap-4 p-6 hover:bg-white/5 transition-all duration-300 group ${
                    player.rank <= 3 ? 'relative overflow-hidden' : ''
                  }`}
                >
                  {/* Special effect for top 3 */}
                  {player.rank <= 3 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}

                  {/* Rank */}
                  <div className="relative">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold ${getRankStyle(player.rank)}`}>
                      {getRankIcon(player.rank)}
                    </div>
                  </div>

                  {/* Player */}
                  <div className="col-span-2 flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${player.avatarColor} flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-yellow-400 transition-colors duration-200">
                        {player.player}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        {player.rank <= 3 ? (
                          <>
                            <svg className="w-3 h-3 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.48 12.35c-.04-.48-.39-.84-.85-.97l-3.36-.96-.87-3.24c-.16-.59-.63-.99-1.24-.94-.27.02-.52.12-.72.31l-5.02 4.73c-.26.24-.4.58-.38.93.02.29.15.55.37.73l2.88 2.37-.7 2.81c-.13.52.09 1.06.53 1.34.19.12.4.18.61.18.27 0 .54-.1.75-.29l5.03-4.73c.26-.24.4-.58.38-.93z"/>
                            </svg>
                            <span>Hot Streak</span>
                          </>
                        ) : (
                          <span>Regular Player</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Game */}
                  <div className="flex items-center">
                    <span className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 font-medium">
                      {player.game}
                    </span>
                  </div>

                  {/* Wagered */}
                  <div className="flex items-center justify-end">
                    <span className="font-semibold text-white">{player.wagered}</span>
                  </div>

                  {/* Profit */}
                  <div className="flex items-center justify-end">
                    <span className={`font-bold ${
                      player.profit.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {player.profit}
                    </span>
                  </div>

                  {/* Win Rate */}
                  <div className="flex items-center justify-end">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: player.winRate }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-300">{player.winRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prize Pool Section */}
          <div className="mt-12 glass rounded-3xl p-8 backdrop-blur-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <div className="text-center">
              <h2 className="text-3xl font-black mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  TODAY'S PRIZE POOL
                </span>
              </h2>
              <div className="text-5xl font-black text-yellow-400 mb-6">$125,000</div>
              
              {/* Prize Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex justify-center mb-3">
                    <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6 2.3-7.4-6-4.6h7.6z"/>
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-yellow-400 mb-2">$50,000</div>
                  <div className="text-gray-400 text-sm">1st Place</div>
                </div>
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex justify-center mb-3">
                    <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6 2.3-7.4-6-4.6h7.6z"/>
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-300 mb-2">$30,000</div>
                  <div className="text-gray-400 text-sm">2nd Place</div>
                </div>
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex justify-center mb-3">
                    <svg className="w-12 h-12 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6 2.3-7.4-6-4.6h7.6z"/>
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-orange-400 mb-2">$20,000</div>
                  <div className="text-gray-400 text-sm">3rd Place</div>
                </div>
              </div>

              {/* Additional Prizes */}
              <div className="mt-6 text-gray-400">
                <p className="text-sm">Places 4-10: Share $25,000</p>
                <p className="text-xs mt-2 flex items-center justify-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  <span>Prizes reset daily at 00:00 UTC</span>
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-6">Ready to compete for the top spot?</p>
            <button className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black py-4 px-10 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
              <span className="relative z-10 flex items-center space-x-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                </svg>
                <span>Start Playing Now</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}