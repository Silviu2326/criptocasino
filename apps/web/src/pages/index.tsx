import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useAppStore } from '../store'

// Mock data for real-time features
const recentWins = [
  { player: 'CryptoKing', amount: 12500, game: 'Crash', time: '2 min ago' },
  { player: 'Player****', amount: 5000, game: 'Dice', time: '3 min ago' },
  { player: 'LuckyDice', amount: 25000, game: 'Slots', time: '5 min ago' },
  { player: 'Anonymous', amount: 8750, game: 'Coinflip', time: '7 min ago' },
  { player: 'BigWinner', amount: 15000, game: 'Crash', time: '10 min ago' },
]

const liveStats = {
  onlinePlayers: 12847,
  gamesPlayed: 1247856,
  totalPaid: 2847291,
  currentJackpot: 75420
}

const promotions = [
  {
    title: '🎉 Welcome Bonus',
    description: '100% Match up to 1 BTC',
    timeLeft: '2d 14h 32m',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    title: '🚀 Weekend Boost',
    description: '50% Cashback on Losses',
    timeLeft: '1d 8h 15m',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: '💎 VIP Tournament',
    description: '100,000 USDT Prize Pool',
    timeLeft: '5d 21h 47m',
    color: 'from-blue-500 to-cyan-500'
  }
]

const testimonials = [
  {
    user: 'CryptoGamer2024',
    text: 'Best crypto casino I\'ve used. Instant payouts and provably fair games!',
    rating: 5,
    amount: '$15,000'
  },
  {
    user: 'DiceKing',
    text: 'Won big on dice game! The transparency is amazing.',
    rating: 5,
    amount: '$8,500'
  },
  {
    user: 'LuckyStar',
    text: 'Fast withdrawals, great games, highly recommend!',
    rating: 5,
    amount: '$22,000'
  }
]

// Mini Game Components
const MiniDiceDemo = () => {
  const [isRolling, setIsRolling] = useState(false)
  const [result, setResult] = useState(null)

  const rollDice = () => {
    setIsRolling(true)
    setTimeout(() => {
      setResult(Math.floor(Math.random() * 100) + 1)
      setIsRolling(false)
    }, 1000)
  }

  return (
    <div className="glass rounded-2xl p-6 text-center">
      <h4 className="text-lg font-bold text-white mb-4">🎲 Try Dice Demo</h4>
      <div className="mb-4">
        <div className={`w-16 h-16 mx-auto bg-blue-500 rounded-lg flex items-center justify-center text-2xl font-bold text-white ${isRolling ? 'animate-spin' : ''}`}>
          {isRolling ? '?' : (result || '🎲')}
        </div>
      </div>
      <button 
        onClick={rollDice} 
        disabled={isRolling}
        className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
      >
        {isRolling ? 'Rolling...' : 'Roll Demo'}
      </button>
      {result && !isRolling && (
        <p className="mt-2 text-sm text-gray-300">
          Result: {result} • {result > 50 ? '🎉 Win!' : '😔 Try again!'}
        </p>
      )}
    </div>
  )
}

