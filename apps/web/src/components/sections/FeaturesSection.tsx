'use client'

import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon,
  BoltIcon,
  CubeTransparentIcon,
  GiftIcon,
  UserGroupIcon,
  ChartBarSquareIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Provably Fair Gaming',
    description: 'Every game outcome is cryptographically verifiable. Check the fairness of any bet using our open-source verification tools.',
    link: '/provably-fair'
  },
  {
    icon: BoltIcon,
    title: 'Instant Withdrawals',
    description: 'Get your winnings in seconds, not hours. Our automated system processes crypto withdrawals instantly.',
    link: '/withdrawals'
  },
  {
    icon: CubeTransparentIcon,
    title: 'Full Transparency',
    description: 'View all game statistics, house edges, and recent bets in real-time. No hidden mechanics or unfair advantages.',
    link: '/transparency'
  },
  {
    icon: GiftIcon,
    title: 'Generous Bonuses',
    description: 'Earn rewards through our VIP program, daily bonuses, and special promotions. The more you play, the more you earn.',
    link: '/bonuses'
  },
  {
    icon: UserGroupIcon,
    title: 'Active Community',
    description: 'Join thousands of players in our chat rooms, tournaments, and social features. Make friends while you play.',
    link: '/community'
  },
  {
    icon: ChartBarSquareIcon,
    title: 'Advanced Analytics',
    description: 'Track your performance with detailed statistics, profit/loss charts, and betting pattern analysis.',
    link: '/analytics'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-casino-card/30 to-casino-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose <span className="gradient-text">CryptoCasino</span>?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            We&apos;re not just another online casino. We&apos;re building the future of fair, 
            transparent, and secure gaming on the blockchain.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card p-8 h-full hover:neon-border transition-all duration-300 group-hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-lg bg-casino-accent/20 group-hover:bg-casino-accent/30 transition-colors">
                    <feature.icon className="h-8 w-8 text-casino-accent" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-casino-accent transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <a
                  href={feature.link}
                  className="inline-flex items-center text-casino-accent hover:text-white transition-colors text-sm font-medium"
                >
                  Learn More
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="card p-8">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Trusted & Secure Platform
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-sm text-gray-400">SSL Encrypted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🛡️</div>
                <div className="text-sm text-gray-400">Licensed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm text-gray-400">KYC Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-sm text-gray-400">24/7 Support</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}