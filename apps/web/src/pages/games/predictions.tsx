import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Market {
  id: string
  question: string
  description: string
  category: 'SPORTS' | 'CRYPTO' | 'POLITICS' | 'ENTERTAINMENT' | 'TECH'
  createdBy: string
  createdAt: Date
  endDate: Date
  status: 'OPEN' | 'CLOSED' | 'RESOLVED'
  yesPool: number
  noPool: number
  totalVolume: number
  resolution?: 'YES' | 'NO' | null
  oracleSource?: string
  participants: number
}

interface UserPosition {
  marketId: string
  position: 'YES' | 'NO'
  amount: number
  potentialPayout: number
}

interface FloatingParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  opacity: number
  trail: { x: number; y: number }[]
}

interface NeonOrb {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  hue: number
  pulse: number
}

// Demo markets
const INITIAL_MARKETS: Market[] = [
  {
    id: '1',
    question: 'Will Bitcoin reach $100,000 before 2025?',
    description: 'This market resolves to YES if Bitcoin price reaches or exceeds $100,000 USD on any major exchange before January 1, 2025.',
    category: 'CRYPTO',
    createdBy: 'CryptoWhale',
    createdAt: new Date('2024-01-01'),
    endDate: new Date('2025-01-01'),
    status: 'OPEN',
    yesPool: 12.5,
    noPool: 8.3,
    totalVolume: 20.8,
    oracleSource: 'CoinGecko API',
    participants: 234
  },
  {
    id: '2',
    question: 'Will Real Madrid win Champions League 2024?',
    description: 'Resolves YES if Real Madrid wins the UEFA Champions League 2023-2024 season.',
    category: 'SPORTS',
    createdBy: 'SportsFan',
    createdAt: new Date('2024-02-01'),
    endDate: new Date('2024-06-01'),
    status: 'OPEN',
    yesPool: 15.2,
    noPool: 11.8,
    totalVolume: 27.0,
    oracleSource: 'UEFA Official',
    participants: 567
  },
  {
    id: '3',
    question: 'Will Apple stock hit $200 in 2024?',
    description: 'Market resolves YES if Apple Inc. (AAPL) reaches $200 per share during 2024.',
    category: 'TECH',
    createdBy: 'StockGuru',
    createdAt: new Date('2024-01-15'),
    endDate: new Date('2024-12-31'),
    status: 'OPEN',
    yesPool: 8.7,
    noPool: 9.3,
    totalVolume: 18.0,
    oracleSource: 'Yahoo Finance',
    participants: 189
  },
  {
    id: '4',
    question: 'Will AI replace 50% of jobs by 2030?',
    description: 'Resolves YES if credible studies show AI has replaced 50% or more of current jobs by 2030.',
    category: 'TECH',
    createdBy: 'FutureTech',
    createdAt: new Date('2024-03-01'),
    endDate: new Date('2030-01-01'),
    status: 'OPEN',
    yesPool: 22.1,
    noPool: 31.4,
    totalVolume: 53.5,
    oracleSource: 'World Economic Forum',
    participants: 892
  }
]

const CATEGORY_COLORS = {
  SPORTS: 'from-orange-500 via-red-500 to-pink-600',
  CRYPTO: 'from-yellow-400 via-orange-500 to-red-500',
  POLITICS: 'from-blue-500 via-purple-500 to-indigo-600',
  ENTERTAINMENT: 'from-pink-500 via-purple-500 to-violet-600',
  TECH: 'from-cyan-400 via-blue-500 to-purple-600'
}

const CATEGORY_ICONS = {
  SPORTS: '⚽',
  CRYPTO: '₿',
  POLITICS: '🏛️',
  ENTERTAINMENT: '🎭',
  TECH: '🚀'
}

