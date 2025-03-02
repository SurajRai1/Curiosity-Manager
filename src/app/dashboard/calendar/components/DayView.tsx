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
  Eye,
  EyeOff
} from 'lucide-react';
import { CalendarEvent } from '@/lib/supabase';
import EventModal from '@/components/calendar/EventModal';
import EventDetails from '@/components/calendar/EventDetails';

type EventType = 'task' | 'appointment' | 'reminder' | 'break';
type EnergyLevel = 'high' | 'medium' | 'low';
type FocusMode = 'default' | 'minimal' | 'structured';

interface DayViewProps {
  currentDate: Date;
  selectedEventTypes: EventType[];
  userEnergyLevel: EnergyLevel;
  focusMode: FocusMode;
  events: CalendarEvent[];
  onEventUpdated?: (event: CalendarEvent) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function DayView({
  currentDate,
  selectedEventTypes,
  userEnergyLevel,
  focusMode,
  events,
  onEventUpdated,
  onEventDeleted
}: DayViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [hidePastEvents, setHidePastEvents] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    // You would need to update the currentDate in the parent component
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    // You would need to update the currentDate in the parent component
  };

  const getEventsForDay = () => {
    const dateString = currentDate.toISOString().split('T')[0];
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

  const handleAddEvent = () => {
    const dateString = currentDate.toISOString().split('T')[0];
    setIsEventModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
  const dayEvents = getEventsForDay();
  const currentHour = new Date().getHours();
  const isToday = 
    currentDate.getDate() === new Date().getDate() &&
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden"
      >
        {/* Day header */}
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPreviousDay}
              className="p-1.5 rounded-full hover:bg-neutral-100"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700" />
            </motion.button>
            
            <h2 className="text-lg font-semibold text-neutral-900">
              {formatDate(currentDate)}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNextDay}
              className="p-1.5 rounded-full hover:bg-neutral-100"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700" />
            </motion.button>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHidePastEvents(!hidePastEvents)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                hidePastEvents
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
              }`}
            >
              {hidePastEvents ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Show All</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Focus Mode</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddEvent}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </motion.button>
          </div>
        </div>
        
        {/* Time slots */}
        <div className="flex flex-col divide-y divide-neutral-200">
          {timeSlots.map((hour, index) => {
            const isPast = isToday && hour < currentHour;
            if (hidePastEvents && isPast) return null;
            
            const hourEvents = dayEvents.filter(event => {
              if (!event.time) return false;
              const eventHour = parseInt(event.time.split(':')[0]);
              return eventHour === hour;
            });
            
            return (
              <motion.div
                key={hour}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`flex min-h-[80px] ${isPast ? 'bg-neutral-50/70' : ''}`}
              >
                <div className="w-20 p-2 flex flex-col items-center justify-center border-r border-neutral-200">
                  <span className="text-sm font-medium text-neutral-700">
                    {hour % 12 || 12} {hour >= 12 ? 'PM' : 'AM'}
                  </span>
                </div>
                
                <div className="flex-1 p-2 relative">
                  {hourEvents.length > 0 ? (
                    <div className="space-y-2">
                      {hourEvents.map(event => (
                        <motion.button
                          key={event.id}
                          whileHover={{ scale: 1.01, x: 3 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleEventClick(event)}
                          className={`w-full text-left p-3 rounded-lg ${
                            getEventTypeStyles(event.type as EventType, event.is_urgent)
                          } ${
                            event.is_completed ? 'opacity-70 line-through' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{event.title}</span>
                            {event.is_urgent && <AlertCircle className="w-4 h-4 text-red-600" />}
                            {event.is_completed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                            <div className="ml-auto">
                              {getEnergyLevelIcon(event.energy_required as EnergyLevel)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs">
                            <span>{event.time}</span>
                            {event.duration && <span>{event.duration} min</span>}
                          </div>
                          
                          {event.description && (
                            <p className="mt-1 text-sm opacity-80 line-clamp-2">{event.description}</p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-sm text-neutral-400">No events</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Current time indicator */}
        {isToday && (
          <div 
            className="absolute left-0 right-0 border-t-2 border-primary-500 z-10"
            style={{ 
              top: `calc(${(currentHour - 8) * 80}px + ${(new Date().getMinutes() / 60) * 80}px)` 
            }}
          >
            <div className="absolute -top-2 -left-1 w-4 h-4 rounded-full bg-primary-500"></div>
          </div>
        )}
      </motion.div>

      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={currentDate.toISOString().split('T')[0]}
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