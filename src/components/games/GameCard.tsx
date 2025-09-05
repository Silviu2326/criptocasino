'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'

interface GameCardProps {
  game: {
    id: string
    name: string
    icon: any
    description: string
    houseEdge: string
    minBet: string
    maxBet: string
    color: string
    players: number
    isPopular: boolean
    features: string[]
  }
}

export function GameCard({ game }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <div className="card p-8 h-full hover:neon-border transition-all duration-300 group-hover:scale-105">
        {game.isPopular && (
          <div className="absolute -top-3 -right-3 bg-casino-accent text-casino-dark text-xs font-bold px-3 py-1 rounded-full z-10">
            🔥 HOT
          </div>
        )}
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-xl bg-gradient-to-r ${game.color}`}>
            <game.icon className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Players Online</div>
            <div className="text-2xl font-bold text-white flex items-center">
              <div className="w-2 h-2 bg-casino-success rounded-full animate-pulse mr-2" />
              {game.players}
            </div>
          </div>
        </div>

        {/* Game Info */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-casino-accent transition-colors">
          {game.name}
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {game.description}
        </p>

        {/* Features */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {game.features.map((feature, index) => (
              <span
                key={index}
                className="text-xs px-3 py-1 bg-casino-accent/20 text-casino-accent rounded-full border border-casino-accent/30"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Game Stats */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">House Edge:</span>
            <span className="text-white font-semibold">{game.houseEdge}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Min Bet:</span>
            <span className="text-white font-mono text-sm">{game.minBet}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Max Bet:</span>
            <span className="text-white font-mono text-sm">{game.maxBet}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            href={`/games/${game.id}`}
            className="flex-1 btn btn-primary btn-md casino-glow flex items-center justify-center space-x-2"
          >
            <PlayIcon className="h-5 w-5" />
            <span>Play Now</span>
          </Link>
          <Link
            href={`/games/${game.id}/demo`}
            className="btn btn-secondary btn-md flex items-center space-x-1"
          >
            <span>Demo</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(45deg, transparent, ${game.color.includes('blue') ? '#3b82f6' : game.color.includes('green') ? '#10b981' : game.color.includes('red') ? '#ef4444' : '#8b5cf6'})` }} 
        />
      </div>
    </motion.div>
  )
}