// Enhanced floating particles with trails and neon orbs
const EnhancedParticleSystem: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])
  const orbsRef = useRef<NeonOrb[]>([])
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })

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
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Initialize particles with trails
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 4 + 1,
          color: ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#ef4444', '#f97316'][Math.floor(Math.random() * 6)],
          opacity: Math.random() * 0.6 + 0.2,
          trail: []
        })
      }
    }

    // Initialize neon orbs
    const initOrbs = () => {
      orbsRef.current = []
      for (let i = 0; i < 5; i++) {
        orbsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 40 + 20,
          hue: Math.random() * 360,
          pulse: 0
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Animate neon orbs
      orbsRef.current.forEach(orb => {
        orb.x += orb.vx
        orb.y += orb.vy
        orb.pulse += 0.1
        orb.hue = (orb.hue + 0.5) % 360
        
        if (orb.x < 0 || orb.x > canvas.width) orb.vx *= -1
        if (orb.y < 0 || orb.y > canvas.height) orb.vy *= -1
        
        const pulseFactor = 1 + Math.sin(orb.pulse) * 0.3
        const currentSize = orb.size * pulseFactor
        
        // Create radial gradient for neon glow
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentSize)
        gradient.addColorStop(0, `hsla(${orb.hue}, 100%, 70%, 0.8)`)
        gradient.addColorStop(0.5, `hsla(${orb.hue}, 100%, 50%, 0.3)`)
        gradient.addColorStop(1, `hsla(${orb.hue}, 100%, 30%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, currentSize, 0, Math.PI * 2)
        ctx.fill()
      })
      
      // Animate particles with trails and mouse interaction
      particlesRef.current.forEach(particle => {
        // Mouse attraction
        const mouseDistance = Math.sqrt(
          (mouseRef.current.x - particle.x) ** 2 + (mouseRef.current.y - particle.y) ** 2
        )
        if (mouseDistance < 100) {
          const attractionForce = (100 - mouseDistance) / 100
          const dx = (mouseRef.current.x - particle.x) * attractionForce * 0.02
          const dy = (mouseRef.current.y - particle.y) * attractionForce * 0.02
          particle.vx += dx
          particle.vy += dy
        }
        
        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y })
        if (particle.trail.length > 10) particle.trail.shift()
        
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Damping
        particle.vx *= 0.995
        particle.vy *= 0.995
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8
        
        // Draw trail
        ctx.beginPath()
        ctx.globalAlpha = particle.opacity * 0.3
        for (let i = 1; i < particle.trail.length; i++) {
          const current = particle.trail[i]
          const previous = particle.trail[i - 1]
          ctx.lineWidth = (i / particle.trail.length) * particle.size
          ctx.strokeStyle = particle.color
          ctx.beginPath()
          ctx.moveTo(previous.x, previous.y)
          ctx.lineTo(current.x, current.y)
          ctx.stroke()
        }
        
        // Draw main particle with glow
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(0.5, particle.color + '80')
        gradient.addColorStop(1, particle.color + '00')
        
        ctx.fillStyle = gradient
        ctx.globalAlpha = particle.opacity
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Inner core
        ctx.fillStyle = '#fff'
        ctx.globalAlpha = particle.opacity * 0.8
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2)
        ctx.fill()
      })
      
      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    initOrbs()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}

// Liquid morphing probability bar with 3D effects
const LiquidProbabilityBar: React.FC<{ yesPercentage: number; noPercentage: number }> = ({ yesPercentage, noPercentage }) => {
  const [animatedYes, setAnimatedYes] = useState(0)
  const [animatedNo, setAnimatedNo] = useState(0)
  const [waveOffset, setWaveOffset] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedYes(yesPercentage)
      setAnimatedNo(noPercentage)
    }, 200)
    return () => clearTimeout(timer)
  }, [yesPercentage, noPercentage])

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => prev + 0.1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-6 bg-gray-800 rounded-2xl overflow-hidden border border-gray-600/30 shadow-inner">
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 24">
          <path
            d={`M0,12 Q100,${8 + Math.sin(waveOffset) * 4},200,12 T400,12 L400,24 L0,24 Z`}
            fill="url(#waveGradient1)"
            className="animate-pulse"
          />
          <path
            d={`M0,12 Q100,${16 + Math.cos(waveOffset + 1) * 4},200,12 T400,12 L400,0 L0,0 Z`}
            fill="url(#waveGradient2)"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06d6a0" />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* YES bar with liquid effect */}
      <div 
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 transition-all duration-2000 ease-out shadow-lg"
        style={{ 
          width: `${animatedYes}%`,
          filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))',
          borderRadius: '16px 8px 8px 16px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/30 to-emerald-300/30 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      {/* NO bar with liquid effect */}
      <div 
        className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-400 via-rose-400 to-red-500 transition-all duration-2000 ease-out shadow-lg"
        style={{ 
          width: `${animatedNo}%`,
          filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))',
          borderRadius: '8px 16px 16px 8px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-red-300/30 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
      
      {/* Center divider with glow */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-yellow-400 to-orange-500 transform -translate-x-0.5 shadow-glow-yellow animate-pulse" />
    </div>
  )
}

// 3D Market card with perspective and advanced animations
const Enhanced3DMarketCard: React.FC<{ market: Market; onBet: (marketId: string, position: 'YES' | 'NO', amount: number) => void; index: number }> = ({ market, onBet, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showBettingPanel, setShowBettingPanel] = useState(false)
  const [betAmount, setBetAmount] = useState(0.01)
  const [selectedPosition, setSelectedPosition] = useState<'YES' | 'NO'>('YES')
  const [glitchEffect, setGlitchEffect] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const yesPercentage = (market.yesPool / (market.yesPool + market.noPool)) * 100
  const noPercentage = (market.noPool / (market.yesPool + market.noPool)) * 100
  const yesOdds = ((market.yesPool + market.noPool) / market.yesPool).toFixed(2)
  const noOdds = ((market.yesPool + market.noPool) / market.noPool).toFixed(2)

  const handleBet = () => {
    setGlitchEffect(true)
    setTimeout(() => setGlitchEffect(false), 300)
    onBet(market.id, selectedPosition, betAmount)
    setShowBettingPanel(false)
  }

  const daysLeft = Math.ceil((market.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  // Mouse tracking for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateX = (e.clientY - centerY) / 10
    const rotateY = (centerX - e.clientX) / 10
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? '20px' : '0px'})`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }
    setIsHovered(false)
  }

  return (
    <div 
      ref={cardRef}
      className={`relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 transition-all duration-700 hover:shadow-2xl hover:border-yellow-400/50 ${glitchEffect ? 'animate-glitch' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 191, 36, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
        animationDelay: `${index * 0.2}s`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic overlay */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${CATEGORY_COLORS[market.category]} opacity-0 transition-opacity duration-700 ${isHovered ? 'opacity-10' : ''}`} />
      
      {/* Scanning line effect */}
      <div className={`absolute inset-0 rounded-3xl overflow-hidden ${isHovered ? 'animate-scan' : ''}`}>
        <div className="absolute -top-full left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent transform skew-x-12" />
      </div>
      
      {/* Floating category badge */}
      <div className="flex items-center justify-between mb-6">
        <div className={`group relative inline-flex items-center space-x-3 px-4 py-2 rounded-2xl bg-gradient-to-r ${CATEGORY_COLORS[market.category]} text-white text-sm font-bold shadow-lg animate-float`}>
          <span className="text-2xl animate-bounce">{CATEGORY_ICONS[market.category]}</span>
          <span className="tracking-wide">{market.category}</span>
          <div className="absolute inset-0 rounded-2xl animate-ping bg-white/20" />
        </div>
        {market.status === 'OPEN' && (
          <div className="flex items-center space-x-2 text-xs text-gray-300 bg-gray-800/80 rounded-full px-3 py-2 border border-green-400/30">
            <div className="relative">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="font-mono">LIVE</span>
          </div>
        )}
      </div>

      {/* Holographic question text */}
      <h3 className="text-2xl font-bold mb-4 leading-tight relative">
        <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent animate-shimmer-text">
          {market.question}
        </span>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 animate-pulse" />
      </h3>

      {/* Description with typewriter effect */}
      <p className="text-gray-400 text-sm mb-6 line-clamp-2 font-mono leading-relaxed">
        {market.description}
      </p>

      {/* Enhanced probability visualization */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-emerald-400/50 rounded-full animate-ping" />
            </div>
            <span className="text-emerald-400 font-bold text-lg tracking-wide">
              YES {yesPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-red-400 font-bold text-lg tracking-wide">
              NO {noPercentage.toFixed(1)}%
            </span>
            <div className="relative">
              <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-rose-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-4 h-4 bg-red-400/50 rounded-full animate-ping" />
            </div>
          </div>
        </div>
        <LiquidProbabilityBar yesPercentage={yesPercentage} noPercentage={noPercentage} />
      </div>

      {/* 3D Stats panels */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:border-yellow-400/50">
          <div className="text-yellow-400 font-bold text-xl mb-1 animate-counter">₿{market.totalVolume.toFixed(1)}</div>
          <div className="text-gray-400 text-xs font-mono">VOLUME</div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:border-blue-400/50">
          <div className="text-blue-400 font-bold text-xl mb-1 animate-counter">{market.participants}</div>
          <div className="text-gray-400 text-xs font-mono">TRADERS</div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-4 border border-gray-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:border-purple-400/50">
          <div className="text-purple-400 font-bold text-xl mb-1 animate-counter">{daysLeft}d</div>
          <div className="text-gray-400 text-xs font-mono">LEFT</div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Cyberpunk betting buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setSelectedPosition('YES')
            setShowBettingPanel(true)
          }}
          className="group flex-1 relative bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:via-green-400 hover:to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-lg active:scale-95 overflow-hidden"
          style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          <div className="relative flex items-center justify-center space-x-3">
            <span className="text-xl">YES</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono border border-white/30">
              {yesOdds}x
            </div>
          </div>
        </button>
        <button
          onClick={() => {
            setSelectedPosition('NO')
            setShowBettingPanel(true)
          }}
          className="group flex-1 relative bg-gradient-to-r from-red-500 via-rose-500 to-red-600 hover:from-red-400 hover:via-rose-400 hover:to-red-500 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-lg active:scale-95 overflow-hidden"
          style={{ filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[200%] group-hover:translate-x-[-200%] transition-transform duration-1000" />
          <div className="relative flex items-center justify-center space-x-3">
            <span className="text-xl">NO</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-mono border border-white/30">
              {noOdds}x
            </div>
          </div>
        </button>
      </div>

      {/* Cyberpunk betting panel */}
      {showBettingPanel && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 rounded-3xl border border-gray-700/50 max-w-lg w-full mx-4 animate-slideUp shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 animate-pulse" />
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Place Bet
                </h3>
                <button
                  onClick={() => setShowBettingPanel(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl hover:scale-110 transform duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8">
                <div className="text-center">
                  <div className={`inline-block px-6 py-3 rounded-2xl text-white font-bold text-lg shadow-lg ${
                    selectedPosition === 'YES' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600'
                  }`}>
                    Betting {selectedPosition}
                  </div>
                  <p className="text-gray-400 mt-4 text-sm font-mono">{market.question}</p>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-4 uppercase tracking-wide">Bet Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Number(e.target.value))}
                      min="0.001"
                      step="0.001"
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-6 text-white text-xl placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 font-mono backdrop-blur-sm"
                      placeholder="0.001"
                    />
                    <span className="absolute right-6 top-4 text-gray-400 text-xl font-mono">BTC</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm">
                  <div className="flex justify-between text-lg mb-4">
                    <span className="text-gray-400 font-mono">Potential Payout:</span>
                    <span className="text-yellow-400 font-bold font-mono">
                      ₿{(betAmount * Number(selectedPosition === 'YES' ? yesOdds : noOdds)).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-400 font-mono">Odds:</span>
                    <span className="text-white font-bold font-mono">
                      {selectedPosition === 'YES' ? yesOdds : noOdds}x
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBet}
                  className={`w-full py-6 rounded-2xl font-bold text-xl text-white transition-all duration-500 transform hover:scale-105 active:scale-95 relative overflow-hidden ${
                    selectedPosition === 'YES'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-500/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                  <span className="relative">CONFIRM BET</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Enhanced create market modal
const CyberpunkCreateMarketModal: React.FC<{ isOpen: boolean; onClose: () => void; onCreate: (market: Omit<Market, 'id' | 'createdAt' | 'yesPool' | 'noPool' | 'totalVolume' | 'participants'>) => void }> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [question, setQuestion] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Market['category']>('CRYPTO')
  const [endDate, setEndDate] = useState('')
  const [oracleSource, setOracleSource] = useState('')

  const handleCreate = () => {
    if (!question || !description || !endDate) return

    onCreate({
      question,
      description,
      category,
      createdBy: 'Anonymous',
      endDate: new Date(endDate),
      status: 'OPEN',
      oracleSource
    })

    setQuestion('')
    setDescription('')
    setCategory('CRYPTO')
    setEndDate('')
    setOracleSource('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 rounded-3xl border border-gray-700/50 max-w-3xl w-full mx-4 animate-slideUp shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-red-600/20 animate-pulse" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-shimmer-text">
              Create New Market
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-3xl hover:scale-110 transform duration-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-gray-300 text-sm font-bold mb-4 uppercase tracking-wide">Market Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-6 text-white text-lg placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                placeholder="Will [event] happen by [date]?"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-bold mb-4 uppercase tracking-wide">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 resize-none backdrop-blur-sm"
                placeholder="Detailed resolution criteria..."
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-4 uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Market['category'])}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-6 text-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                >
                  {Object.keys(CATEGORY_COLORS).map(cat => (
                    <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-bold mb-4 uppercase tracking-wide">Resolution Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-6 text-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-bold mb-4 uppercase tracking-wide">Oracle Source (Optional)</label>
              <input
                type="text"
                value={oracleSource}
                onChange={(e) => setOracleSource(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-600 rounded-2xl py-4 px-6 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 backdrop-blur-sm"
                placeholder="e.g., CoinGecko API, Reuters, Official Website"
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={!question || !description || !endDate}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 hover:from-yellow-400 hover:via-orange-400 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-500 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative">CREATE MARKET</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component
export default function PredictionMarketsPage() {
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [balance, setBalance] = useState(10.0)
  const [userPositions, setUserPositions] = useState<UserPosition[]>([])
  const [showPositions, setShowPositions] = useState(false)

  const filteredMarkets = markets.filter(market => 
    selectedCategory === 'ALL' || market.category === selectedCategory
  )

  const handleBet = (marketId: string, position: 'YES' | 'NO', amount: number) => {
    if (balance < amount) {
      alert('Insufficient balance!')
      return
    }

    setBalance(prev => prev - amount)
    
    setMarkets(prev => prev.map(market => {
      if (market.id === marketId) {
        const updatedMarket = {
          ...market,
          yesPool: position === 'YES' ? market.yesPool + amount : market.yesPool,
          noPool: position === 'NO' ? market.noPool + amount : market.noPool,
          totalVolume: market.totalVolume + amount,
          participants: market.participants + 1
        }
        
        const totalPool = updatedMarket.yesPool + updatedMarket.noPool
        const multiplier = totalPool / (position === 'YES' ? updatedMarket.yesPool : updatedMarket.noPool)
        
        setUserPositions(prev => [...prev, {
          marketId,
          position,
          amount,
          potentialPayout: amount * multiplier
        }])
        
        return updatedMarket
      }
      return market
    }))
  }

  const handleCreateMarket = (newMarket: Omit<Market, 'id' | 'createdAt' | 'yesPool' | 'noPool' | 'totalVolume' | 'participants'>) => {
    const market: Market = {
      ...newMarket,
      id: Date.now().toString(),
      createdAt: new Date(),
      yesPool: 0,
      noPool: 0,
      totalVolume: 0,
      participants: 0
    }
    setMarkets(prev => [market, ...prev])
  }

  const handleResolveMarket = (marketId: string, outcome: 'YES' | 'NO') => {
    setMarkets(prev => prev.map(market => 
      market.id === marketId 
        ? { ...market, status: 'RESOLVED', resolution: outcome }
        : market
    ))
    
    // Calculate payouts for user positions
    const userWinnings = userPositions
      .filter(pos => pos.marketId === marketId && pos.position === outcome)
      .reduce((sum, pos) => sum + pos.potentialPayout, 0)
    
    if (userWinnings > 0) {
      setBalance(prev => prev + userWinnings)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Multi-layer animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/30 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-transparent via-purple-900/10 to-transparent animate-spin-slow" />
      </div>
      
      {/* Enhanced particle system */}
      <EnhancedParticleSystem />

      <div className="relative z-10 max-w-8xl mx-auto px-6 py-12">
        {/* Cyberpunk header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h1 className="text-8xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-8 animate-glitch-text">
              PREDICTION MARKETS
            </h1>
            {/* Glitch overlay */}
            <div className="absolute inset-0 text-8xl font-black text-cyan-400/20 animate-glitch-overlay">
              PREDICTION MARKETS
            </div>
            {/* Scanning lines */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent h-1 animate-scan-horizontal" />
            <div className="absolute inset-0 w-1 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-scan-vertical" />
          </div>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto mt-8 leading-relaxed font-mono">
            <span className="text-yellow-400">&gt;</span> Bet on the future with revolutionary prediction markets
            <span className="animate-blink text-cyan-400">_</span>
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mt-4 font-mono">
            Oracle-resolved outcomes • Community-driven insights • Transparent algorithms
          </p>
        </div>

        {/* Cyberpunk controls panel */}
        <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-gray-700/50 shadow-2xl relative overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              <defs>
                <pattern id="controlGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#controlGrid)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between space-y-6 xl:space-y-0">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm shadow-lg">
                <div className="text-yellow-400 font-black text-3xl mb-2 font-mono animate-counter">₿{balance.toFixed(3)}</div>
                <div className="text-gray-400 text-sm font-mono uppercase tracking-wider">BALANCE</div>
              </div>
              <button
                onClick={() => setShowPositions(true)}
                className="bg-gradient-to-r from-purple-600 via-violet-600 to-blue-600 hover:from-purple-500 hover:via-violet-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 shadow-lg shadow-purple-500/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="relative font-mono">MY POSITIONS ({userPositions.length})</span>
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex bg-gray-800/50 rounded-2xl p-2 border border-gray-600/30 backdrop-blur-sm">
                {['ALL', ...Object.keys(CATEGORY_COLORS)].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-500 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    {category === 'ALL' ? 'ALL' : `${CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]} ${category}`}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-500 transform hover:scale-105 shadow-lg shadow-emerald-500/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
                <span className="relative font-mono">+ CREATE MARKET</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced 3D markets grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-16">
          {filteredMarkets.map((market, index) => (
            <Enhanced3DMarketCard key={market.id} market={market} onBet={handleBet} index={index} />
          ))}
        </div>

        {/* Cyberpunk oracle simulation */}
        <div className="bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 animate-pulse" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-8 font-mono flex items-center">
              <span className="text-4xl mr-4">🔮</span>
              ORACLE SIMULATION
              <span className="ml-4 text-cyan-400 animate-pulse">ONLINE</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {markets.filter(m => m.status === 'OPEN').slice(0, 4).map(market => (
                <div key={market.id} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm hover:scale-105 transition-all duration-300">
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2 font-mono leading-relaxed">{market.question}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleResolveMarket(market.id, 'YES')}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-sm py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      YES
                    </button>
                    <button
                      onClick={() => handleResolveMarket(market.id, 'NO')}
                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white text-sm py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                    >
                      NO
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cyberpunk back link */}
        <div className="text-center">
          <Link
            href="/games"
            className="inline-flex items-center space-x-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-600 hover:to-gray-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-500 transform hover:scale-105 shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-1000" />
            <span className="relative font-mono">← BACK TO GAMES</span>
          </Link>
        </div>
      </div>

      {/* Modals */}
      <CyberpunkCreateMarketModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateMarket}
      />

      {/* Enhanced user positions modal */}
      {showPositions && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-10 rounded-3xl border border-gray-700/50 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl backdrop-blur-xl relative">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-mono">
                MY POSITIONS
              </h3>
              <button
                onClick={() => setShowPositions(false)}
                className="text-gray-400 hover:text-white transition-colors text-3xl hover:scale-110 transform duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {userPositions.map((position, index) => {
                const market = markets.find(m => m.id === position.marketId)
                if (!market) return null
                
                return (
                  <div key={index} className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-gray-600/30 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white text-lg font-mono">{market.question}</h4>
                      <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                        position.position === 'YES' 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                      }`}>
                        {position.position}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-lg">
                      <div className="text-center">
                        <div className="text-gray-400 font-mono mb-2">BET AMOUNT</div>
                        <div className="text-white font-bold font-mono">₿{position.amount.toFixed(4)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 font-mono mb-2">POTENTIAL PAYOUT</div>
                        <div className="text-yellow-400 font-bold font-mono">₿{position.potentialPayout.toFixed(4)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 font-mono mb-2">STATUS</div>
                        <div className={`font-bold font-mono ${
                          market.status === 'RESOLVED' 
                            ? market.resolution === position.position ? 'text-green-400' : 'text-red-400'
                            : 'text-blue-400'
                        }`}>
                          {market.status === 'RESOLVED' 
                            ? market.resolution === position.position ? 'WON' : 'LOST'
                            : 'PENDING'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {userPositions.length === 0 && (
                <div className="text-center text-gray-400 py-16 font-mono text-xl">
                  NO POSITIONS YET<br/>
                  <span className="text-cyan-400">START BETTING TO SEE YOUR POSITIONS HERE</span>
                  <span className="animate-blink">_</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-text {
          0%, 90%, 100% { text-shadow: 0 0 1px rgba(0,255,255,0.8); }
          95% { text-shadow: 2px 0 0 rgba(255,0,255,0.8), -2px 0 0 rgba(0,255,255,0.8); }
        }
        @keyframes glitch-overlay {
          0%, 90%, 100% { transform: skew(0deg) translate(0); }
          95% { transform: skew(-2deg) translate(2px); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes counter {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animate-shimmer { animation: shimmer 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-scan { animation: scan 2s linear infinite; }
        .animate-scan-horizontal { animation: scan-horizontal 3s linear infinite; }
        .animate-scan-vertical { animation: scan-vertical 4s linear infinite; }
        .animate-glitch { animation: glitch 0.3s ease-in-out; }
        .animate-glitch-text { animation: glitch-text 4s ease-in-out infinite; }
        .animate-glitch-overlay { animation: glitch-overlay 4s ease-in-out infinite; }
        .animate-blink { animation: blink 2s infinite; }
        .animate-counter { animation: counter 2s ease-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-shimmer-text { animation: shimmer 3s ease-in-out infinite; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .shadow-glow-yellow {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }
      `}</style>
    </div>
  )
}