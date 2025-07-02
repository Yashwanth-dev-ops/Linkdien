import React from 'react'
import { motion } from 'framer-motion'
import AdvancedAnalytics from '../components/AdvancedAnalytics'
import MobileOptimizedLayout from '../components/MobileOptimizedLayout'

const Analytics = () => {
  return (
    <MobileOptimizedLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdvancedAnalytics />
      </motion.div>
    </MobileOptimizedLayout>
  )
}

export default Analytics