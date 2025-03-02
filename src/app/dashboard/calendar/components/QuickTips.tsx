'use client';

import { motion } from 'framer-motion';
import { Brain, Timer, Sparkles, ChevronRight } from 'lucide-react';

export default function QuickTips() {
  const tips = [
    {
      id: 'energy-planning',
      title: 'Energy-Based Planning',
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      description: 'Match tasks to your energy levels throughout the day'
    },
    {
      id: 'time-blocks',
      title: 'Time Blocks',
      icon: Timer,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      description: 'Break your day into focused blocks with breaks in between'
    },
    {
      id: 'visual-progress',
      title: 'Visual Progress',
      icon: Sparkles,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      description: 'Use visual cues to track your progress and stay motivated'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-6 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">ADHD-Friendly Tips</h3>
        <motion.button
          whileHover={{ scale: 1.05, x: 3 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          View all tips
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tips.map((tip) => {
          const { id, title, icon: Icon, color, bgColor, description } = tip;
          return (
            <motion.div
              key={id}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${bgColor}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 mb-1">{title}</h4>
                  <p className="text-sm text-neutral-600">{description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
} 