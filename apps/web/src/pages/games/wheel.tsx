import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

// Wheel segments with multipliers and colors
const WHEEL_SEGMENTS = [
  { multiplier: 0, color: '#10b981', label: 'x0', probability: 0.02 },    // Green - 2%
  { multiplier: 1.2, color: '#3b82f6', label: 'x1.2', probability: 0.30 }, // Blue - 30%
  { multiplier: 1.5, color: '#8b5cf6', label: 'x1.5', probability: 0.25 }, // Purple - 25%
  { multiplier: 2, color: '#f59e0b', label: 'x2', probability: 0.20 },     // Amber - 20%
  { multiplier: 3, color: '#ef4444', label: 'x3', probability: 0.10 },     // Red - 10%
  { multiplier: 5, color: '#ec4899', label: 'x5', probability: 0.08 },     // Pink - 8%
  { multiplier: 10, color: '#14b8a6', label: 'x10', probability: 0.04 },   // Teal - 4%
  { multiplier: 50, color: '#fbbf24', label: 'x50', probability: 0.01 },   // Gold - 1%
]

// Duplicate segments for the actual wheel display (total 24 segments)
const WHEEL_DISPLAY = [
  ...WHEEL_SEGMENTS.slice(0, 7), // 7 segments
  ...WHEEL_SEGMENTS.slice(1, 7), // 6 segments (skip x0)
  ...WHEEL_SEGMENTS.slice(1, 6), // 5 segments
  ...WHEEL_SEGMENTS.slice(1, 5), // 4 segments
  ...WHEEL_SEGMENTS.slice(1, 3), // 2 segments
]

