import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { useAppStore } from '../../store'
import { useWallet } from '../../hooks/useWallet'
import { ProvablyFair, SeedManager, DiceResult } from '../../utils/provablyFair'
import { WalletConnect } from '../../components/wallet/WalletConnect'

export default function DicePage() {
  const { user, isAuthenticated, balance, addGameResult, addNotification } = useAppStore()
  const { isConnected } = useWallet()
  
  // Game state
  const [betAmount, setBetAmount] = useState('0.001')
  const [selectedCurrency, setSelectedCurrency] = useState('btc')
  const [target, setTarget] = useState(50)
  const [isUnder, setIsUnder] = useState(true)
  const [isRolling, setIsRolling] = useState(false)
  const [lastResult, setLastResult] = useState<DiceResult | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [rollHistory, setRollHistory] = useState<DiceResult[]>([])
  const [isDemoMode, setIsDemoMode] = useState(!isConnected)
  const [demoBalance, setDemoBalance] = useState({ btc: 1.0, eth: 10.0, usdt: 1000.0 })
  const [diceAnimation, setDiceAnimation] = useState<{ value: number, isRolling: boolean }>({ value: 50, isRolling: false })
  const [showDiceResult, setShowDiceResult] = useState(false)

  // Seed management
  const seedManager = SeedManager.getInstance()
  const [currentSeeds, setCurrentSeeds] = useState(() => seedManager.getCurrentSeeds() || seedManager.generateNewSeeds())

  const currencies = [
    { key: 'btc', symbol: 'BTC', min: 0.00001 },
    { key: 'eth', symbol: 'ETH', min: 0.0001 },
    { key: 'usdt', symbol: 'USDT', min: 0.01 },
  ]

  // Calculate win chance and multiplier
  const winChance = isUnder ? target : (100 - target)
  const multiplier = winChance > 0 ? (99 / winChance) : 0
  const potentialProfit = parseFloat(betAmount) * multiplier

  const canPlay = () => {
    if (parseFloat(betAmount) <= 0) return false
    const currentBalance = isDemoMode ? demoBalance : balance
    if (parseFloat(currentBalance[selectedCurrency as keyof typeof currentBalance]) < parseFloat(betAmount)) return false
    if (winChance <= 0 || winChance >= 100) return false
    return true
  }

  const handleRoll = async () => {
    if (!canPlay() || isRolling) return

    setIsRolling(true)
    setShowDiceResult(false)
    setDiceAnimation({ value: 50, isRolling: true })

    try {
      // Animate dice rolling with random values
      let animationInterval = setInterval(() => {
        setDiceAnimation(prev => ({ ...prev, value: Math.floor(Math.random() * 100) }))
      }, 100)

      // Simulate rolling animation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(animationInterval)

      // Play the game
      const gameResult = ProvablyFair.playDice(currentSeeds, target, isUnder)
      
      const result: DiceResult = {
        ...gameResult,
        target,
        isUnder,
        seeds: { ...currentSeeds }
      }

      // Set final dice animation value
      setDiceAnimation({ value: Math.floor(result.result), isRolling: false })
      setShowDiceResult(true)
      
      setLastResult(result)
      setRollHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 rolls

      // Update balance if in demo mode
      if (isDemoMode) {
        const amount = parseFloat(betAmount)
        if (result.win) {
          setDemoBalance(prev => ({
            ...prev,
            [selectedCurrency]: prev[selectedCurrency as keyof typeof prev] + (amount * result.multiplier - amount)
          }))
        } else {
          setDemoBalance(prev => ({
            ...prev,
            [selectedCurrency]: prev[selectedCurrency as keyof typeof prev] - amount
          }))
        }
      }

      // Add to global game history
      addGameResult({
        id: Math.random().toString(36).substr(2, 9),
        game: 'dice',
        amount: betAmount,
        currency: selectedCurrency,
        multiplier: result.multiplier,
        profit: result.win ? (parseFloat(betAmount) * result.multiplier - parseFloat(betAmount)).toFixed(6) : `-${betAmount}`,
        timestamp: new Date().toISOString(),
        result: result,
        serverSeed: currentSeeds.serverSeed,
        clientSeed: currentSeeds.clientSeed,
        nonce: currentSeeds.nonce
      })

      // Show result notification
      addNotification({
        type: result.win ? 'success' : 'error',
        title: result.win ? '🎉 You Won!' : '😔 You Lost',
        message: result.win 
          ? `Won ${(parseFloat(betAmount) * result.multiplier).toFixed(6)} ${selectedCurrency.toUpperCase()}`
          : `Lost ${betAmount} ${selectedCurrency.toUpperCase()}`
      })

      // Increment nonce and check for seed rotation
      seedManager.incrementNonce()
      if (seedManager.shouldRotateSeeds()) {
        const newSeeds = seedManager.generateNewSeeds()
        setCurrentSeeds(newSeeds)
        addNotification({
          type: 'info',
          title: 'Seeds Rotated',
          message: 'New seeds generated for security'
        })
      }

    } catch (error) {
      console.error('Error rolling dice:', error)
      addNotification({
        type: 'error',
        title: 'Roll Failed',
        message: 'Something went wrong. Please try again.'
      })
    } finally {
      setIsRolling(false)
    }
  }

  const handleQuickBet = (action: 'half' | 'double' | 'max') => {
    const current = parseFloat(betAmount)
    const currentBalance = isDemoMode ? demoBalance : balance
    const maxBalance = parseFloat(currentBalance[selectedCurrency as keyof typeof currentBalance])
    
    switch (action) {
      case 'half':
        setBetAmount((current / 2).toFixed(6))
        break
      case 'double':
        setBetAmount(Math.min(current * 2, maxBalance).toFixed(6))
        break
      case 'max':
        setBetAmount(maxBalance.toFixed(6))
        break
    }
  }

  // Update demo mode when wallet connects
  useEffect(() => {
    if (isConnected) {
      setIsDemoMode(false)
    }
  }, [isConnected])

  return (
    <Layout>
        <div className="min-h-screen relative overflow-hidden">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 text-center">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold">Demo Mode - Playing with virtual credits</span>
              </div>
              {!isConnected && (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="bg-white text-black px-4 py-1 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        )}
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Dice Game
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Roll under or over your target number • Provably Fair • Instant Results
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Game Controls */}
            <div className="xl:col-span-2">
              <div className="glass rounded-3xl p-8 backdrop-blur-xl border border-gray-700/50 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Place Your Bet</h2>
                
                {/* Bet Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bet Amount
                    </label>
                    <div className="flex">
                      <select
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded-l-xl px-3 py-3 text-white focus:outline-none focus:border-yellow-400"
                      >
                        {currencies.map(currency => (
                          <option key={currency.key} value={currency.key}>
                            {currency.symbol}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.000001"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-r-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 font-mono"
                        placeholder="0.001"
                      />
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleQuickBet('half')}
                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        1/2
                      </button>
                      <button
                        onClick={() => handleQuickBet('double')}
                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        2x
                      </button>
                      <button
                        onClick={() => handleQuickBet('max')}
                        className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Available Balance {isDemoMode && '(Demo)'}
                    </label>
                    <div className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white font-mono">
                      {parseFloat((isDemoMode ? demoBalance : balance)[selectedCurrency as keyof typeof balance]).toFixed(6)} {selectedCurrency.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Target Number */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-300">
                      Target Number
                    </label>
                    <span className="text-sm text-gray-400">
                      Roll {isUnder ? 'Under' : 'Over'} {target}
                    </span>
                  </div>
                  
                  <div className="relative mb-4">
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={target}
                      onChange={(e) => setTarget(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div 
                      className="absolute top-0 h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg pointer-events-none"
                      style={{ width: `${target}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>50</span>
                    <span>99</span>
                  </div>
                </div>

                {/* Under/Over Toggle */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setIsUnder(true)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                      isUnder
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'glass-dark hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    Roll Under
                  </button>
                  <button
                    onClick={() => setIsUnder(false)}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                      !isUnder
                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                        : 'glass-dark hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    Roll Over
                  </button>
                </div>

                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="glass-dark rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{winChance.toFixed(2)}%</div>
                    <div className="text-xs text-gray-500">Win Chance</div>
                  </div>
                  <div className="glass-dark rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{multiplier.toFixed(2)}x</div>
                    <div className="text-xs text-gray-500">Multiplier</div>
                  </div>
                  <div className="glass-dark rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{potentialProfit.toFixed(6)}</div>
                    <div className="text-xs text-gray-500">Potential Profit</div>
                  </div>
                </div>

                {/* Roll Button */}
                <button
                  onClick={handleRoll}
                  disabled={!canPlay() || isRolling}
                  className={`w-full py-4 rounded-2xl font-black text-xl transition-all duration-300 transform ${
                    canPlay() && !isRolling
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isRolling ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Rolling...</span>
                    </div>
                  ) : (
                    'Roll Dice'
                  )}
                </button>
              </div>

              {/* Dice Animation */}
              <div className="glass rounded-3xl p-8 backdrop-blur-xl border border-gray-700/50 mb-8">
                <div className="relative">
                  {/* 3D Dice Container */}
                  <div className="flex justify-center items-center h-64">
                    <div className={`relative ${diceAnimation.isRolling ? 'animate-bounce' : ''}`}>
                      {/* Dice Face */}
                      <div className={`
                        w-32 h-32 bg-gradient-to-br from-white to-gray-200 rounded-2xl shadow-2xl
                        flex items-center justify-center transform transition-all duration-300
                        ${diceAnimation.isRolling ? 'animate-spin' : 'hover:scale-110'}
                        ${showDiceResult && lastResult ? (lastResult.win ? 'ring-4 ring-green-400 ring-opacity-75' : 'ring-4 ring-red-400 ring-opacity-75') : ''}
                      `}
                      style={{
                        transform: diceAnimation.isRolling ? undefined : `rotateX(${diceAnimation.value * 3.6}deg) rotateY(${diceAnimation.value * 1.8}deg)`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.5)'
                      }}>
                        <div className="text-5xl font-black text-gray-800">
                          {diceAnimation.value}
                        </div>
                      </div>
                      
                      {/* Dice Shadow */}
                      <div className={`
                        absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-xl
                        ${diceAnimation.isRolling ? 'animate-pulse' : ''}
                      `}></div>
                      
                      {/* Rolling particles */}
                      {diceAnimation.isRolling && (
                        <>
                          <div className="absolute top-0 left-0 w-full h-full">
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-200"></div>
                            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-ping animation-delay-400"></div>
                            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-600"></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Result Display */}
                  {showDiceResult && lastResult && (
                    <div className={`
                      absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                      px-6 py-2 rounded-full font-bold text-white text-xl
                      ${lastResult.win ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'}
                      animate-bounce
                    `}>
                      {lastResult.win ? '🎉 WIN!' : '💔 LOSE'}
                    </div>
                  )}
                  
                  {/* Target Indicator */}
                  <div className="mt-6 flex justify-center items-center space-x-8">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Target</div>
                      <div className={`text-2xl font-bold ${isUnder ? 'text-green-400' : 'text-red-400'}`}>
                        {isUnder ? '<' : '>'} {target}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Result</div>
                      <div className={`text-3xl font-bold ${
                        !showDiceResult ? 'text-gray-400' :
                        lastResult?.win ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {showDiceResult ? diceAnimation.value : '??'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">Multiplier</div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {multiplier.toFixed(2)}x
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Result */}
              {lastResult && (
                <div className={`glass rounded-2xl p-6 backdrop-blur-xl border ${
                  lastResult.win 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-red-500/50 bg-red-500/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                        lastResult.win ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {lastResult.result.toFixed(2)}
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${lastResult.win ? 'text-green-400' : 'text-red-400'}`}>
                          {lastResult.win ? 'YOU WON!' : 'YOU LOST'}
                        </div>
                        <div className="text-gray-400">
                          Rolled {lastResult.result.toFixed(2)} • Target: {lastResult.isUnder ? 'Under' : 'Over'} {lastResult.target}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${lastResult.win ? 'text-green-400' : 'text-red-400'}`}>
                        {lastResult.win ? '+' : '-'}{(parseFloat(betAmount) * (lastResult.win ? lastResult.multiplier : 1)).toFixed(6)}
                      </div>
                      <div className="text-gray-400">
                        {lastResult.multiplier.toFixed(2)}x multiplier
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Roll History */}
              <div className="glass rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4">Recent Rolls</h3>
                <div className="space-y-2">
                  {rollHistory.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <div className="text-4xl mb-2">🎲</div>
                      <p>No rolls yet</p>
                    </div>
                  ) : (
                    rollHistory.map((roll, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                        roll.win ? 'bg-green-900/30' : 'bg-red-900/30'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            roll.win ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {roll.result.toFixed(0)}
                          </div>
                          <div>
                            <div className="text-sm text-white">
                              {roll.isUnder ? '<' : '>'} {roll.target}
                            </div>
                            <div className="text-xs text-gray-400">
                              {roll.multiplier.toFixed(2)}x
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${roll.win ? 'text-green-400' : 'text-red-400'}`}>
                          {roll.win ? '+' : '-'}{(parseFloat(betAmount) * (roll.win ? roll.multiplier : 1)).toFixed(4)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Provably Fair */}
              <div className="glass rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4">Provably Fair</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Server Seed Hash</div>
                    <div className="bg-gray-800 rounded-lg p-2 font-mono text-xs break-all">
                      {currentSeeds.serverSeedHash}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Client Seed</div>
                    <div className="bg-gray-800 rounded-lg p-2 font-mono text-xs break-all">
                      {currentSeeds.clientSeed}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Nonce</div>
                    <div className="bg-gray-800 rounded-lg p-2 font-mono text-xs">
                      {currentSeeds.nonce}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                  Verify Results
                </button>
              </div>
            </div>
          </div>
        </div>
        {showWalletModal && (
          <WalletConnect 
            showModal={true}
            onClose={() => setShowWalletModal(false)}
          />
        )}
        
        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) }
            50% { transform: translateY(-20px) }
          }
          
          @keyframes dice-roll {
            0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) }
            25% { transform: rotateX(180deg) rotateY(90deg) rotateZ(45deg) }
            50% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg) }
            75% { transform: rotateX(540deg) rotateY(270deg) rotateZ(135deg) }
            100% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg) }
          }
          
          .animation-delay-200 {
            animation-delay: 0.2s;
          }
          
          .animation-delay-400 {
            animation-delay: 0.4s;
          }
          
          .animation-delay-600 {
            animation-delay: 0.6s;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
        </div>
      </Layout>
  )
}