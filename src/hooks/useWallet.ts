import { useState, useCallback, useEffect } from 'react'
import { useAppStore } from '../store'

declare global {
  interface Window {
    ethereum?: any
  }
}

interface UseWalletReturn {
  isConnected: boolean
  address: string | null
  balance: string
  network: string | null
  provider: string | null
  isConnecting: boolean
  connectMetaMask: () => Promise<void>
  disconnect: () => void
  switchNetwork: (networkId: string) => Promise<void>
  getBalance: () => Promise<void>
}

export const useWallet = (): UseWalletReturn => {
  const [isConnecting, setIsConnecting] = useState(false)
  const { wallet, connectWallet, disconnectWallet, addNotification } = useAppStore()

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      addNotification({
        type: 'error',
        title: 'MetaMask not found',
        message: 'Please install MetaMask to continue',
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]

      // Get network
      const networkId = await window.ethereum.request({
        method: 'net_version',
      })

      // Get balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })

      // Convert balance from wei to ETH
      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)

      connectWallet({
        isConnected: true,
        address,
        balance: balanceInEth,
        network: getNetworkName(networkId),
        provider: 'metamask',
      })

      addNotification({
        type: 'success',
        title: 'Wallet Connected',
        message: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      })

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: error.message || 'Failed to connect wallet',
      })
    } finally {
      setIsConnecting(false)
    }
  }, [connectWallet, addNotification])

  const disconnect = useCallback(() => {
    disconnectWallet()
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }

    addNotification({
      type: 'info',
      title: 'Wallet Disconnected',
      message: 'Your wallet has been disconnected',
    })
  }, [disconnectWallet, addNotification])

  const handleAccountsChanged = useCallback((accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect()
    } else {
      // Update with new account
      connectMetaMask()
    }
  }, [disconnect, connectMetaMask])

  const handleChainChanged = useCallback(() => {
    // Reload the page to avoid state inconsistencies
    window.location.reload()
  }, [])

  const switchNetwork = useCallback(async (networkId: string) => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkId }],
      })
    } catch (error: any) {
      console.error('Error switching network:', error)
      addNotification({
        type: 'error',
        title: 'Network Switch Failed',
        message: 'Failed to switch network',
      })
    }
  }, [addNotification])

  const getBalance = useCallback(async () => {
    if (!wallet.address || !window.ethereum) return

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [wallet.address, 'latest'],
      })

      const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)

      connectWallet({
        ...wallet,
        balance: balanceInEth,
      })
    } catch (error) {
      console.error('Error getting balance:', error)
    }
  }, [wallet, connectWallet])

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && wallet.isConnected) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })
          
          if (accounts.length === 0) {
            disconnect()
          }
        } catch (error) {
          console.error('Error checking connection:', error)
        }
      }
    }

    checkConnection()
  }, [wallet.isConnected, disconnect])

  return {
    isConnected: wallet.isConnected,
    address: wallet.address,
    balance: wallet.balance,
    network: wallet.network,
    provider: wallet.provider,
    isConnecting,
    connectMetaMask,
    disconnect,
    switchNetwork,
    getBalance,
  }
}

function getNetworkName(networkId: string): string {
  const networks: { [key: string]: string } = {
    '1': 'Mainnet',
    '3': 'Ropsten',
    '4': 'Rinkeby',
    '5': 'Goerli',
    '42': 'Kovan',
    '137': 'Polygon',
    '80001': 'Mumbai',
    '56': 'BSC',
    '97': 'BSC Testnet',
  }

  return networks[networkId] || `Network ${networkId}`
}