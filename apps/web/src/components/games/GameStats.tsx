'use client'

import { motion } from 'framer-motion'

interface GameStatsProps {
  stats: {
    totalBets: number
    totalWon: number
    biggestWin: string
    winRate: string
  }
}

export function GameStats({ stats }: GameStatsProps) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Bets:</span>
          <span className="text-white font-semibold">{stats.totalBets.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Total Won:</span>
          <span className="text-casino-success font-semibold">{stats.totalWon.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Biggest Win:</span>
          <span className="text-casino-accent font-semibold">{stats.biggestWin}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Win Rate:</span>
          <span className="text-white font-semibold">{stats.winRate}</span>
        </div>
      </div>

      {/* Win Rate Visual */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Win Rate</span>
          <span>{stats.winRate}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-casino-success to-casino-accent h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: stats.winRate }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Profit/Loss */}
      <div className="mt-6 p-4 bg-casino-card/50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Total P&L</div>
          <div className="text-2xl font-bold text-casino-success">
            +2.34 BTC
          </div>
          <div className="text-xs text-gray-500 mt-1">
            All time
          </div>
        </div>
      </div>
    </div>
  )
}