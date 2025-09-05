'use client'

import { useState } from 'react'
import { WalletIcon } from '@heroicons/react/24/outline'
import { useWalletStore } from '@/store/walletStore'
import { ConnectWalletModal } from './ConnectWalletModal'

export function WalletButton() {
  const [showModal, setShowModal] = useState(false)
  const { isConnected, address, disconnect } = useWalletStore()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="flex items-center space-x-2 bg-casino-success/20 hover:bg-casino-success/30 text-casino-success border border-casino-success/50 btn btn-md transition-all duration-200"
      >
        <div className="w-2 h-2 bg-casino-success rounded-full animate-pulse" />
        <span className="font-mono text-sm">{formatAddress(address)}</span>
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn btn-primary btn-md flex items-center space-x-2 casino-glow"
      >
        <WalletIcon className="h-5 w-5" />
        <span>Connect Wallet</span>
      </button>
      
      <ConnectWalletModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}