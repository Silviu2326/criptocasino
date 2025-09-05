'use client'

import { useState } from 'react'
import { EyeIcon, EyeSlashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface BalanceCardProps {
  balance: {
    BTC: string
    ETH: string
    USDT: string
  }
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  const currencies = [
    { symbol: 'BTC', amount: balance.BTC, color: 'text-orange-400', icon: '₿' },
    { symbol: 'ETH', amount: balance.ETH, color: 'text-blue-400', icon: 'Ξ' },
    { symbol: 'USDT', amount: balance.USDT, color: 'text-green-400', icon: '₮' },
  ]

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Balance</h3>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {showBalance ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="space-y-4">
        {currencies.map((currency) => (
          <div key={currency.symbol} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`text-2xl ${currency.color}`}>{currency.icon}</span>
              <span className="text-white font-medium">{currency.symbol}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold font-mono">
                {showBalance ? currency.amount : '••••••'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-3 mt-6">
        <button className="flex-1 btn btn-success btn-sm flex items-center justify-center space-x-2">
          <ArrowDownIcon className="h-4 w-4" />
          <span>Deposit</span>
        </button>
        <button className="flex-1 btn btn-secondary btn-sm flex items-center justify-center space-x-2">
          <ArrowUpIcon className="h-4 w-4" />
          <span>Withdraw</span>
        </button>
      </div>
    </div>
  )
}