# Focus Mode Setup

This document provides instructions for setting up the Focus Mode feature in the Curiosity Manager application.

## 1. Database Setup

The Focus Mode feature requires several tables in your Supabase database. You can create these tables by running the SQL script located at `supabase/setup.sql`.

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/setup.sql`
4. Paste into the SQL Editor and run the script

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase db push
```

## 2. Audio Files Setup

The Focus Mode feature includes ambient sounds to help users focus. You need to add these audio files to the project.

### Option 1: Using the Setup Helper (Recommended)

We've provided a script to create placeholder files and a helper page with download links:

```bash
node scripts/create-placeholder-sounds.js
```

After running this script:
1. Open `http://localhost:3000/ambient-sounds-setup.html` in your browser
2. Follow the instructions to download the sound files from Pixabay
3. Place the downloaded files in the `public/sounds/ambient` directory

### Option 2: Using the Download Script (Not Working Currently)

```bash
node scripts/download-sounds.js
```

This script attempts to download sound files directly but may encounter permission issues.

### Option 3: Manual Download

Place the following MP3 files in the `public/sounds/ambient` directory:

- `rain.mp3` - Rainfall sounds
- `forest.mp3` - Forest ambience
- `cafe.mp3` - Café background noise
- `waves.mp3` - Ocean waves
- `whitenoise.mp3` - White noise

### Where to Find Audio Files

You can find free ambient sound files on websites like:
- [Pixabay](https://pixabay.com/sound-effects/) (recommended)
- [Freesound](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [SoundBible](https://soundbible.com/)

Make sure to use files that are free for commercial use or properly licensed.

## 3. Environment Variables

Ensure your `.env.local` file contains the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Testing the Setup

After completing the setup:

1. Start your development server: `npm run dev`
2. Navigate to the Focus Mode page
3. Check the browser console for any errors
4. Try playing an ambient sound to verify the audio files are working
5. Try saving settings to verify the database connection is working

## 5. Demo Mode

If your Supabase database is not properly set up, the Focus Mode will automatically run in "Demo Mode". In this mode:

- All functionality works locally
- Settings are not saved between sessions
- A "Demo Mode" indicator is shown in the UI

This allows you to test the Focus Mode functionality even if your database is not set up.

## Troubleshooting

### Missing Audio Files

If you see errors like `Failed to load because no supported source was found`, it means the audio files are missing or have incorrect paths. Make sure all required audio files are in the `public/sounds/ambient` directory.

### Database Connection Issues

If you see errors like `Error creating focus settings` or `Error saving ambient sound setting`, it means there are issues with your Supabase connection or tables. Check:

1. Your Supabase URL and anon key in `.env.local`
2. That all required tables exist in your Supabase database
3. That you're properly authenticated with Supabase

### Authentication Issues

The Focus Mode feature requires users to be authenticated. Make sure you're signed in before using the feature. 