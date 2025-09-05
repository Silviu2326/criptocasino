import React, { useState, useEffect } from 'react'

interface CoinProps {
  result?: 'heads' | 'tails' | null
  isFlipping?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const Coin3D: React.FC<CoinProps> = ({ result = null, isFlipping = false, size = 'md' }) => {
  const [currentSide, setCurrentSide] = useState<'heads' | 'tails'>('heads')
  const [rotation, setRotation] = useState(0)
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [lightAngle, setLightAngle] = useState(0)
  const [flipCount, setFlipCount] = useState(0)
  const [velocityX, setVelocityX] = useState(0)
  const [velocityY, setVelocityY] = useState(0)
  const [velocityZ, setVelocityZ] = useState(0)
  const [gravity, setGravity] = useState(0)
  const [metallic, setMetallic] = useState(1)
  const [roughness, setRoughness] = useState(0.1)

  useEffect(() => {
    if (isFlipping) {
      // Simplified physics for better visibility
      setGravity(0.3)
      setVelocityX(0)
      setVelocityY(-5)
      setVelocityZ(0)
      setMetallic(0.8)
      setRoughness(0.1)
      
      const interval = setInterval(() => {
        setRotation(prev => prev + 15) // Rotación más lenta para mejor visibilidad
        setFlipCount(prev => prev + 1)
        
        // Cambiar lado cada 12 frames (cada 1.2 segundos aproximadamente)
        const side = Math.floor(flipCount / 12) % 2 === 0 ? 'heads' : 'tails'
        setCurrentSide(side)
        
        // Glow más suave
        setGlowIntensity(50 + Math.sin(flipCount * 0.3) * 30)
        setLightAngle(prev => prev + 3)
      }, 150) // Más lento para mejor visibilidad
      return () => clearInterval(interval)
    } else if (result) {
      setCurrentSide(result)
      setGlowIntensity(0)
      setFlipCount(0)
      setVelocityX(0)
      setVelocityY(0)
      setVelocityZ(0)
      setGravity(0)
      setMetallic(1)
      setRoughness(0.1)
    }
  }, [isFlipping, result, flipCount])

  const sizeClasses = {
    sm: { coin: 'w-20 h-20', face: 'w-20 h-20', thickness: '4px' },
    md: { coin: 'w-32 h-32', face: 'w-32 h-32', thickness: '6px' },
    lg: { coin: 'w-48 h-48', face: 'w-48 h-48', thickness: '8px' }
  }

  const CoinFace: React.FC<{ side: 'heads' | 'tails'; className: string }> = ({ side, className }) => {
    return (
      <div className={`absolute ${sizeClasses[size].face} ${className} flex items-center justify-center`}>
        <div 
          className={`
            ${sizeClasses[size].face} 
            rounded-full
            shadow-2xl
            backdrop-blur-sm
            relative
            overflow-hidden
            border-8
            ${isFlipping ? 'animate-coin-sparkle' : ''}
          `}
          style={{
            background: side === 'heads' 
              ? `conic-gradient(from ${lightAngle}deg, 
                  hsl(${45 + Math.sin(lightAngle * 0.1) * 10}, ${80 + metallic * 20}%, ${60 + Math.cos(lightAngle * 0.05) * 10}%) 0%, 
                  hsl(${50 + Math.sin(lightAngle * 0.08) * 15}, ${85 + metallic * 15}%, ${65 + Math.sin(lightAngle * 0.03) * 5}%) 25%, 
                  hsl(${35 + Math.cos(lightAngle * 0.06) * 12}, ${75 + metallic * 25}%, ${50 + Math.sin(lightAngle * 0.04) * 8}%) 50%, 
                  hsl(${30 + Math.sin(lightAngle * 0.09) * 8}, ${70 + metallic * 30}%, ${45 + Math.cos(lightAngle * 0.07) * 12}%) 75%, 
                  hsl(${45 + Math.sin(lightAngle * 0.1) * 10}, ${80 + metallic * 20}%, ${60 + Math.cos(lightAngle * 0.05) * 10}%) 100%)`
              : `conic-gradient(from ${lightAngle}deg,
                  hsl(${210 + Math.sin(lightAngle * 0.12) * 5}, ${15 + metallic * 10}%, ${20 + Math.cos(lightAngle * 0.08) * 5}%) 0%, 
                  hsl(${220 + Math.cos(lightAngle * 0.09) * 8}, ${25 + metallic * 15}%, ${30 + Math.sin(lightAngle * 0.06) * 8}%) 25%, 
                  hsl(${200 + Math.sin(lightAngle * 0.11) * 12}, ${20 + metallic * 20}%, ${25 + Math.cos(lightAngle * 0.04) * 10}%) 50%, 
                  hsl(${215 + Math.cos(lightAngle * 0.07) * 6}, ${30 + metallic * 12}%, ${35 + Math.sin(lightAngle * 0.09) * 7}%) 75%, 
                  hsl(${210 + Math.sin(lightAngle * 0.12) * 5}, ${15 + metallic * 10}%, ${20 + Math.cos(lightAngle * 0.08) * 5}%) 100%)`,
            borderColor: side === 'heads' ? `hsl(${45}, ${80 + metallic * 20}%, ${60}%)` : `hsl(${210}, ${20 + metallic * 15}%, ${30}%)`,
            borderWidth: sizeClasses[size].thickness,
            boxShadow: `
              0 0 ${Math.min(glowIntensity, 30)}px ${side === 'heads' ? `hsla(${45}, 80%, 60%, 0.6)` : `hsla(${210}, 30%, 40%, 0.4)`},
              inset 0 ${size === 'sm' ? '2' : size === 'md' ? '4' : '6'}px ${size === 'sm' ? '8' : size === 'md' ? '12' : '16'}px rgba(255,255,255,0.2),
              inset 0 -${size === 'sm' ? '2' : size === 'md' ? '4' : '6'}px ${size === 'sm' ? '8' : size === 'md' ? '12' : '16'}px rgba(0,0,0,0.3),
              0 ${size === 'sm' ? '8' : size === 'md' ? '16' : '24'}px ${size === 'sm' ? '32' : size === 'md' ? '48' : '64'}px rgba(0,0,0,0.3),
              inset 0 1px ${size === 'sm' ? '2' : size === 'md' ? '3' : '4'}px rgba(255,255,255,0.3),
              inset 0 -1px ${size === 'sm' ? '2' : size === 'md' ? '3' : '4'}px rgba(0,0,0,0.4)
            `,
            transform: `rotateZ(${lightAngle * 0.5}deg)`,
            filter: `brightness(${1 + metallic * 0.2 - roughness * 0.1}) contrast(${1.1 + metallic * 0.3}) saturate(${1.2 + metallic * 0.2})`
          }}
        >
          {/* Simplified metallic shine effect */}
          <div 
            className="absolute inset-1 rounded-full pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse at 50% 50%, 
                  rgba(255,255,255,0.4) 0%, 
                  rgba(255,255,255,0.2) 30%, 
                  transparent 60%),
                linear-gradient(${lightAngle + 45}deg, 
                  rgba(255,255,255,0.3) 0%, 
                  transparent 50%, 
                  rgba(255,255,255,0.2) 100%)
              `,
              opacity: isFlipping ? 0.6 : 0.3,
              animation: isFlipping ? 'metallic-shine 2s ease-in-out infinite' : 'none'
            }} 
          />
          
          {/* Simplified fresnel reflection */}
          <div 
            className="absolute inset-2 rounded-full pointer-events-none"
            style={{
              background: `
                radial-gradient(circle at 30% 30%,
                  rgba(255,255,255,0.3) 0%,
                  rgba(255,255,255,0.1) 40%,
                  transparent 70%)
              `,
              opacity: 0.4,
              filter: 'blur(1px)'
            }} 
          />
          
          {/* Simplified subsurface scattering */}
          {side === 'heads' && (
            <div 
              className="absolute inset-3 rounded-full pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at center,
                    hsla(45, 80%, 70%, 0.2) 0%,
                    hsla(50, 75%, 60%, 0.1) 50%,
                    transparent 80%)
                `,
                opacity: isFlipping ? 0.4 : 0.2
              }} 
            />
          )}
          
          {/* Coin design */}
          <div className="relative z-20 flex items-center justify-center w-full h-full">
            {side === 'heads' ? (
              <div className="text-center">
                {/* Golden Crown Bitcoin Design */}
                <div className="relative">
                  {/* Outer decorative ring */}
                  <div className={`absolute inset-0 ${size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-24 h-24' : 'w-36 h-36'} border-4 border-yellow-300/30 rounded-full animate-spin-slow`} 
                       style={{ animation: isFlipping ? 'spin 2s linear infinite' : 'none' }} />
                  
                  {/* Central Bitcoin Symbol */}
                  <div className="relative flex flex-col items-center">
                    <svg 
                      className={`${size === 'sm' ? 'w-10 h-10' : size === 'md' ? 'w-16 h-16' : 'w-24 h-24'} text-yellow-900 drop-shadow-2xl ${isFlipping ? 'animate-pulse' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/>
                      <path d="M11.647 9.6c.199-.896.298-1.341-.367-1.664-.665-.322-1.776-.322-2.242-.033-.466.29-.665.665-.665 1.329 0 .033.033.066.066.066h2.94c.166-.033.233-.365.268-.698zM11.18 12.6c.233-1.063.332-1.562-.433-1.929-.764-.366-2.078-.366-2.61-.033-.532.333-.764.764-.764 1.529 0 .033.033.066.066.066h3.474c.199-.033.267-.4.267-.633z" fill="#ffd700"/>
                    </svg>
                    
                    {/* Crown elements */}
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className={`absolute ${size === 'sm' ? 'w-1 h-2' : size === 'md' ? 'w-1.5 h-3' : 'w-2 h-4'} bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-t-full`}
                        style={{
                          transform: `rotate(${i * 45}deg) translateY(-${size === 'sm' ? '20' : size === 'md' ? '28' : '40'}px)`,
                          opacity: isFlipping ? Math.random() * 0.5 + 0.5 : 1
                        }}
                      />
                    ))}
                    
                    {/* Text below */}
                    <div className={`mt-2 text-yellow-900 font-black ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'} tracking-wider`}>
                      HEADS
                    </div>
                  </div>
                  
                  {/* Radiating golden rays */}
                  {isFlipping && Array.from({ length: 12 }, (_, i) => (
                    <div
                      key={i}
                      className={`absolute ${size === 'sm' ? 'w-0.5 h-6' : size === 'md' ? 'w-1 h-8' : 'w-1.5 h-12'} bg-gradient-to-t from-yellow-400 to-transparent opacity-70`}
                      style={{
                        transform: `rotate(${i * 30}deg) translateY(-${size === 'sm' ? '24' : size === 'md' ? '32' : '48'}px)`,
                        animation: 'pulse 0.5s ease-in-out infinite'
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Dark Skull Casino Design */}
                <div className="relative">
                  {/* Outer menacing ring */}
                  <div className={`absolute inset-0 ${size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-24 h-24' : 'w-36 h-36'} border-4 border-red-600/40 rounded-full`} 
                       style={{ animation: isFlipping ? 'spin 3s linear infinite reverse' : 'none' }} />
                  
                  {/* Central Skull Design */}
                  <div className="relative flex flex-col items-center">
                    {/* Skull SVG */}
                    <svg 
                      className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-18 h-18'} text-gray-200 drop-shadow-2xl ${isFlipping ? 'animate-pulse' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.5 2 6 4.5 6 8c0 2.5 1 4.5 2 6l1 3h6l1-3c1-1.5 2-3.5 2-6 0-3.5-2.5-6-6-6zM9 9c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm6 0c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1zm-3 3c-1 0-1.5.5-1.5 1s.5 1 1.5 1 1.5-.5 1.5-1-.5-1-1.5-1z"/>
                      <path d="M8 19h8v2H8z"/>
                    </svg>
                    
                    {/* Crossbones behind skull */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        className={`${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-18 h-18' : 'w-24 h-24'} text-gray-400 opacity-50`}
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ transform: 'rotate(45deg)' }}
                      >
                        <path d="M2 12h20M12 2v20"/>
                      </svg>
                    </div>
                    
                    {/* Danger spikes */}
                    {Array.from({ length: 6 }, (_, i) => (
                      <div
                        key={i}
                        className={`absolute ${size === 'sm' ? 'w-1 h-3' : size === 'md' ? 'w-1.5 h-4' : 'w-2 h-6'} bg-gradient-to-t from-red-800 to-red-500 clip-triangle`}
                        style={{
                          transform: `rotate(${i * 60}deg) translateY(-${size === 'sm' ? '18' : size === 'md' ? '24' : '36'}px)`,
                          opacity: isFlipping ? Math.random() * 0.7 + 0.3 : 0.8,
                          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                        }}
                      />
                    ))}
                    
                    {/* Text below */}
                    <div className={`mt-2 text-gray-200 font-black ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg'} tracking-wider`}>
                      TAILS
                    </div>
                  </div>
                  
                  {/* Dark energy waves */}
                  {isFlipping && Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={`absolute ${size === 'sm' ? 'w-4 h-1' : size === 'md' ? 'w-6 h-1.5' : 'w-8 h-2'} bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60 rounded-full`}
                      style={{
                        transform: `rotate(${i * 45}deg) translateX(${size === 'sm' ? '20' : size === 'md' ? '28' : '40'}px)`,
                        animation: 'pulse 0.7s ease-in-out infinite'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simplified reflection effect */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(${lightAngle}deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)`,
              animation: isFlipping ? 'shimmer 1.5s ease-in-out infinite' : 'none'
            }} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center perspective-2000">
      {/* Reduced ambient particles when flipping */}
      {isFlipping && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-40"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Outer glow ring during flip */}
      {isFlipping && (
        <div className={`absolute ${sizeClasses[size].coin} rounded-full animate-pulse-ring`} 
             style={{
               background: `radial-gradient(circle, ${currentSide === 'heads' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(239, 68, 68, 0.3)'} 0%, transparent 70%)`,
               animation: 'pulse-ring 1.5s ease-out infinite'
             }} />
      )}

      {/* 3D Coin Container */}
      <div 
        className={`
          ${sizeClasses[size].coin}
          relative 
          transform-style-preserve-3d
          ${isFlipping ? '' : 'transition-all duration-500 ease-out hover:rotate-y-15 hover:scale-110'}
        `}
        style={{
          filter: isFlipping 
            ? `drop-shadow(0 0 20px ${currentSide === 'heads' ? 'rgba(251, 191, 36, 0.8)' : 'rgba(239, 68, 68, 0.6)'})`
            : `drop-shadow(0 10px 20px rgba(0,0,0,0.3))`,
          transform: isFlipping 
            ? `
              perspective(1000px)
              rotateY(${rotation}deg) 
              translateY(${Math.sin(flipCount * 0.1) * 5}px)
              scale(1.05)
            ` 
            : result === 'heads' 
              ? 'perspective(1000px) rotateY(0deg)' 
              : 'perspective(1000px) rotateY(180deg)',
          transformOrigin: 'center center',
          transition: isFlipping ? 'none' : 'transform 0.5s ease-out',
          willChange: 'transform, filter',
          backfaceVisibility: 'visible'
        }}
      >
        {/* Heads face */}
        <CoinFace 
          side="heads" 
          className="transform translateZ-2" 
        />
        
        {/* Tails face */}
        <CoinFace 
          side="tails" 
          className="transform rotateY-180 translateZ-2" 
        />
      </div>

      {/* Ground reflection */}
      <div 
        className={`
          absolute bottom-0 ${sizeClasses[size].coin}
          bg-gradient-radial from-yellow-400/20 to-transparent
          rounded-full
          blur-md
          scale-75
          opacity-60
        `}
        style={{ 
          transform: 'translateY(60%) scaleY(0.2)',
          filter: 'blur(12px)'
        }}
      />
    </div>
  )
}

export default Coin3D