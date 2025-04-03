
import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient()

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SessionContextProvider>
  </React.StrictMode>
);
