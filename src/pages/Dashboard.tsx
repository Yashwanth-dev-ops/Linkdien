import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useProfileStore } from '../store/profileStore'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Target,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import ScoreCircle from '../components/ScoreCircle'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const { currentScore, profileData, isLoading, setCurrentScore, setProfileData } = useProfileStore()

  useEffect(() => {
    // Simulate loading profile data
    if (!profileData) {
      setProfileData({
        id: '1',
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
        education: [
          {
            school: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            year: '2019'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        connections: 847,
        profileViews: 1234,
        lastUpdated: new Date().toISOString()
      })
    }

    if (!currentScore) {
      setCurrentScore({
        overall: 78,
        headline: 85,
        summary: 72,
        experience: 80,
        skills: 75,
        completeness: 82,
        engagement: 70
      })
    }
  }, [profileData, currentScore, setProfileData, setCurrentScore])

  const progressData = [
    { month: 'Jan', score: 65 },
    { month: 'Feb', score: 68 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 75 },
    { month: 'May', score: 78 },
  ]

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Connections',
      value: profileData?.connections || 0,
      change: '+12%',
      positive: true
    },
    {
      icon: <Eye className="w-6 h-6" />,
      label: 'Profile Views',
      value: profileData?.profileViews || 0,
      change: '+24%',
      positive: true
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Search Appearances',
      value: 156,
      change: '+8%',
      positive: true
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Optimization Score',
      value: currentScore?.overall || 0,
      change: '+6 points',
      positive: true
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
          Profile Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Track your LinkedIn optimization progress and insights
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="card"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-linkedin-500">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {typeof stat.value === 'number' && stat.label === 'Optimization Score' 
                ? `${stat.value}%` 
                : stat.value.toLocaleString()
              }
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Optimization Score */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-6">Overall Score</h3>
            <ScoreCircle score={currentScore?.overall || 0} size={200} />
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Headline</span>
                <span className="font-medium">{currentScore?.headline || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Summary</span>
                <span className="font-medium">{currentScore?.summary || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Experience</span>
                <span className="font-medium">{currentScore?.experience || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Skills</span>
                <span className="font-medium">{currentScore?.skills || 0}%</span>
              </div>
            </div>
            <Link to="/optimization" className="btn-primary w-full mt-6">
              Optimize Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </motion.div>

        {/* Progress Chart */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Progress Over Time</h3>
              <button className="p-2 text-gray-500 hover:text-linkedin-500 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#0a66c2" 
                    strokeWidth={3}
                    dot={{ fill: '#0a66c2', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/profile" className="card hover:shadow-xl transition-all duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">View Profile</h4>
              <p className="text-sm text-gray-600">Review your current profile data</p>
            </div>
          </div>
        </Link>

        <Link to="/optimization" className="card hover:shadow-xl transition-all duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Start Optimization</h4>
              <p className="text-sm text-gray-600">Get AI-powered recommendations</p>
            </div>
          </div>
        </Link>

        <Link to="/history" className="card hover:shadow-xl transition-all duration-200 group">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">View History</h4>
              <p className="text-sm text-gray-600">Track your optimization journey</p>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}

export default Dashboard