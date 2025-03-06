import { createClient } from '@supabase/supabase-js';

// These should be in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for the entire app with proper headers
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
});

// Types for our database tables
export type FocusSession = {
  id?: string;
  user_id?: string;
  duration: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  completed: boolean;
  energy_level?: 'low' | 'medium' | 'high';
  created_at?: string;
};

export type FocusSettings = {
  id?: string;
  user_id?: string;
  focus_time: number;
  short_break_time: number;
  long_break_time: number;
  sessions_until_long_break: number;
  sound_enabled: boolean;
  preferred_theme: 'light' | 'dark' | 'nature' | 'space';
  audio_volume: number;
  audio_looping: boolean;
  last_ambient_sound?: string;
  created_at?: string;
  updated_at?: string;
};

export type FocusStreak = {
  id?: string;
  user_id?: string;
  current_streak: number;
  longest_streak: number;
  last_focus_date?: string;
  updated_at?: string;
};

export type CalendarEvent = {
  id?: string;
  user_id?: string;
  title: string;
  type: 'task' | 'appointment' | 'reminder' | 'break';
  date: string; // ISO format date
  time?: string; // Time string like "10:00 AM"
  energy_required: 'low' | 'medium' | 'high';
  is_completed?: boolean;
  is_urgent?: boolean;
  duration?: number; // in minutes
  description?: string;
  created_at?: string;
  updated_at?: string;
}; 