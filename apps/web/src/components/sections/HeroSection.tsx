'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  CubeTransparentIcon, 
  BoltIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Provably Fair',
    description: 'Cryptographically secure random generation'
  },
  {
    icon: BoltIcon,
    title: 'Instant Payouts',
    description: 'Lightning-fast cryptocurrency withdrawals'
  },
  {
    icon: CubeTransparentIcon,
    title: 'Transparent',
    description: 'Open-source algorithms you can verify'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Access',
    description: 'Play from anywhere with crypto support'
  }
]

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-casino-dark via-casino-card to-casino-dark" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-casino-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold">
              <span className="gradient-text">Crypto Casino</span>
              <br />
              <span className="text-white">Reimagined</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of online gaming with provably fair games, 
              instant crypto payouts, and complete transparency.
            </p>
          </div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link 
              href="/games" 
              className="btn btn-primary btn-lg casino-glow text-lg px-8"
            >
              Start Playing
            </Link>
            <Link 
              href="/demo" 
              className="btn btn-secondary btn-lg text-lg px-8"
            >
              Try Demo
            </Link>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-2xl mx-auto mt-16"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-casino-accent">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-casino-accent">10k+</div>
              <div className="text-sm text-gray-400">Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-casino-accent">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-casino-accent">1M+</div>
              <div className="text-sm text-gray-400">Bets Placed</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="card p-6 text-center hover:neon-border transition-all duration-300"
            >
              <feature.icon className="h-12 w-12 text-casino-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}