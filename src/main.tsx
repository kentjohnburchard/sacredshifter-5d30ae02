
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.tsx'
import { GlobalAudioProvider } from './hooks/useGlobalAudioPlayer.tsx'

// Create a client
const queryClient = new QueryClient()

// Order of providers: BrowserRouter -> QueryClientProvider -> AuthProvider -> GlobalAudioProvider -> App
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GlobalAudioProvider>
            <App />
          </GlobalAudioProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
