'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Battery, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus 
} from 'lucide-react';
import { CalendarEvent } from '@/lib/supabase';
import EventModal from '@/components/calendar/EventModal';
import EventDetails from '@/components/calendar/EventDetails';

type EventType = 'task' | 'appointment' | 'reminder' | 'break';
type EnergyLevel = 'high' | 'medium' | 'low';
type FocusMode = 'default' | 'minimal' | 'structured';

interface MonthViewProps {
  currentDate: Date;
  selectedEventTypes: EventType[];
  userEnergyLevel: EnergyLevel;
  focusMode: FocusMode;
  events: CalendarEvent[];
  onEventUpdated?: (event: CalendarEvent) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function MonthView({
  currentDate,
  selectedEventTypes,
  userEnergyLevel,
  focusMode,
  events,
  onEventUpdated,
  onEventDeleted
}: MonthViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate days for the month view
  const generateMonthDays = () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }
      
      return days;
    } catch (error) {
      console.error('Error generating month days:', error);
      setError('Failed to generate calendar days. Please try refreshing the page.');
      return [];
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => 
      event.date === dateString && 
      selectedEventTypes.includes(event.type as EventType)
    );
  };

  const getEventTypeStyles = (type: EventType, isUrgent?: boolean) => {
    switch (type) {
      case 'task':
        return isUrgent 
          ? 'bg-red-200 border border-red-400 text-red-800 shadow-sm' 
          : 'bg-blue-100 border border-blue-400 text-blue-800 shadow-sm';
      case 'appointment':
        return 'bg-purple-100 border border-purple-400 text-purple-800 shadow-sm';
      case 'reminder':
        return 'bg-amber-100 border border-amber-400 text-amber-800 shadow-sm';
      case 'break':
        return 'bg-emerald-100 border border-emerald-400 text-emerald-800 shadow-sm';
    }
  };

  const getEnergyLevelIcon = (level: EnergyLevel) => {
    switch (level) {
      case 'high':
        return <Zap className="w-3 h-3 text-orange-500" />;
      case 'medium':
        return <Battery className="w-3 h-3 text-blue-500" />;
      case 'low':
        return <Clock className="w-3 h-3 text-green-500" />;
    }
  };

  const handleAddEvent = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const days = generateMonthDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
      >
        {/* Days of the week header */}
        <div className="grid grid-cols-7 border-b border-neutral-200">
          {dayNames.map((day, index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`py-2 text-center text-sm font-medium ${
                index === 0 || index === 6 ? 'text-neutral-500 bg-neutral-50/70' : 'text-neutral-700'
              }`}
            >
              {day}
            </motion.div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {days.map((day, index) => (
            <motion.div
              key={`day-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`min-h-[100px] p-1 border-b border-r border-neutral-200 relative ${
                day === null ? 'bg-neutral-50/70' : '',
                (index % 7 === 0 || index % 7 === 6) && day !== null ? 'bg-neutral-50/30' : ''
              }`}
            >
              {day !== null && (
                <>
                  <div className="flex justify-between items-start p-1">
                    <span className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday(day) 
                        ? 'bg-primary-500 text-white' 
                        : 'text-neutral-700'
                    }`}>
                      {day}
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAddEvent(day)}
                      className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {getEventsForDay(day).map((event) => {
                      // Skip events that don't match energy level in focus mode
                      if (focusMode === 'structured' && event.energy_required !== userEnergyLevel) {
                        return null;
                      }
                      
                      return (
                        <motion.button
                          key={event.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEventClick(event)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium truncate flex items-center gap-1 ${
                            getEventTypeStyles(event.type as EventType, event.is_urgent)
                          } ${
                            event.is_completed ? 'opacity-70 line-through' : ''
                          }`}
                        >
                          {event.is_urgent && <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0" />}
                          {event.is_completed && <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />}
                          <span className="truncate font-semibold">{event.title}</span>
                          <div className="ml-auto flex-shrink-0">
                            {getEnergyLevelIcon(event.energy_required as EnergyLevel)}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDate || undefined}
        onEventSaved={(event) => {
          // Handle event saved
          setIsEventModalOpen(false);
          if (onEventUpdated) {
            onEventUpdated(event);
          }
        }}
      />

      {/* Event Details */}
      {selectedEvent && (
        <EventDetails
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          event={selectedEvent}
          onEventUpdated={(event) => {
            if (onEventUpdated) {
              onEventUpdated(event);
            }
          }}
          onEventDeleted={(eventId) => {
            if (onEventDeleted) {
              onEventDeleted(eventId);
            }
          }}
        />
      )}
    </>
  );
} 