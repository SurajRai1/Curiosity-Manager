# Focus Mode Database Setup Guide

This guide will help you fix the foreign key constraint error in your Focus Mode feature.

## The Problem

You're encountering this error:
```
Error: Database error: insert or update on table "focus_settings" violates foreign key constraint "focus_settings_user_id_fkey"
```

This means that when your app tries to save focus settings, the user ID it's using doesn't exist in the `auth.users` table that the foreign key is referencing.

## Diagnostic Steps

### 1. Check Authentication Status

Run the authentication check script to verify your user is properly authenticated:

```bash
# Install dependencies if needed
npm install @supabase/supabase-js dotenv

# Run the script
node scripts/check-auth.js
```

This will tell you:
- If you can connect to Supabase
- If you're properly authenticated
- If your user ID exists in the auth.users table
- If the focus_settings table exists and is accessible

### 2. Fix Database Schema

If the script shows issues with your tables or authentication, you'll need to fix the database schema:

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `scripts/fix-focus-tables.sql`
4. Run the SQL script

The script will:
- Check if your tables exist
- Check the foreign key constraints
- Drop and recreate the tables with proper constraints
- Set up Row Level Security policies

## Common Issues and Solutions

### User Not Found in auth.users

If your user exists in the authentication system but not in the `auth.users` table, you may need to:

1. Sign out and sign in again to refresh your session
2. Check if you're using the correct Supabase project
3. Verify that your auth tables are set up correctly

### Table Permission Issues

If you can't access the tables due to permission issues:

1. Make sure the tables have proper RLS policies
2. Ensure your authenticated role has the necessary permissions
3. Check if your Supabase service role has the right access

### Foreign Key Constraint Issues

If the foreign key constraint is pointing to the wrong table:

1. The SQL script will fix this by recreating the tables with the correct constraints
2. Make sure the `auth.users` table exists and is accessible
3. Verify that your user ID is in the correct format (UUID)

## After Fixing

After running the SQL script:

1. Restart your application
2. Try changing the theme or updating focus settings again
3. Check the console for any new errors

If you're still having issues, you may need to check your Supabase configuration or authentication setup. 