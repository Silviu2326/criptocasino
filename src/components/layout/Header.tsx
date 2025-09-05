'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useState } from 'react'
import { WalletButton } from '../ui/WalletButton'
import { useAuthStore } from '@/store/authStore'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Games', href: '/games' },
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'VIP', href: '/vip' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()

  return (
    <header className="bg-casino-dark/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-r from-casino-accent to-primary-400">
                <span className="text-sm font-bold text-casino-dark">CC</span>
              </div>
              <span className="text-xl font-bold gradient-text">CryptoCasino</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-casino-accent transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <WalletButton />
            
            {isAuthenticated && user && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <UserCircleIcon className="h-8 w-8" />
                  <span className="hidden sm:block text-sm font-medium">
                    {user.username}
                  </span>
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right card">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/settings"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-600 my-1" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => {/* logout logic */}}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              active ? 'bg-gray-700 text-white' : 'text-gray-300'
                            }`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <Transition
          show={mobileMenuOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="md:hidden border-t border-gray-700 pt-4 pb-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-casino-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </Transition>
      </nav>
    </header>
  )
}