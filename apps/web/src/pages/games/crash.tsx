import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function CrashGame() {
  const [gameState, setGameState] = useState<'waiting' | 'running' | 'crashed'>('waiting')
  const [multiplier, setMultiplier] = useState(1.00)
  const [betAmount, setBetAmount] = useState(0.001)
  const [hasBet, setHasBet] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [cashoutMultiplier, setCashoutMultiplier] = useState(0)
  const [crashPoint, setCrashPoint] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [balance, setBalance] = useState(1.234) // Demo balance
  const [gameHistory, setGameHistory] = useState<number[]>([2.34, 1.52, 7.89, 1.08, 3.45])
  const [playerHistory, setPlayerHistory] = useState<{multiplier: number, won: boolean, amount: number}[]>([])
  const [isPlacingBet, setIsPlacingBet] = useState(false)
  const [particles, setParticles] = useState<{x: number, y: number, vx: number, vy: number, life: number}[]>([])
  const [rocketTrail, setRocketTrail] = useState<{x: number, y: number, opacity: number}[]>([])
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [autoCashout, setAutoCashout] = useState(2.0)
  
  const intervalRef = useRef<NodeJS.Timeout>()
  const countdownRef = useRef<NodeJS.Timeout>()
  const particleRef = useRef<NodeJS.Timeout>()
  const autoCashoutRef = useRef<NodeJS.Timeout>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRunningRef = useRef(false)

  // Generate crash point using house edge algorithm
  const generateCrashPoint = () => {
    const houseEdge = 0.01 // 1% house edge
    const random = Math.random() * (1 - houseEdge)
    return Math.max(1.01, 1 / random)
  }

  // Clean up all intervals
  const cleanupIntervals = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = undefined
    }
    if (particleRef.current) {
      clearInterval(particleRef.current)
      particleRef.current = undefined
    }
    if (autoCashoutRef.current) {
      clearInterval(autoCashoutRef.current)
      autoCashoutRef.current = undefined
    }
  }

  // Start new game
  const startGame = () => {
    // Prevent multiple games running simultaneously
    if (gameRunningRef.current) {
      return
    }
    
    // Clean up any existing intervals
    cleanupIntervals()
    
    const newCrashPoint = generateCrashPoint()
    setCrashPoint(newCrashPoint)
    setGameState('running')
    setMultiplier(1.00)
    setHasWon(false)
    setCashoutMultiplier(0)
    setParticles([])
    setRocketTrail([])
    gameRunningRef.current = true
    
    let currentMultiplier = 1.00
    const startTime = Date.now()
    
    // Auto-cashout logic
    if (isAutoMode && hasBet && autoCashout > 1) {
      autoCashoutRef.current = setInterval(() => {
        if (currentMultiplier >= autoCashout && gameRunningRef.current && hasBet && !hasWon) {
          // Trigger cashout which will handle balance update
          cashOut()
          if (autoCashoutRef.current) {
            clearInterval(autoCashoutRef.current)
            autoCashoutRef.current = undefined
          }
        }
      }, 50)
    }
    
    intervalRef.current = setInterval(() => {
      if (!gameRunningRef.current) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = undefined
        }
        return
      }
      
      const elapsed = Date.now() - startTime
      // More realistic exponential growth
      const baseGrowth = elapsed / 1000
      currentMultiplier = 1 + Math.pow(baseGrowth, 1.4) * 0.8
      
      // Update rocket trail
      const rocketX = Math.min(780, baseGrowth * 60)
      const rocketY = 350 - Math.log(currentMultiplier) * 80
      setRocketTrail(prev => [{
        x: rocketX,
        y: rocketY,
        opacity: 1
      }, ...prev.slice(0, 15)].map((trail, i) => ({
        ...trail,
        opacity: trail.opacity * 0.9
      })))
      
      if (currentMultiplier >= newCrashPoint) {
        crashGame()
        return
      }
      
      setMultiplier(currentMultiplier)
    }, 50)
  }

  // Crash the game
  const crashGame = () => {
    // Stop the game immediately
    gameRunningRef.current = false
    cleanupIntervals()
    
    setGameState('crashed')
    setGameHistory(prev => [crashPoint, ...prev.slice(0, 4)])
    
    // Create explosion particles
    const explosionParticles = []
    for (let i = 0; i < 50; i++) {
      explosionParticles.push({
        x: 400 + (Math.random() - 0.5) * 100,
        y: 200 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 1.0
      })
    }
    setParticles(explosionParticles)
    
    // Animate particles
    particleRef.current = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02
        })).filter(p => p.life > 0)
        
        if (updated.length === 0 && particleRef.current) {
          clearInterval(particleRef.current)
          particleRef.current = undefined
        }
        
        return updated
      })
    }, 50)
    
    // Handle bet outcomes
    if (hasBet) {
      if (!hasWon) {
        // Player lost - bet amount was already deducted when placed, so just record the loss
        setPlayerHistory(prev => [{
          multiplier: crashPoint,
          won: false,
          amount: -betAmount
        }, ...prev.slice(0, 9)])
        console.log(`Player lost: ${betAmount} BTC was already deducted when bet was placed`)
      }
      // If hasWon is true, balance was already updated in cashOut function
    }
    
    // Start countdown for next game (increased to 10 seconds)
    setTimeLeft(10)
    countdownRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current)
            countdownRef.current = undefined
          }
          setGameState('waiting')
          setHasBet(false)
          setIsPlacingBet(false)
          // Small delay before starting new game to prevent race conditions
          setTimeout(() => {
            if (!gameRunningRef.current) {
              startGame()
            }
          }, 100)
          return 10
        }
        return prev - 1
      })
    }, 1000)
  }

  // Place bet
  const placeBet = async () => {
    if ((gameState === 'waiting' || gameState === 'crashed') && balance >= betAmount && !isPlacingBet && !hasBet) {
      setIsPlacingBet(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Deduct bet amount from balance immediately when placing bet
      setBalance(prev => prev - betAmount)
      setHasBet(true)
      setIsPlacingBet(false)
      
      console.log(`Bet placed: ${betAmount} BTC deducted from balance`)
    }
  }

  // Cash out
  const cashOut = () => {
    if (gameState === 'running' && hasBet && !hasWon) {
      setHasWon(true)
      setCashoutMultiplier(multiplier)
      const winAmount = betAmount * multiplier
      const profit = winAmount - betAmount
      
      // Add only the winnings to balance (bet was already deducted when placed)
      setBalance(prev => prev + winAmount)
      
      setPlayerHistory(prev => [{
        multiplier: multiplier,
        won: true,
        amount: profit
      }, ...prev.slice(0, 9)])
      
      console.log(`Cash out successful: +${winAmount} BTC added to balance (profit: ${profit} BTC)`)
    }
  }

  // Enhanced canvas drawing with particles and effects
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 400

    // Create gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bgGradient.addColorStop(0, 'rgba(17, 24, 39, 0.95)')
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = 'rgba(75, 85, 99, 0.2)'
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    if (gameState === 'running' || gameState === 'crashed') {
      // Draw enhanced multiplier curve
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, gameState === 'crashed' ? '#ef4444' : '#10b981')
      gradient.addColorStop(0.5, gameState === 'crashed' ? '#dc2626' : '#059669')
      gradient.addColorStop(1, gameState === 'crashed' ? '#b91c1c' : '#047857')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 4
      ctx.shadowColor = gameState === 'crashed' ? '#ef4444' : '#10b981'
      ctx.shadowBlur = 10
      ctx.beginPath()
      
      const points = 200
      for (let i = 0; i <= points; i++) {
        const progress = i / points
        const x = progress * canvas.width
        const currentMult = 1 + Math.pow(progress * (multiplier - 1), 1.2)
        const y = canvas.height - (Math.log(currentMult) * 120 + 60)
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw rocket trail
      rocketTrail.forEach((trail, index) => {
        ctx.fillStyle = `rgba(251, 191, 36, ${trail.opacity * 0.6})`
        ctx.beginPath()
        ctx.arc(trail.x, trail.y, 3 + index * 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw rocket
      const rocketX = Math.min(750, (multiplier - 1) * 100)
      const rocketY = canvas.height - (Math.log(multiplier) * 120 + 80)
      
      // Rocket glow
      const rocketGradient = ctx.createRadialGradient(rocketX, rocketY, 0, rocketX, rocketY, 25)
      rocketGradient.addColorStop(0, 'rgba(245, 158, 11, 1)')
      rocketGradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.6)')
      rocketGradient.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = rocketGradient
      ctx.beginPath()
      ctx.arc(rocketX, rocketY, 25, 0, Math.PI * 2)
      ctx.fill()
      
      // Rocket body
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(rocketX, rocketY, 8, 0, Math.PI * 2)
      ctx.fill()
      
      // Rocket flame
      for (let i = 0; i < 8; i++) {
        const flameLength = Math.random() * 20 + 10
        const flameAngle = Math.PI + (Math.random() - 0.5) * 0.5
        const flameX = rocketX + Math.cos(flameAngle) * flameLength
        const flameY = rocketY + Math.sin(flameAngle) * flameLength
        
        ctx.strokeStyle = `rgba(${255 - i * 20}, ${100 + i * 15}, 0, ${0.8 - i * 0.1})`
        ctx.lineWidth = 3 - i * 0.3
        ctx.beginPath()
        ctx.moveTo(rocketX, rocketY)
        ctx.lineTo(flameX, flameY)
        ctx.stroke()
      }
    }

    // Draw explosion particles
    particles.forEach(particle => {
      const alpha = particle.life
      ctx.fillStyle = `rgba(${255}, ${Math.floor(100 + particle.life * 155)}, 0, ${alpha})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, 3 + (1 - particle.life) * 5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw multiplier text on canvas
    if (gameState === 'running') {
      ctx.font = 'bold 24px monospace'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.shadowColor = '#000000'
      ctx.shadowBlur = 5
      ctx.fillText(`${multiplier.toFixed(2)}x`, canvas.width / 2, 40)
      ctx.shadowBlur = 0
    }

  }, [multiplier, gameState, particles, rocketTrail])

  // Component cleanup and initialization
  useEffect(() => {
    // Start first game after component mount
    const initGame = () => {
      if (!gameRunningRef.current) {
        startGame()
      }
    }
    
    // Small delay to ensure component is fully mounted
    const initTimeout = setTimeout(initGame, 100)
    
    return () => {
      clearTimeout(initTimeout)
      gameRunningRef.current = false
      cleanupIntervals()
    }
  }, []) // Empty dependency array - run only once on mount

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      gameRunningRef.current = false
      cleanupIntervals()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-orange-900/10 to-yellow-900/10 animate-pulse"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-red-400/5 to-orange-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '8s'}}></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-orange-500/5 to-yellow-600/5 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/games" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 transition-colors group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Games
          </Link>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-6xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">CRASH</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Watch the multiplier soar and <span className="font-semibold text-orange-400">cash out before it crashes!</span> Timing is everything.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Game Display */}
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 text-center overflow-hidden border border-red-400/30 shadow-2xl">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl opacity-75 animate-pulse"></div>
              {/* Crashed Overlay */}
              {gameState === 'crashed' && (
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-orange-600/20 backdrop-blur-lg flex items-center justify-center z-20 animate-fade-in">
                  <div className="text-center transform scale-110">
                    <div className="mb-6 animate-bounce">
                      <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full shadow-2xl">
                        <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-6xl font-black text-red-400 mb-4 neon-text animate-pulse">CRASHED!</div>
                    <div className="text-3xl font-bold text-white mb-6 holographic">at {crashPoint.toFixed(2)}x</div>
                    <div className="text-xl text-gray-200 bg-black/40 px-6 py-3 rounded-full">
                      Next game in <span className="text-yellow-400 font-bold">{timeLeft}</span>s
                    </div>
                  </div>
                </div>
              )}

              {/* Multiplier Display */}
              <div className="mb-8 relative">
                <div className={`text-9xl font-black mb-6 transition-all duration-300 ${
                  gameState === 'crashed' ? 'text-red-400 animate-bounce' : 
                  gameState === 'running' ? 'text-green-400 animate-glow-pulse neon-text' : 
                  'text-yellow-400 holographic'
                } drop-shadow-2xl`}>
                  {multiplier.toFixed(2)}x
                </div>
                
                {/* Status Indicators */}
                {gameState === 'waiting' && (
                  <div className="flex justify-center items-center space-x-4">
                    <div className="flex items-center space-x-3 text-2xl text-gray-300 animate-pulse">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      <span>Preparing launch...</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
                
                {gameState === 'running' && (
                  <div className="flex justify-center items-center space-x-6">
                    <div className="flex items-center space-x-3 text-3xl font-bold text-green-300 animate-pulse">
                      <svg className="w-10 h-10 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                      </svg>
                      <span>ROCKET FLYING!</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse ring-4 ring-green-400/30"></div>
                      <div className="text-lg text-green-200">LIVE</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Canvas Graph */}
              <div className="relative mb-8 perspective-1000">
                <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-xl blur-xl opacity-75 animate-pulse"></div>
                <canvas 
                  ref={canvasRef}
                  className="relative w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-yellow-400/30 shadow-2xl transform hover:scale-102 transition-transform duration-300"
                  style={{ maxWidth: '800px', height: '350px' }}
                />
                <div className="absolute top-2 right-4 bg-black/60 px-3 py-1 rounded-full text-sm font-mono text-yellow-400">
                  TARGET: {crashPoint > 0 ? crashPoint.toFixed(2) : '???'}x
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center space-x-6">
                  {!hasBet && (gameState === 'waiting' || gameState === 'crashed') && (
                    <button
                      onClick={placeBet}
                      disabled={balance < betAmount || isPlacingBet}
                      className={`
                        relative overflow-hidden px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300
                        ${balance >= betAmount && !isPlacingBet
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 transform hover:scale-110 shadow-2xl hover:shadow-yellow-400/50'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      {isPlacingBet ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          <span>Placing Bet...</span>
                        </div>
                      ) : gameState === 'crashed' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5zM10 1.5l7.5 5.25v12.5c0 .83-.67 1.5-1.5 1.5H4c-.83 0-1.5-.67-1.5-1.5V6.75L10 1.5z"/>
                          </svg>
                          <div>
                            <div>PLACE BET FOR NEXT ROUND ({betAmount.toFixed(4)} BTC)</div>
                            <div className="text-sm opacity-75">Starting in {timeLeft} seconds</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                          </svg>
                          <span>PLACE BET ({betAmount.toFixed(4)} BTC)</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  )}
                  
                  {hasBet && gameState === 'waiting' && (
                    <div className="glass px-8 py-4 text-xl font-bold rounded-xl border-2 border-green-400 text-green-400 flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>Bet Placed</span>
                      </div>
                    </div>
                  )}
                  
                  {hasBet && gameState === 'running' && !hasWon && (
                    <button
                      onClick={cashOut}
                      className="relative overflow-hidden px-8 py-4 text-xl font-bold rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 transform hover:scale-110 shadow-2xl hover:shadow-green-400/50 animate-pulse transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                        </svg>
                        <span>CASH OUT ({(betAmount * multiplier).toFixed(4)} BTC)</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                    </button>
                  )}
                  
                  {hasWon && (
                    <div className="glass border-2 border-green-400 px-8 py-4 text-xl font-bold rounded-xl text-green-400 flex items-center space-x-3">
                      <div className="animate-bounce">
                        <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span>Cashed Out at {cashoutMultiplier.toFixed(2)}x!</span>
                    </div>
                  )}
                </div>
                
                {/* Profit/Loss Display */}
                {(hasWon || (gameState === 'crashed' && hasBet)) && (
                  <div className={`text-lg font-bold px-4 py-2 rounded-lg ${
                    hasWon ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                  }`}>
                    {hasWon 
                      ? `+${((betAmount * cashoutMultiplier) - betAmount).toFixed(4)} BTC` 
                      : `-${betAmount.toFixed(4)} BTC`}
                  </div>
                )}
              </div>
            </div>

            {/* Game History */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Recent Crashes</h3>
              <div className="flex space-x-2 overflow-x-auto">
                {gameHistory.map((crash, index) => (
                  <div
                    key={index}
                    className={`
                      px-4 py-2 rounded-lg font-bold min-w-20 text-center
                      ${crash >= 2 ? 'bg-green-600 text-white' : 
                        crash >= 1.5 ? 'bg-yellow-600 text-white' : 
                        'bg-red-600 text-white'}
                    `}
                  >
                    {crash.toFixed(2)}x
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Betting Panel */}
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-orange-400/30 shadow-2xl">
              {/* Panel glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl"></div>
              <div className="relative z-10">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                </svg>
                <span>Betting Panel</span>
              </h3>
              
              <div className="space-y-6">
                {/* Bet Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                    </svg>
                    <span>Bet Amount (BTC)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      max={balance}
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(0.001, parseFloat(e.target.value) || 0.001))}
                      disabled={hasBet || gameState === 'running'}
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-lg text-white font-mono text-lg focus:border-yellow-400 focus:outline-none transition-colors disabled:opacity-50"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold">
                      ₿
                    </div>
                  </div>
                </div>

                {/* Quick Bet Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setBetAmount(prev => Math.min(balance, prev * 2))}
                    disabled={hasBet || gameState === 'running'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    2×
                  </button>
                  <button
                    onClick={() => setBetAmount(prev => Math.max(0.001, prev / 2))}
                    disabled={hasBet || gameState === 'running'}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ½×
                  </button>
                  <button
                    onClick={() => setBetAmount(balance)}
                    disabled={hasBet || gameState === 'running'}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    MAX
                  </button>
                </div>

                {/* Auto Cashout */}
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-600">
                  <label className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      checked={isAutoMode}
                      onChange={(e) => setIsAutoMode(e.target.checked)}
                      className="w-4 h-4 text-yellow-400 rounded focus:ring-yellow-400"
                    />
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-white font-medium">Auto Cashout</span>
                    </div>
                  </label>
                  
                  {isAutoMode && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300 text-sm">at</span>
                      <input
                        type="number"
                        step="0.1"
                        min="1.1"
                        max="100"
                        value={autoCashout}
                        onChange={(e) => setAutoCashout(Math.max(1.1, parseFloat(e.target.value) || 1.1))}
                        className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                      />
                      <span className="text-yellow-400 font-bold">x</span>
                    </div>
                  )}
                </div>

                {/* Balance Display */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                      </svg>
                      <span>Balance:</span>
                    </div>
                    <span className="text-white font-bold text-lg">{balance.toFixed(4)} BTC</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (balance / 2) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Betting Action Button */}
                <div className="pt-2">
                  {!hasBet && (gameState === 'waiting' || gameState === 'crashed') && (
                    <button
                      onClick={placeBet}
                      disabled={balance < betAmount || isPlacingBet}
                      className={`
                        w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform
                        ${balance >= betAmount && !isPlacingBet
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 hover:scale-105 shadow-lg hover:shadow-yellow-400/30'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      {isPlacingBet ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                          <span>Placing Bet...</span>
                        </div>
                      ) : gameState === 'crashed' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                          </svg>
                          <div>
                            <div>PLACE BET FOR NEXT ROUND ({betAmount.toFixed(4)} BTC)</div>
                            <div className="text-sm opacity-75">Next game in {timeLeft}s</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                          </svg>
                          <span>PLACE BET ({betAmount.toFixed(4)} BTC)</span>
                        </div>
                      )}
                    </button>
                  )}
                  
                  {hasBet && gameState === 'waiting' && (
                    <div className="w-full py-4 px-6 rounded-xl bg-green-600/20 border-2 border-green-400 text-green-400 text-center font-bold text-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>BET PLACED - READY TO FLY!</span>
                      </div>
                    </div>
                  )}
                  
                  {hasBet && gameState === 'running' && !hasWon && (
                    <button
                      onClick={cashOut}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-400 hover:to-emerald-500 font-bold text-lg transform hover:scale-105 shadow-lg hover:shadow-green-400/30 animate-pulse transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                        </svg>
                        <span>CASH OUT NOW!</span>
                      </div>
                      <div className="text-sm mt-1">
                        ({(betAmount * multiplier).toFixed(4)} BTC)
                      </div>
                    </button>
                  )}
                  
                  {hasWon && (
                    <div className="w-full py-4 px-6 rounded-xl bg-green-600/20 border-2 border-green-400 text-green-400 text-center font-bold text-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                        <span>CASHED OUT at {cashoutMultiplier.toFixed(2)}x!</span>
                      </div>
                      <div className="text-sm text-green-300">
                        +{((betAmount * cashoutMultiplier) - betAmount).toFixed(4)} BTC
                      </div>
                    </div>
                  )}
                  
                  {gameState === 'crashed' && hasBet && !hasWon && (
                    <div className="w-full py-4 px-6 rounded-xl bg-red-600/20 border-2 border-red-400 text-red-400 text-center font-bold text-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                        </svg>
                        <span>CRASHED! Better luck next time</span>
                      </div>
                      <div className="text-sm text-red-300">
                        -{betAmount.toFixed(4)} BTC
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Game Stats</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">House Edge:</span>
                  <span className="text-white">1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Bet:</span>
                  <span className="text-white">0.001 BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Win:</span>
                  <span className="text-white">100x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RTP:</span>
                  <span className="text-white">99%</span>
                </div>
              </div>
            </div>

            {/* Player History */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Your Bets</h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {playerHistory.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-4">
                    No bets yet
                  </div>
                ) : (
                  playerHistory.map((bet, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className={`font-bold ${bet.won ? 'text-green-400' : 'text-red-400'}`}>
                        {bet.multiplier.toFixed(2)}x
                      </div>
                      <div className={bet.amount >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {bet.amount >= 0 ? '+' : ''}{bet.amount.toFixed(4)} BTC
                      </div>
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