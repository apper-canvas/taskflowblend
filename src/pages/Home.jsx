import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { AuthContext } from '../App'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
function Home({ darkMode }) {
function Home() {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  
  useEffect(() => {
    // Welcome toast notification for logged in users
    if (user?.firstName) {
      toast.success(`Welcome back, ${user.firstName}!`)
    }
  }, [user?.firstName])
  const [activeView, setActiveView] = useState('board')

  const stats = [
    { icon: 'CheckCircle2', label: 'Completed Tasks', value: '24', color: 'text-green-500' },
    { icon: 'Clock', label: 'In Progress', value: '8', color: 'text-yellow-500' },
          {user?.firstName ? `${user.firstName}'s Tasks` : 'My Tasks'}
    { icon: 'Target', label: 'This Week', value: '44', color: 'text-blue-500' }
  ]
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <button
            onClick={logout}
            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200 text-sm flex items-center gap-1"
          >
            <ApperIcon name="LogOut" className="h-4 w-4" /> Logout
          </button>
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-1 border border-surface-200/50 dark:border-surface-700/50 ml-auto">
    { id: 'board', icon: 'Kanban', label: 'Board View' },
    { id: 'list', icon: 'List', label: 'List View' },
    { id: 'calendar', icon: 'Calendar', label: 'Calendar' }
  ]

  return (
    <div className="min-h-screen pt-6 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent bg-clip-text text-transparent">
              Organize Your Workflow
            </h2>
            <p className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              Transform your productivity with TaskFlow's intuitive task management system
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
      <MainFeature activeView={activeView} darkMode={darkMode} />
              >
                <div className="flex items-center justify-between mb-2">
                  <ApperIcon name={stat.icon} className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
                  <span className="text-2xl sm:text-3xl font-bold text-surface-800 dark:text-surface-100">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-sm rounded-2xl p-2 shadow-soft border border-surface-200/50 dark:border-surface-700/50">
              <div className="flex space-x-1">
                {viewOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveView(option.id)}
                    className={`flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 ${
                      activeView === option.id
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    <ApperIcon name={option.icon} className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-sm sm:text-base font-medium hidden sm:inline">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Feature Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <MainFeature activeView={activeView} />
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 rounded-2xl p-6 sm:p-8 border border-primary-200/50 dark:border-primary-700/50">
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-surface-800 dark:text-surface-100">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex items-center justify-center space-x-3 p-4 bg-white/70 dark:bg-surface-800/70 rounded-xl hover:bg-white dark:hover:bg-surface-800 transition-all duration-200 shadow-soft hover:shadow-card group">
                <ApperIcon name="Plus" className="h-5 w-5 text-primary-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-surface-700 dark:text-surface-300">Add New Task</span>
              </button>
              <button className="flex items-center justify-center space-x-3 p-4 bg-white/70 dark:bg-surface-800/70 rounded-xl hover:bg-white dark:hover:bg-surface-800 transition-all duration-200 shadow-soft hover:shadow-card group">
                <ApperIcon name="FolderPlus" className="h-5 w-5 text-secondary-500 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-surface-700 dark:text-surface-300">Create Project</span>
              </button>
              <button className="flex items-center justify-center space-x-3 p-4 bg-white/70 dark:bg-surface-800/70 rounded-xl hover:bg-white dark:hover:bg-surface-800 transition-all duration-200 shadow-soft hover:shadow-card group">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-accent group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium text-surface-700 dark:text-surface-300">View Reports</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home