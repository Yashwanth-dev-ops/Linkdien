import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your LinkedIn profile and provide detailed optimization scores."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Recommendations",
      description: "Get tailored suggestions based on your industry, role, and career goals."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automated Optimization",
      description: "Choose between manual guidance or automated AI-driven profile improvements."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Integration",
      description: "Safe and secure LinkedIn authentication with enterprise-grade security."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multiple AI Models",
      description: "Choose from various AI models or let our system select the best one for your profile."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Monitor your optimization progress with detailed before/after comparisons."
    }
  ]

  const benefits = [
    "Increase profile visibility by up to 300%",
    "Get more connection requests from relevant professionals",
    "Improve your chances of being found by recruiters",
    "Enhance your professional brand and credibility",
    "Track optimization progress over time"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Optimize Your{' '}
            <span className="gradient-text">LinkedIn Profile</span>{' '}
            with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your LinkedIn presence with AI-powered analysis, personalized recommendations, 
            and automated optimization tools designed for professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary text-lg px-8 py-4">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4">
              Watch Demo
            </button>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-white/50 backdrop-blur-sm rounded-3xl mx-4 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to create a standout LinkedIn profile
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-linkedin-500 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">
              Join thousands of professionals who have transformed their LinkedIn presence
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="card">
              <div className="text-center">
                <div className="text-4xl font-bold text-linkedin-500 mb-2">95%</div>
                <p className="text-gray-600 mb-4">Success Rate</p>
                <div className="text-4xl font-bold text-linkedin-500 mb-2">10K+</div>
                <p className="text-gray-600 mb-4">Profiles Optimized</p>
                <div className="text-4xl font-bold text-linkedin-500 mb-2">300%</div>
                <p className="text-gray-600">Average Visibility Increase</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your LinkedIn Profile?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey to a more powerful professional presence today.
          </p>
          <Link to="/login" className="btn-primary text-lg px-8 py-4">
            Start Free Optimization
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Link>
        </div>
      </motion.section>
    </div>
  )
}

export default Home