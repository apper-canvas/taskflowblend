import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [
    {
      id: 1,
      title: 'Complete project proposal',
      description: 'Write and submit the Q4 project proposal document',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-15',
      category: 'Work',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Review team performance',
      description: 'Conduct quarterly performance reviews for team members',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2024-01-20',
      category: 'Management',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Update documentation',
      description: 'Update API documentation with recent changes',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-01-10',
      category: 'Development',
      completed: true,
      createdAt: new Date().toISOString()
    }
  ],
  filter: 'all',
  searchTerm: '',
  selectedCategory: 'all'
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        ...action.payload,
        completed: false,
        createdAt: new Date().toISOString()
      }
      state.tasks.unshift(newTask)
    },
    updateTask: (state, action) => {
      const { id, ...updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload)
    },
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
        task.status = task.completed ? 'completed' : 'pending'
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload
    }
  }
})

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  setFilter,
  setSearchTerm,
  setSelectedCategory
} = tasksSlice.actions

export default tasksSlice.reducer