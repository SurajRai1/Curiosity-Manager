-- SQL script to check and fix focus tables in Supabase
-- Run this in the Supabase SQL Editor

-- First, check if the tables exist
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'focus_settings'
) AS focus_settings_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'focus_sessions'
) AS focus_sessions_exists,
EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'focus_streaks'
) AS focus_streaks_exists;

-- Check the foreign key constraint on focus_settings
SELECT
  tc.table_schema, 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'focus_settings';

-- Check if the auth.users table exists and is accessible
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'auth' 
  AND table_name = 'users'
) AS auth_users_exists;

-- Check if the current user exists in auth.users
-- Replace 'your-user-id' with your actual user ID
-- SELECT * FROM auth.users WHERE id = 'your-user-id';

-- If tables don't exist, create them with proper foreign key constraints
-- Drop existing tables if they have incorrect constraints
DROP TABLE IF EXISTS public.focus_settings CASCADE;
DROP TABLE IF EXISTS public.focus_sessions CASCADE;
DROP TABLE IF EXISTS public.focus_streaks CASCADE;

-- Create focus_settings table
CREATE TABLE IF NOT EXISTS public.focus_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  focus_time INTEGER NOT NULL DEFAULT 25,
  short_break_time INTEGER NOT NULL DEFAULT 5,
  long_break_time INTEGER NOT NULL DEFAULT 15,
  sessions_until_long_break INTEGER NOT NULL DEFAULT 4,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  preferred_theme TEXT NOT NULL DEFAULT 'light',
  audio_volume FLOAT NOT NULL DEFAULT 0.5,
  audio_looping BOOLEAN NOT NULL DEFAULT true,
  last_ambient_sound TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT focus_settings_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  duration INTEGER NOT NULL,
  mode TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  energy_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT focus_sessions_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create focus_streaks table
CREATE TABLE IF NOT EXISTS public.focus_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_focus_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT focus_streaks_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Set up Row Level Security (RLS) policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only access their own focus settings" ON public.focus_settings;
DROP POLICY IF EXISTS "Users can only access their own focus sessions" ON public.focus_sessions;
DROP POLICY IF EXISTS "Users can only access their own focus streaks" ON public.focus_streaks;

-- Enable Row Level Security
ALTER TABLE public.focus_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_streaks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only access their own focus settings"
  ON public.focus_settings
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own focus sessions"
  ON public.focus_sessions
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own focus streaks"
  ON public.focus_streaks
  FOR ALL
  USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT ALL ON public.focus_settings TO authenticated;
GRANT ALL ON public.focus_sessions TO authenticated;
GRANT ALL ON public.focus_streaks TO authenticated; 