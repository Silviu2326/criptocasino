import React, { useState } from 'react'
import { useWallet } from '../../hooks/useWallet'

interface WalletConnectProps {
  onClose?: () => void
  showModal?: boolean
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  onClose, 
  showModal = false 
}) => {
  const { connectMetaMask, isConnecting } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c-.17-.44-.36-.87-.58-1.29.22.42.41.85.58 1.29zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.73 2.89-1.64 3.99-.18.22-.37.42-.58.62 1.17-.3 2.17-.98 2.64-2.07.3-.7.39-1.44.25-2.19-.05-.25-.12-.49-.19-.73.19.15.36.32.52.38z"/>
        </svg>
      ),
      description: 'Connect using MetaMask wallet',
      available: typeof window !== 'undefined' && window.ethereum,
      action: connectMetaMask,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.67 8.17c3.54-3.47 9.26-3.47 12.8 0l.41.4c.17.17.17.44 0 .61l-1.43 1.4c-.09.08-.22.08-.31 0l-.57-.56c-2.47-2.42-6.46-2.42-8.93 0l-.61.6c-.09.08-.22.08-.31 0L5.28 9.22c-.17-.17-.17-.44 0-.61l.39-.44zm15.8 2.89l1.27 1.25c.17.17.17.44 0 .61l-5.73 5.62c-.17.17-.44.17-.61 0L12 14.16c-.04-.04-.11-.04-.15 0L7.4 18.54c-.17.17-.44.17-.61 0L.06 12.92c-.17-.17-.17-.44 0-.61l1.27-1.25c.17-.17.44-.17.61 0l4.45 4.36c.04.04.11.04.15 0l4.45-4.36c.17-.17.44-.17.61 0l4.45 4.36c.04.04.11.04.15 0l4.45-4.36c.17-.17.44-.17.61 0z"/>
        </svg>
      ),
      description: 'Scan QR code with your wallet app',
      available: true,
      action: () => console.log('WalletConnect coming soon'),
    }
  ]

  const handleConnect = async (wallet: any) => {
    setSelectedWallet(wallet.id)
    await wallet.action()
    setSelectedWallet(null)
    onClose?.()
  }

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative glass rounded-3xl p-8 max-w-md w-full backdrop-blur-xl border border-gray-700/50">
          <WalletConnectContent 
            wallets={wallets}
            selectedWallet={selectedWallet}
            isConnecting={isConnecting}
            onConnect={handleConnect}
            onClose={onClose}
          />
        </div>
      </div>
    )
  }

  return (
    <WalletConnectContent 
      wallets={wallets}
      selectedWallet={selectedWallet}
      isConnecting={isConnecting}
      onConnect={handleConnect}
    />
  )
}

interface WalletConnectContentProps {
  wallets: any[]
  selectedWallet: string | null
  isConnecting: boolean
  onConnect: (wallet: any) => void
  onClose?: () => void
}

const WalletConnectContent: React.FC<WalletConnectContentProps> = ({
  wallets,
  selectedWallet,
  isConnecting,
  onConnect,
  onClose
}) => {
  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-400 mb-8">
        Connect your wallet to start playing provably fair games
      </p>

      {/* Wallet Options */}
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <button
            key={wallet.id}
            onClick={() => onConnect(wallet)}
            disabled={!wallet.available || isConnecting}
            className={`w-full glass-dark rounded-2xl p-6 border transition-all duration-300 ${
              wallet.available
                ? 'border-gray-700/50 hover:border-yellow-400/50 hover:bg-white/5'
                : 'border-gray-800/50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${
                wallet.available 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {wallet.icon}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
                  {!wallet.available && (
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded-full">
                      Not Available
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{wallet.description}</p>
              </div>

              {selectedWallet === wallet.id && isConnecting && (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
              )}

              {wallet.available && (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          <div className="text-sm text-blue-300">
            <p className="font-medium mb-1">Secure & Anonymous</p>
            <p className="text-blue-400">We never store your private keys and your funds remain in your wallet.</p>
          </div>
        </div>
      </div>
    </>
  )
}