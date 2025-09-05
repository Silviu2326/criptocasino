import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { WalletButton } from './wallet/WalletButton'
import { NotificationSystem } from './ui/NotificationSystem'
import { useAppStore } from '../store'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAppStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Modern Animated Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass-dark backdrop-blur-xl shadow-2xl shadow-yellow-400/10 py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Animated Logo */}
          <Link 
            href="/" 
            className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <svg className="w-7 h-7 text-black animate-spin-slow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-orange-400 transition-all duration-300">
              CRYPTO CASINO
            </span>
          </Link>

          {/* Animated Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            <Link 
              href="/games" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
            >
              <span className="relative z-10">Games</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <div className="relative group">
              <button className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold flex items-center space-x-1">
                <span>Features</span>
                <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 glass-dark rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <Link href="/games/dice" className="block px-4 py-3 hover:bg-white/10 transition-colors duration-200 rounded-t-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">🎲</span>
                    <span>Dice Game</span>
                  </div>
                </Link>
                <Link href="/games/coinflip" className="block px-4 py-3 hover:bg-white/10 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">🪙</span>
                    <span>Coin Flip</span>
                  </div>
                </Link>
                <Link href="/games/crash" className="block px-4 py-3 hover:bg-white/10 transition-colors duration-200 rounded-b-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400">🚀</span>
                    <span>Crash Game</span>
                  </div>
                </Link>
              </div>
            </div>

            <Link 
              href="/vip" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"/>
                </svg>
                VIP
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link 
              href="/tournaments" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
            >
              <span className="relative z-10">Tournaments</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>

            <Link 
              href="/leaderboard" 
              className="relative group text-gray-300 hover:text-white transition-colors duration-300 font-semibold"
            >
              <span className="relative z-10">Leaderboard</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <WalletButton />
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden relative w-8 h-8 flex items-center justify-center group">
            <div className="space-y-1.5">
              <span className="block w-7 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:rotate-45 group-hover:translate-y-2 transition-all duration-300"></span>
              <span className="block w-7 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:opacity-0 transition-all duration-300"></span>
              <span className="block w-7 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:-rotate-45 group-hover:-translate-y-2 transition-all duration-300"></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content with padding for fixed navbar */}
      <main className="relative z-10 pt-24">{children}</main>

      {/* Modern Animated Footer */}
      <footer className="relative z-10 glass-dark backdrop-blur-xl border-t border-gray-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Footer Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  CRYPTO CASINO
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The future of online gaming with blockchain technology, provably fair games, and instant payouts.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-0.5 mr-2"></span>
                Games
              </h3>
              <ul className="space-y-2">
                <li><Link href="/games/dice" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">Dice Game</Link></li>
                <li><Link href="/games/coinflip" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">Coin Flip</Link></li>
                <li><Link href="/games/crash" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">Crash Game</Link></li>
                <li><Link href="/games" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">All Games</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-0.5 mr-2"></span>
                Resources
              </h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">Help Center</Link></li>
                <li><Link href="/fairness" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">Provably Fair</Link></li>
                <li><Link href="/responsible" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">Responsible Gaming</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-0.5 mr-2"></span>
                Community
              </h3>
              <div className="flex space-x-3">
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-200 group">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-16 h-1 rounded-full"></div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Crypto Casino. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">
                Privacy
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Footer Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-shimmer"></div>
        </div>
      </footer>

      {/* Notification System */}
      <NotificationSystem />

      {/* Add CSS for animation delays and spin-slow */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}