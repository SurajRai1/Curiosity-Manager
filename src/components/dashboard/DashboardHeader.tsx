'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bell,
  Plus,
  Search,
  Zap,
  Battery,
  BatteryMedium,
  BatteryLow,
  X,
  Sparkles,
  MenuSquare,
  Star,
  Flame
} from 'lucide-react';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { TaskService, CreateTaskData, Task } from '@/lib/services/TaskService';

interface DashboardHeaderProps {
  onTaskCreated?: (task: Task) => void;
}

export function DashboardHeader({ onTaskCreated }: DashboardHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentEnergyLevel, setCurrentEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  const [highlightEnergy, setHighlightEnergy] = useState(false);
  const [isEnergyDropdownOpen, setIsEnergyDropdownOpen] = useState(false);
  
  // Refs for dropdown containers
  const notificationsRef = useRef<HTMLDivElement>(null);
  const energyDropdownRef = useRef<HTMLDivElement>(null);

  // Pulse energy button when idle for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlightEnergy(true);
      setTimeout(() => setHighlightEnergy(false), 2000);
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [currentEnergyLevel]);

  const energyLevels = {
    high: {
      icon: Flame,
      label: 'High Energy',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      description: 'Ready for challenging tasks',
      emoji: '🔥'
    },
    medium: {
      icon: Zap,
      label: 'Medium Energy',
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      description: 'Balanced productivity mode',
      emoji: '⚡'
    },
    low: {
      icon: BatteryLow,
      label: 'Low Energy',
      color: 'text-green-500',
      bg: 'bg-green-50',
      border: 'border-green-200',
      description: 'Focus on gentle, easy tasks',
      emoji: '🧘'
    },
  };

  const currentEnergy = energyLevels[currentEnergyLevel];

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      const task = await TaskService.createTask(taskData);
      console.log('Task created:', task);
      
      // Show visual confirmation
      setNotificationCount(prev => prev + 1);
      
      // Notify parent component
      if (onTaskCreated) {
        onTaskCreated(task);
      }
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      // TODO: Show error notification
      throw error;
    }
  };
  
  const fakeNotifications = [
    { id: 1, title: "New badge unlocked!", icon: Star, color: "text-yellow-500", time: "Just now" },
    { id: 2, title: "Task 'Review project plan' is due soon", icon: Flame, color: "text-orange-500", time: "1 hour ago" }
  ];

  // Use useCallback to prevent unnecessary re-renders
  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsSearchOpen(false);
  }, []);

  const handleAddTaskClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsCreateTaskOpen(true);
  }, []);

  const handleNotificationsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setIsNotificationsOpen(prev => !prev);
    // Close other dropdowns
    setIsEnergyDropdownOpen(false);
  }, []);

  const handleEnergyClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setIsEnergyDropdownOpen(prev => !prev);
    // Close other dropdowns
    setIsNotificationsOpen(false);
  }, []);

  const handleEnergyLevelSelect = useCallback((level: 'high' | 'medium' | 'low', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentEnergyLevel(level);
    setIsEnergyDropdownOpen(false);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside notifications dropdown
      if (
        isNotificationsOpen && 
        notificationsRef.current && 
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      
      // Check if click is outside energy dropdown
      if (
        isEnergyDropdownOpen && 
        energyDropdownRef.current && 
        !energyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsEnergyDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen, isEnergyDropdownOpen]);

  return (
    <>
      <motion.header 
        className="sticky top-0 z-30 backdrop-blur-md border-b border-neutral-200 shadow-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 sm:px-6 lg:px-8 bg-white/80 bg-opacity-90">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <div className="relative max-w-md">
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, width: "100%" }}
                      animate={{ opacity: 1, scale: 1, width: "100%" }}
                      exit={{ opacity: 0, scale: 0.95, width: "100%" }}
                      className="relative"
                      key="open-search"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="search"
                        placeholder="Search tasks, projects, or notes..."
                        className="w-full pl-10 pr-12 py-2 rounded-lg border border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white transition-all duration-300"
                        autoFocus
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <button
                        onClick={handleSearchClose}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <X className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleSearchClick}
                      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
                      key="closed-search"
                    >
                      <Search className="w-5 h-5" />
                      <span className="hidden sm:inline">Search anything...</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Energy Level Selector */}
              <div className="relative" ref={energyDropdownRef}>
                <button
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-all duration-200',
                    currentEnergy.bg,
                    currentEnergy.border,
                    currentEnergy.color
                  )}
                  onClick={handleEnergyClick}
                >
                  <div>
                    <currentEnergy.icon className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:inline">{currentEnergy.label}</span>
                </button>

                {/* Energy Level Dropdown */}
                {isEnergyDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-56 py-2 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Current Energy Level</h3>
                    </div>
                    {Object.entries(energyLevels).map(([level, data]) => (
                      <button
                        key={level}
                        onClick={(e) => handleEnergyLevelSelect(level as 'high' | 'medium' | 'low', e)}
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-neutral-50 transition-colors',
                          level === currentEnergyLevel ? `${data.color} ${data.bg}` : 'text-neutral-600'
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <data.icon className="w-4 h-4" />
                          <div className="text-left">
                            <div className="font-medium">{data.label}</div>
                            <div className="text-xs text-neutral-500">{data.description}</div>
                          </div>
                        </div>
                        <div className="text-xl">{data.emoji}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Add Button */}
              <button
                onClick={handleAddTaskClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm hover:shadow"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  onClick={handleNotificationsClick}
                >
                  <Bell className="w-5 h-5 text-neutral-600" />
                  {notificationCount > 0 && (
                    <div
                      className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-medium px-1.5"
                    >
                      {notificationCount}
                    </div>
                  )}
                </button>
                
                {/* Notifications Panel */}
                {isNotificationsOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-200 z-50"
                  >
                    <div className="p-3 border-b border-neutral-100 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <button 
                        className="text-xs text-primary-600 hover:text-primary-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNotificationCount(0);
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {fakeNotifications.map(notification => (
                        <div 
                          key={notification.id}
                          className="p-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <div className={`mt-0.5 rounded-full p-2 ${notification.color} bg-opacity-10`}>
                              <notification.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{notification.title}</p>
                              <p className="text-xs text-neutral-500">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 text-center">
                      <button 
                        className="text-sm text-primary-600 hover:text-primary-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <CreateTaskDialog
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </>
  );
} 