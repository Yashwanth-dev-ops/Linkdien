import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from 'socket.io-client'
import { 
  Bot, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OptimizationProgress {
  sessionId: string
  progress: number
  status: string
  currentStep?: string
}

interface OptimizationResult {
  sessionId: string
  result: {
    improvements: Array<{
      section: string
      current: string
      optimized: string
      reasoning: string
      impact: string
      keywords: string[]
    }>
    scoreImprovement: {
      before: number
      after: number
      increase: number
    }
  }
}

const RealTimeOptimization: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [progress, setProgress] = useState<OptimizationProgress | null>(null)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [selectedModel, setSelectedModel] = useState('smart')
  const [optimizationMode, setOptimizationMode] = useState<'manual' | 'auto'>('auto')

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3002')
    setSocket(newSocket)

    // Socket event listeners
    newSocket.on('optimization-progress', (data: OptimizationProgress) => {
      setProgress(data)
    })

    newSocket.on('optimization-complete', (data: OptimizationResult) => {
      setResult(data)
      setIsOptimizing(false)
      toast.success('Optimization completed successfully!')
    })

    newSocket.on('optimization-error', (data: { sessionId: string; error: string }) => {
      setIsOptimizing(false)
      toast.error(`Optimization failed: ${data.error}`)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const startOptimization = () => {
    if (!socket) return

    const sessionId = `opt_${Date.now()}`
    const profileData = {
      headline: 'Senior Software Engineer at Tech Corp',
      summary: 'Passionate software engineer with 5+ years of experience...',
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          duration: '2021 - Present',
          description: 'Leading development of scalable web applications...'
        }
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS']
    }

    setIsOptimizing(true)
    setProgress(null)
    setResult(null)

    socket.emit('start-optimization', {
      profileData,
      mode: optimizationMode,
      modelId: selectedModel,
      sessionId
    })
  }

  const aiModels = [
    {
      id: 'smart',
      name: 'Smart AI',
      description: 'Automatically selects the best model',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Advanced language understanding',
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      description: 'Professional writing expert',
      icon: <Bot className="w-5 h-5" />
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      description: 'Google\'s multimodal AI',
      icon: <Bot className="w-5 h-5" />
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
        <h2 className="text-3xl font-bold gradient-text mb-4">
          Real-Time AI Optimization
        </h2>
        <p className="text-xl text-gray-600">
          Watch your profile transform in real-time with AI assistance
        </p>
      </motion.div>

      {/* Configuration */}
      {!isOptimizing && !result && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-xl font-semibold mb-6">Optimization Settings</h3>
          
          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Optimization Mode
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setOptimizationMode('manual')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  optimizationMode === 'manual'
                    ? 'border-linkedin-500 bg-linkedin-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-linkedin-500" />
                  <div className="text-left">
                    <div className="font-medium">Manual Guidance</div>
                    <div className="text-sm text-gray-600">Get step-by-step instructions</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setOptimizationMode('auto')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  optimizationMode === 'auto'
                    ? 'border-linkedin-500 bg-linkedin-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-linkedin-500" />
                  <div className="text-left">
                    <div className="font-medium">Automated</div>
                    <div className="text-sm text-gray-600">AI applies changes automatically</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* AI Model Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              AI Model
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {aiModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 border-2 rounded-lg transition-all text-left ${
                    selectedModel === model.id
                      ? 'border-linkedin-500 bg-linkedin-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-linkedin-500">{model.icon}</div>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-600">{model.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startOptimization}
            className="btn-primary w-full text-lg py-4"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Real-Time Optimization
          </button>
        </motion.div>
      )}

      {/* Progress Display */}
      <AnimatePresence>
        {isOptimizing && progress && (
          <motion.div
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-linkedin-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-10 h-10 text-linkedin-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimizing Your Profile</h3>
                <p className="text-gray-600">{progress.status}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-linkedin-500">{progress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-linkedin-500 to-purple-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Current Step */}
              {progress.currentStep && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">{progress.currentStep}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Display */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Score Improvement */}
            <div className="card text-center">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div>
                  <div className="text-3xl font-bold text-gray-500">
                    {result.result.scoreImprovement.before}%
                  </div>
                  <div className="text-sm text-gray-600">Before</div>
                </div>
                <TrendingUp className="w-8 h-8 text-linkedin-500" />
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {result.result.scoreImprovement.after}%
                  </div>
                  <div className="text-sm text-gray-600">After</div>
                </div>
              </div>
              <div className="text-lg font-semibold text-green-600">
                +{result.result.scoreImprovement.increase} point improvement!
              </div>
            </div>

            {/* Improvements */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Optimization Results</h3>
              {result.result.improvements.map((improvement, index) => (
                <motion.div
                  key={index}
                  className="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      improvement.impact === 'high' ? 'bg-red-100 text-red-600' :
                      improvement.impact === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2 capitalize">
                        {improvement.section}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Before:</p>
                          <p className="text-gray-800 bg-gray-50 p-3 rounded">
                            {improvement.current}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">After:</p>
                          <p className="text-gray-800 bg-green-50 p-3 rounded border-l-4 border-green-500">
                            {improvement.optimized}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Why this helps:</strong> {improvement.reasoning}
                          </p>
                        </div>
                        {improvement.keywords.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Added keywords:</p>
                            <div className="flex flex-wrap gap-2">
                              {improvement.keywords.map((keyword, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-linkedin-100 text-linkedin-700 rounded text-xs"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button className="btn-primary">
                Apply All Changes
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setResult(null)
                  setProgress(null)
                }}
              >
                Start New Optimization
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RealTimeOptimization