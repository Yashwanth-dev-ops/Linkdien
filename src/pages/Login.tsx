import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Linkedin, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const user = {
        id: '1',
        email: formData.email,
        name: formData.name || formData.email.split('@')[0]
      }
      
      login(user, 'mock-token')
      toast.success(`Welcome ${user.name}!`)
      navigate('/dashboard')
    } catch (error) {
      toast.error('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkedInAuth = async () => {
    setIsLoading(true)
    try {
      // Simulate LinkedIn OAuth
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const user = {
        id: '1',
        email: 'user@linkedin.com',
        name: 'LinkedIn User',
        linkedinId: 'linkedin-123',
        profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
      }
      
      login(user, 'linkedin-token')
      toast.success('Successfully connected with LinkedIn!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('LinkedIn authentication failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Sign in to optimize your LinkedIn profile' 
                : 'Join thousands of professionals'
              }
            </p>
          </div>

          {/* LinkedIn Auth Button */}
          <button
            onClick={handleLinkedInAuth}
            disabled={isLoading}
            className="w-full bg-linkedin-500 hover:bg-linkedin-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 mb-6 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="loading-spinner w-5 h-5"></div>
            ) : (
              <>
                <Linkedin className="w-5 h-5" />
                <span>Continue with LinkedIn</span>
              </>
            )}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  className="input-field"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isLoading ? (
                <div className="loading-spinner w-5 h-5 mx-auto"></div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-linkedin-500 hover:text-linkedin-600 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login