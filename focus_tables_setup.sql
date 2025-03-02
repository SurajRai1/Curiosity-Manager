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

-- Create policies for focus_sessions
CREATE POLICY focus_sessions_select_policy ON public.focus_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY focus_sessions_insert_policy ON public.focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY focus_sessions_update_policy ON public.focus_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY focus_sessions_delete_policy ON public.focus_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create the focus_streak table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.focus_streak (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_focus_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT focus_streak_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security for focus_streak
ALTER TABLE public.focus_streak ENABLE ROW LEVEL SECURITY;

-- Create policies for focus_streak
CREATE POLICY focus_streak_select_policy ON public.focus_streak
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY focus_streak_insert_policy ON public.focus_streak
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY focus_streak_update_policy ON public.focus_streak
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY focus_streak_delete_policy ON public.focus_streak
  FOR DELETE USING (auth.uid() = user_id); 