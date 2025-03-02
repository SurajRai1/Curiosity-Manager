'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Calendar, Clock, CheckSquare, Tag, Filter, RefreshCw } from 'lucide-react';

interface FilterPanelProps {
  onClose: () => void;
}

export default function FilterPanel({ onClose }: FilterPanelProps) {
  // Filter states
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z' | 'z-a' | 'progress'>('newest');
  const [progressFilter, setProgressFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
  const [taskCountFilter, setTaskCountFilter] = useState<'any' | 'none' | 'few' | 'many'>('any');
  const [timeRangeFilter, setTimeRangeFilter] = useState<'any' | 'today' | 'week' | 'month' | 'older'>('any');
  
  // Reset all filters
  const resetFilters = () => {
    setSortBy('newest');
    setProgressFilter('all');
    setTaskCountFilter('any');
    setTimeRangeFilter('any');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden h-full"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-200 flex justify-between items-center">
        <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
          <Filter className="h-5 w-5 text-neutral-500" />
          Filters
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Filter options */}
      <div className="p-5 space-y-6">
        {/* Sort options */}
        <div>
          <h4 className="font-medium text-sm text-neutral-700 mb-3">Sort Projects</h4>
          <div className="space-y-2">
            {[
              { value: 'newest', label: 'Newest first' },
              { value: 'oldest', label: 'Oldest first' },
              { value: 'a-z', label: 'Name (A-Z)' },
              { value: 'z-a', label: 'Name (Z-A)' },
              { value: 'progress', label: 'Progress' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm ${
                  sortBy === option.value
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {option.label}
                {sortBy === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-px bg-neutral-200" aria-hidden="true"></div>
        
        {/* Progress filter */}
        <div>
          <h4 className="font-medium text-sm text-neutral-700 mb-3">Progress</h4>
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All projects' },
              { value: 'not-started', label: 'Not started (0%)' },
              { value: 'in-progress', label: 'In progress (1-99%)' },
              { value: 'completed', label: 'Completed (100%)' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setProgressFilter(option.value as any)}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm ${
                  progressFilter === option.value
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {option.label}
                {progressFilter === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-px bg-neutral-200" aria-hidden="true"></div>
        
        {/* Task count filter */}
        <div>
          <h4 className="font-medium text-sm text-neutral-700 mb-3">Tasks</h4>
          <div className="space-y-2">
            {[
              { value: 'any', label: 'Any number of tasks' },
              { value: 'none', label: 'No tasks' },
              { value: 'few', label: '1-5 tasks' },
              { value: 'many', label: '6+ tasks' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTaskCountFilter(option.value as any)}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm ${
                  taskCountFilter === option.value
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {option.label}
                {taskCountFilter === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-px bg-neutral-200" aria-hidden="true"></div>
        
        {/* Time filter */}
        <div>
          <h4 className="font-medium text-sm text-neutral-700 mb-3">Time Range</h4>
          <div className="space-y-2">
            {[
              { value: 'any', label: 'Any time' },
              { value: 'today', label: 'Created today' },
              { value: 'week', label: 'Created this week' },
              { value: 'month', label: 'Created this month' },
              { value: 'older', label: 'Older' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRangeFilter(option.value as any)}
                className={`w-full px-3 py-2 rounded-lg flex items-center justify-between text-sm ${
                  timeRangeFilter === option.value
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {option.label}
                {timeRangeFilter === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer with reset button */}
      <div className="px-5 py-4 border-t border-neutral-200">
        <button
          onClick={resetFilters}
          className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Reset All Filters
        </button>
      </div>
    </motion.div>
  );
} 