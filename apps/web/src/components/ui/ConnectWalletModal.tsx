'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useWalletStore } from '@/store/walletStore'
import toast from 'react-hot-toast'

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/icons/metamask.svg',
    description: 'Connect using browser wallet',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '/icons/walletconnect.svg',
    description: 'Scan QR code with mobile wallet',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '/icons/coinbase.svg',
    description: 'Connect using Coinbase Wallet',
  },
]

export function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connect } = useWalletStore()

  const handleConnect = async (walletId: string) => {
    try {
      await connect(walletId)
      toast.success('Wallet connected successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error('Wallet connection error:', error)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl card p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Connect Wallet
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-white focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {walletOptions.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnect(wallet.id)}
                      className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-600 hover:border-casino-accent transition-all duration-200 hover:bg-gray-700/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-900">
                          {wallet.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">{wallet.name}</p>
                        <p className="text-sm text-gray-400">{wallet.description}</p>
                      </div>
                      <div className="text-casino-accent">
                        →
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-600">
                  <p className="text-xs text-gray-400 text-center">
                    By connecting a wallet, you agree to our{' '}
                    <a href="/terms" className="text-casino-accent hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-casino-accent hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}