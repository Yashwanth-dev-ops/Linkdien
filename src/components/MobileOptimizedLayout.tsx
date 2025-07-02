import React from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '../hooks/useMediaQuery'

interface MobileOptimizedLayoutProps {
  children: React.ReactNode
  className?: string
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')

  return (
    <motion.div
      className={`
        ${className}
        ${isMobile ? 'px-4 py-2' : isTablet ? 'px-6 py-4' : 'px-8 py-6'}
        transition-all duration-300 ease-in-out
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default MobileOptimizedLayout