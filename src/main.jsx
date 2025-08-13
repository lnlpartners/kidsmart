import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initializeStorage } from '@/api/localStorage'

// Initialize local storage with mock data
initializeStorage();

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
) 