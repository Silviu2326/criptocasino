'use client'

import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

const mockActivity = [
  { id: '1', type: 'win', game: 'Dice', amount: '+0.00245 BTC', time: '2 min ago' },
  { id: '2', type: 'loss', game: 'Coinflip', amount: '-0.001 BTC', time: '5 min ago' },
  { id: '3', type: 'win', game: 'Crash', amount: '+0.00892 BTC', time: '12 min ago' },
  { id: '4', type: 'loss', game: 'Dice', amount: '-0.002 BTC', time: '18 min ago' },
  { id: '5', type: 'win', game: 'Slots', amount: '+0.0156 BTC', time: '25 min ago' },
]

export function RecentActivity() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <ClockIcon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {mockActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 bg-casino-card/30 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {activity.type === 'win' ? (
                <CheckCircleIcon className="h-5 w-5 text-casino-success flex-shrink-0" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-casino-danger flex-shrink-0" />
              )}
              <div>
                <div className="text-white font-medium">{activity.game}</div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            </div>
            <div className={`font-semibold font-mono ${
              activity.type === 'win' ? 'text-casino-success' : 'text-casino-danger'
            }`}>
              {activity.amount}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-center mt-4 text-sm text-casino-accent hover:text-white transition-colors">
        View All Activity →
      </button>
    </div>
  )
}