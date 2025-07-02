import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Optimization from './pages/Optimization'
import History from './pages/History'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import RealTimeOptimizationPage from './pages/RealTimeOptimizationPage'
import Login from './pages/Login'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/optimization" element={<Optimization />} />
              <Route path="/realtime-optimization" element={<RealTimeOptimizationPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
        </Routes>
      </main>
    </div>
  )
}

export default App