-- Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task', 'appointment', 'reminder', 'break')),
  date DATE NOT NULL,
  time TEXT,
  energy_required TEXT NOT NULL CHECK (energy_required IN ('low', 'medium', 'high')),
  is_completed BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  duration INTEGER, -- in minutes
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own calendar events
CREATE POLICY calendar_events_select_policy ON calendar_events
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY calendar_events_insert_policy ON calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY calendar_events_update_policy ON calendar_events
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY calendar_events_delete_policy ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX calendar_events_user_id_idx ON calendar_events(user_id);
CREATE INDEX calendar_events_date_idx ON calendar_events(date); 