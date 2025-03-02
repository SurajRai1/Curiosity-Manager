-- Add new audio columns to focus_settings table
ALTER TABLE focus_settings 
ADD COLUMN IF NOT EXISTS audio_volume FLOAT DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS audio_looping BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_ambient_sound TEXT; 