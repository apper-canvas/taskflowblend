import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-8 sm:p-12 shadow-soft border border-surface-200/50 dark:border-surface-700/50"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-glow">
              <ApperIcon name="AlertTriangle" className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-surface-800 dark:text-surface-100 mb-4">
              Page Not Found
            </h2>
            <p className="text-surface-600 dark:text-surface-400 text-sm sm:text-base">
              The page you're looking for seems to have wandered off. Let's get you back to organizing your tasks!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-glow hover:shadow-lg transform hover:scale-105"
            >
              <ApperIcon name="Home" className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-medium rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200 shadow-soft"
            >
              <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 flex justify-center space-x-4"
          >
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound