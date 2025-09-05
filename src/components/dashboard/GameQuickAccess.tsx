'use client'

import Link from 'next/link'
import { CubeIcon, CircleStackIcon, ChartBarIcon, SparklesIcon } from '@heroicons/react/24/outline'

const quickGames = [
  { name: 'Dice', href: '/games/dice', icon: CubeIcon, color: 'from-blue-500 to-purple-600' },
  { name: 'Coinflip', href: '/games/coinflip', icon: CircleStackIcon, color: 'from-green-500 to-teal-600' },
  { name: 'Crash', href: '/games/crash', icon: ChartBarIcon, color: 'from-red-500 to-orange-600' },
  { name: 'Slots', href: '/games/slots', icon: SparklesIcon, color: 'from-purple-500 to-pink-600' },
]

export function GameQuickAccess() {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Play</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {quickGames.map((game) => (
          <Link
            key={game.name}
            href={game.href}
            className="group p-4 bg-casino-card/30 rounded-lg hover:bg-casino-card/50 transition-all duration-200 hover:scale-105"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center mb-2`}>
              <game.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-white font-medium text-sm group-hover:text-casino-accent transition-colors">
              {game.name}
            </div>
          </Link>
        ))}
      </div>
      
      <Link
        href="/games"
        className="block w-full text-center mt-4 text-sm text-casino-accent hover:text-white transition-colors"
      >
        View All Games →
      </Link>
    </div>
  )
}