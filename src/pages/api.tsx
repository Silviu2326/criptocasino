import React from 'react'
import Layout from '../components/Layout'

export default function APIDocumentation() {
  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Comprehensive API documentation for the Crypto Casino platform. Explore endpoints, authentication methods, and integrate with our provably fair gaming system.
            </p>
          </div>

          {/* API Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Base URL</h3>
                  <p className="text-sm text-gray-400">Production API</p>
                </div>
              </div>
              <code className="text-blue-400 bg-gray-800/50 px-3 py-2 rounded-lg text-sm block">
                https://api.cryptocasino.com
              </code>
            </div>

            <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Authentication</h3>
                  <p className="text-sm text-gray-400">Bearer Token</p>
                </div>
              </div>
              <code className="text-blue-400 bg-gray-800/50 px-3 py-2 rounded-lg text-sm block">
                Authorization: Bearer &lt;token&gt;
              </code>
            </div>

            <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Rate Limiting</h3>
                  <p className="text-sm text-gray-400">Per IP Address</p>
                </div>
              </div>
              <code className="text-blue-400 bg-gray-800/50 px-3 py-2 rounded-lg text-sm block">
                100 requests/minute
              </code>
            </div>
          </div>

          {/* Main API Documentation */}
          <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Available Endpoints</h2>
            
            {/* Authentication Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                Authentication
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/auth/magic-link</code>
                  <span className="text-gray-300">Send magic link for email authentication</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/auth/callback</code>
                  <span className="text-gray-300">Verify magic link token</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/auth/wallet/nonce</code>
                  <span className="text-gray-300">Get nonce for wallet signature</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/auth/wallet/verify</code>
                  <span className="text-gray-300">Verify wallet signature</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/auth/refresh</code>
                  <span className="text-gray-300">Refresh access token</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/auth/logout</code>
                  <span className="text-gray-300">Logout user</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/auth/me</code>
                  <span className="text-gray-300">Get current user profile</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
              </div>
            </div>

            {/* Games Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a1.5 1.5 0 011.5 1.5V12m-3 0V9a3 3 0 016 0v3m-6 0h6" />
                  </svg>
                </span>
                Games
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/games/dice/play</code>
                  <span className="text-gray-300">Play dice game</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/games/coinflip/play</code>
                  <span className="text-gray-300">Play coinflip game</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/games/slots/play</code>
                  <span className="text-gray-300">Play slots game</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/games/stats</code>
                  <span className="text-gray-300">Get user game statistics</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
              </div>
            </div>

            {/* Payments Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </span>
                Payments
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/payments/deposits</code>
                  <span className="text-gray-300">Create deposit intent</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/payments/withdrawals</code>
                  <span className="text-gray-300">Request withdrawal</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/payments/deposits</code>
                  <span className="text-gray-300">Get user deposits</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/payments/withdrawals</code>
                  <span className="text-gray-300">Get user withdrawals</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
              </div>
            </div>

            {/* Provably Fair Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Provably Fair
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/provably-fair/config</code>
                  <span className="text-gray-300">Get provably fair configuration</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/provably-fair/seed/commit</code>
                  <span className="text-gray-300">Commit new server seed</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/provably-fair/seed/reveal</code>
                  <span className="text-gray-300">Reveal current server seed and rotate</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/provably-fair/seed/current</code>
                  <span className="text-gray-300">Get current active seed information</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">GET</span>
                  <code className="text-blue-400">/provably-fair/seed/history</code>
                  <span className="text-gray-300">Get user seed history</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">🔒 Auth Required</span>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg">
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold">POST</span>
                  <code className="text-blue-400">/provably-fair/verify</code>
                  <span className="text-gray-300">Verify game result independently</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Swagger Documentation</h3>
              <p className="text-gray-400 mb-4">
                Access the interactive Swagger documentation for detailed API specifications and live testing.
              </p>
              <a
                href="http://localhost:4000/api/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span>Open Swagger Docs</span>
              </a>
            </div>

            <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
              <p className="text-gray-400 mb-4">
                Quick start guide and examples for integrating with our API.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Authentication guide</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Code examples</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Error handling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}