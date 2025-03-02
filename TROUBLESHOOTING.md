# Focus Mode Troubleshooting Guide

## Issues Identified

1. **Missing Audio Files**: The ambient sound files referenced in the code (`rain.mp3`, `forest.mp3`, `cafe.mp3`, `waves.mp3`, `whitenoise.mp3`) were missing from the `public/sounds/ambient` directory.

2. **Supabase Connection Issues**: The application was encountering errors when trying to connect to Supabase, resulting in errors like:
   - `Error creating focus settings: {}`
   - `Error saving ambient sound setting: {}`

## Solutions Implemented

### 1. Audio Files

We implemented multiple solutions for the missing audio files:

1. **Created Placeholder Files**: Empty placeholder files were created in the `public/sounds/ambient` directory to prevent file not found errors.

2. **Setup Helper Page**: A helper HTML page (`public/ambient-sounds-setup.html`) was created with links to download the required sound files from Pixabay.

3. **Download Script**: A script (`scripts/download-sounds.js`) was created to attempt direct downloads, but it encountered permission issues with the source websites.

4. **Improved Error Handling**: The code was updated to handle missing audio files gracefully, providing clear error messages to the user.

### 2. Supabase Connection

We implemented several improvements for the Supabase connection issues:

1. **Demo Mode**: Added a "Demo Mode" that allows the focus feature to work without a Supabase connection. In this mode:
   - All functionality works locally
   - Settings are not saved between sessions
   - A "Demo Mode" indicator is shown in the UI

2. **Database Setup Script**: Created a SQL script (`supabase/setup.sql`) with all the necessary table definitions and security policies.

3. **Improved Error Handling**: Enhanced error handling in the Supabase service functions to provide more informative error messages.

4. **Table Existence Check**: Added a function to check if the required Supabase tables exist and display appropriate messages.

## How to Use

### Setting Up Audio Files

1. Run the setup helper script:
   ```bash
   node scripts/create-placeholder-sounds.js
   ```

2. Open `http://localhost:3000/ambient-sounds-setup.html` in your browser and follow the instructions to download the sound files.

### Setting Up Supabase

1. Ensure your `.env.local` file contains the correct Supabase URL and anon key.

2. Run the SQL script in the Supabase dashboard:
   - Copy the contents of `supabase/setup.sql`
   - Paste into the SQL Editor in your Supabase dashboard
   - Run the script

3. If you prefer to use the application without setting up Supabase, the "Demo Mode" will activate automatically.

## Additional Resources

- **Focus Mode README**: See `src/app/dashboard/focus/README.md` for detailed setup instructions.
- **Supabase Migrations**: See `supabase/migrations/README.md` for information about database migrations.
- **Ambient Sounds README**: See `public/sounds/ambient/README.md` for information about the required sound files. 