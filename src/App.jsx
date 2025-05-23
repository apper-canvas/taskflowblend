import { Routes, Route, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { useState, useEffect, createContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './store/userSlice'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Callback from './pages/Callback'
import ErrorPage from './pages/ErrorPage'
import ApperIcon from './components/ApperIcon'
import 'react-toastify/dist/ReactToastify.css'

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode')
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [navigate, dispatch]);
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
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-surface-50 via-primary-50 to-secondary-50 dark:from-surface-900 dark:via-surface-800 dark:to-surface-900 min-h-screen">
        {isAuthenticated && <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
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
        }

        {/* Main Content */}
        <main className="relative">
          <AuthContext.Provider value={authMethods}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/" element={isAuthenticated ? <Home darkMode={darkMode} /> : <Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AuthContext.Provider>
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