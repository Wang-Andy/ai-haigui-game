import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LoadingProvider } from './contexts/LoadingContext.tsx'
import { ErrorProvider } from './contexts/ErrorContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadingProvider>
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </LoadingProvider>
  </React.StrictMode>,
)