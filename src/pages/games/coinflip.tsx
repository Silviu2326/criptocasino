import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Coin3D from '../../components/Coin3D'
import ParticleSystem from '../../components/ParticleSystem'

export default function CoinflipPage() {
  const [betAmount, setBetAmount] = useState('0.001')
  const [selectedSide, setSelectedSide] = useState<'heads' | 'tails'>('heads')
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<'heads' | 'tails' | null>(null)
  const [isWin, setIsWin] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)

  const multiplier = 1.96 // 2% house edge
  const winChance = 50

  const flipCoin = async () => {
    setIsFlipping(true)
    setShowResult(false)
    setResult(null)
    
    setTimeout(() => {
      const coinResult: 'heads' | 'tails' = Math.random() > 0.5 ? 'heads' : 'tails'
      const win = coinResult === selectedSide
      
      setResult(coinResult)
      setIsWin(win)
      setIsFlipping(false)
      
      setTimeout(() => {
        setShowResult(true)
      }, 500)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-80 h-80 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Particle System */}
      <ParticleSystem 
        isActive={isFlipping} 
        particleCount={25} 
        size="lg"
        colors={['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899']}
      />

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <Link href="/games" className="inline-flex items-center text-green-400 hover:text-green-300 mb-8 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Games
          </Link>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-8 shadow-2xl animate-pulse">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-green-400 via-teal-500 to-emerald-500 bg-clip-text text-transparent">COINFLIP</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Choose heads or tails and <span className="font-semibold text-green-400">flip the coin!</span> Classic 50/50 odds with instant results.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Game */}
          <div className="xl:col-span-2">
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30 shadow-2xl">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-500/10 to-emerald-500/10 rounded-3xl opacity-75 animate-pulse"></div>
              <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Game Controls */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                    </svg>
                    <span>Game Controls</span>
                  </h2>
                  
                  {/* Bet Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      <span>Bet Amount (BTC)</span>
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                        step="0.001"
                        min="0.001"
                        max="0.5"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                        disabled={isFlipping}
                      />
                      <button
                        onClick={() => setBetAmount(String(parseFloat(betAmount) * 2))}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isFlipping}
                      >
                        2×
                      </button>
                      <button
                        onClick={() => setBetAmount(String(parseFloat(betAmount) / 2))}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isFlipping}
                      >
                        ½
                      </button>
                    </div>
                  </div>

                  {/* Side Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                      </svg>
                      <span>Choose Your Side</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setSelectedSide('heads')}
                        disabled={isFlipping}
                        className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          selectedSide === 'heads'
                            ? 'glass neon-glow bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400'
                            : 'glass-dark hover:glass border border-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Coin3D result="heads" size="sm" />
                          <span className="font-semibold text-white">Heads</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setSelectedSide('tails')}
                        disabled={isFlipping}
                        className={`p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          selectedSide === 'tails'
                            ? 'glass neon-glow bg-gradient-to-br from-gray-400/20 to-gray-600/20 border-2 border-gray-400'
                            : 'glass-dark hover:glass border border-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <Coin3D result="tails" size="sm" />
                          <span className="font-semibold text-white">Tails</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Game Info */}
                  <div className="glass rounded-2xl p-6 space-y-4 animate-glow-pulse">
                    <div className="flex justify-between items-center transition-all duration-300">
                      <span className="text-gray-300">Win Chance:</span>
                      <span className="text-white font-semibold text-lg">{winChance}%</span>
                    </div>
                    <div className="flex justify-between items-center transition-all duration-300">
                      <span className="text-gray-300">Multiplier:</span>
                      <span className="text-yellow-400 font-bold text-lg animate-pulse">{multiplier.toFixed(2)}×</span>
                    </div>
                    <div className="flex justify-between items-center transition-all duration-300">
                      <span className="text-gray-300">Payout on Win:</span>
                      <span className="text-green-400 font-bold text-lg">
                        {(parseFloat(betAmount) * multiplier).toFixed(6)} BTC
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Flip Button */}
                  <button
                    onClick={flipCoin}
                    disabled={isFlipping}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 disabled:bg-gray-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-black py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-400/50 disabled:hover:scale-100 flex items-center justify-center space-x-3 relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 ${!isFlipping ? 'translate-x-[-100%] hover:translate-x-[100%]' : ''}`}></div>
                    {isFlipping ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="animate-pulse">Flipping...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                        </svg>
                        <span className="relative z-10">FLIP COIN</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Game Display */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>Coin Result</span>
                  </h2>
                  
                  {/* Enhanced Coin Animation */}
                  <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 text-center min-h-64 flex items-center justify-center overflow-hidden perspective-2000 border border-gray-600/30 shadow-2xl">
                    {/* Inner glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-3xl animate-pulse"></div>
                    {/* Background particles effect */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute top-6 right-6 w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute bottom-8 left-6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="absolute bottom-3 right-3 w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
                    </div>

                    {isFlipping && (
                      <div className="text-center relative z-10">
                        <div className="mb-6">
                          <Coin3D isFlipping={true} size="lg" />
                        </div>
                        <div className="text-xl text-yellow-400 animate-pulse font-bold">
                          Flipping...
                        </div>
                      </div>
                    )}

                    {!isFlipping && result !== null && (
                      <div className="text-center relative z-10">
                        <div className={`mb-4 transition-all duration-500 transform ${
                          showResult ? 'scale-100' : 'scale-75'
                        }`}>
                          <Coin3D result={result} size="lg" />
                        </div>
                        <div className="text-lg text-gray-300 mb-2 animate-fade-in">
                          Result: {result.charAt(0).toUpperCase() + result.slice(1)}
                        </div>
                        <div className="text-lg text-gray-300 mb-3 animate-fade-in">
                          You chose: {selectedSide.charAt(0).toUpperCase() + selectedSide.slice(1)}
                        </div>
                        <div className={`text-3xl font-bold transition-all duration-700 flex items-center justify-center gap-3 ${
                          showResult ? 'animate-bounce' : ''
                        } ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                          {isWin ? (
                            <>
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              YOU WIN!
                            </>
                          ) : (
                            <>
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              YOU LOSE
                            </>
                          )}
                        </div>
                        {isWin && showResult && (
                          <div className="text-xl text-yellow-400 mt-2 animate-pulse font-bold">
                            +{(parseFloat(betAmount) * multiplier).toFixed(6)} BTC
                          </div>
                        )}
                      </div>
                    )}

                    {!isFlipping && result === null && (
                      <div className="text-center text-gray-400 py-12 relative z-10">
                        <div className="mb-4 opacity-50 animate-pulse">
                          <Coin3D result="heads" size="lg" />
                        </div>
                        <p className="text-xl">Flip the coin to start playing!</p>
                      </div>
                    )}
                  </div>

                  {/* Last Result */}
                  {result !== null && (
                    <div className="glass rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Last Flip</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Result:</span>
                          <span className="text-white font-mono">{result.charAt(0).toUpperCase() + result.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Your Choice:</span>
                          <span className="text-white">{selectedSide.charAt(0).toUpperCase() + selectedSide.slice(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bet:</span>
                          <span className="text-white font-mono">{betAmount} BTC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Result:</span>
                          <span className={isWin ? 'text-green-400' : 'text-red-400'}>
                            {isWin ? `+${(parseFloat(betAmount) * multiplier).toFixed(6)} BTC` : `-${betAmount} BTC`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Your Stats */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                <span>Your Stats</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Flips:</span>
                  <span className="text-white font-semibold">89</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Won:</span>
                  <span className="text-green-400 font-semibold">43</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Biggest Win:</span>
                  <span className="text-yellow-400 font-semibold">0.245 BTC</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate:</span>
                  <span className="text-white font-semibold">48%</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Win Rate</span>
                  <span>48%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full" style={{width: '48%'}} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-lg font-bold text-green-400 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                <span>Recent Flips</span>
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-4 glass-dark rounded-xl hover:glass transition-all duration-300 transform hover:scale-102 neon-glow">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 text-green-400 animate-pulse">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">0.002 BTC</div>
                      <div className="text-xs text-gray-400">3 min ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400 animate-pulse">
                      +0.00392
                    </div>
                    <div className="text-xs text-gray-400">Heads</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 glass-dark rounded-xl hover:glass transition-all duration-300 transform hover:scale-102 neon-glow">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 text-red-400 animate-pulse">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">0.001 BTC</div>
                      <div className="text-xs text-gray-400">7 min ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-400">
                      -0.001
                    </div>
                    <div className="text-xs text-gray-400">Tails</div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 glass-dark rounded-xl hover:glass transition-all duration-300 transform hover:scale-102 neon-glow">
                  <div className="flex items-center space-x-3">
                    <div className="h-6 w-6 text-green-400 animate-pulse">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">0.005 BTC</div>
                      <div className="text-xs text-gray-400">12 min ago</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400 animate-pulse">
                      +0.0098
                    </div>
                    <div className="text-xs text-gray-400">Heads</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}