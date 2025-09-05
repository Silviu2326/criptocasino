import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'

export default function ResponsibleGamingPage() {
  const [activeTab, setActiveTab] = useState('guidelines')
  const [selfAssessment, setSelfAssessment] = useState({
    timeSpent: '',
    moneySpent: '',
    emotionalControl: '',
    socialImpact: '',
    frequency: ''
  })
  const [showResources, setShowResources] = useState(false)

  const warningSignsData = [
    {
      category: "Time Management",
      icon: "clock",
      color: "from-orange-500 to-red-500",
      signs: [
        "Spending more time gambling than planned",
        "Neglecting work, school, or family responsibilities",
        "Gambling late into the night or early morning",
        "Losing track of time while playing"
      ]
    },
    {
      category: "Financial Control",
      icon: "money",
      color: "from-red-500 to-pink-500",
      signs: [
        "Betting more money than you can afford to lose",
        "Borrowing money to gamble",
        "Hiding gambling losses from family/friends",
        "Chasing losses with bigger bets"
      ]
    },
    {
      category: "Emotional State",
      icon: "heart",
      color: "from-purple-500 to-indigo-500",
      signs: [
        "Gambling to escape problems or negative emotions",
        "Feeling anxious or depressed when not gambling",
        "Mood swings related to wins and losses",
        "Gambling as the primary source of excitement"
      ]
    },
    {
      category: "Social Impact",
      icon: "users",
      color: "from-blue-500 to-cyan-500",
      signs: [
        "Lying about gambling activities",
        "Isolating yourself from friends and family",
        "Conflicts with loved ones about gambling",
        "Losing interest in other activities or hobbies"
      ]
    }
  ]

  const selfHelpTools = [
    {
      title: "Set Time Limits",
      description: "Decide how long you'll play before you start and stick to it",
      action: "Use phone alarms or timers",
      icon: "clock"
    },
    {
      title: "Set Budget Limits",
      description: "Only gamble with money you can afford to lose",
      action: "Set daily/weekly deposit limits",
      icon: "wallet"
    },
    {
      title: "Take Regular Breaks",
      description: "Step away from games every 30-60 minutes",
      action: "Use our mandatory break reminders",
      icon: "pause"
    },
    {
      title: "Keep Track of Time",
      description: "Monitor how much time you spend gambling",
      action: "Review your gaming history regularly",
      icon: "chart"
    },
    {
      title: "Avoid Chasing Losses",
      description: "Accept losses as part of the game",
      action: "Set loss limits and stick to them",
      icon: "stop"
    },
    {
      title: "Gamble for Fun",
      description: "Treat gambling as entertainment, not income",
      action: "Focus on enjoyment over profit",
      icon: "smile"
    }
  ]

  const supportResources = [
    {
      name: "Gamblers Anonymous",
      description: "International fellowship for problem gamblers",
      website: "www.gamblersanonymous.org",
      phone: "1-800-522-4700",
      type: "Support Group"
    },
    {
      name: "National Council on Problem Gambling",
      description: "24/7 confidential helpline and resources",
      website: "www.ncpgambling.org",
      phone: "1-800-522-4700",
      type: "Helpline"
    },
    {
      name: "GamCare",
      description: "UK's leading provider of gambling harm support",
      website: "www.gamcare.org.uk",
      phone: "0808-8020-133",
      type: "Support Service"
    },
    {
      name: "Gambling Therapy",
      description: "Free online support and counseling",
      website: "www.gamblingtherapy.org",
      phone: "Online Chat Available",
      type: "Online Therapy"
    },
    {
      name: "BeGambleAware",
      description: "Information and tools for safer gambling",
      website: "www.begambleaware.org",
      phone: "0808-8020-133",
      type: "Education"
    }
  ]

  const handleSelfAssessment = () => {
    // Simple assessment logic
    let riskScore = 0
    if (selfAssessment.timeSpent === 'high') riskScore += 2
    if (selfAssessment.moneySpent === 'high') riskScore += 2
    if (selfAssessment.emotionalControl === 'low') riskScore += 2
    if (selfAssessment.socialImpact === 'high') riskScore += 2
    if (selfAssessment.frequency === 'daily') riskScore += 1

    let message = ""
    if (riskScore >= 6) {
      message = "High Risk: We strongly recommend seeking professional help and using our self-exclusion tools."
    } else if (riskScore >= 3) {
      message = "Moderate Risk: Consider setting stricter limits and taking more frequent breaks."
    } else {
      message = "Low Risk: You appear to have good control over your gambling habits."
    }

    alert(`Assessment Result: ${message}`)
  }

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-green-400/10 to-teal-500/10 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Responsible Gaming
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              We're committed to providing a safe and enjoyable gaming environment. Learn how to gamble responsibly and recognize the signs when gaming becomes a problem.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="glass rounded-2xl p-2 backdrop-blur-xl border border-gray-700/50">
              <div className="flex space-x-2">
                {[
                  { id: 'guidelines', label: 'Guidelines', icon: 'guidelines' },
                  { id: 'warning-signs', label: 'Warning Signs', icon: 'warning' },
                  { id: 'self-help', label: 'Self-Help Tools', icon: 'tools' },
                  { id: 'resources', label: 'Get Help', icon: 'help' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {tab.icon === 'guidelines' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      )}
                      {tab.icon === 'warning' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      )}
                      {tab.icon === 'tools' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      )}
                      {tab.icon === 'help' && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      )}
                    </svg>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Guidelines Section */}
          {activeTab === 'guidelines' && (
            <div className="space-y-12">
              <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">Golden Rules of Responsible Gaming</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      title: "Gamble for Entertainment",
                      description: "Treat gambling as a form of entertainment, not as a way to make money or solve financial problems.",
                      icon: "🎯"
                    },
                    {
                      title: "Set Time Limits",
                      description: "Decide how long you want to play before you start and stick to that limit, regardless of wins or losses.",
                      icon: "⏰"
                    },
                    {
                      title: "Set Money Limits", 
                      description: "Only gamble with money you can afford to lose. Never gamble with money needed for essentials.",
                      icon: "💰"
                    },
                    {
                      title: "Take Regular Breaks",
                      description: "Step away from games regularly to maintain perspective and avoid getting caught up in the moment.",
                      icon: "🔄"
                    },
                    {
                      title: "Don't Chase Losses",
                      description: "Accept losses as part of the game. Trying to win back losses often leads to bigger losses.",
                      icon: "🚫"
                    },
                    {
                      title: "Stay Balanced",
                      description: "Maintain other interests and activities. Gambling should not be your primary source of entertainment.",
                      icon: "⚖️"
                    }
                  ].map((rule, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 glass-dark rounded-xl">
                      <div className="text-3xl">{rule.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{rule.title}</h3>
                        <p className="text-gray-300">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Self-Assessment */}
              <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Self-Assessment</h2>
                <p className="text-gray-300 mb-6">Answer these questions honestly to assess your gambling habits:</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">How much time do you typically spend gambling per session?</label>
                    <select
                      value={selfAssessment.timeSpent}
                      onChange={(e) => setSelfAssessment({...selfAssessment, timeSpent: e.target.value})}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white"
                    >
                      <option value="">Select an option</option>
                      <option value="low">Less than 1 hour</option>
                      <option value="medium">1-3 hours</option>
                      <option value="high">More than 3 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Do you spend more money than you planned?</label>
                    <select
                      value={selfAssessment.moneySpent}
                      onChange={(e) => setSelfAssessment({...selfAssessment, moneySpent: e.target.value})}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white"
                    >
                      <option value="">Select an option</option>
                      <option value="low">Rarely or never</option>
                      <option value="medium">Sometimes</option>
                      <option value="high">Often</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">How well do you control your emotions while gambling?</label>
                    <select
                      value={selfAssessment.emotionalControl}
                      onChange={(e) => setSelfAssessment({...selfAssessment, emotionalControl: e.target.value})}
                      className="w-full p-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white"
                    >
                      <option value="">Select an option</option>
                      <option value="high">Very well</option>
                      <option value="medium">Somewhat well</option>
                      <option value="low">Not well</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSelfAssessment}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-xl hover:from-orange-400 hover:to-red-400 transition-all duration-200 transform hover:scale-105"
                  >
                    Get Assessment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Warning Signs Section */}
          {activeTab === 'warning-signs' && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Recognize the Warning Signs</h2>
                <p className="text-gray-300 text-lg">Early recognition of problem gambling signs can help prevent serious issues</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {warningSignsData.map((category, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6 hover:border-red-500/50 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center shadow-xl`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {category.icon === 'clock' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                          {category.icon === 'money' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          )}
                          {category.icon === 'heart' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          )}
                          {category.icon === 'users' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          )}
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                    </div>
                    
                    <ul className="space-y-3">
                      {category.signs.map((sign, signIndex) => (
                        <li key={signIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="glass rounded-2xl backdrop-blur-xl border border-red-500/50 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">If you recognize these signs...</h3>
                <p className="text-gray-300 mb-6">It's important to seek help immediately. Problem gambling is treatable, and support is available.</p>
                <button
                  onClick={() => setActiveTab('resources')}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-8 rounded-xl hover:from-red-400 hover:to-pink-400 transition-all duration-200 transform hover:scale-105"
                >
                  Get Help Now
                </button>
              </div>
            </div>
          )}

          {/* Self-Help Tools Section */}
          {activeTab === 'self-help' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Self-Help Tools & Strategies</h2>
                <p className="text-gray-300 text-lg">Practical tools to help you maintain control over your gambling</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selfHelpTools.map((tool, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all duration-300">
                    <div className="text-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {tool.icon === 'clock' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                          {tool.icon === 'wallet' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          )}
                          {tool.icon === 'pause' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                          {tool.icon === 'chart' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          )}
                          {tool.icon === 'stop' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                          {tool.icon === 'smile' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm">{tool.description}</p>
                    <div className="glass-dark rounded-lg p-3">
                      <span className="text-blue-400 font-medium text-sm">{tool.action}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Platform Tools */}
              <div className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Built-in Protection Tools</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Deposit Limits",
                      description: "Set daily, weekly, or monthly deposit limits",
                      status: "Available"
                    },
                    {
                      title: "Session Timers",
                      description: "Automatic notifications after set time periods",
                      status: "Available"
                    },
                    {
                      title: "Reality Check",
                      description: "Regular reminders of time and money spent",
                      status: "Available"
                    },
                    {
                      title: "Self-Exclusion",
                      description: "Temporarily or permanently exclude yourself",
                      status: "Available"
                    }
                  ].map((tool, index) => (
                    <div key={index} className="text-center p-4 glass-dark rounded-xl">
                      <h4 className="text-white font-bold mb-2">{tool.title}</h4>
                      <p className="text-gray-300 text-sm mb-3">{tool.description}</p>
                      <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {tool.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources Section */}
          {activeTab === 'resources' && (
            <div className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Professional Help & Resources</h2>
                <p className="text-gray-300 text-lg">Free, confidential support is available 24/7</p>
              </div>
              
              <div className="space-y-6">
                {supportResources.map((resource, index) => (
                  <div key={index} className="glass rounded-2xl backdrop-blur-xl border border-gray-700/50 p-6 hover:border-green-500/50 transition-all duration-300">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{resource.name}</h3>
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {resource.type}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{resource.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-400 uppercase tracking-wider">Website</span>
                            <div className="text-blue-400 font-medium">{resource.website}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-400 uppercase tracking-wider">Phone</span>
                            <div className="text-green-400 font-medium">{resource.phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Emergency Contact */}
              <div className="glass rounded-2xl backdrop-blur-xl border border-red-500/50 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Need Immediate Help?</h3>
                <p className="text-gray-300 mb-6 text-lg">If you're in crisis or need immediate support</p>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400 mb-2">National Problem Gambling Helpline</div>
                    <div className="text-3xl font-black text-white">1-800-522-4700</div>
                    <div className="text-green-400 font-medium">24/7 • Free • Confidential</div>
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