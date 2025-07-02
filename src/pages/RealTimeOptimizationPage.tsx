import React from 'react'
import { motion } from 'framer-motion'
import RealTimeOptimization from '../components/RealTimeOptimization'
import MobileOptimizedLayout from '../components/MobileOptimizedLayout'

const RealTimeOptimizationPage = () => {
  return (
    <MobileOptimizedLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <RealTimeOptimization />
      </motion.div>
    </MobileOptimizedLayout>
  )
}

export default RealTimeOptimizationPage