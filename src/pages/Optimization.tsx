import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bot, 
  User, 
  Zap, 
  Target, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import toast from 'react-hot-toast'

const Optimization = () => {
  const [selectedMode, setSelectedMode] = useState<'manual' | 'auto' | null>(null)
  const [selectedAI, setSelectedAI] = useState('default')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResults, setOptimizationResults] = useState<any>(null)

  const aiOptions = [
    {
      id: 'default',
      name: 'Smart AI (Recommended)',
      description: 'Our AI automatically selects the best model for your profile',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'gpt4',
      name: 'GPT-4',
      description: 'Advanced language model for comprehensive analysis',
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'claude',
      name: 'Claude',
      description: 'Excellent for professional writing and optimization',
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'gemini',
      name: 'Gemini Pro',
      description: 'Google\'s advanced AI for detailed insights',
      icon: <Bot className="w-5 h-5" />
    }
  ]

  const handleOptimization = async () => {
    setIsOptimizing(true)
    
    try {
      // Simulate AI optimization process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockResults = {
        mode: selectedMode,
        aiModel: selectedAI,
        improvements: [
          {
            section: 'Headline',
            current: 'Senior Software Engineer at Tech Corp',
            suggested: 'Senior Full-Stack Engineer | React & Node.js Expert | Building Scalable Web Solutions',
            impact: 'high',
            reason: 'More specific skills and value proposition will increase visibility'
          },
          {
            section: 'Summary',
            current: 'Passionate software engineer with 5+ years...',
            suggested: 'Results-driven Full-Stack Engineer with 5+ years of experience building scalable web applications...',
            impact: 'medium',
            reason: 'Lead with results and specific technologies'
          },
          {
            section: 'Skills',
            current: ['JavaScript', 'React', 'Node.js'],
            suggested: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
            impact: 'medium',
            reason: 'Adding trending technologies will improve search visibility'
          }
        ],
        scoreImprovement: {
          before: 78,
          after: 89,
          increase: 11
        }
      }
      
      setOptimizationResults(mockResults)
      toast.success('Optimization complete!')
    } catch (error) {
      toast.error('Optimization failed. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  if (optimizationResults) {
    return (
      <div className="space-y-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Optimization Results
          </h1>
          <p className="text-xl text-gray-600">
            Your profile optimization is complete!
          </p>
        </motion.div>

        {/* Score Improvement */}
        <motion.div
          className="card text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-center space-x-8">
            <div>
              <div className="text-3xl font-bold text-gray-500">
                {optimizationResults.scoreImprovement.before}%
              </div>
              <div className="text-sm text-gray-600">Before</div>
            </div>
            <ArrowRight className="w-8 h-8 text-linkedin-500" />
            <div>
              <div className="text-3xl font-bold text-green-600">
                {optimizationResults.scoreImprovement.after}%
              </div>
              <div className="text-sm text-gray-600">After</div>
            </div>
          </div>
          <div className="mt-4 text-lg font-semibold text-green-600">
            +{optimizationResults.scoreImprovement.increase} point improvement!
          </div>
        </motion.div>

        {/* Improvements */}
        <div className="space-y-6">
          {optimizationResults.improvements.map((improvement: any, index: number) => (
            <motion.div
              key={index}
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  improvement.impact === 'high' ? 'bg-red-100 text-red-600' :
                  improvement.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{improvement.section}</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current:</p>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded">
                        {Array.isArray(improvement.current) 
                          ? improvement.current.join(', ')
                          : improvement.current
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Suggested:</p>
                      <p className="text-gray-800 bg-green-50 p-3 rounded border-l-4 border-green-500">
                        {Array.isArray(improvement.suggested) 
                          ? improvement.suggested.join(', ')
                          : improvement.suggested
                        }
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Why this helps:</strong> {improvement.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button className="btn-primary">
            Apply All Changes
          </button>
          <button 
            className="btn-secondary"
            onClick={() => setOptimizationResults(null)}
          >
            Start New Optimization
          </button>
        </motion.div>
      </div>
    )
  }

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
          Profile Optimization
        </h1>
        <p className="text-xl text-gray-600">
          Choose your optimization approach and AI model
        </p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-center">Choose Optimization Mode</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            className={`card cursor-pointer transition-all duration-200 ${
              selectedMode === 'manual' 
                ? 'ring-2 ring-linkedin-500 bg-linkedin-50' 
                : 'hover:shadow-xl'
            }`}
            onClick={() => setSelectedMode('manual')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Manual Optimization</h3>
              <p className="text-gray-600 mb-4">
                Get detailed recommendations and instructions to optimize your profile manually
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4" />
                <span>Full control over changes</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={`card cursor-pointer transition-all duration-200 ${
              selectedMode === 'auto' 
                ? 'ring-2 ring-linkedin-500 bg-linkedin-50' 
                : 'hover:shadow-xl'
            }`}
            onClick={() => setSelectedMode('auto')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Optimization</h3>
              <p className="text-gray-600 mb-4">
                Let AI automatically optimize your profile with minimal input required
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4" />
                <span>Quick and efficient</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* AI Model Selection */}
      {selectedMode && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-center">Select AI Model</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {aiOptions.map((ai) => (
              <motion.div
                key={ai.id}
                className={`card cursor-pointer transition-all duration-200 ${
                  selectedAI === ai.id 
                    ? 'ring-2 ring-linkedin-500 bg-linkedin-50' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedAI(ai.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    {ai.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ai.name}</h3>
                    <p className="text-sm text-gray-600">{ai.description}</p>
                  </div>
                  {selectedAI === ai.id && (
                    <CheckCircle className="w-5 h-5 text-linkedin-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Start Optimization */}
      {selectedMode && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={handleOptimization}
            disabled={isOptimizing}
            className="btn-primary text-lg px-8 py-4 disabled:opacity-50"
          >
            {isOptimizing ? (
              <>
                <div className="loading-spinner w-5 h-5 mr-2"></div>
                Optimizing Profile...
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Start {selectedMode === 'manual' ? 'Manual' : 'Automated'} Optimization
              </>
            )}
          </button>
          <p className="text-sm text-gray-600 mt-3">
            This process typically takes 2-3 minutes
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default Optimization