'use client';

import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: number;
  view: 'day' | 'week' | 'month';
  setView: (view: 'day' | 'week' | 'month') => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export default function CalendarHeader({
  currentMonth,
  currentYear,
  view,
  setView,
  goToPreviousMonth,
  goToNextMonth,
  showFilters,
  setShowFilters
}: CalendarHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4"
    >
      {/* Calendar Title and Navigation */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <CalendarIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">
            {currentMonth} {currentYear}
          </h1>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPreviousMonth}
              className="p-1.5 rounded-full hover:bg-neutral-100"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNextMonth}
              className="p-1.5 rounded-full hover:bg-neutral-100"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* View Controls and Filters */}
      <div className="flex items-center gap-3">
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          {(['day', 'week', 'month'] as const).map((viewType) => (
            <motion.button
              key={viewType}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(viewType)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === viewType
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </motion.button>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters
              ? 'bg-primary-100 text-primary-600'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Filter className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
} 