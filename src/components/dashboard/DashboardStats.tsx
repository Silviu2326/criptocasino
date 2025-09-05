'use client'

import { TrophyIcon, ChartBarIcon, FireIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

interface DashboardStatsProps {
  stats: {
    totalBets: number
    totalWins: number
    winRate: number
    highestWin: string
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      icon: ChartBarIcon,
      label: 'Total Bets',
      value: stats.totalBets.toLocaleString(),
      color: 'text-blue-400',
    },
    {
      icon: TrophyIcon,
      label: 'Total Wins',
      value: stats.totalWins.toLocaleString(),
      color: 'text-casino-success',
    },
    {
      icon: FireIcon,
      label: 'Win Rate',
      value: `${stats.winRate}%`,
      color: 'text-casino-accent',
    },
    {
      icon: CurrencyDollarIcon,
      label: 'Biggest Win',
      value: `₿${stats.highestWin}`,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => (
          <div key={stat.label} className="text-center">
            <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}