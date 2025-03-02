'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Zap, Battery, AlertCircle, Save, Info, CheckCircle2, Type, AlarmClock, ChevronRight, CalendarDays, BellRing, Coffee } from 'lucide-react';
import { CalendarService, CreateCalendarEventData, UpdateCalendarEventData } from '@/lib/services/CalendarService';
import { CalendarEvent } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  onEventSaved?: (event: CalendarEvent) => void;
  selectedDate?: string; // ISO format date
}

export default function EventModal({ isOpen, onClose, event, onEventSaved, selectedDate }: EventModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateCalendarEventData>({
    title: '',
    type: 'task',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '',
    energyRequired: 'medium',
    isUrgent: false,
    duration: 30,
    description: '',
  });

  // Reset form when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      if (event) {
        setFormData({
          title: event.title,
          type: event.type,
          date: event.date,
          time: event.time || '',
          energyRequired: event.energy_required,
          isUrgent: event.is_urgent || false,
          isCompleted: event.is_completed || false,
          duration: event.duration || 30,
          description: event.description || '',
        });
      } else {
        setFormData({
          title: '',
          type: 'task',
          date: selectedDate || new Date().toISOString().split('T')[0],
          time: '',
          energyRequired: 'medium',
          isUrgent: false,
          duration: 30,
          description: '',
        });
      }
    }
  }, [isOpen, event, selectedDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let savedEvent: CalendarEvent;

      if (event?.id) {
        // Update existing event
        const updateData: UpdateCalendarEventData = { ...formData };
        savedEvent = await CalendarService.updateEvent(event.id, updateData);
        toast({
          title: 'Event updated',
          description: 'Your event has been updated successfully.',
        });
      } else {
        // Create new event
        savedEvent = await CalendarService.createEvent(formData);
        toast({
          title: 'Event created',
          description: 'Your event has been created successfully.',
        });
      }

      if (onEventSaved) {
        onEventSaved(savedEvent);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'There was an error saving your event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'appointment': return 'bg-purple-50 border-purple-200 text-purple-600';
      case 'reminder': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'break': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      default: return 'bg-neutral-50 border-neutral-200 text-neutral-600';
    }
  };

  // Get event type icon color
  const getEventTypeIconColor = (type: string) => {
    switch (type) {
      case 'task': return 'text-blue-500';
      case 'appointment': return 'text-purple-500';
      case 'reminder': return 'text-amber-500';
      case 'break': return 'text-emerald-500';
      default: return 'text-neutral-500';
    }
  };

  // Get event type icon
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="w-4 h-4" />;
      case 'appointment': return <CalendarDays className="w-4 h-4" />;
      case 'reminder': return <BellRing className="w-4 h-4" />;
      case 'break': return <Coffee className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  // Get energy level color
  const getEnergyLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'medium': return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-600';
      default: return 'bg-neutral-50 border-neutral-200 text-neutral-600';
    }
  };

  // Get energy level icon color
  const getEnergyLevelIconColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-blue-500';
      case 'high': return 'text-orange-500';
      default: return 'text-neutral-500';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden border border-neutral-100"
          >
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 text-white p-5">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute right-4 top-4 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
              
              <h2 className="text-xl font-bold">
                {event?.id ? 'Edit Event' : 'Add New Event'}
              </h2>
              
              {formData.date && (
                <p className="mt-1 text-white/80 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(formData.date)}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              {/* Title Input - Full Width with Icon */}
              <div className="mb-5">
                <div className="relative">
                  <div className="absolute left-3 top-3 text-neutral-400">
                    <Type className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-base font-medium border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400"
                    placeholder="Event title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Column */}
                <div className="space-y-5">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      Event Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'task', label: 'Task' },
                        { value: 'appointment', label: 'Appointment' },
                        { value: 'reminder', label: 'Reminder' },
                        { value: 'break', label: 'Break' }
                      ].map(({ value, label }) => (
                        <motion.label
                          key={value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                            formData.type === value
                              ? getEventTypeColor(value)
                              : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="type"
                            value={value}
                            checked={formData.type === value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`p-1 rounded-full ${
                            formData.type === value 
                              ? `bg-white/80` 
                              : 'bg-neutral-100'
                          }`}>
                            <div className={formData.type === value ? getEventTypeIconColor(value) : 'text-neutral-500'}>
                              {getEventTypeIcon(value)}
                            </div>
                          </div>
                          <span className="text-sm font-medium whitespace-nowrap">
                            {label}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      When
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-neutral-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900"
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-neutral-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900"
                        placeholder="Select time (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  {/* Energy Required */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      Energy Required
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'low', label: 'Low', icon: Battery },
                        { value: 'medium', label: 'Medium', icon: Battery },
                        { value: 'high', label: 'High', icon: Zap }
                      ].map(({ value, label, icon: Icon }) => (
                        <motion.label
                          key={value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex-1 flex items-center justify-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-all border ${
                            formData.energyRequired === value
                              ? getEnergyLevelColor(value)
                              : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="energyRequired"
                            value={value}
                            checked={formData.energyRequired === value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`p-1 rounded-full ${
                            formData.energyRequired === value 
                              ? `bg-white/80` 
                              : 'bg-neutral-100'
                          }`}>
                            <div className={formData.energyRequired === value ? getEnergyLevelIconColor(value) : 'text-neutral-500'}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <span className="text-sm font-medium">{label}</span>
                        </motion.label>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      Duration
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-2.5 text-neutral-400">
                        <AlarmClock className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration || ''}
                        onChange={handleChange}
                        min="1"
                        className="w-full pl-9 pr-16 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900"
                        placeholder="Duration"
                      />
                      <div className="absolute right-3 top-2.5 text-neutral-500 text-xs font-medium">
                        minutes
                      </div>
                    </div>
                  </div>

                  {/* Urgent Checkbox */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-all border ${
                      formData.isUrgent 
                        ? 'bg-red-50 border-red-200 text-red-600' 
                        : 'bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, isUrgent: !prev.isUrgent }))}
                  >
                    <div className={`p-1 rounded-full ${
                      formData.isUrgent 
                        ? 'bg-white/80' 
                        : 'bg-neutral-100'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${formData.isUrgent ? 'text-red-500' : 'text-neutral-500'}`} />
                    </div>
                    <label htmlFor="isUrgent" className="ml-2 text-sm font-medium cursor-pointer">
                      Mark as urgent
                    </label>
                    <input
                      type="checkbox"
                      id="isUrgent"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleCheckboxChange}
                      className="sr-only"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 bg-white text-neutral-900 placeholder-neutral-400"
                  placeholder="Add details about this event (optional)"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 text-sm font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1.5 text-sm font-medium shadow-sm transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : event?.id ? 'Update Event' : 'Create Event'}
                  {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 