import Link from 'next/link'
import { 
  ShieldCheckIcon, 
  CubeTransparentIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline'

const footerLinks = {
  games: {
    title: 'Games',
    links: [
      { name: 'Dice', href: '/games/dice' },
      { name: 'Coinflip', href: '/games/coinflip' },
      { name: 'Crash', href: '/games/crash' },
      { name: 'Slots', href: '/games/slots' },
    ]
  },
  features: {
    title: 'Features',
    links: [
      { name: 'Tournaments', href: '/tournaments' },
      { name: 'VIP Program', href: '/vip' },
      { name: 'Affiliate', href: '/affiliate' },
      { name: 'Leaderboard', href: '/leaderboard' },
    ]
  },
  support: {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Bug Reports', href: '/bugs' },
      { name: 'Feature Requests', href: '/features' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Responsible Gaming', href: '/responsible' },
      { name: 'KYC/AML Policy', href: '/kyc' },
    ]
  }
}

const features = [
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Licensed',
    description: 'Military-grade security with proper licensing'
  },
  {
    icon: CubeTransparentIcon,
    title: 'Provably Fair',
    description: 'Transparent and verifiable game outcomes'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: '24/7 Support',
    description: 'Round-the-clock customer assistance'
  },
  {
    icon: DocumentTextIcon,
    title: 'Instant Payouts',
    description: 'Lightning-fast cryptocurrency withdrawals'
  }
]

export function Footer() {
  return (
    <footer className="bg-casino-dark border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features section */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <feature.icon className="h-8 w-8 text-casino-accent mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Links section */}
        <div className="py-12 border-b border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-casino-accent transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-r from-casino-accent to-primary-400">
              <span className="text-sm font-bold text-casino-dark">CC</span>
            </div>
            <span className="text-xl font-bold gradient-text">CryptoCasino</span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © 2024 CryptoCasino. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Play responsibly. Must be 18+ to participate.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-casino-success rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <div className="text-xs text-gray-500">
              SSL Secured
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}