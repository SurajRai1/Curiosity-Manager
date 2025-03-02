-- Focus Sessions Table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('focus', 'shortBreak', 'longBreak')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Focus Settings Table
CREATE TABLE IF NOT EXISTS focus_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  focus_time INTEGER NOT NULL DEFAULT 25,
  short_break_time INTEGER NOT NULL DEFAULT 5,
  long_break_time INTEGER NOT NULL DEFAULT 15,
  sessions_until_long_break INTEGER NOT NULL DEFAULT 4,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_theme TEXT NOT NULL DEFAULT 'light' CHECK (preferred_theme IN ('light', 'dark', 'nature', 'space')),
  audio_volume FLOAT DEFAULT 0.5,
  audio_looping BOOLEAN DEFAULT TRUE,
  last_ambient_sound TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Focus Streaks Table
CREATE TABLE IF NOT EXISTS focus_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_focus_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
-- Only allow users to access their own data

-- Focus Sessions RLS
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY focus_sessions_select_policy ON focus_sessions
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY focus_sessions_insert_policy ON focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY focus_sessions_update_policy ON focus_sessions
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY focus_sessions_delete_policy ON focus_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Focus Settings RLS
ALTER TABLE focus_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY focus_settings_select_policy ON focus_settings
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY focus_settings_insert_policy ON focus_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY focus_settings_update_policy ON focus_settings
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY focus_settings_delete_policy ON focus_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Focus Streaks RLS
ALTER TABLE focus_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY focus_streaks_select_policy ON focus_streaks
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY focus_streaks_insert_policy ON focus_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY focus_streaks_update_policy ON focus_streaks
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY focus_streaks_delete_policy ON focus_streaks
  FOR DELETE USING (auth.uid() = user_id); 