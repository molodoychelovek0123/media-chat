import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import '@salutejs/plasma-b2c/css/es/index.css'
import '../.cache/plasma-dev/packages/themes/plasma-themes/src/css/plasma_b2c__dark.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)