'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for the auth callback
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error during auth callback:', error.message);
          router.push('/login?error=auth-callback-error');
          return;
        }

        if (session) {
          try {
            // Check if this is a new user by looking for their profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('id, first_name, last_name, email')
              .eq('id', session.user.id)
              .single();

            if (profileError || !profile) {
              console.log('Creating new profile for user:', session.user.id);
              // If no profile exists, this is a new user - create profile and redirect to onboarding
              const { error: insertError } = await supabase
                .from('profiles')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    first_name: session.user.user_metadata?.first_name || '',
                    last_name: session.user.user_metadata?.last_name || '',
                    created_at: new Date().toISOString(),
                  },
                ])
                .select();

              if (insertError) {
                console.error('Error creating profile:', insertError);
                // Continue to onboarding even if profile creation fails
              }
              
              router.push('/onboarding');
            } else {
              // Existing user - redirect to dashboard
              router.push('/dashboard');
            }
          } catch (profileCheckError) {
            console.error('Error checking profile:', profileCheckError);
            // If we can't check the profile, assume new user and go to onboarding
            router.push('/onboarding');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/login?error=auth-callback-error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-neutral-900">Completing sign in...</h2>
        <p className="mt-2 text-neutral-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
} 