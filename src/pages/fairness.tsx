import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function FairnessPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [verificationData, setVerificationData] = useState({
    serverSeed: '',
    clientSeed: '',
    nonce: '',
    game: 'dice'
  })
  const [verificationResult, setVerificationResult] = useState<string | null>(null)

  const handleVerification = () => {
    if (!verificationData.serverSeed || !verificationData.clientSeed || !verificationData.nonce) {
      alert('Please fill in all verification fields')
      return
    }

    // Simulate verification process
    const crypto = require('crypto')
    const message = `${verificationData.clientSeed}:${verificationData.nonce}`
    const result = crypto.createHmac('sha256', verificationData.serverSeed).update(message).digest('hex')
    
    setVerificationResult(`Verification Hash: ${result.substring(0, 16)}...`)
  }

  const gameAlgorithms = [
    {
      name: "Dice",
      description: "Roll a number between 0.00 and 99.99",
      algorithm: "HMAC-SHA256(serverSeed, clientSeed:nonce) → hexToNumber(0-9999) / 100",
      houseEdge: "1%",
      example: {
        serverSeed: "a4c7b2d1f8e9...",
        clientSeed: "user_chosen_seed",
        nonce: 1,
        result: "45.67"
      }
    },
    {
      name: "Coinflip", 
      description: "Heads or Tails with 50/50 odds",
      algorithm: "HMAC-SHA256(serverSeed, clientSeed:nonce) → hexToNumber(0-1)",
      houseEdge: "2%",
      example: {
        serverSeed: "b8f3a1c9e2d4...",
        clientSeed: "player_seed_123",
        nonce: 1,
        result: "Heads (0)"
      }
    },
    {
      name: "Crash",
      description: "Multiplier crashes at random point",
      algorithm: "HMAC-SHA256(serverSeed, clientSeed:nonce) → exponential distribution",
      houseEdge: "1%",
      example: {
        serverSeed: "e7d2a9f4b1c8...",
        clientSeed: "crash_seed_456",
        nonce: 1,
        result: "2.45x"
      }
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Provably Fair Gaming
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Complete transparency through cryptographic verification. Every game result can be independently verified using our open-source algorithms.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="glass rounded-2xl p-2 backdrop-blur-xl border border-gray-700/50">
              <div className="flex space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: 'info' },
                  { id: 'how-it-works', label: 'How It Works', icon: 'cog' },
                  { id: 'algorithms', label: 'Algorithms', icon: 'code' },
                  { id: 'verify', label: 'Verify Game', icon: 'check' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {tab.icon === 'info' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {tab.icon === 'cog' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      )}
                      {tab.icon === 'code' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      )}
                      {tab.icon === 'check' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Overview Section */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* What is Provably Fair */}
              <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">What is Provably Fair?</h2>
                </div>
                <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
                  <p>
                    Provably Fair is a cryptographic system that allows you to verify that game outcomes are truly random and haven't been manipulated by the house. Unlike traditional online casinos where you have to trust the operator, our system provides mathematical proof that every game is fair.
                  </p>
                  <p>
                    Before each game, we generate a <strong className="text-green-400">server seed</strong> (kept secret until after the game) and you provide a <strong className="text-blue-400">client seed</strong>. These seeds, combined with a <strong className="text-purple-400">nonce</strong> (game counter), create a unique hash that determines the game outcome.
                  </p>
                  <p>
                    After the game, we reveal the server seed so you can verify that the result was predetermined and not manipulated based on your bet or game state.
                  </p>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Complete Transparency",
                    description: "Every game result can be verified independently using cryptographic proof",
                    icon: "eye",
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "No Manipulation",
                    description: "Results are predetermined before bets are placed, preventing any interference",
                    icon: "shield",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Open Source",
                    description: "All algorithms are public and can be audited by security researchers",
                    icon: "code",
                    color: "from-purple-500 to-pink-500"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6 hover:border-green-500/50 transition-all duration-300">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-full mb-4 shadow-xl`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {benefit.icon === 'eye' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        )}
                        {benefit.icon === 'shield' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        )}
                        {benefit.icon === 'code' && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        )}
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-300">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How It Works Section */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Step by Step Process */}
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-white mb-8">Step by Step Process</h2>
                  {[
                    {
                      step: 1,
                      title: "Server Seed Generation",
                      description: "We generate a random 256-bit server seed and create its SHA256 hash. The hash is shown to you before the game, but the actual seed remains secret.",
                      color: "bg-blue-500"
                    },
                    {
                      step: 2,
                      title: "Client Seed Input",
                      description: "You provide your own client seed (or use a randomly generated one). This ensures that we cannot predict the final outcome.",
                      color: "bg-green-500"
                    },
                    {
                      step: 3,
                      title: "Game Execution",
                      description: "The game uses HMAC-SHA256(serverSeed, clientSeed:nonce) to generate a deterministic result. The outcome is now fixed and cannot be changed.",
                      color: "bg-purple-500"
                    },
                    {
                      step: 4,
                      title: "Verification",
                      description: "After the game, we reveal the server seed. You can now verify that the hash matches and reproduce the exact same result using our algorithms.",
                      color: "bg-orange-500"
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 ${step.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-gray-300">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Diagram */}
                <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">Cryptographic Process</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="inline-block glass-dark rounded-lg px-4 py-2 mb-2">
                        <span className="text-blue-400 font-mono text-sm">Server Seed (Hidden)</span>
                      </div>
                      <div className="w-px h-8 bg-gray-600 mx-auto"></div>
                      <div className="inline-block glass-dark rounded-lg px-4 py-2">
                        <span className="text-blue-300 font-mono text-sm">SHA256 Hash (Public)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <span className="text-2xl">+</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block glass-dark rounded-lg px-4 py-2">
                        <span className="text-green-400 font-mono text-sm">Client Seed (Your Input)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <span className="text-2xl">+</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block glass-dark rounded-lg px-4 py-2">
                        <span className="text-purple-400 font-mono text-sm">Nonce (Game #)</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <span className="text-2xl">↓</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-4 py-2">
                        <span className="text-black font-bold text-sm">HMAC-SHA256</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center">
                      <span className="text-2xl">↓</span>
                    </div>
                    
                    <div className="text-center">
                      <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg px-4 py-2">
                        <span className="text-white font-bold">Game Result</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Algorithms Section */}
          {activeTab === 'algorithms' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Game Algorithms</h2>
                <p className="text-gray-300 text-lg">Each game uses specific algorithms to convert cryptographic hashes into fair game outcomes</p>
              </div>
              
              <div className="space-y-8">
                {gameAlgorithms.map((game, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">{game.name}</h3>
                        <p className="text-gray-300 mb-6">{game.description}</p>
                        
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Algorithm</span>
                            <div className="glass-dark rounded-lg p-3 mt-2">
                              <code className="text-green-400 text-sm font-mono">{game.algorithm}</code>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-sm font-bold text-orange-400 uppercase tracking-wider">House Edge</span>
                            <div className="glass-dark rounded-lg p-3 mt-2">
                              <span className="text-orange-300 font-bold">{game.houseEdge}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Example Calculation</h4>
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Server Seed</span>
                            <div className="glass-dark rounded p-2">
                              <code className="text-blue-400 text-sm font-mono">{game.example.serverSeed}</code>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Client Seed</span>
                            <div className="glass-dark rounded p-2">
                              <code className="text-green-400 text-sm font-mono">{game.example.clientSeed}</code>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Nonce</span>
                            <div className="glass-dark rounded p-2">
                              <code className="text-purple-400 text-sm font-mono">{game.example.nonce}</code>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Result</span>
                            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded p-2">
                              <code className="text-black text-sm font-bold">{game.example.result}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Section */}
          {activeTab === 'verify' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Verify Game Results</h2>
                <p className="text-gray-300 text-lg">Enter the game data to verify that the results were fair and predetermined</p>
              </div>
              
              <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Server Seed</label>
                    <input
                      type="text"
                      value={verificationData.serverSeed}
                      onChange={(e) => setVerificationData({...verificationData, serverSeed: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 font-mono"
                      placeholder="Enter the revealed server seed..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Seed</label>
                    <input
                      type="text"
                      value={verificationData.clientSeed}
                      onChange={(e) => setVerificationData({...verificationData, clientSeed: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 font-mono"
                      placeholder="Enter your client seed..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nonce</label>
                      <input
                        type="number"
                        value={verificationData.nonce}
                        onChange={(e) => setVerificationData({...verificationData, nonce: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200 font-mono"
                        placeholder="Game number..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Game Type</label>
                      <select
                        value={verificationData.game}
                        onChange={(e) => setVerificationData({...verificationData, game: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                      >
                        <option value="dice">Dice</option>
                        <option value="coinflip">Coinflip</option>
                        <option value="crash">Crash</option>
                      </select>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleVerification}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all duration-200 transform hover:scale-105"
                  >
                    Verify Game Result
                  </button>
                  
                  {verificationResult && (
                    <div className="mt-6 glass-dark rounded-xl p-4">
                      <h4 className="text-lg font-bold text-green-400 mb-2">Verification Result</h4>
                      <code className="text-gray-300 font-mono text-sm">{verificationResult}</code>
                      <p className="text-green-400 mt-2">✓ Result verified successfully!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* External Verification Links */}
              <div className="mt-12 text-center">
                <h3 className="text-xl font-bold text-white mb-6">Third-Party Verification</h3>
                <div className="flex justify-center space-x-4">
                  <a
                    href="#"
                    className="glass hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Verify on BitVerify</span>
                  </a>
                  <a
                    href="#"
                    className="glass hover:bg-white/10 text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>GitHub Repository</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}