export default function WheelGame() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedSegment, setSelectedSegment] = useState<typeof WHEEL_SEGMENTS[0] | null>(null)
  const [betAmount, setBetAmount] = useState(0.001)
  const [balance, setBalance] = useState(1.234) // Demo balance
  const [gameHistory, setGameHistory] = useState<{multiplier: number, color: string, win: boolean}[]>([])
  const [showResult, setShowResult] = useState(false)
  const [particles, setParticles] = useState<{x: number, y: number, color: string}[]>([])
  const wheelRef = useRef<HTMLDivElement>(null)
  const [selectedBet, setSelectedBet] = useState<number | null>(null) // Which multiplier user is betting on
  
  const segmentAngle = 360 / WHEEL_DISPLAY.length
  
  // Calculate winning segment based on probabilities
  const calculateWinningSegment = () => {
    const random = Math.random()
    let cumulative = 0
    
    for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
      cumulative += WHEEL_SEGMENTS[i].probability
      if (random <= cumulative) {
        // Find this segment in the display wheel
        const displayIndex = WHEEL_DISPLAY.findIndex(s => s.multiplier === WHEEL_SEGMENTS[i].multiplier)
        return { segment: WHEEL_SEGMENTS[i], displayIndex }
      }
    }
    
    return { segment: WHEEL_SEGMENTS[0], displayIndex: 0 }
  }
  
  const spinWheel = () => {
    if (isSpinning || balance < betAmount || selectedBet === null) return
    
    setIsSpinning(true)
    setShowResult(false)
    setBalance(prev => prev - betAmount) // Deduct bet
    
    // Calculate result
    const { segment, displayIndex } = calculateWinningSegment()
    
    // Calculate rotation to land on the winning segment
    const targetAngle = displayIndex * segmentAngle
    const extraSpins = 5 + Math.random() * 3 // 5-8 full rotations
    const finalRotation = rotation + (extraSpins * 360) + (360 - targetAngle) + (segmentAngle / 2)
    
    // Apply rotation with easing
    setRotation(finalRotation)
    
    // Show result after animation
    setTimeout(() => {
      setSelectedSegment(segment)
      setIsSpinning(false)
      setShowResult(true)
      
      // Check if user won
      const won = segment.multiplier === selectedBet
      
      if (won) {
        const winAmount = betAmount * segment.multiplier
        setBalance(prev => prev + winAmount)
        
        // Create celebration particles
        const newParticles = []
        for (let i = 0; i < 30; i++) {
          newParticles.push({
            x: 50 + (Math.random() - 0.5) * 30,
            y: 50 + (Math.random() - 0.5) * 30,
            color: segment.color
          })
        }
        setParticles(newParticles)
        setTimeout(() => setParticles([]), 2000)
      }
      
      // Add to history
      setGameHistory(prev => [{
        multiplier: segment.multiplier,
        color: segment.color,
        win: won
      }, ...prev.slice(0, 9)])
      
    }, 4000) // Match animation duration
  }
  
  // Draw wheel on canvas
  useEffect(() => {
    const canvas = document.getElementById('wheelCanvas') as HTMLCanvasElement
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const centerX = 250
    const centerY = 250
    const radius = 200
    
    // Clear canvas
    ctx.clearRect(0, 0, 500, 500)
    
    // Draw segments
    WHEEL_DISPLAY.forEach((segment, index) => {
      const startAngle = (index * segmentAngle - 90) * Math.PI / 180
      const endAngle = ((index + 1) * segmentAngle - 90) * Math.PI / 180
      
      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segment.color
      ctx.fill()
      
      // Draw border
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 2
      ctx.stroke()
      
      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate((startAngle + endAngle) / 2)
      ctx.textAlign = 'center'
      ctx.font = 'bold 18px monospace'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(segment.label, radius * 0.7, 6)
      ctx.restore()
    })
    
    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.fillStyle = '#1f2937'
    ctx.fill()
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Draw center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = '#fbbf24'
    ctx.fill()
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/10 via-orange-900/10 to-amber-900/10 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-yellow-400/5 to-orange-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-orange-500/5 to-amber-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/games" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Games
          </Link>
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-8 shadow-2xl animate-pulse">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="6" r="2" fill="currentColor"/>
              <circle cx="6" cy="18" r="2" fill="currentColor"/>
              <circle cx="18" cy="18" r="2" fill="currentColor"/>
              <circle cx="6" cy="6" r="1" fill="currentColor"/>
              <circle cx="18" cy="6" r="1" fill="currentColor"/>
              <circle cx="12" cy="18" r="1" fill="currentColor"/>
            </svg>
          </div>
          
          <h1 className="text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">LUCKY WHEEL</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Spin the wheel and <span className="font-semibold text-yellow-400">multiply your bet!</span> Choose your target multiplier wisely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wheel Container */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/30 shadow-2xl">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-amber-500/10 rounded-3xl opacity-75 animate-pulse"></div>
              {/* Enhanced Pointer */}
              <div className="relative z-20">
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <div className="flex flex-col items-center">
                    <div className="w-0 h-0 border-l-[35px] border-l-transparent border-t-[60px] border-t-gradient-to-r from-yellow-400 to-orange-500 border-r-[35px] border-r-transparent filter drop-shadow-2xl animate-bounce" style={{animationDuration: '2s'}}></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mt-2 animate-pulse shadow-lg"></div>
                    <div className="text-yellow-400 text-xs font-bold mt-1 tracking-wider">WINNER</div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Wheel Container */}
              <div className="relative flex justify-center items-center" style={{ height: '500px' }}>
                {/* Outer glow ring */}
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-[520px] h-[520px] rounded-full bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-amber-500/20 blur-xl animate-spin" style={{animationDuration: '20s'}}></div>
                </div>
                
                {/* Middle glow ring */}
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-[510px] h-[510px] rounded-full border-2 border-gradient-to-r from-yellow-400/30 to-orange-500/30 animate-pulse"></div>
                </div>
                <div 
                  ref={wheelRef}
                  className="relative"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
                    willChange: 'transform'
                  }}
                >
                  <canvas 
                    id="wheelCanvas" 
                    width="500" 
                    height="500"
                    className="rounded-full shadow-2xl border-4 border-yellow-400/50"
                    style={{
                      filter: isSpinning ? 'blur(1px) brightness(1.2)' : 'brightness(1)',
                      transition: 'filter 0.3s ease'
                    }}
                  />
                  {/* Enhanced multi-layer glow effects */}
                  <div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-400/30 via-orange-500/20 to-transparent opacity-60 animate-pulse pointer-events-none"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-radial from-white/10 to-transparent opacity-40 animate-ping pointer-events-none" style={{animationDuration: '3s'}}></div>
                  {isSpinning && (
                    <div className="absolute inset-0 rounded-full bg-gradient-radial from-yellow-400/40 to-transparent opacity-80 animate-pulse pointer-events-none" style={{animationDuration: '0.5s'}}></div>
                  )}
                </div>
                
                {/* Result Display */}
                {showResult && selectedSegment && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/90 rounded-2xl p-8 animate-fade-in border-2 border-yellow-400 transform scale-110">
                      <div className="text-center">
                        <div 
                          className="text-6xl font-black mb-4"
                          style={{ color: selectedSegment.color }}
                        >
                          {selectedSegment.label}
                        </div>
                        {selectedBet === selectedSegment.multiplier ? (
                          <>
                            <div className="text-3xl text-green-400 font-bold">YOU WIN!</div>
                            <div className="text-xl text-white mt-2">
                              +{(betAmount * selectedSegment.multiplier - betAmount).toFixed(4)} BTC
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-3xl text-red-400 font-bold">TRY AGAIN!</div>
                            <div className="text-xl text-white mt-2">
                              You bet on x{selectedBet}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Enhanced Particles */}
                {particles.map((particle, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full animate-bounce"
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                      width: `${4 + Math.random() * 8}px`,
                      height: `${4 + Math.random() * 8}px`,
                      backgroundColor: particle.color,
                      boxShadow: `0 0 10px ${particle.color}`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: `${1 + Math.random() * 2}s`
                    }}
                  />
                ))}
                
                {/* Spinning indicator */}
                {isSpinning && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/70 px-3 py-2 rounded-full">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-yellow-400 text-sm font-bold">SPINNING</span>
                  </div>
                )}
              </div>
              
              {/* Betting Options */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Choose Your Bet:</h3>
                <div className="grid grid-cols-4 gap-3">
                  {WHEEL_SEGMENTS.map(segment => (
                    <button
                      key={segment.multiplier}
                      onClick={() => setSelectedBet(segment.multiplier)}
                      disabled={isSpinning}
                      className={`
                        p-4 rounded-lg font-bold text-white transition-all duration-300 transform hover:scale-105
                        ${selectedBet === segment.multiplier 
                          ? 'ring-4 ring-yellow-400 scale-105' 
                          : 'hover:ring-2 hover:ring-gray-400'}
                        ${isSpinning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      style={{ backgroundColor: segment.color }}
                    >
                      <div className="text-lg">{segment.label}</div>
                      <div className="text-xs opacity-75">{(segment.probability * 100).toFixed(0)}%</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls & Stats */}
          <div className="space-y-6">
            {/* Betting Panel */}
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-yellow-400/30 shadow-2xl">
              {/* Panel glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                  <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="6" r="2" fill="currentColor"/>
                    <circle cx="6" cy="18" r="2" fill="currentColor"/>
                    <circle cx="18" cy="18" r="2" fill="currentColor"/>
                  </svg>
                  <span>Place Your Bet</span>
                </h3>
              
              <div className="space-y-4">
                {/* Bet Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bet Amount (BTC)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max={balance}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(0.001, parseFloat(e.target.value) || 0.001))}
                    disabled={isSpinning}
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Quick Bet Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBetAmount(prev => Math.min(balance, prev * 2))}
                    disabled={isSpinning}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    2×
                  </button>
                  <button
                    onClick={() => setBetAmount(prev => Math.max(0.001, prev / 2))}
                    disabled={isSpinning}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    ½×
                  </button>
                  <button
                    onClick={() => setBetAmount(balance)}
                    disabled={isSpinning}
                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
                
                {/* Selected Bet Display */}
                {selectedBet !== null && (
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Betting on:</span>
                      <span 
                        className="font-bold text-xl px-3 py-1 rounded"
                        style={{ 
                          backgroundColor: WHEEL_SEGMENTS.find(s => s.multiplier === selectedBet)?.color,
                          color: '#ffffff'
                        }}
                      >
                        {selectedBet}x
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Potential win: {(betAmount * selectedBet).toFixed(4)} BTC
                    </div>
                  </div>
                )}
                
                {/* Spin Button */}
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || balance < betAmount || selectedBet === null}
                  className={`
                    w-full py-4 px-6 rounded-xl font-bold text-xl transition-all duration-300 transform
                    ${!isSpinning && balance >= betAmount && selectedBet !== null
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 hover:scale-105 shadow-lg hover:shadow-yellow-400/30'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                  `}
                >
                  {isSpinning ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      <span>SPINNING...</span>
                    </div>
                  ) : selectedBet === null ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                      </svg>
                      <span>SELECT A BET FIRST</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="6" r="2" fill="currentColor"/>
                      </svg>
                      <span>SPIN THE WHEEL ({betAmount.toFixed(4)} BTC)</span>
                    </div>
                  )}
                </button>
                
                {/* Balance */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      <span>Balance:</span>
                    </div>
                    <span className="text-white font-bold text-lg">{balance.toFixed(4)} BTC</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            {/* Game Stats */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
                <span>Probabilities</span>
              </h3>
              <div className="space-y-2 text-sm">
                {WHEEL_SEGMENTS.map(segment => (
                  <div key={segment.multiplier} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: segment.color }}
                      />
                      <span className="text-gray-300">{segment.label}</span>
                    </div>
                    <span className="text-white font-mono">{(segment.probability * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* History */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                <span>Recent Spins</span>
              </h3>
              <div className="space-y-2">
                {gameHistory.length === 0 ? (
                  <div className="text-gray-400 text-center py-4">No spins yet</div>
                ) : (
                  gameHistory.map((spin, i) => (
                    <div 
                      key={i} 
                      className={`flex justify-between items-center p-2 rounded ${
                        spin.win ? 'bg-green-500/20' : 'bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: spin.color }}
                        />
                        <span className="text-white font-bold">{spin.multiplier}x</span>
                      </div>
                      <span className={spin.win ? 'text-green-400' : 'text-gray-400'}>
                        {spin.win ? 'WIN' : 'LOSE'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}