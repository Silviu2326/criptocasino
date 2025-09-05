import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Tournament {
  id: number
  title: string
  game: string
  prize: string
  participants: number
  maxParticipants: number
  startDate: string
  endDate: string
  status: 'upcoming' | 'active' | 'finished'
  entryFee: string
  type: 'daily' | 'weekly' | 'special'
  description: string
  leaderboard?: { rank: number; user: string; score: number; prize: string }[]
}

interface PlayerStats {
  totalWinnings: string
  tournamentWins: number
  currentRank: number
  participatedTournaments: number
}

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'finished'>('active')
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [playerStats] = useState<PlayerStats>({
    totalWinnings: '2.4567',
    tournamentWins: 12,
    currentRank: 47,
    participatedTournaments: 34
  })

  // Mock tournament data
  const tournaments: Tournament[] = [
    {
      id: 1,
      title: "Weekly Crash Championship",
      game: "Crash",
      prize: "50.0000 BTC",
      participants: 1247,
      maxParticipants: 2000,
      startDate: "2024-01-15T09:00:00Z",
      endDate: "2024-01-22T23:59:59Z",
      status: 'active',
      entryFee: "0.001 BTC",
      type: 'weekly',
      description: "Compete for the highest multiplier in our weekly Crash tournament!",
      leaderboard: [
        { rank: 1, user: "CryptoKing", score: 127.45, prize: "25.0000 BTC" },
        { rank: 2, user: "RocketRider", score: 98.32, prize: "12.5000 BTC" },
        { rank: 3, user: "MoonShot", score: 87.91, prize: "7.5000 BTC" }
      ]
    },
    {
      id: 2,
      title: "Dice Masters Daily",
      game: "Dice",
      prize: "10.0000 BTC",
      participants: 456,
      maxParticipants: 1000,
      startDate: "2024-01-16T00:00:00Z",
      endDate: "2024-01-16T23:59:59Z",
      status: 'active',
      entryFee: "0.0005 BTC",
      type: 'daily',
      description: "Daily dice competition with instant payouts!"
    },
    {
      id: 3,
      title: "Mega Coinflip Championship",
      game: "Coinflip",
      prize: "100.0000 BTC",
      participants: 0,
      maxParticipants: 5000,
      startDate: "2024-02-01T12:00:00Z",
      endDate: "2024-02-15T23:59:59Z",
      status: 'upcoming',
      entryFee: "0.01 BTC",
      type: 'special',
      description: "The biggest coinflip tournament of the year! Special NFT rewards included."
    },
    {
      id: 4,
      title: "New Year Bash",
      game: "Mixed",
      prize: "25.0000 BTC",
      participants: 892,
      maxParticipants: 1500,
      startDate: "2024-01-01T00:00:00Z",
      endDate: "2024-01-07T23:59:59Z",
      status: 'finished',
      entryFee: "0.002 BTC",
      type: 'special',
      description: "Multi-game tournament celebrating the New Year!"
    }
  ]

  const filteredTournaments = tournaments.filter(t => t.status === activeTab)

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const diff = end - now

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'from-green-500 to-emerald-600'
      case 'upcoming': return 'from-blue-500 to-cyan-600'
      case 'finished': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getGameIcon = (game: string) => {
    switch (game.toLowerCase()) {
      case 'crash': return '🚀'
      case 'dice': return '🎲'
      case 'coinflip': return '🪙'
      case 'mixed': return '🎯'
      default: return '🎮'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-blue-900/10 to-cyan-900/10 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-blue-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/5 to-cyan-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Home
          </Link>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl mb-6 shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              <path d="M12 6L13 10L16 11L13 12L12 16L11 12L8 11L11 10L12 6Z"/>
            </svg>
          </div>
          
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent">TOURNAMENTS</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Compete with players worldwide in our <span className="font-semibold text-blue-400">epic tournaments</span> and win massive prizes!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Tournament Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Player Stats Dashboard */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                </svg>
                Your Tournament Stats
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400 mb-2">{playerStats.totalWinnings}</div>
                  <div className="text-sm text-gray-400">Total Winnings (BTC)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-yellow-400 mb-2">{playerStats.tournamentWins}</div>
                  <div className="text-sm text-gray-400">Tournament Wins</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-400 mb-2">#{playerStats.currentRank}</div>
                  <div className="text-sm text-gray-400">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400 mb-2">{playerStats.participatedTournaments}</div>
                  <div className="text-sm text-gray-400">Tournaments Played</div>
                </div>
              </div>
            </div>

            {/* Tournament Tabs */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="flex flex-wrap justify-center mb-8 bg-gray-800/30 rounded-2xl p-2">
                {(['active', 'upcoming', 'finished'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 flex-1 min-w-32
                      ${activeTab === tab 
                        ? `bg-gradient-to-r ${getStatusColor(tab)} text-white shadow-lg transform scale-105` 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className="ml-2 text-sm">
                      ({tournaments.filter(t => t.status === tab).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Tournament Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="relative group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/30 hover:border-purple-400/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/20"
                    onClick={() => setSelectedTournament(tournament)}
                  >
                    {/* Tournament Type Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                      tournament.type === 'special' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' :
                      tournament.type === 'weekly' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                      'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                      {tournament.type.toUpperCase()}
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${getStatusColor(tournament.status)} text-white`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${tournament.status === 'active' ? 'animate-pulse bg-white' : 'bg-white/70'}`}></div>
                      {tournament.status.toUpperCase()}
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-3xl">{getGameIcon(tournament.game)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                          {tournament.title}
                        </h3>
                        <div className="text-sm text-gray-400">{tournament.game} Tournament</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">{tournament.description}</p>

                    <div className="space-y-4">
                      {/* Prize Pool */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Prize Pool:</span>
                        <span className="text-yellow-400 font-bold text-lg">{tournament.prize}</span>
                      </div>

                      {/* Participants */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Participants:</span>
                        <span className="text-white font-semibold">
                          {tournament.participants.toLocaleString()} / {tournament.maxParticipants.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                        ></div>
                      </div>

                      {/* Entry Fee */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Entry Fee:</span>
                        <span className="text-blue-400 font-semibold">{tournament.entryFee}</span>
                      </div>

                      {/* Time Remaining */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">
                          {tournament.status === 'active' ? 'Ends in:' : 
                           tournament.status === 'upcoming' ? 'Starts in:' : 'Ended:'}
                        </span>
                        <span className={`font-bold ${
                          tournament.status === 'active' ? 'text-red-400' :
                          tournament.status === 'upcoming' ? 'text-green-400' :
                          'text-gray-400'
                        }`}>
                          {getTimeRemaining(tournament.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Join Button */}
                    {tournament.status !== 'finished' && (
                      <button className={`
                        w-full mt-6 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                        ${tournament.status === 'active' 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-400/30' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-blue-400/30'
                        }
                      `}>
                        {tournament.status === 'active' ? 'Join Tournament' : 'Register Now'}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {filteredTournaments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏆</div>
                  <div className="text-xl text-gray-400 mb-2">No {activeTab} tournaments</div>
                  <div className="text-gray-500">Check back soon for new tournaments!</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Tournament */}
            <div className="bg-gradient-to-br from-purple-800/80 to-blue-900/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-xl font-bold text-white mb-2">Featured Tournament</h3>
                <div className="text-yellow-400 font-bold text-2xl">100.0000 BTC</div>
                <div className="text-sm text-gray-300">Mega Prize Pool</div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Game:</span>
                  <span className="text-white font-semibold">Multi-Game</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white font-semibold">2 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Fee:</span>
                  <span className="text-blue-400 font-semibold">0.01 BTC</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 transform hover:scale-105">
                Join Featured Tournament
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link 
                  href="/leaderboard" 
                  className="w-full flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-400">🏆</span>
                    <span className="text-white group-hover:text-yellow-400 transition-colors">Global Leaderboard</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-yellow-400 transform group-hover:translate-x-1 transition-all duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </Link>

                <Link 
                  href="/games" 
                  className="w-full flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-400">🎮</span>
                    <span className="text-white group-hover:text-blue-400 transition-colors">Practice Games</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenoRule"/>
                  </svg>
                </Link>

                <button className="w-full flex items-center justify-between p-3 bg-gray-800/30 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 group">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">📊</span>
                    <span className="text-white group-hover:text-green-400 transition-colors">Tournament History</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-green-400 transform group-hover:translate-x-1 transition-all duration-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenRule"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Tournament Schedule */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Upcoming Schedule
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">Daily Dice</div>
                    <div className="text-gray-400">Every day at 12:00 UTC</div>
                  </div>
                  <div className="text-blue-400 font-bold">10 BTC</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">Weekly Crash</div>
                    <div className="text-gray-400">Every Monday at 15:00 UTC</div>
                  </div>
                  <div className="text-purple-400 font-bold">50 BTC</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                  <div>
                    <div className="text-white font-semibold">Monthly Special</div>
                    <div className="text-gray-400">1st of each month</div>
                  </div>
                  <div className="text-yellow-400 font-bold">200 BTC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Detail Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-400/30">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{selectedTournament.title}</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getGameIcon(selectedTournament.game)}</span>
                  <span className="text-lg text-gray-300">{selectedTournament.game} Tournament</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTournament(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">{selectedTournament.description}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                <div className="text-2xl font-bold text-yellow-400 mb-1">{selectedTournament.prize}</div>
                <div className="text-sm text-gray-400">Prize Pool</div>
              </div>
              <div className="text-center p-4 bg-gray-800/30 rounded-xl">
                <div className="text-2xl font-bold text-blue-400 mb-1">{selectedTournament.entryFee}</div>
                <div className="text-sm text-gray-400">Entry Fee</div>
              </div>
            </div>

            {selectedTournament.leaderboard && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">Current Leaderboard</h3>
                <div className="space-y-2">
                  {selectedTournament.leaderboard.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1 ? 'bg-yellow-500 text-black' :
                          entry.rank === 2 ? 'bg-gray-400 text-black' :
                          entry.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {entry.rank}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{entry.user}</div>
                          <div className="text-gray-400 text-sm">Score: {entry.score}</div>
                        </div>
                      </div>
                      <div className="text-green-400 font-bold">{entry.prize}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              {selectedTournament.status !== 'finished' && (
                <button className={`
                  flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105
                  ${selectedTournament.status === 'active' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-green-400/30' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:shadow-blue-400/30'
                  }
                `}>
                  {selectedTournament.status === 'active' ? 'Join Tournament' : 'Register Now'}
                </button>
              )}
              <button
                onClick={() => setSelectedTournament(null)}
                className="px-6 py-4 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-xl transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}