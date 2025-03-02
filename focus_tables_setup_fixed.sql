-- Create the focus_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  duration INTEGER NOT NULL,
  mode TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  energy_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT focus_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security for focus_sessions
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS focus_sessions_select_policy ON public.focus_sessions;
DROP POLICY IF EXISTS focus_sessions_insert_policy ON public.focus_sessions;
DROP POLICY IF EXISTS focus_sessions_update_policy ON public.focus_sessions;
DROP POLICY IF EXISTS focus_sessions_delete_policy ON public.focus_sessions;

-- Create policies for focus_sessions
CREATE POLICY focus_sessions_select_policy ON public.focus_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY focus_sessions_insert_policy ON public.focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY focus_sessions_update_policy ON public.focus_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY focus_sessions_delete_policy ON public.focus_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create the focus_streaks table if it doesn't exist (note: changed from focus_streak to focus_streaks to match the code)
CREATE TABLE IF NOT EXISTS public.focus_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_focus_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT focus_streaks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security for focus_streaks
ALTER TABLE public.focus_streaks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS focus_streaks_select_policy ON public.focus_streaks;
DROP POLICY IF EXISTS focus_streaks_insert_policy ON public.focus_streaks;
DROP POLICY IF EXISTS focus_streaks_update_policy ON public.focus_streaks;
DROP POLICY IF EXISTS focus_streaks_delete_policy ON public.focus_streaks;

-- Create policies for focus_streaks
CREATE POLICY focus_streaks_select_policy ON public.focus_streaks
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY focus_streaks_insert_policy ON public.focus_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY focus_streaks_update_policy ON public.focus_streaks
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY focus_streaks_delete_policy ON public.focus_streaks
  FOR DELETE USING (auth.uid() = user_id); 