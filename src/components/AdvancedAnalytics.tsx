import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface AnalyticsData {
  profileViews: number[]
  searchAppearances: number[]
  connectionGrowth: number[]
  optimizationScores: number[]
  dates: string[]
  industryComparison: {
    userScore: number
    industryAverage: number
    topPercentile: number
  }
  skillsAnalysis: {
    skill: string
    demand: number
    proficiency: number
  }[]
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockData: AnalyticsData = {
      profileViews: [120, 135, 148, 162, 178, 195, 210, 225, 240, 258, 275, 290],
      searchAppearances: [45, 52, 48, 61, 58, 67, 72, 69, 78, 82, 89, 95],
      connectionGrowth: [5, 8, 12, 7, 15, 18, 22, 19, 25, 28, 32, 35],
      optimizationScores: [65, 68, 72, 75, 78, 82, 85, 87, 89, 91, 93, 95],
      dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      industryComparison: {
        userScore: 89,
        industryAverage: 72,
        topPercentile: 95
      },
      skillsAnalysis: [
        { skill: 'JavaScript', demand: 95, proficiency: 90 },
        { skill: 'React', demand: 88, proficiency: 85 },
        { skill: 'Node.js', demand: 82, proficiency: 80 },
        { skill: 'Python', demand: 90, proficiency: 75 },
        { skill: 'AWS', demand: 85, proficiency: 70 },
        { skill: 'Docker', demand: 78, proficiency: 65 }
      ]
    }
    
    setAnalyticsData(mockData)
    setIsLoading(false)
  }

  const profileViewsChart = {
    labels: analyticsData?.dates || [],
    datasets: [
      {
        label: 'Profile Views',
        data: analyticsData?.profileViews || [],
        borderColor: 'rgb(10, 102, 194)',
        backgroundColor: 'rgba(10, 102, 194, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Search Appearances',
        data: analyticsData?.searchAppearances || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const optimizationChart = {
    labels: analyticsData?.dates || [],
    datasets: [
      {
        label: 'Optimization Score',
        data: analyticsData?.optimizationScores || [],
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2
      }
    ]
  }

  const industryComparisonChart = {
    labels: ['Your Score', 'Industry Average', 'Top 10%'],
    datasets: [
      {
        data: [
          analyticsData?.industryComparison.userScore || 0,
          analyticsData?.industryComparison.industryAverage || 0,
          analyticsData?.industryComparison.topPercentile || 0
        ],
        backgroundColor: [
          'rgba(10, 102, 194, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your LinkedIn performance</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-linkedin-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            onClick={fetchAnalyticsData}
            className="p-2 text-gray-500 hover:text-linkedin-500 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <Eye className="w-6 h-6" />,
            label: 'Profile Views',
            value: analyticsData?.profileViews.slice(-1)[0] || 0,
            change: '+24%',
            positive: true
          },
          {
            icon: <Users className="w-6 h-6" />,
            label: 'New Connections',
            value: analyticsData?.connectionGrowth.slice(-1)[0] || 0,
            change: '+18%',
            positive: true
          },
          {
            icon: <Target className="w-6 h-6" />,
            label: 'Search Appearances',
            value: analyticsData?.searchAppearances.slice(-1)[0] || 0,
            change: '+12%',
            positive: true
          },
          {
            icon: <TrendingUp className="w-6 h-6" />,
            label: 'Optimization Score',
            value: analyticsData?.optimizationScores.slice(-1)[0] || 0,
            change: '+15 points',
            positive: true
          }
        ].map((metric, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-linkedin-500">
                {metric.icon}
              </div>
              <span className={`text-sm font-medium ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Performance */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-6">Profile Performance</h3>
          <div className="h-80">
            <Line data={profileViewsChart} options={chartOptions} />
          </div>
        </motion.div>

        {/* Optimization Progress */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-6">Optimization Progress</h3>
          <div className="h-80">
            <Bar data={optimizationChart} options={chartOptions} />
          </div>
        </motion.div>

        {/* Industry Comparison */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-6">Industry Comparison</h3>
          <div className="h-80">
            <Doughnut 
              data={industryComparisonChart} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom' as const
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        {/* Skills Analysis */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-6">Skills Market Analysis</h3>
          <div className="space-y-4">
            {analyticsData?.skillsAnalysis.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-sm text-gray-600">
                    Demand: {skill.demand}% | Your Level: {skill.proficiency}%
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-linkedin-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.demand}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights Panel */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-6">AI-Powered Insights</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Peak Activity</h4>
            <p className="text-sm text-blue-700">
              Your profile gets the most views on Tuesday afternoons. Consider posting updates during this time.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Growth Opportunity</h4>
            <p className="text-sm text-green-700">
              Adding "Machine Learning" to your skills could increase your visibility by 23%.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Industry Trend</h4>
            <p className="text-sm text-purple-700">
              Professionals in your field are increasingly highlighting "Remote Leadership" skills.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdvancedAnalytics