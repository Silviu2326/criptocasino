import React, { useState, useEffect } from 'react'

interface DiceProps {
  value?: number
  isRolling?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Dice3D: React.FC<DiceProps> = ({ value = 1, isRolling = false, size = 'md' }) => {
  const [currentFace, setCurrentFace] = useState(value)
  const [glowIntensity, setGlowIntensity] = useState(0)

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setCurrentFace(Math.floor(Math.random() * 6) + 1)
        setGlowIntensity(Math.random() * 100)
      }, 100)
      return () => clearInterval(interval)
    } else {
      setCurrentFace(value)
      setGlowIntensity(0)
    }
  }, [isRolling, value])

  const sizeClasses = {
    sm: { cube: 'w-16 h-16', face: 'w-16 h-16', translate: 'translate3d(0,0,32px)' },
    md: { cube: 'w-24 h-24', face: 'w-24 h-24', translate: 'translate3d(0,0,48px)' },
    lg: { cube: 'w-40 h-40', face: 'w-40 h-40', translate: 'translate3d(0,0,80px)' }
  }

  const getDotPattern = (num: number) => {
    const patterns: { [key: number]: number[] } = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    }
    return patterns[num] || []
  }

  const DiceFace: React.FC<{ number: number; className: string }> = ({ number, className }) => {
    const dotPattern = getDotPattern(number)
    const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
    
    return (
      <div className={`absolute ${sizeClasses[size].face} ${className} flex items-center justify-center`}>
        <div 
          className={`
            ${sizeClasses[size].face} 
            bg-gradient-to-br from-white via-gray-50 to-gray-200
            border-2 border-gray-300
            rounded-2xl
            shadow-2xl
            backdrop-blur-sm
            relative
            overflow-hidden
          `}
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.7) 50%, rgba(200,200,200,0.8) 100%),
              linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)
            `,
            boxShadow: `
              0 0 ${glowIntensity}px rgba(251, 191, 36, ${glowIntensity / 200}),
              inset 0 1px 3px rgba(255,255,255,0.8),
              inset 0 -1px 3px rgba(0,0,0,0.1),
              0 8px 32px rgba(0,0,0,0.3)
            `
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-1 rounded-xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
          
          {/* Dots */}
          <div className="grid grid-cols-3 gap-1 p-2 w-full h-full">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className={`
                  ${dotSize}
                  rounded-full
                  transition-all duration-300
                  ${dotPattern.includes(i) 
                    ? `bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg opacity-100 scale-100
                       ${isRolling ? 'animate-pulse' : ''}` 
                    : 'opacity-0 scale-75'
                  }
                `}
                style={{
                  boxShadow: dotPattern.includes(i) 
                    ? 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.5)'
                    : 'none'
                }}
              />
            ))}
          </div>

          {/* Reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl pointer-events-none" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center perspective-1000">
      {/* Ambient particles */}
      {isRolling && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* 3D Dice Container */}
      <div 
        className={`
          ${sizeClasses[size].cube}
          relative 
          transform-style-preserve-3d
          transition-transform duration-1000 ease-out
          ${isRolling 
            ? 'animate-spin-3d' 
            : 'hover:rotate-y-15 hover:rotate-x-15'
          }
        `}
        style={{
          filter: isRolling ? 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
          transform: isRolling 
            ? `rotateX(${Math.random() * 360}deg) rotateY(${Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg) scale(${0.9 + Math.random() * 0.2})` 
            : 'rotateX(-15deg) rotateY(20deg)'
        }}
      >
        {/* Front face */}
        <DiceFace 
          number={currentFace} 
          className="transform translateZ-12" 
        />
        
        {/* Back face */}
        <DiceFace 
          number={7 - currentFace} 
          className="transform rotateY-180 translateZ-12" 
        />
        
        {/* Right face */}
        <DiceFace 
          number={(currentFace % 6) + 1} 
          className="transform rotateY-90 translateZ-12" 
        />
        
        {/* Left face */}
        <DiceFace 
          number={((currentFace + 1) % 6) + 1} 
          className="transform rotateY--90 translateZ-12" 
        />
        
        {/* Top face */}
        <DiceFace 
          number={((currentFace + 2) % 6) + 1} 
          className="transform rotateX-90 translateZ-12" 
        />
        
        {/* Bottom face */}
        <DiceFace 
          number={((currentFace + 3) % 6) + 1} 
          className="transform rotateX--90 translateZ-12" 
        />
      </div>

      {/* Ground reflection */}
      <div 
        className={`
          absolute bottom-0 ${sizeClasses[size].cube}
          bg-gradient-radial from-black/20 to-transparent
          rounded-full
          blur-sm
          scale-75
          opacity-50
        `}
        style={{ 
          transform: 'translateY(50%) scaleY(0.3)',
          filter: 'blur(8px)'
        }}
      />
    </div>
  )
}

export default Dice3D