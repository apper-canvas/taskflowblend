import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './store/tasksSlice'
import App from './App.jsx'
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  reducer: {
    tasks: tasksReducer
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)