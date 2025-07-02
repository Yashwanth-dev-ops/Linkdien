import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Bot,
  Save,
  Trash2,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      optimization: true,
      weekly: true
    },
    privacy: {
      profileVisible: true,
      shareProgress: false,
      anonymousData: true
    },
    ai: {
      defaultModel: 'smart',
      autoOptimize: false,
      saveConversations: true
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Settings', icon: <Bot className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> }
  ]

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not implemented in this demo.')
    }
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
          Settings
        </h1>
        <p className="text-xl text-gray-600">
          Manage your account and preferences
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-linkedin-100 text-linkedin-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Profile Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      defaultValue={user?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="input-field"
                      defaultValue={user?.email}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL
                  </label>
                  <div className="flex">
                    <input
                      type="url"
                      className="input-field rounded-r-none"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                    <button className="px-4 py-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select className="input-field">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Marketing</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, email: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Receive browser notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.push}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, push: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Optimization Alerts</h3>
                      <p className="text-sm text-gray-600">Get notified when optimization is complete</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.optimization}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, optimization: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Reports</h3>
                      <p className="text-sm text-gray-600">Receive weekly progress summaries</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.weekly}
                        onChange={(e) => setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, weekly: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Profile Visibility</h3>
                      <p className="text-sm text-gray-600">Make your optimization progress visible to others</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.profileVisible}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, profileVisible: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Share Progress</h3>
                      <p className="text-sm text-gray-600">Allow sharing of anonymized progress data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.shareProgress}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, shareProgress: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Anonymous Analytics</h3>
                      <p className="text-sm text-gray-600">Help improve our service with anonymous usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.anonymousData}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, anonymousData: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">AI Settings</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default AI Model
                  </label>
                  <select 
                    className="input-field"
                    value={settings.ai.defaultModel}
                    onChange={(e) => setSettings({
                      ...settings,
                      ai: { ...settings.ai, defaultModel: e.target.value }
                    })}
                  >
                    <option value="smart">Smart AI (Recommended)</option>
                    <option value="gpt4">GPT-4</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini Pro</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-Optimization</h3>
                      <p className="text-sm text-gray-600">Automatically apply AI suggestions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.ai.autoOptimize}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: { ...settings.ai, autoOptimize: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Save Conversations</h3>
                      <p className="text-sm text-gray-600">Keep AI conversation history for future reference</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.ai.saveConversations}
                        onChange={(e) => setSettings({
                          ...settings,
                          ai: { ...settings.ai, saveConversations: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-linkedin-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linkedin-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Appearance</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 border-2 border-linkedin-500 rounded-lg cursor-pointer">
                      <div className="w-full h-20 bg-gradient-to-br from-blue-50 to-purple-50 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Light (Current)</p>
                    </div>
                    <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                      <div className="w-full h-20 bg-gray-800 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Dark</p>
                    </div>
                    <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                      <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-gray-800 rounded mb-2"></div>
                      <p className="text-sm font-medium text-center">Auto</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-linkedin-500 rounded-full cursor-pointer ring-2 ring-linkedin-500 ring-offset-2"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded-full cursor-pointer hover:ring-2 hover:ring-purple-500 hover:ring-offset-2"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full cursor-pointer hover:ring-2 hover:ring-green-500 hover:ring-offset-2"></div>
                    <div className="w-8 h-8 bg-red-500 rounded-full cursor-pointer hover:ring-2 hover:ring-red-500 hover:ring-offset-2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handleDeleteAccount}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
              
              <button
                onClick={handleSave}
                className="btn-primary flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings