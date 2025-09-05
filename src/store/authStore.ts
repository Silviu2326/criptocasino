import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  username: string
  balance: {
    BTC: string
    ETH: string
    USDT: string
  }
  stats: {
    totalBets: number
    totalWins: number
    winRate: number
    highestWin: string
  }
  isVip: boolean
  level: number
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
  updateBalance: (currency: string, amount: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // TODO: Implement actual login logic
          const mockUser: User = {
            id: 'demo-user-1',
            email: email,
            username: 'demo',
            balance: {
              BTC: '0.05',
              ETH: '1.25',
              USDT: '1000.00'
            },
            stats: {
              totalBets: 150,
              totalWins: 87,
              winRate: 58,
              highestWin: '500.00'
            },
            isVip: false,
            level: 1
          }
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false,
            token: 'demo-token'
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null 
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setToken: (token: string) => {
        set({ token })
      },

      updateBalance: (currency: string, amount: string) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              balance: {
                ...user.balance,
                [currency]: amount
              }
            }
          })
        }
      }
    }),
    {
      name: 'crypto-casino-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {}
        }
      }),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token
      })
    }
  )
)