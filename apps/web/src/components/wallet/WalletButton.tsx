import React, { useState } from 'react'
import { useWallet } from '../../hooks/useWallet'
import { useAppStore } from '../../store'
import { WalletConnect } from './WalletConnect'
import { BalanceCard } from './BalanceCard'

export const WalletButton: React.FC = () => {
  const { isConnected, address, disconnect } = useWallet()
  const { balance } = useAppStore()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTotalUSDValue = () => {
    // Mock USD values - in real app, these would come from API
    const prices = {
      btc: 45000,
      eth: 3000,
      usdt: 1
    }
    
    const total = 
      parseFloat(balance.btc) * prices.btc +
      parseFloat(balance.eth) * prices.eth +
      parseFloat(balance.usdt) * prices.usdt +
      parseFloat(balance.usd)
    
    return total.toFixed(2)
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="group relative px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 shadow-green-500/30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
          <div className="relative flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="hidden md:inline">{formatAddress(address)}</span>
            <span className="md:hidden">Connected</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown content */}
            <div className="absolute top-full right-0 mt-2 w-80 glass-dark rounded-2xl backdrop-blur-xl border border-gray-700/50 shadow-2xl z-50">
              <div className="p-6">
                {/* Wallet Info */}
                <div className="mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">{formatAddress(address)}</div>
                      <div className="text-green-400 text-sm">Connected</div>
                    </div>
                  </div>
                </div>

                {/* Balance Summary */}
                <div className="mb-4">
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-white">${getTotalUSDValue()}</div>
                    <div className="text-sm text-gray-400">Total Balance</div>
                  </div>
                  
                  <BalanceCard compact showActions={false} />
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      // Navigate to dashboard
                    }}
                    className="w-full glass hover:bg-white/10 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      // Navigate to transactions
                    }}
                    className="w-full glass hover:bg-white/10 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Transactions</span>
                  </button>

                  <div className="border-t border-gray-700/50 pt-2 mt-3">
                    <button
                      onClick={() => {
                        disconnect()
                        setShowDropdown(false)
                      }}
                      className="w-full text-red-400 hover:bg-red-500/10 py-2 px-4 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Disconnect</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowWalletModal(true)}
        className="group relative px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 shadow-yellow-500/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700 group-hover:translate-x-full"></div>
        <div className="relative flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
          </svg>
          <span>Connect Wallet</span>
        </div>
      </button>

      {showWalletModal && (
        <WalletConnect 
          showModal={true}
          onClose={() => setShowWalletModal(false)}
        />
      )}
    </>
  )
}