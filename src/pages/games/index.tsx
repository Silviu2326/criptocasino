import React from 'react'
import Link from 'next/link'

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-orange-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <h1 className="text-7xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4 tracking-tight">
              CRYPTO CASINO
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-60"></div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 tracking-wide">
            Choose Your <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text animate-pulse">Destiny</span>
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-5xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="font-semibold text-yellow-400">Provably Fair</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
              <span className="font-semibold text-green-400">Instant Payouts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-semibold text-blue-400">24/7 Gaming</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
              </div>
              <span className="font-semibold text-purple-400">Crypto Only</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {/* Dice Game */}
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-yellow-400/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 transform-gpu">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Players Online</div>
                  <div className="text-2xl font-black text-white flex items-center justify-end">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">234</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                  <span>HOT</span>
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">DICE</span>
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Roll the dice and <span className="font-semibold text-yellow-400">win big</span> with customizable odds. Set your target and watch fortune unfold!
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-gray-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">House Edge</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">1%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Max Win</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">50x</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet: <span className="text-yellow-400 font-mono">0.001 BTC</span></span>
                    <span className="text-gray-400">Max Bet: <span className="text-yellow-400 font-mono">1 BTC</span></span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/games/dice" className="group flex-1 relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    <span>PLAY NOW</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/games/dice" className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-gray-500/80 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Coinflip Game */}
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-green-400/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/20 transform-gpu">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-teal-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-2xl shadow-xl group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Players Online</div>
                  <div className="text-2xl font-black text-white flex items-center justify-end">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">189</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">COINFLIP</span>
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                Classic <span className="font-semibold text-green-400">heads or tails</span> with 50/50 odds. Simple, fast, and instant fortune!
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-gray-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">House Edge</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">2%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Win Rate</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">2x</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet: <span className="text-green-400 font-mono">0.001 BTC</span></span>
                    <span className="text-gray-400">Max Bet: <span className="text-green-400 font-mono">0.5 BTC</span></span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/games/coinflip" className="group flex-1 relative overflow-hidden bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-black text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                    </svg>
                    <span>FLIP NOW</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/games/coinflip" className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-gray-500/80 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Crash Game */}
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-red-400/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/20 transform-gpu">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-2xl shadow-xl group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      <path d="M12 16L10 21H14L12 16Z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Players Online</div>
                  <div className="text-2xl font-black text-white flex items-center justify-end">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">156</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-red-400 to-orange-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                  </svg>
                  <span>NEW</span>
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">CRASH</span>
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  <path d="M12 16L10 21H14L12 16Z"/>
                </svg>Watch the multiplier <span className="font-semibold text-red-400">rocket rise</span> and cash out before it crashes! High risk, massive rewards.
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-gray-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">House Edge</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">1%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Max Win</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">100x</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet: <span className="text-red-400 font-mono">0.001 BTC</span></span>
                    <span className="text-gray-400">Max Bet: <span className="text-red-400 font-mono">1 BTC</span></span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/games/crash" className="group flex-1 relative overflow-hidden bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      <path d="M12 16L10 21H14L12 16Z"/>
                    </svg>
                    <span>LAUNCH NOW</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/games/crash" className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-gray-500/80 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Lucky Wheel Game */}
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-yellow-400/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 transform-gpu">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-2xl shadow-xl group-hover:shadow-yellow-500/50 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Players Online</div>
                  <div className="text-2xl font-black text-white flex items-center justify-end">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">278</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM6 10a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zM.343 15.657a1 1 0 001.414-1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM11 14a1 1 0 10-2 0v1a1 1 0 102 0v-1zM14.95 14.95a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707z"/>
                  </svg>
                  <span>POPULAR</span>
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">LUCKY WHEEL</span>
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>Spin the <span className="font-semibold text-yellow-400">fortune wheel</span>! Pick your multiplier and watch the wheel decide your fate.
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-gray-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">House Edge</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">2.8%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Max Win</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">50x</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet: <span className="text-yellow-400 font-mono">0.001 BTC</span></span>
                    <span className="text-gray-400">Max Bet: <span className="text-yellow-400 font-mono">0.5 BTC</span></span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/games/wheel" className="group flex-1 relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>
                    <span>SPIN NOW</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/games/wheel" className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-gray-500/80 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Plinko Game */}
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-purple-400/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400/20 transform-gpu">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="4" cy="4" r="2"/>
                      <circle cx="12" cy="4" r="2"/>
                      <circle cx="20" cy="4" r="2"/>
                      <circle cx="4" cy="12" r="2"/>
                      <circle cx="12" cy="12" r="2"/>
                      <circle cx="20" cy="12" r="2"/>
                      <circle cx="4" cy="20" r="2"/>
                      <circle cx="12" cy="20" r="2"/>
                      <circle cx="20" cy="20" r="2"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Players Online</div>
                  <div className="text-2xl font-black text-white flex items-center justify-end">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">342</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                  <span>ADDICTIVE</span>
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">PLINKO</span>
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="4" cy="4" r="2"/>
                  <circle cx="12" cy="4" r="2"/>
                  <circle cx="20" cy="4" r="2"/>
                  <circle cx="4" cy="12" r="2"/>
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="20" cy="12" r="2"/>
                  <circle cx="4" cy="20" r="2"/>
                  <circle cx="12" cy="20" r="2"/>
                  <circle cx="20" cy="20" r="2"/>
                </svg>Drop balls through pegs and watch them <span className="font-semibold text-purple-400">bounce to massive multipliers</span> below!
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-gray-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">House Edge</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">1%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Max Win</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">29x</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet: <span className="text-purple-400 font-mono">0.001 BTC</span></span>
                    <span className="text-gray-400">Max Bet: <span className="text-purple-400 font-mono">0.5 BTC</span></span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/games/plinko" className="group flex-1 relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span>DROP NOW</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/games/plinko" className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-gray-500/80 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Demo</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Prediction Markets Game */}
          <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 hover:border-blue-400/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/20 transform-gpu">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-2xl shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3v18h18v-2H5V3H3zm4 14h2V9H7v8zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-ping opacity-75"></div>
                </div>
                
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-400 font-medium tracking-wider uppercase">Active Markets</div>
                  <div className="text-2xl font-black text-white flex items-center justify-end">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3 shadow-lg shadow-green-400/50" />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">87</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg animate-bounce">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>SMART</span>
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">PREDICTION MARKETS</span>
              </h3>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3v18h18v-2H5V3H3zm4 14h2V9H7v8zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z"/>
                </svg>Bet on <span className="font-semibold text-blue-400">future events</span>! Yes/No markets resolved by oracles with community-driven outcomes.
              </p>

              <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-gray-600/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Platform Fee</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">5%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Max Return</div>
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">∞</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Min Bet: <span className="text-blue-400 font-mono">0.001 BTC</span></span>
                    <span className="text-gray-400">Max Bet: <span className="text-blue-400 font-mono">No Limit</span></span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link href="/games/predictions" className="group flex-1 relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white text-center py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50">
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3v18h18v-2H5V3H3zm4 14h2V9H7v8zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z"/>
                    </svg>
                    <span>PREDICT NOW</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link href="/games/predictions" className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700/80 text-white px-8 py-4 rounded-2xl transition-all duration-300 font-bold border border-gray-600/50 hover:border-gray-500/80 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Browse</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Game Statistics */}
        <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-12 text-center border border-gray-700/50 shadow-2xl">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5 rounded-3xl"></div>
          <div className="absolute top-4 left-4 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-orange-600/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 right-4 w-40 h-40 bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3v18h18v-2H5V3H3zm4 14h2V9H7v8zm4 0h2V7h-2v10zm4 0h2v-4h-2v4z"/>
                </svg>
              </div>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  LIVE STATISTICS
                </span>
              </h2>
              <p className="text-gray-300 text-lg">Real-time casino activity</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="group relative">
                <div className="bg-black/30 rounded-2xl p-6 border border-gray-600/30 group-hover:border-yellow-400/50 transition-all duration-300">
                  <div className="text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">1,234</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Games Today</div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="group relative">
                <div className="bg-black/30 rounded-2xl p-6 border border-gray-600/30 group-hover:border-green-400/50 transition-all duration-300">
                  <div className="text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">₿12.34</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Total Won</div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="group relative">
                <div className="bg-black/30 rounded-2xl p-6 border border-gray-600/30 group-hover:border-blue-400/50 transition-all duration-300">
                  <div className="text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">892</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Active Players</div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="group relative">
                <div className="bg-black/30 rounded-2xl p-6 border border-gray-600/30 group-hover:border-purple-400/50 transition-all duration-300">
                  <div className="text-4xl font-black mb-2">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">₿5.67</span>
                  </div>
                  <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Biggest Win</div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="inline-flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                Updated every second • All times UTC
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}