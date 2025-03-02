'use client';

import { motion } from 'framer-motion';
import { Zap, Check } from 'lucide-react';

interface CustomizationStepProps {
  data: {
    theme?: string;
    layout?: string;
    notifications?: string[];
    goals?: string[];
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CustomizationStep({ data, onUpdate }: CustomizationStepProps) {
  const handleUpdatePreference = (category: string, value: string) => {
    onUpdate({
      ...data,
      [category]: value,
    });
  };

  const handleToggleNotification = (type: string) => {
    const currentNotifications = data.notifications || [];
    if (currentNotifications.includes(type)) {
      onUpdate({
        ...data,
        notifications: currentNotifications.filter(t => t !== type),
      });
    } else {
      onUpdate({
        ...data,
        notifications: [...currentNotifications, type],
      });
    }
  };

  const handleToggleGoal = (goal: string) => {
    const currentGoals = data.goals || [];
    if (currentGoals.includes(goal)) {
      onUpdate({
        ...data,
        goals: currentGoals.filter(g => g !== goal),
      });
    } else {
      onUpdate({
        ...data,
        goals: [...currentGoals, goal],
      });
    }
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-neutral-900"
        >
          Customize Your Experience
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-neutral-600 max-w-md mx-auto"
        >
          Set up your workspace to match your preferences
        </motion.p>
      </div>

      {/* Theme Selection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-neutral-900">Visual Theme</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleUpdatePreference('theme', theme.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                data.theme === theme.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-primary-200'
              }`}
            >
              {data.theme === theme.id && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <div className="aspect-video rounded-lg mb-3" style={{ background: theme.preview }} />
              <p className="text-sm font-medium text-neutral-900">{theme.name}</p>
              <p className="text-xs text-neutral-600">{theme.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Layout Preference */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-neutral-900">Layout Style</h3>
        <div className="grid grid-cols-2 gap-4">
          {layouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => handleUpdatePreference('layout', layout.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                data.layout === layout.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-primary-200'
              }`}
            >
              {data.layout === layout.id && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <layout.icon className="w-8 h-8 text-neutral-600 mb-3" />
              <p className="text-sm font-medium text-neutral-900">{layout.name}</p>
              <p className="text-xs text-neutral-600">{layout.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-neutral-900">Notifications & Reminders</h3>
        <div className="grid grid-cols-2 gap-4">
          {notificationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleToggleNotification(type.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                (data.notifications || []).includes(type.id)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-primary-200'
              }`}
            >
              {(data.notifications || []).includes(type.id) && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <type.icon className="w-6 h-6 text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-900">{type.name}</p>
              <p className="text-xs text-neutral-600">{type.description}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-neutral-900">Your Goals</h3>
        <div className="grid grid-cols-2 gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => handleToggleGoal(goal.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                (data.goals || []).includes(goal.id)
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-primary-200'
              }`}
            >
              {(data.goals || []).includes(goal.id) && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <goal.icon className="w-6 h-6 text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-900">{goal.name}</p>
              <p className="text-xs text-neutral-600">{goal.description}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const themes = [
  {
    id: 'calm',
    name: 'Calm & Focused',
    description: 'Soft, muted colors that help reduce visual overwhelm',
    preview: 'linear-gradient(to right, #E0F2FE, #F0F9FF)',
  },
  {
    id: 'energetic',
    name: 'Energetic & Bright',
    description: 'Vibrant colors that help maintain engagement',
    preview: 'linear-gradient(to right, #818CF8, #C084FC)',
  },
];

const layouts = [
  {
    id: 'visual',
    name: 'Visual Board',
    description: 'Card-based layout with drag-and-drop organization',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'list',
    name: 'Smart Lists',
    description: 'Traditional list view with enhanced organization',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
];

const notificationTypes = [
  {
    id: 'focus',
    name: 'Focus Time',
    description: "Get notified when it's time for deep work",
    icon: Zap,
  },
  {
    id: 'breaks',
    name: 'Break Reminders',
    description: "Regular reminders to take short breaks",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const goals = [
  {
    id: 'productivity',
    name: 'Boost Productivity',
    description: 'Complete tasks more efficiently',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'organization',
    name: 'Better Organization',
    description: 'Keep thoughts and tasks structured',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
]; 