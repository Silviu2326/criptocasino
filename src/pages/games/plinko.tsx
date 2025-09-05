import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// Enhanced Plinko configuration with cyberpunk effects
const ROWS = 16
const RISK_LEVELS = {
  LOW: {
    multipliers: [5.6, 2.1, 1.1, 1.0, 0.5, 1.0, 1.1, 2.1, 5.6],
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.5)',
    name: 'SECURE',
    description: 'Safe multipliers with balanced risk'
  },
  MEDIUM: {
    multipliers: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.5)',
    name: 'BALANCED',
    description: 'Higher rewards with moderate risk'
  },
  HIGH: {
    multipliers: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.5)',
    name: 'EXTREME',
    description: 'Maximum multipliers, extreme risk!'
  }
}

interface Ball {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  path: {x: number, y: number}[]
  trail: {x: number, y: number, opacity: number}[]
  finalColumn?: number
  color: string
  glow: string
  size: number
  energy: number
}

interface Pin {
  x: number
  y: number
  hit: boolean
  hitTime: number
  glowIntensity: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface FloatingParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  opacity: number
}

// Enhanced particle system for background
const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 30; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: Math.random() * 3 + 1,
          hue: Math.random() * 60 + 30, // Orange/yellow range
          opacity: Math.random() * 0.3 + 0.1
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.hue = (particle.hue + 0.2) % 360

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 60%, ${particle.opacity})`)
        gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 60%, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

export default function PlinkoGame() {
  const [balls, setBalls] = useState<Ball[]>([])
  const [pins, setPins] = useState<Pin[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [betAmount, setBetAmount] = useState(0.001)
  const [balance, setBalance] = useState(1.234)
  const [risk, setRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [gameHistory, setGameHistory] = useState<{multiplier: number, profit: number, column: number, timestamp: number}[]>([])
  const [totalWagered, setTotalWagered] = useState(0)
  const [totalProfit, setTotalProfit] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const ballIdRef = useRef(0)
  const autoIntervalRef = useRef<NodeJS.Timeout>()
  
  const boardWidth = 700
  const boardHeight = 800
  const pinRadius = 4
  const ballRadius = 8
  const pinSpacing = 40
  const gravity = 0.08  // Aún más lento para mejor visualización
  const bounciness = 0.5  // Rebotes más controlados
  const friction = 0.998  // Menos fricción para movimiento más fluido
  
  // Initialize pins with enhanced properties
  useEffect(() => {
    const newPins: Pin[] = []
    for (let row = 0; row < ROWS; row++) {
      const pinsInRow = row + 3
      const rowWidth = pinsInRow * pinSpacing
      const startX = (boardWidth - rowWidth) / 2 + pinSpacing / 2
      
      for (let col = 0; col < pinsInRow; col++) {
        newPins.push({
          x: startX + col * pinSpacing,
          y: 120 + row * 38,
          hit: false,
          hitTime: 0,
          glowIntensity: 0
        })
      }
    }
    setPins(newPins)
  }, [])
  
  // Enhanced ball drop with trails and effects
  const dropBall = useCallback(() => {
    // Validaciones más estrictas
    if (balance < betAmount || isPlaying || betAmount <= 0 || betAmount > balance) {
      if (betAmount <= 0) {
        alert('Bet amount must be greater than 0!')
      } else if (betAmount > balance) {
        alert('Insufficient balance!')
      }
      return
    }
    
    setBalance(prev => Math.max(0, prev - betAmount)) // Asegurar que no sea negativo
    setTotalWagered(prev => prev + betAmount)
    setIsPlaying(true)
    
    const riskConfig = RISK_LEVELS[risk]
    const newBall: Ball = {
      id: ballIdRef.current++,
      x: boardWidth / 2 + (Math.random() - 0.5) * 20,
      y: 40,
      vx: (Math.random() - 0.5) * 0.3,  // Velocidad inicial más lenta
      vy: 0.1,  // Pequeño impulso inicial hacia abajo
      path: [],
      trail: [],
      color: riskConfig.color,
      glow: riskConfig.glow,
      size: ballRadius + Math.random() * 3,
      energy: 1.0
    }
    
    setBalls(prev => [...prev, newBall])
  }, [betAmount, balance, risk, isPlaying])
  
  // Auto mode toggle con validaciones mejoradas
  const toggleAutoMode = () => {
    if (isAutoMode) {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
      }
      setIsAutoMode(false)
    } else {
      // Validar antes de activar auto mode
      if (balance < betAmount) {
        alert('Insufficient balance for auto mode!')
        return
      }
      if (betAmount <= 0) {
        alert('Set a valid bet amount first!')
        return
      }
      
      setIsAutoMode(true)
      autoIntervalRef.current = setInterval(() => {
        // Verificar balance antes de cada drop automático
        if (!isPlaying && balance >= betAmount && betAmount > 0) {
          dropBall()
        } else if (balance < betAmount) {
          // Detener auto mode si no hay suficiente balance
          if (autoIntervalRef.current) {
            clearInterval(autoIntervalRef.current)
          }
          setIsAutoMode(false)
          alert('Auto mode stopped: insufficient balance!')
        }
      }, 6000)  // 6 segundos para dar tiempo suficiente a la caída súper lenta
    }
  }
  
  // Enhanced physics simulation with particles and effects
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)'
      ctx.fillRect(0, 0, boardWidth, boardHeight)
      
      // Update and draw pins with glow effects
      pins.forEach(pin => {
        if (pin.hit && Date.now() - pin.hitTime < 500) {
          pin.glowIntensity = Math.max(0, pin.glowIntensity - 0.02)
        }
        
        // Draw pin glow
        if (pin.glowIntensity > 0) {
          const gradient = ctx.createRadialGradient(pin.x, pin.y, 0, pin.x, pin.y, pinRadius * 4)
          gradient.addColorStop(0, `rgba(251, 191, 36, ${pin.glowIntensity})`)
          gradient.addColorStop(1, `rgba(251, 191, 36, 0)`)
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(pin.x, pin.y, pinRadius * 4, 0, Math.PI * 2)
          ctx.fill()
        }
        
        // Draw pin
        ctx.fillStyle = pin.hit && Date.now() - pin.hitTime < 200 ? '#fbbf24' : '#6b7280'
        ctx.beginPath()
        ctx.arc(pin.x, pin.y, pinRadius, 0, Math.PI * 2)
        ctx.fill()
        
        // Pin inner glow
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(pin.x, pin.y, pinRadius * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Update and draw balls with enhanced trails
      setBalls(prevBalls => {
        const updatedBalls = prevBalls.map(ball => {
          // Update trail (más largo para caída lenta)
          ball.trail.push({ x: ball.x, y: ball.y, opacity: 1.0 })
          if (ball.trail.length > 35) ball.trail.shift()  // Trail más largo
          ball.trail = ball.trail.map(point => ({ ...point, opacity: point.opacity * 0.92 }))  // Fade más lento
          
          // Apply physics
          ball.vy += gravity
          ball.x += ball.vx
          ball.y += ball.vy
          ball.vx *= friction
          ball.vy *= friction
          ball.energy *= 0.9995  // Energía se reduce más lentamente
          
          // Collision with pins
          pins.forEach(pin => {
            const dx = ball.x - pin.x
            const dy = ball.y - pin.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < ball.size + pinRadius) {
              if (!pin.hit || Date.now() - pin.hitTime > 100) {
                pin.hit = true
                pin.hitTime = Date.now()
                pin.glowIntensity = 1.0
                
                // Create particle explosion
                for (let i = 0; i < 8; i++) {
                  setParticles(prev => [...prev, {
                    x: pin.x,
                    y: pin.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 30,
                    maxLife: 30,
                    color: ball.color,
                    size: 2
                  }])
                }
                
                // Bounce calculation (mucho más suave)
                const angle = Math.atan2(dy, dx)
                const force = (ball.size + pinRadius - distance) * 0.05  // Fuerza muy reducida
                ball.vx += Math.cos(angle) * force * bounciness
                ball.vy += Math.sin(angle) * force * bounciness
                
                // Add some randomness (muy controlado)
                ball.vx += (Math.random() - 0.5) * 0.2
              }
            }
          })
          
          // Boundary collisions
          if (ball.x < ball.size) {
            ball.x = ball.size
            ball.vx *= -bounciness
          }
          if (ball.x > boardWidth - ball.size) {
            ball.x = boardWidth - ball.size
            ball.vx *= -bounciness
          }
          
          return ball
        })
        
        // Check for balls that reached the bottom
        const activeBalls = updatedBalls.filter(ball => {
          if (ball.y > boardHeight - 80) {
            // Calculate final column and multiplier
            const columns = RISK_LEVELS[risk].multipliers.length
            const columnWidth = boardWidth / columns
            const column = Math.floor(ball.x / columnWidth)
            const safeColumn = Math.max(0, Math.min(column, columns - 1))
            const multiplier = RISK_LEVELS[risk].multipliers[safeColumn]
            const profit = betAmount * multiplier - betAmount
            
            // Update game state con validaciones
            setBalance(prev => Math.max(0, prev + betAmount * multiplier))
            setTotalProfit(prev => prev + profit)
            setGameHistory(prev => [{
              multiplier,
              profit,
              column: safeColumn,
              timestamp: Date.now()
            }, ...prev.slice(0, 9)])
            setIsPlaying(false)
            
            // Create winning particle explosion
            for (let i = 0; i < 20; i++) {
              setParticles(prev => [...prev, {
                x: ball.x,
                y: boardHeight - 60,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 60,
                maxLife: 60,
                color: multiplier > 1 ? '#10b981' : '#ef4444',
                size: 3
              }])
            }
            
            return false
          }
          return true
        })
        
        return activeBalls
      })
      
      // Draw ball trails
      balls.forEach(ball => {
        ball.trail.forEach((point, index) => {
          if (point.opacity > 0.1) {
            const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, ball.size)
            gradient.addColorStop(0, ball.glow.replace(/[\d\.]+\)$/g, `${point.opacity * ball.energy})`))
            gradient.addColorStop(1, ball.glow.replace(/[\d\.]+\)$/g, '0)'))
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(point.x, point.y, ball.size * (0.3 + point.opacity * 0.7), 0, Math.PI * 2)
            ctx.fill()
          }
        })
        
        // Draw main ball with enhanced glow
        const mainGradient = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, ball.size * 2)
        mainGradient.addColorStop(0, ball.color)
        mainGradient.addColorStop(0.6, ball.glow)
        mainGradient.addColorStop(1, ball.glow.replace(/[\d\.]+\)$/g, '0)'))
        ctx.fillStyle = mainGradient
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Ball highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
        ctx.beginPath()
        ctx.arc(ball.x - ball.size * 0.3, ball.y - ball.size * 0.3, ball.size * 0.3, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Update and draw particles
      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          particle.x += particle.vx
          particle.y += particle.vy
          particle.vx *= 0.98
          particle.vy *= 0.98
          particle.vy += 0.1 // gravity
          particle.life -= 1
          
          const opacity = particle.life / particle.maxLife
          ctx.fillStyle = particle.color.replace('1)', `${opacity})`) || `rgba(251, 191, 36, ${opacity})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          
          return particle
        }).filter(particle => particle.life > 0)
      })
      
      // Draw multiplier zones at bottom with risk-based colors
      const columns = RISK_LEVELS[risk].multipliers.length
      const columnWidth = boardWidth / columns
      const riskConfig = RISK_LEVELS[risk]
      
      RISK_LEVELS[risk].multipliers.forEach((multiplier, index) => {
        const x = index * columnWidth
        const isWinning = multiplier > 1
        const isCenter = index === Math.floor(columns / 2)
        const isEdge = index === 0 || index === columns - 1
        
        // Dynamic zone background based on risk and position
        let bgColor, borderColor
        if (isEdge && risk === 'HIGH') {
          // Extreme edges in HIGH risk - special golden glow
          bgColor = `rgba(251, 191, 36, 0.3)`
          borderColor = '#fbbf24'
        } else if (isWinning) {
          bgColor = `rgba(16, 185, 129, 0.25)`
          borderColor = '#10b981'
        } else {
          bgColor = `rgba(239, 68, 68, 0.25)`
          borderColor = '#ef4444'
        }
        
        ctx.fillStyle = bgColor
        ctx.fillRect(x, boardHeight - 70, columnWidth, 70)
        
        // Enhanced zone border with risk-based styling
        ctx.strokeStyle = borderColor
        ctx.lineWidth = isEdge && risk === 'HIGH' ? 3 : 2
        ctx.strokeRect(x + 1, boardHeight - 69, columnWidth - 2, 68)
        
        // Add inner glow for high multipliers
        if (multiplier >= 10) {
          const glowGradient = ctx.createLinearGradient(x, boardHeight - 70, x, boardHeight)
          glowGradient.addColorStop(0, `rgba(251, 191, 36, 0.4)`)
          glowGradient.addColorStop(1, `rgba(251, 191, 36, 0.1)`)
          ctx.fillStyle = glowGradient
          ctx.fillRect(x + 2, boardHeight - 68, columnWidth - 4, 66)
        }
        
        // Risk level indicator on extreme multipliers
        if (isEdge && risk === 'HIGH') {
          ctx.fillStyle = '#fbbf24'
          ctx.font = 'bold 10px monospace'
          ctx.fillText('EXTREME!', x + columnWidth / 2, boardHeight - 55)
        }
        
        // Multiplier text with size based on value
        const fontSize = multiplier >= 10 ? 18 : 16
        ctx.fillStyle = isEdge && risk === 'HIGH' ? '#fbbf24' : (isWinning ? '#10b981' : '#ef4444')
        ctx.font = `bold ${fontSize}px monospace`
        ctx.textAlign = 'center'
        ctx.fillText(
          `${multiplier}x`, 
          x + columnWidth / 2, 
          boardHeight - 25
        )
        
        // Payout text
        ctx.fillStyle = '#9ca3af'
        ctx.font = '12px monospace'
        ctx.fillText(
          `₿${(betAmount * multiplier).toFixed(4)}`, 
          x + columnWidth / 2, 
          boardHeight - 8
        )
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [balls, pins, particles, betAmount, risk])
  
  // Cleanup auto mode on unmount
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Multi-layer animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent animate-pulse" />
      </div>
      
      {/* Background particles */}
      <BackgroundParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Cyberpunk header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black bg-gradient-to-r from-orange-400 via-yellow-500 to-red-500 bg-clip-text text-transparent mb-4 animate-pulse">
            PLINKO MATRIX
          </h1>
          <p className="text-xl text-gray-300 font-mono">
            <span className="text-orange-400">&gt;</span> Drop • Bounce • Win
            <span className="animate-blink text-orange-400">_</span>
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Control Panel */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              {/* Balance */}
              <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 border border-gray-600/30">
                <div className="text-orange-400 font-black text-2xl mb-1 font-mono">₿{balance.toFixed(6)}</div>
                <div className="text-gray-400 text-sm font-mono uppercase tracking-wider">BALANCE</div>
              </div>

              {/* Bet Amount */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wide font-mono">Bet Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    min="0.001"
                    step="0.001"
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all duration-300 font-mono"
                    disabled={isPlaying}
                  />
                  <span className="absolute right-4 top-3 text-gray-400 text-sm font-mono">BTC</span>
                </div>
              </div>

              {/* Risk Level */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-3 uppercase tracking-wide font-mono">Risk Level</label>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {Object.entries(RISK_LEVELS).map(([level, config]) => (
                    <button
                      key={level}
                      onClick={() => !isPlaying && setRisk(level as any)}
                      disabled={isPlaying}
                      className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 text-left ${
                        risk === level
                          ? 'transform scale-105 shadow-lg border-2'
                          : 'hover:scale-[1.02] border border-gray-600'
                      }`}
                      style={{
                        backgroundColor: risk === level ? config.color + '20' : 'rgba(107, 114, 128, 0.2)',
                        borderColor: risk === level ? config.color : 'transparent',
                        boxShadow: risk === level ? `0 0 20px ${config.glow}` : 'none'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ color: risk === level ? config.color : '#9ca3af' }}>
                          {config.name}
                        </span>
                        {risk === level && (
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">ACTIVE</span>
                        )}
                      </div>
                      <div className="text-xs mt-1" style={{ color: risk === level ? '#d1d5db' : '#6b7280' }}>
                        {config.description}
                      </div>
                      <div className="text-xs mt-2 font-mono" style={{ color: risk === level ? config.color : '#9ca3af' }}>
                        Max: {Math.max(...config.multipliers)}x | Min: {Math.min(...config.multipliers)}x
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={dropBall}
                  disabled={balance < betAmount || isPlaying || betAmount <= 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.5))' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative font-mono">
                    {isPlaying ? 'DROPPING...' : 'DROP BALL'}
                  </span>
                </button>

                <button
                  onClick={toggleAutoMode}
                  disabled={balance < betAmount || betAmount <= 0}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 font-mono disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAutoMode
                      ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white'
                      : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
                  }`}
                >
                  {isAutoMode ? 'STOP AUTO' : 'AUTO MODE'}
                </button>
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">Total Wagered:</span>
                  <span className="text-orange-400 font-mono font-bold">₿{totalWagered.toFixed(6)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">Total Profit:</span>
                  <span className={`font-mono font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₿{totalProfit.toFixed(6)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-mono">Games Played:</span>
                  <span className="text-white font-mono font-bold">{gameHistory.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Board */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <div className="relative mx-auto" style={{ width: boardWidth, height: boardHeight }}>
                <canvas
                  ref={canvasRef}
                  width={boardWidth}
                  height={boardHeight}
                  className="rounded-2xl border border-gray-600/30"
                  style={{ 
                    background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
                    boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.5)'
                  }}
                />
                
                {/* Drop zone indicator */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                  <div className="bg-orange-500/20 border border-orange-400 rounded-full px-4 py-1 text-xs text-orange-400 font-mono animate-pulse">
                    DROP ZONE
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game History */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4 font-mono flex items-center">
                <span className="text-orange-400 mr-2">📊</span>
                GAME HISTORY
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {gameHistory.length === 0 ? (
                  <div className="text-center text-gray-400 py-8 font-mono text-sm">
                    NO GAMES YET<br/>
                    <span className="text-orange-400">DROP YOUR FIRST BALL!</span>
                  </div>
                ) : (
                  gameHistory.map((game, index) => (
                    <div key={game.timestamp} className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${game.profit >= 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-white font-mono text-sm">Game #{gameHistory.length - index}</span>
                        </div>
                        <span className={`font-bold font-mono text-sm ${game.multiplier > 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {game.multiplier}x
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-mono">Profit:</span>
                        <span className={`font-mono font-bold ${game.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {game.profit >= 0 ? '+' : ''}₿{game.profit.toFixed(6)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400 font-mono">Column:</span>
                        <span className="text-white font-mono">{game.column + 1}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-8">
          <Link
            href="/games"
            className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative font-mono">← BACK TO GAMES</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 2s infinite;
        }
      `}</style>
    </div>
  )
}