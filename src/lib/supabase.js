import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://imvxlpikjoqdrekgrpim.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'yeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdnhscGlram9xZHJla2dycGltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NjgzMjIsImV4cCI6MjA3MzA0NDMyMn0.cUT0GlSUyVbaqiP78drhCYX2u8GHE_A1mfx5327LCps';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
