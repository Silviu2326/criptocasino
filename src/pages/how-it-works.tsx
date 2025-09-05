import React, { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('provably-fair')

  const steps = [
    {
      number: '01',
      title: 'Connect Your Wallet',
      description: 'Connect your crypto wallet in seconds. No KYC, no personal data required.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'Deposit Crypto',
      description: 'Deposit your favorite cryptocurrencies instantly with zero fees.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      number: '03',
      title: 'Choose Your Game',
      description: 'Select from our collection of provably fair casino games.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z"/>
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      number: '04',
      title: 'Play & Win',
      description: 'Enjoy transparent gaming with instant payouts directly to your wallet.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 7h14l-.89-3.12c-.13-.45-.52-.78-.98-.78H6.87c-.46 0-.85.32-.98.78L5 7zm14.35 1H4.65l-.11.39-.9 3.15v6.36c0 .61.49 1.1 1.1 1.1h.76c.61 0 1.1-.49 1.1-1.1V17h10.8v.9c0 .61.49 1.1 1.1 1.1h.76c.61 0 1.1-.49 1.1-1.1v-6.36l-.9-3.15-.11-.39zM7.5 16c-.83 0-1.5-.67-1.5-1.5S6.67 13 7.5 13s1.5.67 1.5 1.5S8.33 16 7.5 16zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          <path d="M12 2l.89 1.79L15 4.5l-1.5 1.46.36 2.04L12 6.9 10.14 8l.36-2.04L9 4.5l2.11-.71z"/>
        </svg>
      ),
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  const features = [
    {
      title: 'Blockchain Technology',
      description: 'Every bet is recorded on the blockchain, ensuring complete transparency and immutability.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
        </svg>
      )
    },
    {
      title: 'Smart Contracts',
      description: 'Automated payouts through smart contracts eliminate the need for manual processing.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      )
    },
    {
      title: 'Decentralized Gaming',
      description: 'No central authority controls the games. Everything runs on decentralized protocols.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )
    },
    {
      title: 'Instant Settlements',
      description: 'Win or lose, your funds are settled instantly without any delays.',
      icon: (
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
        </svg>
      )
    }
  ]

  const cryptoSupported = [
    { 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.24 10.56c-.31 1.24-2.24.61-2.84.44l.55-2.18c.62.15 2.61.45 2.29 1.74zm-.76 3.02c-.33 1.37-2.61.68-3.34.48l.59-2.37c.73.18 3.09.53 2.75 1.89zm5.39-5.89c-.85-3.43-5.61-2.63-6.64-2.39l-.48 1.94.99.25-.44 1.76-.97-.24-.48 1.92c2.45.62 2.97.57 4.3.17.16.24.42.56.86.71.68.25 1.82.07 2.09-1.16.26-1.05-.17-1.61-.52-1.92.5-.13 1.5-.5 1.29-2.04zm-6.95-1.57l1.26.31-.38 1.53-1.26-.32.38-1.52zm-1.2-.3l1.1.28-.38 1.52-1.1-.28.38-1.52zm-1.2-.31l.82.2-.38 1.52-.82-.2.38-1.52z"/>
        </svg>
      ), 
      color: 'text-orange-500' 
    },
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 9l10 7 10-7-10-7zM12 22l-10-7 10-3 10 3-10 7z"/>
        </svg>
      ), 
      color: 'text-blue-500' 
    },
    { 
      name: 'USDT', 
      symbol: 'USDT', 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
        </svg>
      ), 
      color: 'text-green-500' 
    },
    { 
      name: 'BNB', 
      symbol: 'BNB', 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 3.09L12 8.18 8.91 5.09 12 2m4.91 4.91L20 10l-3.09 3.09L13.82 10l3.09-3.09M8.18 12L12 15.82 15.82 12 12 8.18 8.18 12m-3.09-1.91L8.18 7l3.09 3.09L8.18 13.18 5.09 10m0 4L8.18 17.09 5.09 20 2 16.91 5.09 13.82M12 15.82l3.09 3.09L12 22l-3.09-3.09L12 15.82m4.91-1.91L20 16.91 16.91 20l-3.09-3.09L16.91 13.91z"/>
        </svg>
      ), 
      color: 'text-yellow-500' 
    },
    { 
      name: 'Polygon', 
      symbol: 'MATIC', 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l-5.5 9.5L12 22l5.5-10.5L12 2zm0 3.84L14.91 11 12 16.16 9.09 11 12 5.84z"/>
        </svg>
      ), 
      color: 'text-purple-500' 
    },
    { 
      name: 'Solana', 
      symbol: 'SOL', 
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.5 11L12 2l4.5 9h-9zm0 2h9l-4.5 9-4.5-9z"/>
        </svg>
      ), 
      color: 'text-cyan-500' 
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl animate-float">
              <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                <path d="M2 17L12 22L22 17"/>
                <path d="M2 12L12 17L22 12"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              How <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">It Works</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of online gaming with blockchain technology, provably fair games, and instant crypto payouts
            </p>
          </div>

          {/* Step by Step Process */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Getting Started is Easy
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="group relative">
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-gray-600 to-gray-700 z-0"></div>
                  )}
                  
                  <div className="relative glass rounded-3xl p-8 backdrop-blur-xl border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-2 border-gray-700">
                      <span className="text-sm font-bold text-gray-400">{step.number}</span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl mb-6 shadow-xl group-hover:animate-bounce`}>
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tabbed Section */}
          <section className="mb-20">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['provably-fair', 'security', 'payouts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black transform scale-105'
                      : 'glass hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            <div className="glass rounded-3xl p-12 backdrop-blur-xl border border-gray-700/50">
              {activeTab === 'provably-fair' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Provably Fair Gaming</h3>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                      Our provably fair system uses cryptographic algorithms to ensure that neither the player nor the casino can know the result of a game before it starts.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-dark rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-yellow-400 mb-2">Client Seed</h4>
                      <p className="text-sm text-gray-400">You provide a random seed that influences the game outcome</p>
                    </div>
                    <div className="glass-dark rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-blue-400 mb-2">Server Seed</h4>
                      <p className="text-sm text-gray-400">We generate a hashed seed before the game starts</p>
                    </div>
                    <div className="glass-dark rounded-2xl p-6">
                      <h4 className="text-lg font-bold text-green-400 mb-2">Verification</h4>
                      <p className="text-sm text-gray-400">After each game, verify the fairness using both seeds</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-green-400 font-medium">All game results can be independently verified on the blockchain</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Bank-Grade Security</h3>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                      Your funds and data are protected by military-grade encryption and blockchain technology.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">SSL Encryption</h4>
                        <p className="text-gray-400">256-bit SSL encryption protects all data transmissions</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Private Keys</h4>
                        <p className="text-gray-400">Your wallet, your keys, your crypto - always in your control</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Cold Storage</h4>
                        <p className="text-gray-400">Majority of funds kept in secure cold storage wallets</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Anonymous Play</h4>
                        <p className="text-gray-400">No KYC required - play with complete privacy</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payouts' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
                      <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Instant Payouts</h3>
                    <p className="text-gray-400 max-w-3xl mx-auto">
                      Win and withdraw instantly. No waiting periods, no approval processes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-black text-yellow-400 mb-2">&lt; 1s</div>
                      <div className="text-gray-400">Average payout time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-400 mb-2">0%</div>
                      <div className="text-gray-400">Withdrawal fees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-black text-blue-400 mb-2">24/7</div>
                      <div className="text-gray-400">Automated payouts</div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-bold text-white mb-4">Supported Cryptocurrencies</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {cryptoSupported.map((crypto, index) => (
                        <div key={index} className="glass-dark rounded-xl p-4 text-center hover:scale-105 transition-transform duration-300">
                          <div className={`mb-2 ${crypto.color}`}>{crypto.icon}</div>
                          <div className="text-white font-semibold">{crypto.symbol}</div>
                          <div className="text-xs text-gray-500">{crypto.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Key Features Grid */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Why Choose Crypto Casino
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="glass rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "How fast are withdrawals?",
                  answer: "Withdrawals are instant! As soon as you request a withdrawal, the smart contract automatically processes it and sends funds to your wallet."
                },
                {
                  question: "Do I need to provide personal information?",
                  answer: "No! We believe in privacy. You can play completely anonymously with just your crypto wallet."
                },
                {
                  question: "What cryptocurrencies do you accept?",
                  answer: "We accept Bitcoin, Ethereum, USDT, BNB, Polygon, and Solana with more being added regularly."
                },
                {
                  question: "How do I verify game fairness?",
                  answer: "Every game result can be verified using the client and server seeds. We provide a verification tool for complete transparency."
                }
              ].map((faq, index) => (
                <div key={index} className="glass rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <div className="glass rounded-3xl p-12 backdrop-blur-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <h2 className="text-3xl font-bold mb-4">
                Ready to <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Get Started?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of players enjoying provably fair gaming with instant crypto payouts
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/games"
                  className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black py-4 px-10 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-400/50 inline-flex items-center justify-center space-x-3 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-1000 group-hover:translate-x-full"></div>
                  <span className="relative z-10">Start Playing Now</span>
                </Link>
                <Link
                  href="/"
                  className="glass hover:glass-dark text-white font-bold py-4 px-10 rounded-2xl text-xl border border-gray-600/50 hover:border-gray-400/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}