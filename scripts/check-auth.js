// Script to check Supabase authentication status
// Run with: node scripts/check-auth.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or key not found in environment variables.');
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuth() {
  console.log('Checking Supabase authentication status...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // Check if we can connect to Supabase
    console.log('\n1. Testing basic Supabase connection...');
    const { data: versionData, error: versionError } = await supabase.rpc('get_server_version');
    
    if (versionError) {
      console.error('❌ Error connecting to Supabase:', versionError);
    } else {
      console.log('✅ Successfully connected to Supabase');
      console.log('   Server version:', versionData);
    }
    
    // Check authentication status
    console.log('\n2. Checking authentication status...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Authentication error:', authError);
    } else if (!user) {
      console.log('❌ No user is currently authenticated');
    } else {
      console.log('✅ User is authenticated');
      console.log('   User ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Created at:', new Date(user.created_at).toLocaleString());
      
      // Check if user exists in auth.users table
      console.log('\n3. Checking if user exists in auth.users table...');
      const { data: authUsers, error: authUsersError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('id', user.id)
        .single();
      
      if (authUsersError) {
        if (authUsersError.code === 'PGRST116') {
          console.error('❌ User not found in auth.users table');
        } else {
          console.error('❌ Error checking auth.users table:', authUsersError);
        }
      } else {
        console.log('✅ User found in auth.users table');
      }
      
      // Try to directly query the focus_settings table
      console.log('\n4. Checking if focus_settings table exists and is accessible...');
      const { data: focusSettings, error: focusSettingsError } = await supabase
        .from('focus_settings')
        .select('id')
        .limit(1);
      
      if (focusSettingsError) {
        console.error('❌ Error accessing focus_settings table:', focusSettingsError);
      } else {
        console.log('✅ Successfully accessed focus_settings table');
        console.log('   Number of records:', focusSettings.length);
      }
      
      // Check if we can query the user's focus settings
      console.log('\n5. Checking if user has focus settings...');
      const { data: userSettings, error: userSettingsError } = await supabase
        .from('focus_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (userSettingsError) {
        if (userSettingsError.code === 'PGRST116') {
          console.log('ℹ️ User has no focus settings yet');
        } else {
          console.error('❌ Error checking user focus settings:', userSettingsError);
        }
      } else {
        console.log('✅ User has focus settings');
        console.log('   Settings:', userSettings);
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkAuth(); 