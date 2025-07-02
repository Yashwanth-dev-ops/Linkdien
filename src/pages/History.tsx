import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, Bot, User, ArrowRight } from 'lucide-react'

const History = () => {
  const optimizationHistory = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'auto',
      aiModel: 'GPT-4',
      scoreBefore: 65,
      scoreAfter: 78,
      improvements: 5,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-10',
      type: 'manual',
      aiModel: 'Claude',
      scoreBefore: 58,
      scoreAfter: 65,
      improvements: 3,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-01-05',
      type: 'auto',
      aiModel: 'Smart AI',
      scoreBefore: 45,
      scoreAfter: 58,
      improvements: 7,
      status: 'completed'
    }
  ]

  const conversations = [
    {
      id: 1,
      date: '2024-01-15',
      summary: 'Discussed headline optimization and skill additions',
      aiModel: 'GPT-4',
      messages: 12
    },
    {
      id: 2,
      date: '2024-01-10',
      summary: 'Profile summary rewrite and experience section improvements',
      aiModel: 'Claude',
      messages: 8
    },
    {
      id: 3,
      date: '2024-01-05',
      summary: 'Initial profile analysis and optimization strategy',
      aiModel: 'Smart AI',
      messages: 15
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Optimization History
        </h1>
        <p className="text-xl text-gray-600">
          Track your profile optimization journey and AI conversations
        </p>
      </motion.div>

      {/* Optimization History */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold">Optimization Sessions</h2>
        <div className="space-y-4">
          {optimizationHistory.map((session, index) => (
            <motion.div
              key={session.id}
              className="card hover:shadow-lg transition-all duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    session.type === 'auto' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {session.type === 'auto' ? (
                      <Bot className="w-6 h-6" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {session.type === 'auto' ? 'Automated' : 'Manual'} Optimization
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(session.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bot className="w-4 h-4" />
                        <span>{session.aiModel}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-500">
                        {session.scoreBefore}%
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="text-2xl font-bold text-green-600">
                        {session.scoreAfter}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Score Change</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-linkedin-500">
                      {session.improvements}
                    </div>
                    <div className="text-sm text-gray-600">Improvements</div>
                  </div>
                  
                  <button className="btn-secondary">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Conversations */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold">AI Conversations</h2>
        <div className="space-y-4">
          {conversations.map((conversation, index) => (
            <motion.div
              key={conversation.id}
              className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{conversation.summary}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(conversation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Bot className="w-4 h-4" />
                        <span>{conversation.aiModel}</span>
                      </div>
                      <div>
                        {conversation.messages} messages
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="btn-secondary">
                  Resume Chat
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Progress Chart */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-linkedin-500" />
          Progress Overview
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-linkedin-500 mb-2">3</div>
            <div className="text-gray-600">Total Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">+33</div>
            <div className="text-gray-600">Points Gained</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
            <div className="text-gray-600">Total Improvements</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default History