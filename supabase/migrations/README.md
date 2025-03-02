# Supabase Migrations

This directory contains SQL migration files for the Supabase database.

## Running Migrations

To apply these migrations to your Supabase project, you can use the Supabase CLI:

```bash
supabase db push
```

Or you can run the SQL statements directly in the Supabase SQL editor in the dashboard.

## Migration Files

- `20250228_update_focus_settings.sql` - Adds audio-related columns to the focus_settings table

## Database Schema

### focus_sessions
- `id` - Primary key
- `user_id` - Foreign key to auth.users
- `duration` - Duration in seconds
- `mode` - 'focus', 'shortBreak', or 'longBreak'
- `completed` - Boolean indicating if the session was completed
- `energy_level` - 'low', 'medium', or 'high'
- `created_at` - Timestamp

### focus_settings
- `id` - Primary key
- `user_id` - Foreign key to auth.users
- `focus_time` - Focus time in minutes
- `short_break_time` - Short break time in minutes
- `long_break_time` - Long break time in minutes
- `sessions_until_long_break` - Number of sessions until a long break
- `sound_enabled` - Boolean indicating if sounds are enabled
- `preferred_theme` - 'light', 'dark', 'nature', or 'space'
- `audio_volume` - Volume level (0.0 to 1.0)
- `audio_looping` - Boolean indicating if audio should loop
- `last_ambient_sound` - ID of the last selected ambient sound
- `created_at` - Timestamp
- `updated_at` - Timestamp

### focus_streaks
- `id` - Primary key
- `user_id` - Foreign key to auth.users
- `current_streak` - Current streak count
- `longest_streak` - Longest streak achieved
- `last_focus_date` - Date of the last focus session
- `updated_at` - Timestamp 