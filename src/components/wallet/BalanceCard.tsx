import React, { useState } from 'react'
import { useAppStore } from '../../store'
import { useWallet } from '../../hooks/useWallet'

interface BalanceCardProps {
  showActions?: boolean
  compact?: boolean
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  showActions = true,
  compact = false 
}) => {
  const { balance } = useAppStore()
  const { getBalance } = useWallet()
  const [selectedCurrency, setSelectedCurrency] = useState('btc')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const currencies = [
    { key: 'btc', name: 'Bitcoin', symbol: 'BTC', color: 'text-orange-500' },
    { key: 'eth', name: 'Ethereum', symbol: 'ETH', color: 'text-blue-500' },
    { key: 'usdt', name: 'Tether', symbol: 'USDT', color: 'text-green-500' },
    { key: 'usd', name: 'US Dollar', symbol: 'USD', color: 'text-gray-300' },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await getBalance()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatBalance = (amount: string) => {
    const num = parseFloat(amount)
    if (num === 0) return '0.00'
    if (num < 0.01) return num.toFixed(6)
    return num.toFixed(4)
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-3">
        {currencies.map((currency) => (
          <div key={currency.key} className="flex items-center space-x-1">
            <span className={`text-sm font-medium ${currency.color}`}>
              {currency.symbol}
            </span>
            <span className="text-sm text-white font-mono">
              {formatBalance(balance[currency.key as keyof typeof balance])}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const selectedCurrencyData = currencies.find(c => c.key === selectedCurrency)!

  return (
    <div className="glass rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Your Balance</h3>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg 
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Currency Selector */}
      <div className="flex space-x-2 mb-6">
        {currencies.map((currency) => (
          <button
            key={currency.key}
            onClick={() => setSelectedCurrency(currency.key)}
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              selectedCurrency === currency.key
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold'
                : 'glass-dark hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {currency.symbol}
          </button>
        ))}
      </div>

      {/* Main Balance Display */}
      <div className="text-center mb-8">
        <div className="text-4xl font-black text-white font-mono mb-2">
          {formatBalance(balance[selectedCurrency as keyof typeof balance])}
        </div>
        <div className={`text-lg font-medium ${selectedCurrencyData.color}`}>
          {selectedCurrencyData.name} ({selectedCurrencyData.symbol})
        </div>
      </div>

      {/* All Balances */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currencies.map((currency) => (
          <div 
            key={currency.key}
            className={`glass-dark rounded-xl p-4 transition-all duration-200 ${
              selectedCurrency === currency.key ? 'border border-yellow-400/30' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${currency.color.replace('text-', 'bg-')}`} />
                <span className="text-sm font-medium text-gray-300">{currency.symbol}</span>
              </div>
              <span className="text-sm font-mono text-white">
                {formatBalance(balance[currency.key as keyof typeof balance])}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-3">
          <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Deposit</span>
          </button>
          
          <button className="flex-1 glass-dark hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl border border-gray-600/50 hover:border-gray-400/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            <span>Withdraw</span>
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500 mb-1">24h Change</div>
            <div className="text-green-400 text-sm font-medium">+2.34%</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Total USD</div>
            <div className="text-white text-sm font-medium font-mono">$1,234.56</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Available</div>
            <div className="text-blue-400 text-sm font-medium">100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}