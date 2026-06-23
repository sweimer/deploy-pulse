import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { PGliteProvider } from '@electric-sql/pglite-react'
import App from './App.jsx'
import { initDB } from './db/index.js'
import './index.css'

function Root() {
  const [db, setDb] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    initDB().then(setDb).catch(setError)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-2">Failed to start database</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!db) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Starting up...</p>
        </div>
      </div>
    )
  }

  return (
    <PGliteProvider db={db}>
      <App />
    </PGliteProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
