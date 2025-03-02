'use client';

import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

interface FinalStepProps {
  data: {
    workStyle: string[];
    adhdTraits: string[];
    preferences: {
      theme?: string;
      layout?: string;
      notifications?: string[];
      goals?: string[];
    };
  };
  onComplete: () => void;
  onBack: () => void;
}

export default function FinalStep({ data, onComplete }: FinalStepProps) {
  return (
    <div className="space-y-8 pb-24">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
            <Clock className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-neutral-900"
        >
          You're All Set!
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-neutral-600 max-w-md mx-auto"
        >
          We've personalized your workspace based on your preferences
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        {/* ADHD Profile Summary */}
        <div className="p-6 rounded-xl bg-white border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your ADHD Profile</h3>
          <div className="flex flex-wrap gap-2">
            {data.adhdTraits.map((trait) => (
              <span
                key={trait}
                className="px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 text-sm font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Work Style Summary */}
        <div className="p-6 rounded-xl bg-white border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Work Style</h3>
          <div className="flex flex-wrap gap-2">
            {data.workStyle.map((style) => (
              <span
                key={style}
                className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        {/* Preferences Summary */}
        <div className="p-6 rounded-xl bg-white border border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Your Preferences</h3>
          <div className="space-y-4">
            {data.preferences.theme && (
              <div>
                <p className="text-sm font-medium text-neutral-600">Theme</p>
                <p className="text-neutral-900 capitalize">{data.preferences.theme}</p>
              </div>
            )}
            {data.preferences.layout && (
              <div>
                <p className="text-sm font-medium text-neutral-600">Layout</p>
                <p className="text-neutral-900 capitalize">{data.preferences.layout}</p>
              </div>
            )}
            {data.preferences.notifications && data.preferences.notifications.length > 0 && (
              <div>
                <p className="text-sm font-medium text-neutral-600">Notifications</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.preferences.notifications.map((notification) => (
                    <span
                      key={notification}
                      className="px-2 py-1 rounded-full bg-neutral-100 text-neutral-700 text-sm"
                    >
                      {notification}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-6"
      >
        <div className="space-y-2">
          <p className="text-lg text-neutral-600">
            Your workspace is ready! Let's start managing your tasks and projects.
          </p>
          <p className="text-sm text-neutral-500">
            You can always adjust these settings later in your preferences
          </p>
        </div>

        <button
          onClick={onComplete}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
} 