'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface StatItemProps {
  title: string
  value: string | number
  suffix?: string
  prefix?: string
  animate?: boolean
}

function StatItem({ title, value, suffix = '', prefix = '', animate = true }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value

  useEffect(() => {
    if (animate && typeof numericValue === 'number') {
      let start = 0
      const end = numericValue
      const duration = 2000
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayValue(end)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    } else {
      setDisplayValue(numericValue)
    }
  }, [numericValue, animate])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-casino-accent mb-2 group-hover:scale-110 transition-transform duration-300">
        {prefix}{animate ? displayValue.toLocaleString() : value}{suffix}
      </div>
      <div className="text-sm sm:text-base text-gray-400 font-medium">{title}</div>
    </motion.div>
  )
}

const stats = [
  { title: 'Total Volume', value: 2847593, prefix: '$', suffix: '', animate: true },
  { title: 'Games Played', value: 1234567, animate: true },
  { title: 'Active Players', value: 12847, animate: true },
  { title: 'Biggest Win', value: 50000, prefix: '$', suffix: '', animate: true },
  { title: 'Avg. Payout Time', value: '< 2', suffix: ' min', animate: false },
  { title: 'House Edge', value: '1', suffix: '%', animate: false },
]

export function StatsSection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-casino-dark to-casino-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Join our growing community of players enjoying fair, transparent, and secure gaming.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <StatItem {...stat} />
            </motion.div>
          ))}
        </div>

        {/* Live activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 card p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 text-center">
            🔴 Live Activity
          </h3>
          <div className="space-y-2 max-h-32 overflow-hidden">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Player *****abc won</span>
              <span className="text-casino-success font-semibold">+1.24 BTC</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Player *****xyz won</span>
              <span className="text-casino-success font-semibold">+0.89 ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Player *****def won</span>
              <span className="text-casino-success font-semibold">+2,450 USDT</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}