'use client'

import { motion } from 'framer-motion'
import { StarIcon, CrownIcon } from '@heroicons/react/24/outline'

interface VipProgressProps {
  level: number
  isVip: boolean
  totalBets: number
}

export function VipProgress({ level, isVip, totalBets }: VipProgressProps) {
  const nextLevel = level + 1
  const betsNeeded = nextLevel * 500 // Simple calculation
  const progress = (totalBets % 500) / 500 * 100

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">VIP Status</h3>
        {isVip ? (
          <div className="flex items-center space-x-2 bg-gradient-to-r from-casino-accent to-yellow-500 text-casino-dark px-3 py-1 rounded-full">
            <CrownIcon className="h-4 w-4" />
            <span className="text-sm font-bold">VIP {level}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-gray-600 text-white px-3 py-1 rounded-full">
            <StarIcon className="h-4 w-4" />
            <span className="text-sm">Level {level}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Progress to Level {nextLevel}</span>
            <span className="text-white">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-casino-accent to-casino-success h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-casino-accent">{totalBets}</div>
            <div className="text-xs text-gray-400">Total Bets</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-casino-accent">{betsNeeded - (totalBets % 500)}</div>
            <div className="text-xs text-gray-400">Bets to Next Level</div>
          </div>
        </div>

        <div className="bg-casino-card/30 rounded-lg p-3">
          <div className="text-sm text-gray-300 mb-2">Next Level Benefits:</div>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Higher betting limits</li>
            <li>• Exclusive bonuses</li>
            <li>• Priority support</li>
            <li>• Special tournaments</li>
          </ul>
        </div>
      </div>
    </div>
  )
}