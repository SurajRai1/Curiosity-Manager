-- Create the focus_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.focus_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT focus_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.focus_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors)
DROP POLICY IF EXISTS focus_settings_select_policy ON public.focus_settings;
DROP POLICY IF EXISTS focus_settings_insert_policy ON public.focus_settings;
DROP POLICY IF EXISTS focus_settings_update_policy ON public.focus_settings;
DROP POLICY IF EXISTS focus_settings_delete_policy ON public.focus_settings;

-- Create policies
CREATE POLICY focus_settings_select_policy ON public.focus_settings
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY focus_settings_insert_policy ON public.focus_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY focus_settings_update_policy ON public.focus_settings
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY focus_settings_delete_policy ON public.focus_settings
  FOR DELETE USING (auth.uid() = user_id); 