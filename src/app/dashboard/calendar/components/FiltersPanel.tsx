'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, BellRing, Clock, Brain, X } from 'lucide-react';

type EventType = 'task' | 'appointment' | 'reminder' | 'break';

interface FiltersPanelProps {
  showFilters: boolean;
  selectedEventTypes: EventType[];
  setSelectedEventTypes: (types: EventType[]) => void;
}

export default function FiltersPanel({
  showFilters,
  selectedEventTypes,
  setSelectedEventTypes
}: FiltersPanelProps) {
  const toggleEventType = (type: EventType) => {
    if (selectedEventTypes.includes(type)) {
      setSelectedEventTypes(selectedEventTypes.filter(t => t !== type));
    } else {
      setSelectedEventTypes([...selectedEventTypes, type]);
    }
  };

  const getEventTypeDetails = (type: EventType) => {
    switch (type) {
      case 'task':
        return {
          icon: CheckCircle2,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          label: 'Tasks'
        };
      case 'appointment':
        return {
          icon: Clock,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          label: 'Appointments'
        };
      case 'reminder':
        return {
          icon: BellRing,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'Reminders'
        };
      case 'break':
        return {
          icon: Brain,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Breaks'
        };
    }
  };

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-6 overflow-hidden"
        >
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-neutral-900">Filter Events</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['task', 'appointment', 'reminder', 'break'] as const).map((type) => {
                const { icon: Icon, color, bgColor, borderColor, label } = getEventTypeDetails(type);
                const isSelected = selectedEventTypes.includes(type);
                
                return (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleEventType(type)}
                    className={`flex items-center gap-2 p-3 rounded-lg border ${
                      isSelected
                        ? `${bgColor} ${borderColor}`
                        : 'bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <div className={`p-1.5 rounded-full ${isSelected ? bgColor : 'bg-neutral-100'}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? color : 'text-neutral-500'}`} />
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-neutral-900' : 'text-neutral-500'}`}>
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 