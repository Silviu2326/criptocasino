import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('faq')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const faqData = [
    {
      question: "How do I create an account?",
      answer: "Click 'Sign Up' on the homepage, fill in your details, and verify your email. No KYC required - just username, email, and secure password."
    },
    {
      question: "How do I deposit funds?",
      answer: "Connect your crypto wallet (MetaMask, etc.) and transfer BTC, ETH, USDT, or other supported cryptocurrencies directly to your gaming balance."
    },
    {
      question: "What is Provably Fair?",
      answer: "Provably Fair is a cryptographic system that allows you to verify that game results are truly random and not manipulated. Each game uses server seeds, client seeds, and nonces that you can verify independently."
    },
    {
      question: "How do withdrawals work?",
      answer: "Withdrawals are instant! Your winnings go directly to your connected wallet. There are no waiting periods or manual approval processes."
    },
    {
      question: "What are the minimum bet amounts?",
      answer: "Minimum bets vary by game: Dice (0.00001 BTC), Coinflip (0.00005 BTC), Crash (0.0001 BTC). All amounts are equivalent in other supported cryptocurrencies."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use military-grade encryption, store minimal personal data, and your funds remain in your wallet until you decide to play. We never store private keys."
    },
    {
      question: "Can I play on mobile?",
      answer: "Absolutely! Our platform is fully responsive and works perfectly on all mobile devices and tablets."
    },
    {
      question: "What if I forget my password?",
      answer: "Use the 'Forgot Password' link on the login page. We'll send a secure reset link to your email address."
    },
    {
      question: "Are there any fees?",
      answer: "No hidden fees! We only take a small house edge on games (1-2%). No deposit, withdrawal, or account fees."
    },
    {
      question: "How can I verify my game results?",
      answer: "Every game provides verification data including server seed hash, client seed, and nonce. Use our verification tool or third-party verifiers to confirm fairness."
    }
  ]

  const gameGuides = [
    {
      title: "Dice Game",
      description: "Roll under or over a target number",
      steps: [
        "Set your bet amount and choose currency",
        "Select target number (2-98)",
        "Choose 'Roll Under' or 'Roll Over'",
        "Click 'Roll' and watch the result",
        "Win multiplier based on odds"
      ]
    },
    {
      title: "Coinflip",
      description: "Simple heads or tails betting",
      steps: [
        "Place your bet amount",
        "Choose Heads or Tails",
        "Click 'Flip Coin'",
        "Win 1.98x your bet if correct"
      ]
    },
    {
      title: "Crash",
      description: "Cash out before the multiplier crashes",
      steps: [
        "Place your bet before round starts",
        "Watch multiplier increase in real-time",
        "Click 'Cash Out' before it crashes",
        "Your winnings = bet × cash out multiplier"
      ]
    }
  ]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-green-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Help & Support
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get answers to your questions and learn how to make the most of Crypto Casino
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="glass rounded-2xl p-2 backdrop-blur-xl border border-gray-700/50">
              <div className="flex space-x-2">
                {[
                  { id: 'faq', label: 'FAQ', icon: '❓' },
                  { id: 'guides', label: 'Game Guides', icon: '🎮' },
                  { id: 'contact', label: 'Contact Us', icon: '💬' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {tab.id === 'faq' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {tab.id === 'guides' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      )}
                      {tab.id === 'contact' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      )}
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          {activeTab === 'faq' && (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-bold text-white pr-4">{faq.question}</h3>
                      <svg
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-4 border-t border-gray-700/50">
                        <p className="text-gray-300 leading-relaxed pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game Guides Section */}
          {activeTab === 'guides' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gameGuides.map((guide, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2L3 7v11c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V7l-7-5z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{guide.title}</h3>
                      <p className="text-gray-400">{guide.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {guide.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{stepIndex + 1}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Link
                      href={`/games/${guide.title.toLowerCase().replace(' ', '')}`}
                      className="block mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 rounded-lg text-center hover:from-blue-400 hover:to-purple-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Play {guide.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Section */}
          {activeTab === 'contact' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      >
                        <option value="">Select a subject</option>
                        <option value="account">Account Issues</option>
                        <option value="deposit">Deposit/Withdrawal</option>
                        <option value="game">Game Questions</option>
                        <option value="technical">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                        placeholder="Describe your question or issue..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-200 transform hover:scale-105"
                    >
                      Send Message
                    </button>
                  </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Quick Response</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-300">Average response: <span className="text-green-400 font-bold">2 hours</span></span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-300">Email: <span className="text-blue-400">support@cryptocasino.com</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Live Chat</h3>
                    <p className="text-gray-300 mb-4">Get instant help with our live chat support</p>
                    <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:from-green-400 hover:to-teal-400 transition-all duration-200 transform hover:scale-105">
                      Start Live Chat
                    </button>
                  </div>

                  <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Community</h3>
                    <div className="space-y-3">
                      <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                        </svg>
                        <span>Join our Discord</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        <span>Follow on Twitter</span>
                      </a>
                      <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-.219c0-1.495.869-2.609 1.949-2.609.919 0 1.364.689 1.364 1.513 0 .921-.587 2.297-.889 3.572-.252 1.073.538 1.947 1.596 1.947 1.915 0 3.386-2.021 3.386-4.936 0-2.58-1.853-4.386-4.501-4.386-3.065 0-4.863 2.299-4.863 4.676 0 .925.357 1.915.803 2.454a.3.3 0 01.069.288c-.076.315-.245.994-.278 1.133-.043.183-.142.222-.326.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.394 2.467-6.518 7.107-6.518 3.73 0 6.635 2.657 6.635 6.206 0 3.703-2.332 6.684-5.570 6.684-1.088 0-2.113-.568-2.463-1.305l-.665 2.54c-.241.924-.893 2.087-1.33 2.794.999.307 2.058.473 3.16.473 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.017 0z"/>
                        </svg>
                        <span>Pinterest</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}