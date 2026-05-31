import React from 'react'
import ReactDOM from 'react-dom/client'
import { PGliteProvider } from '@electric-sql/pglite-react'
import App from './App.jsx'
import { initDB } from './db/index.js'
import './index.css'

const db = await initDB()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PGliteProvider db={db}>
      <App />
    </PGliteProvider>
  </React.StrictMode>,
)
