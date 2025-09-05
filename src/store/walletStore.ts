import { create } from 'zustand'
import { ethers } from 'ethers'

interface WalletState {
  isConnected: boolean
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  network: ethers.Network | null
  balance: string | null
  isConnecting: boolean
  
  // Actions
  connect: (walletType: string) => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
  getBalance: () => Promise<void>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  address: null,
  provider: null,
  signer: null,
  network: null,
  balance: null,
  isConnecting: false,

  connect: async (walletType: string) => {
    set({ isConnecting: true })
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('Window is not available')
      }

      let provider: ethers.BrowserProvider

      switch (walletType) {
        case 'metamask':
          if (!window.ethereum) {
            throw new Error('MetaMask is not installed')
          }
          provider = new ethers.BrowserProvider(window.ethereum)
          break
          
        case 'walletconnect':
          // TODO: Implement WalletConnect
          throw new Error('WalletConnect not implemented yet')
          
        case 'coinbase':
          // TODO: Implement Coinbase Wallet
          throw new Error('Coinbase Wallet not implemented yet')
          
        default:
          throw new Error('Unsupported wallet type')
      }

      // Request account access
      await provider.send('eth_requestAccounts', [])
      
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      
      set({
        isConnected: true,
        address,
        provider,
        signer,
        network,
        isConnecting: false
      })
      
      // Get balance
      get().getBalance()
      
    } catch (error) {
      set({ isConnecting: false })
      throw error
    }
  },

  disconnect: () => {
    set({
      isConnected: false,
      address: null,
      provider: null,
      signer: null,
      network: null,
      balance: null
    })
  },

  switchNetwork: async (chainId: number) => {
    const { provider } = get()
    if (!provider) {
      throw new Error('No provider connected')
    }

    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${chainId.toString(16)}` }
      ])
    } catch (error: any) {
      // Chain not added to wallet
      if (error.code === 4902) {
        throw new Error('Please add this network to your wallet first')
      }
      throw error
    }
  },

  getBalance: async () => {
    const { provider, address } = get()
    if (!provider || !address) return

    try {
      const balance = await provider.getBalance(address)
      const balanceInEth = ethers.formatEther(balance)
      set({ balance: balanceInEth })
    } catch (error) {
      console.error('Failed to get balance:', error)
    }
  }
}))

// Types for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (accounts: string[]) => void) => void
      removeListener: (event: string, callback: (accounts: string[]) => void) => void
      isMetaMask?: boolean
    }
  }
}