const MiniCoinflipDemo = () => {
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState(null)

  const flipCoin = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setResult(Math.random() > 0.5 ? 'heads' : 'tails')
      setIsFlipping(false)
    }, 1000)
  }

  return (
    <div className="glass rounded-2xl p-6 text-center">
      <h4 className="text-lg font-bold text-white mb-4">🪙 Try Coinflip Demo</h4>
      <div className="mb-4">
        <div className={`w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-2xl ${isFlipping ? 'animate-spin' : ''}`}>
          {isFlipping ? '🔄' : (result ? (result === 'heads' ? '👑' : '🪙') : '🪙')}
        </div>
      </div>
      <button 
        onClick={flipCoin} 
        disabled={isFlipping}
        className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
      >
        {isFlipping ? 'Flipping...' : 'Flip Demo'}
      </button>
      {result && !isFlipping && (
        <p className="mt-2 text-sm text-gray-300">
          Result: {result} • {Math.random() > 0.5 ? '🎉 Win!' : '😔 Try again!'}
        </p>
      )}
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated } = useAppStore()
  const [currentWinIndex, setCurrentWinIndex] = useState(0)
  const [jackpot, setJackpot] = useState(liveStats.currentJackpot)
  const [onlinePlayers, setOnlinePlayers] = useState(liveStats.onlinePlayers)
  const [showExitIntent, setShowExitIntent] = useState(false)

  // Rotating wins ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinIndex((prev) => (prev + 1) % recentWins.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Live jackpot counter
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 10) + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Live player counter
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => prev + Math.floor(Math.random() * 20) - 10)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !isAuthenticated) {
        setShowExitIntent(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [isAuthenticated])

  const currentWin = recentWins[currentWinIndex]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 left-20 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Real-time Wins Ticker */}
        <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-xl">
          <div className="overflow-hidden py-3">
            <div className="animate-marquee whitespace-nowrap">
              <span className="text-white font-bold px-8">
                🎉 {currentWin.player} just won ${currentWin.amount.toLocaleString()} on {currentWin.game}! 
                💰 Join now and be the next big winner! 
                🚀 Current Jackpot: ${jackpot.toLocaleString()}!
              </span>
            </div>
          </div>
        </div>

        {/* Sticky CTA Header */}
        <div className="fixed top-0 right-4 z-50 pt-24">
          <div className="glass rounded-2xl p-4 backdrop-blur-xl shadow-2xl border border-yellow-400/30">
            <div className="text-center">
              <div className="text-2xl font-black text-yellow-400 mb-2">
                ${jackpot.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300 mb-3">Live Jackpot</div>
              <Link 
                href={isAuthenticated ? "/games" : "/register"}
                className="block w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
              >
                {isAuthenticated ? "Play Now!" : "Join & Win!"}
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Hero Section */}
        <section className="relative z-10 py-32 px-4 mt-16">
          <div className="max-w-6xl mx-auto text-center">
            {/* Floating Casino Icon */}
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-12 shadow-2xl animate-float">
              <svg className="w-20 h-20 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight animate-fade-in">
              <span 
                className="text-yellow-400 font-black neon-text"
                style={{
                  textShadow: '0 0 10px #fbbf24, 0 0 20px #fbbf24, 0 0 30px #fbbf24, 0 0 40px #f59e0b',
                  color: '#fbbf24',
                  display: 'block',
                  background: 'linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'holographic-shift 3s ease infinite'
                }}
              >
                CRYPTO CASINO
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              Experience the future of online gaming with 
              <span className="font-bold text-yellow-400"> provably fair games</span>, 
              <span className="font-bold text-green-400"> instant crypto payouts</span>, and 
              <span className="font-bold text-blue-400"> complete transparency</span>.
            </p>

            {/* Live Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 mb-12 glass rounded-full px-8 py-4 backdrop-blur-xl inline-block">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300 font-medium">{onlinePlayers.toLocaleString()} Players Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse animation-delay-1000"></div>
                <span className="text-sm text-gray-300 font-medium">Real-time Transparency</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-2000"></div>
                <span className="text-sm text-gray-300 font-medium">Instant Payouts</span>
              </div>
            </div>

            {/* Enhanced Feature Pills */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              <div className="inline-flex items-center space-x-3 glass rounded-full px-6 py-3 backdrop-blur-xl shadow-2xl hover:shadow-green-400/30 transition-all transform hover:scale-105">
                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold text-green-400">Provably Fair</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="inline-flex items-center space-x-3 glass rounded-full px-6 py-3 backdrop-blur-xl shadow-2xl hover:shadow-yellow-400/30 transition-all transform hover:scale-105">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
                <span className="font-semibold text-yellow-400">Anonymous Play</span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping animation-delay-1000"></div>
              </div>
              <div className="inline-flex items-center space-x-3 glass rounded-full px-6 py-3 backdrop-blur-xl shadow-2xl hover:shadow-blue-400/30 transition-all transform hover:scale-105">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span className="font-semibold text-blue-400">Instant Payouts</span>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-2000"></div>
              </div>
              <div className="inline-flex items-center space-x-3 glass rounded-full px-6 py-3 backdrop-blur-xl shadow-2xl hover:shadow-purple-400/30 transition-all transform hover:scale-105">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
                <span className="font-semibold text-purple-400">Crypto Only</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping animation-delay-3000"></div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/games" 
                    className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black py-4 px-10 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50 flex items-center justify-center space-x-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
                    <svg className="w-8 h-8 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                      <circle cx="7" cy="10" r="1"/>
                      <circle cx="13" cy="10" r="1"/>
                      <circle cx="10" cy="13" r="1"/>
                    </svg>
                    <span className="relative z-10">Start Playing Now</span>
                    <div className="relative z-10 ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">HOT</div>
                  </Link>
                  <Link 
                    href="/how-it-works"
                    className="group glass hover:glass-dark text-white font-bold py-4 px-10 rounded-2xl text-xl border border-gray-600/50 hover:border-gray-400/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <span>How It Works</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black py-4 px-10 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50 flex items-center justify-center space-x-3 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
                    <svg className="w-8 h-8 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span className="relative z-10">Sign Up & Get 100% Bonus</span>
                    <div className="relative z-10 ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">NEW</div>
                  </Link>
                  
                  <Link 
                    href="/login"
                    className="group glass hover:glass-dark text-white font-bold py-4 px-10 rounded-2xl text-xl border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </Link>
                </>
              )}
            </div>

            {/* Bonus Calculator */}
            {!isAuthenticated && (
              <div className="mt-12 inline-block glass rounded-2xl p-6 backdrop-blur-xl">
                <h3 className="text-xl font-bold text-white mb-4">💰 Bonus Calculator</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="text-sm text-gray-400">Your Deposit</label>
                    <input 
                      type="number" 
                      placeholder="0.1" 
                      className="block w-24 px-3 py-2 bg-gray-800 text-white rounded-lg text-center"
                      onChange={(e) => {
                        const bonus = parseFloat(e.target.value) || 0
                        document.getElementById('bonus-result').innerText = `You Get: ${bonus * 2} BTC Total!`
                      }}
                    />
                    <span className="text-xs text-gray-500">BTC</span>
                  </div>
                  <div className="text-4xl">+</div>
                  <div>
                    <div className="text-sm text-gray-400">100% Bonus</div>
                    <div className="text-2xl font-bold text-green-400">= 2x</div>
                  </div>
                </div>
                <div id="bonus-result" className="mt-4 text-lg font-bold text-yellow-400">
                  You Get: Double Your Money!
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Promotions Banner */}
        <section className="relative z-10 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotions.map((promo, index) => (
                <div key={index} className={`group relative glass rounded-3xl p-6 backdrop-blur-xl shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-700/50 overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">{promo.title}</h3>
                    <p className="text-gray-400 mb-4">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Ends in</div>
                        <div className="font-bold text-yellow-400">{promo.timeLeft}</div>
                      </div>
                      <button className={`px-4 py-2 bg-gradient-to-r ${promo.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105`}>
                        Claim Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Game Demos */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black mb-6 tracking-tight">
                Try Before You <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Play</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Test our games with these interactive demos - no registration required!
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <MiniDiceDemo />
              <MiniCoinflipDemo />
              <div className="glass rounded-2xl p-6 text-center">
                <h4 className="text-lg font-bold text-white mb-4">🚀 Crash Demo</h4>
                <div className="mb-4">
                  <div className="w-16 h-16 mx-auto bg-red-500 rounded-lg flex items-center justify-center text-2xl font-bold text-white">
                    1.5x
                  </div>
                </div>
                <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                  Watch Demo
                </button>
                <p className="mt-2 text-sm text-gray-300">Multiplier rising... Cash out before crash!</p>
              </div>
            </div>

            <div className="text-center">
              <Link href="/games" className="group inline-flex items-center space-x-4 glass hover:glass-dark text-white py-4 px-10 rounded-2xl font-bold text-xl border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl shadow-2xl">
                <span>Ready to Play for Real?</span>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Live Stats Section */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl animate-pulse">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Live Casino Statistics</h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Real-time data from our blockchain-verified gaming platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Enhanced stat cards with live updates */}
              <div className="group relative glass rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl hover:shadow-yellow-400/20 transition-all duration-300 transform hover:scale-105 border border-gray-700/50 hover:border-yellow-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-yellow-400 mb-2 tabular-nums">${liveStats.totalPaid.toLocaleString()}</div>
                  <div className="text-gray-400 font-semibold">Total Paid Out</div>
                  <div className="text-sm text-green-400 mt-2 font-medium flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Live Updates
                  </div>
                </div>
              </div>

              <div className="group relative glass rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl hover:shadow-purple-400/20 transition-all duration-300 transform hover:scale-105 border border-gray-700/50 hover:border-purple-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                      <circle cx="7" cy="10" r="1"/>
                      <circle cx="13" cy="10" r="1"/>
                      <circle cx="10" cy="13" r="1"/>
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-purple-400 mb-2 tabular-nums">{liveStats.gamesPlayed.toLocaleString()}</div>
                  <div className="text-gray-400 font-semibold">Games Played</div>
                  <div className="text-sm text-green-400 mt-2 font-medium">+247 this hour</div>
                </div>
              </div>

              <div className="group relative glass rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl hover:shadow-blue-400/20 transition-all duration-300 transform hover:scale-105 border border-gray-700/50 hover:border-blue-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-blue-400 mb-2 tabular-nums">{onlinePlayers.toLocaleString()}</div>
                  <div className="text-gray-400 font-semibold">Online Now</div>
                  <div className="text-sm text-green-400 mt-2 font-medium flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
                    Live Count
                  </div>
                </div>
              </div>

              <div className="group relative glass rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl hover:shadow-green-400/20 transition-all duration-300 transform hover:scale-105 border border-gray-700/50 hover:border-green-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div className="text-4xl font-black text-green-400 mb-2 tabular-nums">${jackpot.toLocaleString()}</div>
                  <div className="text-gray-400 font-semibold">Current Jackpot</div>
                  <div className="text-sm text-yellow-400 mt-2 font-medium animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                    Growing Live!
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Wins Showcase */}
            <div className="glass rounded-3xl p-8 backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🎉 Recent Big Wins</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentWins.slice(0, 3).map((win, index) => (
                  <div key={index} className="glass-dark rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">${win.amount.toLocaleString()}</div>
                    <div className="text-gray-300">{win.player}</div>
                    <div className="text-sm text-gray-500">{win.game} • {win.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">What Players Say</h2>
              <p className="text-xl text-gray-400">Real feedback from our community</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="glass rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold">
                      {testimonial.user[0]}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">{testimonial.user}</div>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.text}"</p>
                  <div className="text-green-400 font-bold">Won: {testimonial.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Games Preview with HOT indicators */}
        <section className="relative z-10 py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8 shadow-2xl animate-float">
                <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                  <circle cx="7" cy="10" r="1"/>
                  <circle cx="13" cy="10" r="1"/>
                  <circle cx="10" cy="13" r="1"/>
                </svg>
              </div>
              <h2 className="text-6xl font-black mb-6 tracking-tight">
                Choose Your <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Game</span>
              </h2>
              <p className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Premium blockchain gaming experience with instant rewards and transparent mechanics
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Enhanced Game Cards */}
              {[
                { 
                  name: 'Dice Game', 
                  icon: '🎲', 
                  color: 'from-blue-500 to-purple-600',
                  tag: 'HOT',
                  tagColor: 'from-red-500 to-orange-500',
                  players: 1247,
                  edge: '1%',
                  minBet: '0.001 BTC',
                  maxBet: '1 BTC',
                  description: 'Roll the dice and win big with customizable odds. Set your target number for potentially massive payouts.'
                },
                {
                  name: 'Coinflip',
                  icon: '🪙',
                  color: 'from-green-500 to-teal-600',
                  tag: '50/50',
                  tagColor: 'from-green-500 to-emerald-500',
                  players: 892,
                  edge: '2%',
                  minBet: '0.001 BTC',
                  maxBet: '0.5 BTC',
                  description: 'Classic heads or tails with perfect 50/50 odds. Simple, fast, and fair with instant results.'
                },
                {
                  name: 'Crash',
                  icon: '🚀',
                  color: 'from-red-500 to-orange-600',
                  tag: 'NEW',
                  tagColor: 'from-purple-500 to-pink-500',
                  players: 2156,
                  edge: '1%',
                  minBet: '0.001 BTC',
                  maxBet: '∞',
                  description: 'Watch the multiplier rocket rise and cash out before it crashes! Maximum thrills and explosive rewards.'
                }
              ].map((game, index) => (
                <div key={index} className="group relative glass rounded-3xl p-8 backdrop-blur-xl shadow-2xl hover:shadow-xl transition-all duration-500 transform hover:scale-105 border border-gray-700/50 hover:border-gray-500/50 overflow-hidden">
                  {/* Animated background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${game.color} opacity-5 group-hover:opacity-15 rounded-3xl transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="relative">
                        <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${game.color} rounded-2xl shadow-xl`}>
                          <span className="text-3xl">{game.icon}</span>
                        </div>
                        {/* Live player indicator */}
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                          {game.players}
                        </div>
                      </div>
                      <span className={`bg-gradient-to-r ${game.tagColor} text-white text-sm font-black px-3 py-1 rounded-full shadow-lg animate-pulse`}>
                        {game.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-3">{game.name}</h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {game.description}
                    </p>
                    
                    <div className="space-y-3 mb-8 glass-dark rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">House Edge:</span>
                        <span className="text-green-400 font-bold">{game.edge}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Min Bet:</span>
                        <span className="text-white font-bold">{game.minBet}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Max Bet:</span>
                        <span className="text-white font-bold">{game.maxBet}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-medium">Players:</span>
                        <span className="text-blue-400 font-bold flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
                          {game.players} live
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Link 
                        href={`/games/${game.name.toLowerCase().replace(' ', '')}`} 
                        className="group flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-center py-3 rounded-xl font-black transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
                        <span className="relative z-10">Play Now</span>
                      </Link>
                      <button className="glass-dark hover:glass text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                        Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Call-to-Action */}
            <div className="text-center mt-20">
              <Link href="/games" className="group inline-flex items-center space-x-4 glass hover:glass-dark text-white py-4 px-10 rounded-2xl font-bold text-xl border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl shadow-2xl">
                <svg className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                  <circle cx="7" cy="10" r="1"/>
                  <circle cx="13" cy="10" r="1"/>
                  <circle cx="10" cy="13" r="1"/>
                </svg>
                <span>View All Games</span>
                <div className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">LIVE</div>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Chat Teaser */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="glass rounded-2xl p-4 backdrop-blur-xl shadow-2xl max-w-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">Live Chat</span>
              <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-bold">247 online</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="text-gray-300">
                <strong className="text-yellow-400">CryptoKing:</strong> Just hit 50x on crash! 🚀
              </div>
              <div className="text-gray-300">
                <strong className="text-green-400">LuckyPlayer:</strong> Congrats! Going for dice next
              </div>
            </div>
            <button className="mt-3 w-full px-3 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
              Join Chat
            </button>
          </div>
        </div>

        {/* Exit Intent Popup */}
        {showExitIntent && !isAuthenticated && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-8 max-w-lg mx-auto text-center backdrop-blur-xl shadow-2xl border border-yellow-400/30">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-white mb-4">Wait! Don't Leave Empty Handed!</h3>
              <p className="text-gray-300 mb-6">Get an exclusive 150% welcome bonus + 50 free spins!</p>
              <div className="space-y-4">
                <Link 
                  href="/register" 
                  className="block w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all"
                  onClick={() => setShowExitIntent(false)}
                >
                  Claim Your Bonus Now!
                </Link>
                <button 
                  onClick={() => setShowExitIntent(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  No thanks, I'll pass on free money
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced CSS Animations */}
        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          @keyframes holographic-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          @keyframes number-flip {
            0% { transform: rotateX(0); }
            50% { transform: rotateX(90deg); }
            100% { transform: rotateX(0); }
          }
          .animate-number-flip:hover {
            animation: number-flip 0.6s ease-in-out;
          }
          .animation-delay-1000 { animation-delay: 1s; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-3000 { animation-delay: 3s; }
          .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .glass-dark {
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .glass:hover {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .tabular-nums {
            font-variant-numeric: tabular-nums;
          }
        `}</style>
      </div>
    </Layout>
  )
}