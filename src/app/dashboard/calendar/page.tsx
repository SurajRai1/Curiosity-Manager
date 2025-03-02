'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Calendar, RefreshCw, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { CalendarService } from '@/lib/services/CalendarService';
import { CalendarEvent } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import EventModal from '@/components/calendar/EventModal';
import { supabase } from '@/lib/supabase';

// Import our new components
import CalendarHeader from './components/CalendarHeader';
import EnergyLevelPrompt from './components/EnergyLevelPrompt';
import FiltersPanel from './components/FiltersPanel';
import MonthView from './components/MonthView';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import QuickTips from './components/QuickTips';

// Types
type EnergyLevel = 'high' | 'medium' | 'low';
type EventType = 'task' | 'appointment' | 'reminder' | 'break';
type FocusMode = 'default' | 'minimal' | 'structured';

export default function CalendarPage() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [userEnergyLevel, setUserEnergyLevel] = useState<EnergyLevel>('medium');
  const [showEnergyPrompt, setShowEnergyPrompt] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(['task', 'appointment', 'reminder', 'break']);
  const [focusMode, setFocusMode] = useState<FocusMode>('default');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Add a ref to track if we're already fetching
  const isFetchingRef = useRef(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        console.log('Supabase URL configured:', !!supabaseUrl);
        console.log('Supabase key configured:', !!supabaseKey);
        
        if (!supabaseUrl || !supabaseKey) {
          console.error('Supabase configuration is missing');
          setIsAuthenticated(false);
          toast({
            title: 'Configuration Error',
            description: 'The application is not properly configured. Please contact support.',
            variant: 'destructive',
          });
          return;
        }
        
        const { data: session } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.session?.user);
        console.log('Authentication check:', !!session?.session?.user ? 'Authenticated' : 'Not authenticated');
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []); // Remove toast from dependency array

  // Get current month and year
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // Log component rendering
  useEffect(() => {
    console.log('Calendar page rendered with view:', view);
    console.log('Current date:', currentDate.toISOString());
    console.log('Events count:', events.length);
    console.log('Is loading:', isLoading);
    console.log('Is authenticated:', isAuthenticated);
  }, [view, currentDate, events.length, isLoading, isAuthenticated]);
  
  // Navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Fetch events from the API
  useEffect(() => {
    // Skip if we're already fetching
    if (isFetchingRef.current) return;
    
    const fetchEvents = async () => {
      // Set the fetching flag to prevent multiple fetches
      isFetchingRef.current = true;
      console.log('Starting to fetch events...');
      setIsLoading(true);
      
      // If using mock data, skip the API call
      if (useMockData) {
        console.log('Using mock data, skipping API call');
        // Create mock events for the current view
        const mockEvents: CalendarEvent[] = [];
        let startDate, endDate;
        
        if (view === 'month') {
          // For month view, get the entire month
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
          startDate = new Date(year, month, 1);
          endDate = new Date(year, month + 1, 0);
        } else if (view === 'week') {
          // For week view, get the current week
          const curr = new Date(currentDate);
          const first = curr.getDate() - curr.getDay();
          const last = first + 6;
          
          startDate = new Date(new Date(curr).setDate(first));
          endDate = new Date(new Date(curr).setDate(last));
        } else {
          // For day view, just get the current day
          startDate = new Date(currentDate);
          endDate = new Date(currentDate);
        }
        
        // Generate dates between start and end
        const dates = [];
        const tempDate = new Date(startDate);
        while (tempDate <= endDate) {
          dates.push(new Date(tempDate));
          tempDate.setDate(tempDate.getDate() + 1);
        }
        
        // Add some random events for each date
        dates.forEach(date => {
          // Add events to about 1/2 of the days
          if (Math.random() < 0.5) {
            const dateString = date.toISOString().split('T')[0];
            
            // Add 1-3 events per day
            const numEvents = Math.floor(Math.random() * 3) + 1;
            for (let j = 0; j < numEvents; j++) {
              const eventTypes: EventType[] = ['task', 'appointment', 'reminder', 'break'];
              const energyLevels: EnergyLevel[] = ['low', 'medium', 'high'];
              
              mockEvents.push({
                id: `mock-${dateString}-${j}`,
                title: `Mock Event ${j + 1}`,
                type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
                date: dateString,
                time: Math.random() > 0.5 ? `${Math.floor(Math.random() * 12) + 8}:00` : undefined,
                energy_required: energyLevels[Math.floor(Math.random() * energyLevels.length)],
                is_completed: Math.random() > 0.7,
                is_urgent: Math.random() > 0.8,
                duration: Math.random() > 0.5 ? Math.floor(Math.random() * 60) + 15 : undefined,
                description: Math.random() > 0.5 ? 'This is a mock event description' : undefined
              });
            }
          }
        });
        
        console.log('Generated mock events:', mockEvents.length);
        setEvents(mockEvents);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }
      
      try {
        // Calculate date range based on view
        let startDate, endDate;
        
        if (view === 'month') {
          // For month view, get the entire month
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          startDate = new Date(year, month, 1).toISOString().split('T')[0];
          endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
        } else if (view === 'week') {
          // For week view, get the current week
          const curr = new Date(currentDate);
          const first = curr.getDate() - curr.getDay();
          const last = first + 6;
          
          startDate = new Date(curr.setDate(first)).toISOString().split('T')[0];
          endDate = new Date(new Date(curr).setDate(last)).toISOString().split('T')[0];
        } else {
          // For day view, just get the current day
          startDate = currentDate.toISOString().split('T')[0];
          endDate = startDate;
        }
        
        console.log(`Fetching events from ${startDate} to ${endDate}`);
        
        // Check if user is logged in
        const { data: session } = await supabase.auth.getSession();
        console.log('Auth session:', session?.session ? 'Exists' : 'Does not exist');
        
        try {
          const fetchedEvents = await CalendarService.getEvents(startDate, endDate);
          console.log('Events fetched successfully:', fetchedEvents.length);
          setEvents(fetchedEvents);
        } catch (authError) {
          console.error('Authentication error in CalendarService:', authError);
          
          // TEMPORARY: For testing, create some mock events if authentication fails
          console.log('Creating mock events for testing');
          const mockEvents: CalendarEvent[] = [
            {
              id: '1',
              title: 'Team Meeting',
              type: 'appointment',
              date: new Date().toISOString().split('T')[0],
              time: '10:00',
              energy_required: 'medium',
              is_completed: false,
              is_urgent: false,
              duration: 60,
              description: 'Weekly team sync'
            },
            {
              id: '2',
              title: 'Complete Project',
              type: 'task',
              date: new Date().toISOString().split('T')[0],
              energy_required: 'high',
              is_completed: false,
              is_urgent: true
            },
            {
              id: '3',
              title: 'Take a Break',
              type: 'break',
              date: new Date().toISOString().split('T')[0],
              time: '15:00',
              energy_required: 'low',
              duration: 15
            }
          ];
          setEvents(mockEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Error',
          description: 'Failed to load calendar events. Please try again.',
          variant: 'destructive',
        });
        setEvents([]);
      } finally {
        console.log('Setting isLoading to false');
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };
    
    fetchEvents();
    
    // Cleanup function
    return () => {
      // Reset the fetching flag if the component unmounts or dependencies change
      isFetchingRef.current = false;
    };
  }, [currentDate, view, useMockData]); // Remove toast from dependency array

  // Handle event updates
  const handleEventUpdated = (updatedEvent: CalendarEvent) => {
    setEvents(prevEvents => {
      const index = prevEvents.findIndex(e => e.id === updatedEvent.id);
      if (index !== -1) {
        const newEvents = [...prevEvents];
        newEvents[index] = updatedEvent;
        return newEvents;
      }
      return [...prevEvents, updatedEvent];
    });
    
    toast({
      title: 'Event Updated',
      description: 'Your calendar event has been updated successfully.',
    });
  };

  // Handle event deletion
  const handleEventDeleted = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
    
    toast({
      title: 'Event Deleted',
      description: 'Your calendar event has been deleted successfully.',
    });
  };

  // Function to load mock data
  const loadMockData = () => {
    setUseMockData(true);
    
    // Don't set isLoading here, let the useEffect handle it
    toast({
      title: 'Using Mock Data',
      description: 'Calendar is now showing mock data for demonstration purposes.',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Authentication Check */}
      {isAuthenticated === false && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="mb-4">You need to be logged in to view your calendar. Please log in to continue.</p>
          
                  <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
              onClick={loadMockData}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg flex items-center gap-2 hover:bg-neutral-200"
            >
              <Database className="w-4 h-4" />
              <span>Use Demo Data</span>
                        </motion.button>
                  </div>
                </div>
      )}
      
      {/* Calendar Header */}
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        view={view}
        setView={setView}
        goToPreviousMonth={goToPreviousMonth}
        goToNextMonth={goToNextMonth}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      {/* Energy Level Prompt */}
      <EnergyLevelPrompt
        userEnergyLevel={userEnergyLevel}
        setUserEnergyLevel={setUserEnergyLevel}
        showEnergyPrompt={showEnergyPrompt}
        setShowEnergyPrompt={setShowEnergyPrompt}
      />
      
      {/* Filters Panel */}
      <FiltersPanel
        showFilters={showFilters}
        selectedEventTypes={selectedEventTypes}
        setSelectedEventTypes={setSelectedEventTypes}
      />
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-neutral-600 mb-4">Loading your calendar events...</p>
          {isAuthenticated === false && (
            <p className="text-red-500 mt-2 mb-4">Authentication issue detected. Please log in.</p>
          )}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Only refresh if we're not already fetching
                if (isFetchingRef.current) return;
                
                // Force a refresh of the events
                setIsLoading(true);
                const fetchEvents = async () => {
                  isFetchingRef.current = true;
                  try {
                    // Check if user is logged in
                    const { data: session } = await supabase.auth.getSession();
                    console.log('Manual refresh - Auth session:', session?.session ? 'Exists' : 'Does not exist');
                    
                    // Calculate date range based on view
                    let startDate, endDate;
                    if (view === 'month') {
                      const year = currentDate.getFullYear();
                      const month = currentDate.getMonth();
                      startDate = new Date(year, month, 1).toISOString().split('T')[0];
                      endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
                    } else if (view === 'week') {
                      const curr = new Date(currentDate);
                      const first = curr.getDate() - curr.getDay();
                      const last = first + 6;
                      startDate = new Date(curr.setDate(first)).toISOString().split('T')[0];
                      endDate = new Date(new Date(curr).setDate(last)).toISOString().split('T')[0];
                    } else {
                      startDate = currentDate.toISOString().split('T')[0];
                      endDate = startDate;
                    }
                    
                    try {
                      const fetchedEvents = await CalendarService.getEvents(startDate, endDate);
                      setEvents(fetchedEvents);
                      toast({
                        title: 'Calendar Refreshed',
                        description: `Loaded ${fetchedEvents.length} events successfully.`,
                      });
                    } catch (authError) {
                      console.error('Authentication error in manual refresh:', authError);
                      // Use mock events for testing
                      const mockEvents: CalendarEvent[] = [
                        {
                          id: '1',
                          title: 'Team Meeting',
                          type: 'appointment',
                          date: new Date().toISOString().split('T')[0],
                          time: '10:00',
                          energy_required: 'medium',
                          is_completed: false,
                          is_urgent: false,
                          duration: 60,
                          description: 'Weekly team sync'
                        },
                        {
                          id: '2',
                          title: 'Complete Project',
                          type: 'task',
                          date: new Date().toISOString().split('T')[0],
                          energy_required: 'high',
                          is_completed: false,
                          is_urgent: true
                        }
                      ];
                      setEvents(mockEvents);
                      toast({
                        title: 'Using Demo Data',
                        description: 'Showing sample events for demonstration.',
                      });
                    }
                  } catch (error) {
                    console.error('Error in manual refresh:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to refresh calendar events. Please try again.',
                      variant: 'destructive',
                    });
                    setEvents([]);
                  } finally {
                    setIsLoading(false);
                    isFetchingRef.current = false;
                  }
                };
                
                fetchEvents();
              }}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg flex items-center gap-2 hover:bg-neutral-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Calendar</span>
                  </motion.button>
            
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
              onClick={loadMockData}
              className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg flex items-center gap-2 hover:bg-neutral-200"
            >
              <Database className="w-4 h-4" />
              <span>Use Demo Data</span>
                  </motion.button>
                </div>
        </div>
      ) : (
        <>
          {/* No Events Message */}
          {events.length === 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <h3 className="text-lg font-semibold">No Events Found</h3>
              </div>
              <p>
                You don't have any events for this time period. You can still use the calendar and add new events.
              </p>
            </div>
          )}
        
          {/* Calendar Views - Show regardless of whether there are events */}
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              selectedEventTypes={selectedEventTypes}
              userEnergyLevel={userEnergyLevel}
              focusMode={focusMode}
              events={events}
              onEventUpdated={handleEventUpdated}
              onEventDeleted={handleEventDeleted}
            />
          )}
          
          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              selectedEventTypes={selectedEventTypes}
              userEnergyLevel={userEnergyLevel}
              focusMode={focusMode}
              events={events}
              onEventUpdated={handleEventUpdated}
              onEventDeleted={handleEventDeleted}
            />
          )}
          
          {view === 'day' && (
            <DayView
              currentDate={currentDate}
              selectedEventTypes={selectedEventTypes}
              userEnergyLevel={userEnergyLevel}
              focusMode={focusMode}
              events={events}
              onEventUpdated={handleEventUpdated}
              onEventDeleted={handleEventDeleted}
            />
          )}
        </>
          )}
          
          {/* Quick Tips */}
      <div className="mt-8">
        <QuickTips />
      </div>
      
      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsEventModalOpen(true)}
        className="fixed bottom-8 right-8 p-4 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
      
      {/* Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        selectedDate={currentDate.toISOString().split('T')[0]}
        onEventSaved={(event) => {
          setIsEventModalOpen(false);
          handleEventUpdated(event);
        }}
      />
    </div>
  );
} 