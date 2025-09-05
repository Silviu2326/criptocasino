'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

interface GameHistoryItem {
  id: string
  game: string
  bet: string
  multiplier: number
  payout: string
  result: 'win' | 'lose'
  timestamp: Date
}

const mockHistory: GameHistoryItem[] = [
  {
    id: '1',
    game: 'Dice',
    bet: '0.001',
    multiplier: 1.98,
    payout: '0.00198',
    result: 'win',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: '2',
    game: 'Dice',
    bet: '0.002',
    multiplier: 0,
    payout: '0',
    result: 'lose',
    timestamp: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: '3',
    game: 'Dice',
    bet: '0.001',
    multiplier: 4.95,
    payout: '0.00495',
    result: 'win',
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: '4',
    game: 'Dice',
    bet: '0.003',
    multiplier: 0,
    payout: '0',
    result: 'lose',
    timestamp: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    id: '5',
    game: 'Dice',
    bet: '0.001',
    multiplier: 2.48,
    payout: '0.00248',
    result: 'win',
    timestamp: new Date(Date.now() - 1000 * 60 * 60)
  }
]

export function GameHistory() {
  const [history] = useState<GameHistoryItem[]>(mockHistory)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Bets</h3>
        <ClockIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-casino-card/30 rounded-lg hover:bg-casino-card/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {item.result === 'win' ? (
                <CheckCircleIcon className="h-5 w-5 text-casino-success flex-shrink-0" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-casino-danger flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className="text-sm text-white font-medium">
                  {item.bet} BTC
                </div>
                <div className="text-xs text-gray-400">
                  {formatTime(item.timestamp)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-sm font-semibold ${
                item.result === 'win' ? 'text-casino-success' : 'text-casino-danger'
              }`}>
                {item.result === 'win' ? '+' : '-'}{item.result === 'win' ? item.payout : item.bet}
              </div>
              {item.result === 'win' && (
                <div className="text-xs text-gray-400">
                  {item.multiplier.toFixed(2)}×
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600">
        <button className="w-full text-center text-sm text-casino-accent hover:text-white transition-colors">
          View All History
        </button>
      </div>
    </div>
  )
}