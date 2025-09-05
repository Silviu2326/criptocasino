'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CubeIcon, PlayIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useWalletStore } from '@/store/walletStore'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface DiceResult {
  roll: number
  target: number
  betAmount: string
  payout: string
  isWin: boolean
  multiplier: number
}

export function DiceGame() {
  const [betAmount, setBetAmount] = useState('0.001')
  const [target, setTarget] = useState(50)
  const [isRolling, setIsRolling] = useState(false)
  const [lastResult, setLastResult] = useState<DiceResult | null>(null)
  const [autoPlay, setAutoPlay] = useState(false)
  const [autoCount, setAutoCount] = useState(0)
  const [maxAutoPlays, setMaxAutoPlays] = useState(10)

  const { isConnected } = useWalletStore()
  const { isAuthenticated, user } = useAuthStore()

  // Calculate multiplier based on target
  const multiplier = target > 1 ? (99 / (target - 1)) : 99
  const winChance = target - 1

  const rollDice = async () => {
    if (!isConnected || !isAuthenticated) {
      toast.error('Please connect your wallet and login first')
      return
    }

    setIsRolling(true)

    try {
      // Simulate dice roll (in real implementation, this would be server-side)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const roll = Math.floor(Math.random() * 100) + 1
      const isWin = roll < target
      const payout = isWin ? (parseFloat(betAmount) * multiplier).toFixed(6) : '0'

      const result: DiceResult = {
        roll,
        target,
        betAmount,
        payout,
        isWin,
        multiplier
      }

      setLastResult(result)

      if (isWin) {
        toast.success(`🎉 You won ${payout} BTC!`)
      } else {
        toast.error(`You lost ${betAmount} BTC`)
      }

      // Auto play logic
      if (autoPlay) {
        setAutoCount(prev => prev + 1)
        if (autoCount + 1 >= maxAutoPlays) {
          setAutoPlay(false)
          setAutoCount(0)
        }
      }
    } catch (error) {
      toast.error('Failed to roll dice')
    } finally {
      setIsRolling(false)
    }
  }

  // Auto play effect
  useEffect(() => {
    if (autoPlay && !isRolling && autoCount < maxAutoPlays) {
      const timer = setTimeout(() => {
        rollDice()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, isRolling, autoCount, maxAutoPlays])

  return (
    <div className="card p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game Controls */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Game Controls</h2>
          
          {/* Bet Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bet Amount (BTC)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                step="0.001"
                min="0.001"
                max="1"
                className="input flex-1"
                disabled={isRolling || autoPlay}
              />
              <button
                onClick={() => setBetAmount(String(parseFloat(betAmount) * 2))}
                className="btn btn-secondary btn-sm"
                disabled={isRolling || autoPlay}
              >
                2×
              </button>
              <button
                onClick={() => setBetAmount(String(parseFloat(betAmount) / 2))}
                className="btn btn-secondary btn-sm"
                disabled={isRolling || autoPlay}
              >
                ½
              </button>
            </div>
          </div>

          {/* Target Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Roll Under: {target}
            </label>
            <input
              type="range"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              min="2"
              max="98"
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              disabled={isRolling || autoPlay}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2</span>
              <span>50</span>
              <span>98</span>
            </div>
          </div>

          {/* Game Info */}
          <div className="bg-casino-card/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Win Chance:</span>
              <span className="text-white">{winChance.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Multiplier:</span>
              <span className="text-casino-accent font-bold">{multiplier.toFixed(4)}×</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payout on Win:</span>
              <span className="text-casino-success">
                {(parseFloat(betAmount) * multiplier).toFixed(6)} BTC
              </span>
            </div>
          </div>

          {/* Auto Play */}
          <div className="border-t border-gray-600 pt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Auto Play</label>
              <button
                onClick={() => {
                  setAutoPlay(!autoPlay)
                  if (!autoPlay) setAutoCount(0)
                }}
                className={`btn btn-sm ${autoPlay ? 'btn-danger' : 'btn-secondary'}`}
                disabled={isRolling}
              >
                {autoPlay ? 'Stop Auto' : 'Start Auto'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Rounds:</span>
              <input
                type="number"
                value={maxAutoPlays}
                onChange={(e) => setMaxAutoPlays(parseInt(e.target.value))}
                min="1"
                max="100"
                className="input w-20 text-sm"
                disabled={autoPlay || isRolling}
              />
              {autoPlay && (
                <span className="text-xs text-casino-accent">
                  ({autoCount}/{maxAutoPlays})
                </span>
              )}
            </div>
          </div>

          {/* Roll Button */}
          <button
            onClick={rollDice}
            disabled={isRolling || autoPlay || !isConnected || !isAuthenticated}
            className="w-full btn btn-primary btn-lg casino-glow flex items-center justify-center space-x-2"
          >
            {isRolling ? (
              <>
                <ArrowPathIcon className="h-6 w-6 animate-spin" />
                <span>Rolling...</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-6 w-6" />
                <span>Roll Dice</span>
              </>
            )}
          </button>
        </div>

        {/* Game Display */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Game Result</h2>
          
          {/* Dice Animation */}
          <div className="bg-casino-card/30 rounded-lg p-8 text-center relative overflow-hidden">
            <AnimatePresence>
              {isRolling && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [0.5, 1.2, 1], 
                    rotate: [0, 360, 720, 1080],
                    opacity: 1 
                  }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="mb-4"
                >
                  <CubeIcon className="h-24 w-24 text-casino-accent mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>

            {!isRolling && lastResult && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className={`text-6xl font-bold mb-4 ${lastResult.isWin ? 'text-casino-success' : 'text-casino-danger'}`}>
                  {lastResult.roll}
                </div>
                <div className="text-lg text-gray-300 mb-2">
                  Target: Under {lastResult.target}
                </div>
                <div className={`text-2xl font-bold ${lastResult.isWin ? 'text-casino-success' : 'text-casino-danger'}`}>
                  {lastResult.isWin ? '🎉 WIN!' : '💥 LOSE'}
                </div>
                {lastResult.isWin && (
                  <div className="text-lg text-casino-accent mt-2">
                    +{lastResult.payout} BTC
                  </div>
                )}
              </motion.div>
            )}

            {!isRolling && !lastResult && (
              <div className="text-center text-gray-400 py-12">
                <CubeIcon className="h-24 w-24 mx-auto mb-4 opacity-50" />
                <p>Roll the dice to start playing!</p>
              </div>
            )}
          </div>

          {/* Recent Results */}
          {lastResult && (
            <div className="bg-casino-card/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Last Roll</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Roll:</span>
                  <span className="text-white font-mono">{lastResult.roll}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target:</span>
                  <span className="text-white">Under {lastResult.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bet:</span>
                  <span className="text-white font-mono">{lastResult.betAmount} BTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Result:</span>
                  <span className={lastResult.isWin ? 'text-casino-success' : 'text-casino-danger'}>
                    {lastResult.isWin ? `+${lastResult.payout} BTC` : `-${lastResult.betAmount} BTC`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}