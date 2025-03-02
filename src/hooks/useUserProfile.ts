import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  loading: boolean;
  error: Error | null;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) {
          setProfile({
            id: '',
            loading: false,
            error: new Error('User not authenticated')
          });
          return;
        }

        // Get profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Use data from auth if profile doesn't exist
        const userData = user.user_metadata || {};
        
        setProfile({
          id: user.id,
          first_name: profileData?.first_name || userData.first_name,
          last_name: profileData?.last_name || userData.last_name,
          email: profileData?.email || user.email,
          avatar_url: profileData?.avatar_url || userData.avatar_url,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch profile')
        }));
      }
    }

    fetchUserProfile();
  }, []);

  // Function to update profile
  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'loading' | 'error'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      setProfile(prev => ({
        ...prev,
        ...updates
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      };
    }
  };

  return {
    profile,
    updateProfile,
    isAuthenticated: !!profile.id && !profile.loading,
    fullName: profile.first_name && profile.last_name 
      ? `${profile.first_name} ${profile.last_name}`
      : profile.first_name || 'User'
  };
} 