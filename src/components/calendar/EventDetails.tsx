'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Zap, 
  Battery, 
  AlertCircle, 
  Edit, 
  Trash2, 
  CheckCircle2 
} from 'lucide-react';
import { CalendarEvent } from '@/lib/supabase';
import { CalendarService } from '@/lib/services/CalendarService';
import { useToast } from '@/components/ui/use-toast';
import EventModal from './EventModal';

interface EventDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent;
  onEventUpdated?: (event: CalendarEvent) => void;
  onEventDeleted?: (eventId: string) => void;
}

export default function EventDetails({ 
  isOpen, 
  onClose, 
  event, 
  onEventUpdated, 
  onEventDeleted 
}: EventDetailsProps) {
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(true);
      try {
        await CalendarService.deleteEvent(event.id!);
        toast({
          title: 'Event deleted',
          description: 'Your event has been deleted successfully.',
        });
        if (onEventDeleted) {
          onEventDeleted(event.id!);
        }
        onClose();
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: 'Error',
          description: 'There was an error deleting your event. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleToggleCompletion = async () => {
    setIsTogglingCompletion(true);
    try {
      const updatedEvent = await CalendarService.toggleEventCompletion(event.id!);
      toast({
        title: updatedEvent.is_completed ? 'Event completed' : 'Event reopened',
        description: updatedEvent.is_completed 
          ? 'Your event has been marked as completed.' 
          : 'Your event has been reopened.',
      });
      if (onEventUpdated) {
        onEventUpdated(updatedEvent);
      }
    } catch (error) {
      console.error('Error toggling event completion:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating your event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsTogglingCompletion(false);
    }
  };

  const getEnergyIcon = () => {
    switch (event.energy_required) {
      case 'high':
        return <Zap className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Battery className="w-5 h-5 text-blue-500" />;
      case 'low':
        return <Clock className="w-5 h-5 text-green-500" />;
    }
  };

  const getEventTypeColor = () => {
    switch (event.type) {
      case 'task':
        return event.is_urgent 
          ? 'bg-red-100 text-red-700 border-red-200' 
          : 'bg-blue-50 text-blue-700 border-blue-200';
      case 'appointment':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'reminder':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'break':
        return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getEventTypeColor()}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {/* Title */}
                  <div className="flex items-start gap-2">
                    <h2 className="text-xl font-semibold text-neutral-900 flex-1">
                      {event.title}
                    </h2>
                    {event.is_urgent && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          duration: 1.5 
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium"
                      >
                        <AlertCircle className="w-3 h-3" />
                        <span>Urgent</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center gap-3 text-neutral-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <span>{event.time}</span>
                      </div>
                    )}
                  </div>

                  {/* Energy Required */}
                  <div className="flex items-center gap-2 text-neutral-700">
                    {getEnergyIcon()}
                    <span className="capitalize">{event.energy_required} energy required</span>
                  </div>

                  {/* Duration */}
                  {event.duration && (
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span>{event.duration} minutes</span>
                    </div>
                  )}

                  {/* Description */}
                  {event.description && (
                    <div className="mt-4 p-3 bg-neutral-50 rounded-lg text-neutral-700">
                      <p>{event.description}</p>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      event.is_completed 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {event.is_completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>In Progress</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </motion.button>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleToggleCompletion}
                      className={`px-3 py-2 rounded-lg flex items-center gap-1.5 ${
                        event.is_completed
                          ? 'border border-blue-300 text-blue-600 hover:bg-blue-50'
                          : 'border border-green-300 text-green-600 hover:bg-green-50'
                      }`}
                      disabled={isTogglingCompletion}
                    >
                      {event.is_completed ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Reopen</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete</span>
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1.5"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
        onEventSaved={(updatedEvent) => {
          if (onEventUpdated) {
            onEventUpdated(updatedEvent);
          }
        }}
      />
    </>
  );
} 