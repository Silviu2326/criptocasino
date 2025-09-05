'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  CubeIcon, 
  CircleStackIcon, 
  ChartBarIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'

const games = [
  {
    id: 'dice',
    name: 'Dice',
    icon: CubeIcon,
    description: 'Roll the dice and win big with customizable odds',
    houseEdge: '1%',
    minBet: '0.001 BTC',
    maxBet: '1 BTC',
    color: 'from-blue-500 to-purple-600',
    players: 234,
    isPopular: true
  },
  {
    id: 'coinflip',
    name: 'Coinflip',
    icon: CircleStackIcon,
    description: 'Classic heads or tails with 50/50 odds',
    houseEdge: '2%',
    minBet: '0.001 BTC',
    maxBet: '0.5 BTC',
    color: 'from-green-500 to-teal-600',
    players: 189,
    isPopular: false
  },
  {
    id: 'crash',
    name: 'Crash',
    icon: ChartBarIcon,
    description: 'Watch the multiplier rise and cash out before it crashes',
    houseEdge: '1%',
    minBet: '0.001 BTC',
    maxBet: '2 BTC',
    color: 'from-red-500 to-orange-600',
    players: 445,
    isPopular: true
  },
  {
    id: 'slots',
    name: 'Slots',
    icon: SparklesIcon,
    description: 'Spin the reels for massive jackpot opportunities',
    houseEdge: '3%',
    minBet: '0.01 BTC',
    maxBet: '10 BTC',
    color: 'from-purple-500 to-pink-600',
    players: 567,
    isPopular: true
  }
]

export function GameSection() {
  return (
    <section className="py-16 sm:py-24 bg-casino-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Game</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            All games are provably fair with transparent algorithms you can verify yourself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="card p-6 h-full hover:neon-border transition-all duration-300 group-hover:scale-105">
                {game.isPopular && (
                  <div className="absolute -top-2 -right-2 bg-casino-accent text-casino-dark text-xs font-bold px-2 py-1 rounded-full">
                    HOT
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${game.color}`}>
                    <game.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Players</div>
                    <div className="text-lg font-semibold text-white">{game.players}</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">House Edge:</span>
                    <span className="text-white">{game.houseEdge}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min Bet:</span>
                    <span className="text-white">{game.minBet}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Bet:</span>
                    <span className="text-white">{game.maxBet}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Link
                    href={`/games/${game.id}`}
                    className="flex-1 btn btn-primary btn-sm text-center casino-glow"
                  >
                    Play Now
                  </Link>
                  <Link
                    href={`/games/${game.id}/demo`}
                    className="btn btn-secondary btn-sm"
                  >
                    Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/games"
            className="btn btn-secondary btn-lg"
          >
            View All Games
          </Link>
        </motion.div>
      </div>
    </section>
  )
}