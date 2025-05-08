
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with explicit fallback values
// Use hardcoded values since the environment variables might not be properly initialized
const supabaseUrl = 'https://mikltjgbvxrxndtszorb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
