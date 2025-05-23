import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'
import taskService from '../services/taskService'
import categoryService from '../services/categoryService'

function MainFeature({ activeView, darkMode }) {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingForm, setLoadingForm] = useState(false)

  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedTask, setDraggedTask] = useState(null)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'medium', dueDate: '', category: 'General', tags: ''
  })

  const priorities = {
    low: { color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30', icon: 'ArrowDown' },
    medium: { color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'Minus' },
    high: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', icon: 'ArrowUp' }
  }

  const statusColumns = {
    'to-do': { title: 'To Do', color: 'bg-surface-100 dark:bg-surface-800', icon: 'Circle' },
    'in-progress': { title: 'In Progress', color: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'Clock' },
    'completed': { title: 'Completed', color: 'bg-green-100 dark:bg-green-900/30', icon: 'CheckCircle2' }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Fetch tasks and categories on component mount
  useEffect(() => {
    const fetchTasksAndCategories = async () => {
      setLoading(true)
      try {
        const [fetchedTasks, fetchedCategories] = await Promise.all([
          taskService.getTasks({ status: filterStatus === 'all' ? '' : filterStatus, searchTerm }),
          categoryService.getCategories()
        ])
        setTasks(fetchedTasks)
        setCategories(fetchedCategories)
        setError(null)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load tasks. Please try again.')
        toast.error('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    
    fetchTasksAndCategories()
  }, [filterStatus, searchTerm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoadingForm(true)
    
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      setLoadingForm(false)
      return
    }
    
    // Validate date format if present
    if (formData.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dueDate)) {
      toast.error('Due date must be in YYYY-MM-DD format')
      setLoadingForm(false)
      return
    }
    
    if (!['low', 'medium', 'high'].includes(formData.priority)) {
      toast.error('Please select a valid priority')
      setLoadingForm(false)
      return
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now(),
      status: editingTask ? editingTask.status : 'to-do',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    }

    if (editingTask) {
      try {
        const updatedTask = await taskService.updateTask(editingTask.id, taskData)
        setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task))
        toast.success('Task updated successfully!')
        resetForm()
      } catch (error) {
        console.error('Error updating task:', error)
        toast.error(error.message || 'Failed to update task')
      } finally {
        setLoadingForm(false)
      }
    } else {
      try {
        const newTask = await taskService.createTask(taskData)
        setTasks([newTask, ...tasks])
        toast.success('Task created successfully!')
        resetForm()
      } catch (error) {
        console.error('Error creating task:', error)
        toast.error(error.message || 'Failed to create task')
      } finally {
        setLoadingForm(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      category: 'General',
      tags: ''
    })
    setShowModal(false)
    setEditingTask(null)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      category: task.category,
      tags: task.tags.join(', ')
    })
    setShowModal(true)
  }

  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId)
      setTasks(tasks.filter(task => task.id !== taskId))
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error(error.message || 'Failed to delete task')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      await taskService.updateTask(taskId, { ...task, status: newStatus })
      setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task))
    } catch (error) {
      console.error('Error changing task status:', error)
      toast.error('Failed to update task status')
    }
    toast.success(`Task moved to ${statusColumns[newStatus].title}`)
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, status) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== status) {
      handleStatusChange(draggedTask.id, status)
    }
    setDraggedTask(null)
  }

  const renderTaskCard = (task) => (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className="bg-white dark:bg-surface-800 rounded-xl p-4 sm:p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-surface-200/50 dark:border-surface-700/50 cursor-move task-card-hover group"
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-surface-800 dark:text-surface-100 text-sm sm:text-base line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {task.title}
          </h3>
          <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        </div>
        
        {/* Priority Indicator */}
        <div className={`ml-3 p-2 rounded-lg ${priorities[task.priority].bg} flex-shrink-0`}>
          <ApperIcon 
            name={priorities[task.priority].icon} 
            className={`h-3 w-3 sm:h-4 sm:w-4 ${priorities[task.priority].color}`} 
          />
        </div>
      </div>

      {/* Task Details */}
      <div className="space-y-3">
        {/* Category and Due Date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="inline-flex items-center px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium">
            <ApperIcon name="Folder" className="h-3 w-3 mr-1" />
            {task.category}
          </span>
          {task.dueDate && (
            <span className="inline-flex items-center text-surface-500 dark:text-surface-400">
              <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), 'MMM dd')}
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-md text-xs"
              >
                #{tag}
              </span>
            ))}
            {task.tags.length > 2 && (
              <span className="px-2 py-1 text-surface-500 dark:text-surface-400 text-xs">
                +{task.tags.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-200/50 dark:border-surface-700/50">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(task)}
              className="p-1 text-surface-400 hover:text-primary-500 transition-colors duration-200"
            >
              <ApperIcon name="Edit2" className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              className="p-1 text-surface-400 hover:text-red-500 transition-colors duration-200"
            >
              <ApperIcon name="Trash2" className="h-4 w-4" />
            </button>
          </div>
          
          {/* Status Selector */}
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
            className="text-xs bg-transparent border border-surface-300 dark:border-surface-600 rounded-lg px-2 py-1 text-surface-600 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </motion.div>
  )

  const renderBoardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {Object.entries(statusColumns).map(([status, config]) => (
        <div
          key={status}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
          className={`${config.color} rounded-2xl p-4 sm:p-6 min-h-[400px] transition-all duration-300 ${
            draggedTask && draggedTask.status !== status ? 'ring-2 ring-primary-400 ring-opacity-50' : ''
          }`}
        >
          <div className="flex items-center space-x-3 mb-6">
            <ApperIcon name={config.icon} className="h-5 w-5 sm:h-6 sm:w-6 text-surface-600 dark:text-surface-300" />
            <h3 className="font-bold text-lg sm:text-xl text-surface-800 dark:text-surface-100">
              {config.title}
            </h3>
            <span className="px-2 py-1 bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-lg text-sm font-medium">
              {loading ? (
                <span className="animate-pulse-soft">...</span>
              ) : (
                filteredTasks.filter(task => task.status === status).length)}
            </span>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks
                .filter(task => task.status === status)
                .map(task => renderTaskCard(task))}
              {loading && filteredTasks.filter(task => task.status === status).length === 0 && (
                <div className="bg-white dark:bg-surface-800 rounded-xl p-4 sm:p-6 shadow-soft text-center">
                  <div className="animate-pulse-soft">Loading tasks...</div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-soft border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-surface-200 dark:border-surface-700">
        <h3 className="font-bold text-lg sm:text-xl text-surface-800 dark:text-surface-100">
          All Tasks
          {loading && <span className="ml-2 animate-pulse-soft text-sm text-surface-500">(Loading...)</span>}
        </h3>
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>
      <div className="divide-y divide-surface-200 dark:divide-surface-700">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 sm:p-6 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-surface-800 dark:text-surface-100 text-sm sm:text-base">
                      {task.title}
                    </h4>
                    <div className={`p-1 rounded ${priorities[task.priority].bg}`}>
                      <ApperIcon 
                        name={priorities[task.priority].icon} 
                        className={`h-3 w-3 ${priorities[task.priority].color}`} 
                      />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-surface-600 dark:text-surface-400 mb-2">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                      {task.category}
                    </span>
                    <span className={`px-2 py-1 rounded ${statusColumns[task.status].color} text-surface-700 dark:text-surface-300`}>
                      {statusColumns[task.status].title}
                    </span>
                    {task.dueDate && (
                      <span className="text-surface-500 dark:text-surface-400">
                        Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="p-2 text-surface-400 hover:text-primary-500 transition-colors duration-200"
                  >
                    <ApperIcon name="Edit2" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-surface-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && filteredTasks.length === 0 && (
          <div className="p-6 text-center">
            <div className="animate-pulse-soft">Loading tasks...</div>
          </div>
        )}
        {!loading && filteredTasks.length === 0 && (
          <div className="p-6 text-center text-surface-500">No tasks found</div>
        )}
      </div>
    </div>
  )

  const renderCalendarView = () => (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 shadow-soft border border-surface-200/50 dark:border-surface-700/50">
      <div className="text-center py-12">
        <ApperIcon name="Calendar" className="h-16 w-16 text-surface-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-2">
          Calendar View
        </h3>
        <p className="text-surface-600 dark:text-surface-400">
          Calendar view coming soon! For now, use Board or List view to manage your tasks.
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center flex-1">
          <div className="relative flex-1 max-w-md">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" />
            <input
            type="text" 
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 sm:py-3 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
          >
            <option value="all">All Tasks</option>
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-glow hover:shadow-lg transform hover:scale-105"
          disabled={loading}>
          <ApperIcon name="Plus" className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Add Task</span>
        </button>
      </div>

      {/* Main Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'board' && renderBoardView()}
        {activeView === 'list' && renderListView()}
        {activeView === 'calendar' && renderCalendarView()}
      </motion.div>

      {/* Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-surface-200/50 dark:border-surface-700/50 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-surface-800 dark:text-surface-100">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base resize-none"
                    placeholder="Enter task description..."
                  />
                </div>

                {/* Priority and Due Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Category and Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    {categories.length > 0 ? (
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                        <option value="General">General</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                        placeholder="e.g., Development"
                      />
                    )}
                   </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-50 dark:bg-surface-700 border border-surface-300 dark:border-surface-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-medium rounded-xl hover:bg-surface-200 dark:hover:bg-surface-600 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 shadow-glow hover:shadow-lg transform hover:scale-105"
                    disabled={loadingForm}
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature