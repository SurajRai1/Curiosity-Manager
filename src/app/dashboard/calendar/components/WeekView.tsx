'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Battery, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus,
  Sparkles,
  Brain
} from 'lucide-react';
import { CalendarEvent } from '@/lib/supabase';
import EventModal from '@/components/calendar/EventModal';
import EventDetails from '@/components/calendar/EventDetails';

type EventType = 'task' | 'appointment' | 'reminder' | 'break';
type EnergyLevel = 'high' | 'medium' | 'low';
type FocusMode = 'default' | 'minimal' | 'structured';

interface WeekViewProps {
  currentDate: Date;
  selectedEventTypes: EventType[];
  userEnergyLevel: EnergyLevel;
  focusMode: FocusMode;
  events: CalendarEvent[];
  onEventUpdated?: (event: CalendarEvent) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function WeekView({
  currentDate,
  selectedEventTypes,
  userEnergyLevel,
  focusMode,
  events,
  onEventUpdated,
  onEventDeleted
}: WeekViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [optimizeForEnergy, setOptimizeForEnergy] = useState(false);

  // Get the start and end of the week
  const getWeekDates = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(curr);
      day.setDate(first + i);
      weekDates.push(day);
    }
    
    return weekDates;
  };

  const formatWeekHeader = () => {
    const weekDates = getWeekDates();
    const firstDay = weekDates[0];
    const lastDay = weekDates[6];
    
    const firstMonth = firstDay.toLocaleString('default', { month: 'short' });
    const lastMonth = lastDay.toLocaleString('default', { month: 'short' });
    
    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDay.getDate()} - ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
    } else {
      return `${firstMonth} ${firstDay.getDate()} - ${lastMonth} ${lastDay.getDate()}, ${firstDay.getFullYear()}`;
    }
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    // You would need to update the currentDate in the parent component
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    // You would need to update the currentDate in the parent component
  };

  const getEventsForDay = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => 
      event.date === dateString && 
      selectedEventTypes.includes(event.type as EventType)
    ).sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const getEventTypeStyles = (type: EventType, isUrgent?: boolean) => {
    switch (type) {
      case 'task':
        return isUrgent 
          ? 'bg-red-200 border-2 border-red-400 text-red-800 shadow-sm' 
          : 'bg-blue-100 border-2 border-blue-400 text-blue-800 shadow-sm';
      case 'appointment':
        return 'bg-purple-100 border-2 border-purple-400 text-purple-800 shadow-sm';
      case 'reminder':
        return 'bg-amber-100 border-2 border-amber-400 text-amber-800 shadow-sm';
      case 'break':
        return 'bg-emerald-100 border-2 border-emerald-400 text-emerald-800 shadow-sm';
    }
  };

  const getEnergyLevelIcon = (level: EnergyLevel) => {
    switch (level) {
      case 'high':
        return <Zap className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <Battery className="w-4 h-4 text-blue-600" />;
      case 'low':
        return <Clock className="w-4 h-4 text-green-600" />;
    }
  };

  const handleAddEvent = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const weekDates = getWeekDates();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
      >
        {/* Week header */}
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPreviousWeek}
              className="p-1.5 rounded-full hover:bg-neutral-100"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </motion.button>
            
            <h2 className="text-lg font-semibold text-neutral-900">
              {formatWeekHeader()}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNextWeek}
              className="p-1.5 rounded-full hover:bg-neutral-100"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </motion.button>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOptimizeForEnergy(!optimizeForEnergy)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                optimizeForEnergy
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {optimizeForEnergy ? (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Balance Week</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Optimize for Energy</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
        
        {/* Week grid */}
        <div className="grid grid-cols-7 divide-x divide-neutral-200">
          {weekDates.map((date, index) => {
            const dayEvents = getEventsForDay(date);
            const dayName = date.toLocaleString('default', { weekday: 'short' });
            const dayNumber = date.getDate();
            
            return (
              <motion.div
                key={date.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`min-h-[300px] flex flex-col ${
                  isToday(date) ? 'bg-primary-50/20' : index >= 5 ? 'bg-neutral-50/30' : ''
                }`}
              >
                <div className="p-2 text-center border-b border-neutral-200 sticky top-0 bg-white">
                  <div className="font-medium text-neutral-700">{dayName}</div>
                  <div className={`text-xl ${isToday(date) ? 'text-primary-600 font-bold' : 'text-neutral-900'}`}>
                    {dayNumber}
                  </div>
                </div>
                
                <div className="flex-1 p-2 space-y-2">
                  {dayEvents.length > 0 ? (
                    <>
                      {/* Filter events based on energy level if optimizeForEnergy is true */}
                      {dayEvents
                        .filter(event => !optimizeForEnergy || event.energy_required === userEnergyLevel)
                        .map(event => (
                          <motion.button
                            key={event.id}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEventClick(event)}
                            className={`w-full text-left p-2 rounded-lg text-xs ${
                              getEventTypeStyles(event.type as EventType, event.is_urgent)
                            } ${
                              event.is_completed ? 'opacity-70 line-through' : ''
                            }`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {event.is_urgent && <AlertCircle className="w-3 h-3 text-red-600 flex-shrink-0" />}
                              {event.is_completed && <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />}
                              <span className="font-semibold truncate">{event.title}</span>
                              <div className="ml-auto flex-shrink-0">
                                {getEnergyLevelIcon(event.energy_required as EnergyLevel)}
                              </div>
                            </div>
                            
                            {event.time && (
                              <div className="text-xs font-medium opacity-90">{event.time}</div>
                            )}
                          </motion.button>
                        ))}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-sm text-neutral-400">No events</span>
                    </div>
                  )}
                </div>
                
                <div className="p-1 border-t border-neutral-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddEvent(date)}
                    className="w-full flex items-center justify-center gap-1 py-1 text-xs font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={selectedDate || undefined}
        onEventSaved={(event) => {
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