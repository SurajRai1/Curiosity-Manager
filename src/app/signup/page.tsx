'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Github, Sparkles, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update password validation in real-time
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const isPasswordValid = () => {
    return Object.values(passwordValidation).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isPasswordValid()) {
      setError('Please meet all password requirements');
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Update profile in custom table if needed
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: signUpData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
            },
          ]);

        if (profileError) throw profileError;

        // Redirect to onboarding instead of dashboard
        router.push('/onboarding');
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred with GitHub signup');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred with Google signup');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link 
          href="/"
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </Link>
        <Link 
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Curiosity Manager
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Form Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center px-3 py-1 space-x-2 bg-white rounded-full shadow-md">
                <span className="px-2 py-0.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
                  FREE
                </span>
                <span className="text-sm font-medium text-neutral-600">
                  14-day trial, no credit card required
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Create your account
            </h1>
            <p className="mt-2 text-neutral-600">
              Start managing your ADHD superpowers today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Social Signup */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleGithubSignUp}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <Github className="w-5 h-5" />
              Continue with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-neutral-50 text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700">Password requirements:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { text: 'At least 8 characters', valid: passwordValidation.minLength },
                  { text: 'One uppercase letter', valid: passwordValidation.hasUpperCase },
                  { text: 'One number', valid: passwordValidation.hasNumber },
                  { text: 'One special character', valid: passwordValidation.hasSpecialChar },
                ].map((requirement) => (
                  <div key={requirement.text} className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle className={`w-4 h-4 ${requirement.valid ? 'text-primary-500' : 'text-neutral-300'}`} />
                    {requirement.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 transition-colors duration-200"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-neutral-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid()}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 