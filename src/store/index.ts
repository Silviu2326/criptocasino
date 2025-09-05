import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  address: string
  email?: string
  username?: string
  level: number
  xp: number
  createdAt: string
  isVerified: boolean
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string
  network: string | null
  provider: 'metamask' | 'walletconnect' | null
}

export interface Balance {
  btc: string
  eth: string
  usdt: string
  usd: string
}

export interface GameResult {
  id: string
  game: string
  amount: string
  currency: string
  multiplier: number
  profit: string
  timestamp: string
  result: any
  serverSeed: string
  clientSeed: string
  nonce: number
}

interface AppState {
  // Auth
  user: User | null
  isAuthenticated: boolean
  token: string | null
  
  // Wallet
  wallet: WalletState
  
  // Balance
  balance: Balance
  
  // Games
  gameHistory: GameResult[]
  isPlaying: boolean
  
  // UI
  isLoading: boolean
  notifications: Notification[]
  
  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  connectWallet: (walletData: WalletState) => void
  disconnectWallet: () => void
  updateBalance: (newBalance: Balance) => void
  addGameResult: (result: GameResult) => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      token: null,
      
      wallet: {
        isConnected: false,
        address: null,
        balance: '0',
        network: null,
        provider: null,
      },
      
      balance: {
        btc: '0',
        eth: '0',
        usdt: '0',
        usd: '0',
      },
      
      gameHistory: [],
      isPlaying: false,
      isLoading: false,
      notifications: [],
      
      // Actions
      login: (user: User, token: string) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        })
      },
      
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          gameHistory: [],
          balance: {
            btc: '0',
            eth: '0',
            usdt: '0',
            usd: '0',
          }
        })
      },
      
      connectWallet: (walletData: WalletState) => {
        set({ wallet: { ...walletData, isConnected: true } })
      },
      
      disconnectWallet: () => {
        set({ 
          wallet: {
            isConnected: false,
            address: null,
            balance: '0',
            network: null,
            provider: null,
          }
        })
      },
      
      updateBalance: (newBalance: Balance) => {
        set({ balance: newBalance })
      },
      
      addGameResult: (result: GameResult) => {
        const { gameHistory } = get()
        set({ 
          gameHistory: [result, ...gameHistory].slice(0, 100) // Keep last 100 games
        })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      addNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification = { 
          ...notification, 
          id,
          duration: notification.duration || 5000
        }
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Auto remove notification
        setTimeout(() => {
          get().removeNotification(id)
        }, newNotification.duration)
      },
      
      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
    }),
    {
      name: 'crypto-casino-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        wallet: state.wallet,
        balance: state.balance,
        gameHistory: state.gameHistory,
      }),
    }
  )
)