import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [],
  filter: 'all',
  searchTerm: '',
  selectedCategory: 'all',
  loading: false,
  error: null
}

export const fetchTasks = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const tasks = await taskService.getTasks();
    dispatch(setTasks(tasks));
    dispatch(setError(null));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    dispatch(setError('Failed to fetch tasks. Please try again.'));
  } finally {
    dispatch(setLoading(false));
  }
};


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
    },
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
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
  setSelectedCategory,
  setTasks,
  setLoading,
  setError
} = tasksSlice.actions

export default tasksSlice.reducer