import { supabase, FocusSession, FocusSettings, FocusStreak } from '@/lib/supabase';

// Focus Sessions
export async function createFocusSession(session: Omit<FocusSession, 'id' | 'user_id' | 'created_at'>) {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('focus_sessions')
    .insert({
      ...session,
      user_id: userId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating focus session:', error);
    throw error;
  }
  
  // Update streak when a focus session is completed
  if (session.mode === 'focus' && session.completed) {
    await updateFocusStreak();
  }
  
  return data;
}

export async function getFocusSessions(limit = 10) {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching focus sessions:', error);
    throw error;
  }
  
  return data;
}

// Focus Settings
export async function getFocusSettings() {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('focus_settings')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    // If no settings exist yet, return default settings
    if (error.code === 'PGRST116') {
      return {
        focus_time: 25,
        short_break_time: 5,
        long_break_time: 15,
        sessions_until_long_break: 4,
        sound_enabled: true,
        preferred_theme: 'light',
        audio_volume: 0.5,
        audio_looping: true
      } as FocusSettings;
    }
    
    console.error('Error fetching focus settings:', error);
    throw error;
  }
  
  return data;
}

export async function updateFocusSettings(settings: Partial<FocusSettings>) {
  try {
    const user = supabase.auth.getUser();
    const userData = await user;
    const userId = userData.data.user?.id;

    console.log('Auth state:', {
      isAuthenticated: !!userId,
      userId: userId,
      userEmail: userData.data.user?.email,
    });

    if (!userId) {
      console.error('User not authenticated');
      throw new Error('User not authenticated. Please sign in to save settings.');
    }

    // Check if settings already exist
    try {
      const { data: existingSettings, error: fetchError } = await supabase
        .from('focus_settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      console.log('Fetch existing settings result:', { existingSettings, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing settings:', fetchError);
        console.error('Error details:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint
        });
        throw new Error(`Database error: ${fetchError.message || 'Could not fetch settings'}`);
      }

      if (existingSettings) {
        // Update existing settings
        console.log('Updating existing settings for user:', userId);
        try {
          const { data, error } = await supabase
            .from('focus_settings')
            .update({
              ...settings,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .select()
            .single();

          if (error) {
            console.error('Error updating focus settings:', error);
            console.error('Error details:', {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint
            });
            throw new Error(`Database error: ${error.message || 'Could not update settings'}`);
          }

          console.log('Successfully updated settings:', data);
          return data;
        } catch (updateError) {
          console.error('Exception during update operation:', updateError);
          throw updateError;
        }
      } else {
        // Create new settings
        console.log('Creating new focus settings for user:', userId);
        console.log('Settings to create:', { ...settings, user_id: userId });
        
        try {
          const { data, error } = await supabase
            .from('focus_settings')
            .insert({
              ...settings,
              user_id: userId
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating focus settings:', error);
            console.error('Error details:', {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint
            });
            throw new Error(`Database error: ${error.message || 'Could not create settings'}`);
          }

          console.log('Successfully created settings:', data);
          return data;
        } catch (insertError) {
          console.error('Exception during insert operation:', insertError);
          throw insertError;
        }
      }
    } catch (dbOperationError) {
      console.error('Database operation error:', dbOperationError);
      throw dbOperationError;
    }
  } catch (error) {
    console.error('Error in updateFocusSettings:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

// Update audio settings specifically
export async function updateAudioSettings(audioSettings: {
  sound_enabled?: boolean;
  audio_volume?: number;
  audio_looping?: boolean;
  last_ambient_sound?: string;
}) {
  try {
    return await updateFocusSettings(audioSettings);
  } catch (error) {
    console.error('Error updating audio settings:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update audio settings');
  }
}

// Focus Streaks
export async function getFocusStreak() {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('focus_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    // If no streak exists yet, return default streak
    if (error.code === 'PGRST116') {
      return {
        current_streak: 0,
        longest_streak: 0
      } as FocusStreak;
    }
    
    console.error('Error fetching focus streak:', error);
    throw error;
  }
  
  return data;
}

async function updateFocusStreak() {
  const user = supabase.auth.getUser();
  const userId = (await user).data.user?.id;
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  
  // Get current streak data
  const { data: streakData, error: streakError } = await supabase
    .from('focus_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  if (streakError && streakError.code !== 'PGRST116') {
    console.error('Error fetching focus streak:', streakError);
    throw streakError;
  }
  
  let currentStreak = 0;
  let longestStreak = 0;
  let lastFocusDate = null;
  
  if (streakData) {
    // Existing streak data
    currentStreak = streakData.current_streak;
    longestStreak = streakData.longest_streak;
    lastFocusDate = streakData.last_focus_date;
    
    // Check if this is a new day
    if (lastFocusDate !== today) {
      // Check if the last focus date was yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastFocusDate === yesterdayStr) {
        // Consecutive day, increment streak
        currentStreak += 1;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      } else {
        // Streak broken, reset to 1
        currentStreak = 1;
      }
    }
  } else {
    // First time, start with streak of 1
    currentStreak = 1;
    longestStreak = 1;
  }
  
  // Update or insert streak data
  if (streakData) {
    const { error: updateError } = await supabase
      .from('focus_streaks')
      .update({
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_focus_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating focus streak:', updateError);
      throw updateError;
    }
  } else {
    const { error: insertError } = await supabase
      .from('focus_streaks')
      .insert({
        user_id: userId,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_focus_date: today
      });
    
    if (insertError) {
      console.error('Error creating focus streak:', insertError);
      throw insertError;
    }
  }
  
  return { currentStreak, longestStreak };
} 