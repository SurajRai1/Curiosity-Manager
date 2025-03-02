'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiEdit2,
  FiSave,
  FiX,
  FiAlertCircle,
  FiLogOut,
  FiCheck
} from 'react-icons/fi';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, isAuthenticated } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Auto-save warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Redirect if not authenticated
  if (!isAuthenticated && !profile.loading) {
    router.push('/login');
    return null;
  }

  // Show loading state with reduced motion
  if (profile.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <div className="animate-pulse flex space-x-4 mb-6 justify-center">
            <div className="rounded-full bg-blue-200 h-12 w-12"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-700">Loading your profile...</h3>
          <p className="text-gray-500 mt-2">This will only take a moment</p>
        </div>
      </div>
    );
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || ''
      });
    } else if (hasUnsavedChanges) {
      // Confirm before discarding changes
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setIsEditing(false);
        setHasUnsavedChanges(false);
      }
      return;
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const toastId = toast.loading('Saving your changes...');
    
    try {
      const { success, error } = await updateProfile(formData);
      
      if (!success) {
        throw new Error(error as string);
      }
      
      toast.success('Your profile has been updated!', { 
        id: toastId,
        duration: 3000,
        icon: '✅'
      });
      setIsEditing(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Could not update your profile', 
        { 
          id: toastId,
          duration: 5000,
          icon: '❌'
        }
      );
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading('Logging out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully', { id: toastId });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error(
        'Failed to log out. Please try again.',
        { id: toastId }
      );
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiUser className="mr-2 text-blue-500" />
                Personal Information
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEditToggle}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Edit profile"
                >
                  <FiEdit2 className="mr-1.5 h-4 w-4 text-gray-500" />
                  Edit
                </button>
              )}
            </div>

            {/* Card Content */}
            <div className="px-6 py-5">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          placeholder="Your first name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                        disabled
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiAlertCircle className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiX className="mr-2 -ml-1 h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiSave className="mr-2 -ml-1 h-4 w-4" />
                      Save Changes
                    </button>
                  </div>

                  {/* Unsaved Changes Warning */}
                  {hasUnsavedChanges && (
                    <div className="mt-3 flex items-center justify-center text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
                      <FiAlertCircle className="mr-2 h-4 w-4" />
                      You have unsaved changes
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-y-5 gap-x-6 sm:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Name
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900">
                        {profile.first_name || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Name
                      </h3>
                      <p className="mt-1 text-base font-medium text-gray-900">
                        {profile.last_name || 'Not set'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </h3>
                    <p className="mt-1 text-base font-medium text-gray-900 flex items-center">
                      <FiMail className="mr-2 text-gray-400" />
                      {profile.email || 'Not set'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiAlertCircle className="mr-2 text-blue-500" />
                Account Security
              </h2>
            </div>
            <div className="px-6 py-5">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    For security reasons, we don't display your password. You can reset it if needed.
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => router.push('/reset-password')}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FiLogOut className="mr-2 text-blue-500" />
                Session
              </h2>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-500 mb-4">
                Sign out from your current session on this device.
              </p>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </>
                ) : (
                  <>
                    <FiLogOut className="mr-2 -ml-1 h-5 w-5" />
                    Log out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 