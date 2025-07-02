import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { 
  User, 
  LogOut, 
  Settings, 
  BarChart3, 
  Menu,
  X,
  Zap,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { to: '/optimization', label: 'Optimize', icon: <Zap className="w-4 h-4" /> },
    { to: '/realtime-optimization', label: 'Real-Time', icon: <Zap className="w-4 h-4" /> },
    { to: '/analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { to: '/history', label: 'History', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linkedin-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              {isMobile ? 'LO' : 'LinkedIn Optimizer'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center space-x-1 text-gray-700 hover:text-linkedin-500 transition-colors"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {user?.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                    </div>
                    
                    <Link 
                      to="/settings"
                      className="p-2 text-gray-500 hover:text-linkedin-500 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && isAuthenticated && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-linkedin-500 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}

          {/* Mobile Sign In */}
          {isMobile && !isAuthenticated && (
            <Link to="/login" className="btn-primary text-sm px-4 py-2">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && isAuthenticated && isMobileMenuOpen && (
          <div className="border-t border-gray-200 py-4">
            <div className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-linkedin-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex items-center space-x-3 px-4 py-2">
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </div>
                
                <Link
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-linkedin-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar