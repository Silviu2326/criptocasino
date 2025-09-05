import React, { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  isActive?: boolean
  particleCount?: number
  colors?: string[]
  size?: 'sm' | 'md' | 'lg'
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({
  isActive = false,
  particleCount = 20,
  colors = ['#fbbf24', '#f59e0b', '#d97706', '#10b981', '#3b82f6'],
  size = 'md'
}) => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!isActive) {
      setParticles([])
      return
    }

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size === 'lg' ? 6 : size === 'md' ? 4 : 2) + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: Math.random() * 60 + 30
    })

    const initialParticles = Array.from({ length: particleCount }, (_, i) => createParticle(i))
    setParticles(initialParticles)

    const animationFrame = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const newLife = particle.life + 1
          if (newLife > particle.maxLife) {
            return createParticle(particle.id)
          }

          return {
            ...particle,
            x: (particle.x + particle.speedX + 100) % 100,
            y: (particle.y + particle.speedY + 100) % 100,
            life: newLife
          }
        })
      )
    }, 100)

    return () => clearInterval(animationFrame)
  }, [isActive, particleCount, colors, size])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: 1 - (particle.life / particle.maxLife),
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  )
}

export default ParticleSystem