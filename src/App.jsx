import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ApperIcon from './components/ApperIcon'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-surface-50 via-primary-50 to-secondary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-glow">
                  <ApperIcon name="CheckSquare" className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                  <p className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">
                    Efficient Task Management
                  </p>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200 shadow-neu-light dark:shadow-neu-dark group"
              >
                <ApperIcon 
                  name={darkMode ? "Sun" : "Moon"} 
                  className="h-5 w-5 sm:h-6 sm:w-6 text-surface-600 dark:text-surface-300 group-hover:scale-110 transition-transform duration-200" 
                />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          className="mt-16"
          toastClassName="bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 shadow-card"
        />
      </div>
    </div>
  )
}

export default App