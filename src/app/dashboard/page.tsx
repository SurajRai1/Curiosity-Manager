'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Zap,
  Brain,
  Calendar,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Check,
} from 'lucide-react';
import { SimpleActivityChart } from '@/components/dashboard/SimpleActivityChart';
import { TaskList } from '@/components/tasks/TaskList';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { TaskProgress } from '@/components/dashboard/TaskProgress';
import { TaskService, Task as TaskType } from '@/lib/services/TaskService';

export default function DashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [tasks, setTasks] = useState<TaskType[]>([
    // Sample tasks for better initial experience
    {
      id: '1',
      title: 'Review project proposal',
      status: 'done',
      priority: 'high',
      energyLevel: 'medium',
      isQuickWin: false,
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'sample',
    },
    {
      id: '2',
      title: 'Team meeting prep',
      status: 'todo',
      priority: 'medium',
      energyLevel: 'high',
      isQuickWin: true,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'sample',
    },
    {
      id: '3',
      title: 'Update documentation',
      status: 'in-progress',
      priority: 'low',
      energyLevel: 'low',
      isQuickWin: false,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 'sample',
    }
  ]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false); // Start with false since we have initial data
  const [taskError, setTaskError] = useState<string | null>(null);

  // Productivity tips array
  const tips = [
    "Break tasks into smaller, manageable chunks to avoid overwhelm",
    "Try the Pomodoro technique: 25 minutes of focus, then a 5-minute break",
    "Use color-coding to organize tasks by project or energy level",
    "Schedule tasks based on your natural energy patterns throughout the day",
    "Body doubling: Work alongside someone else to boost accountability",
    "Create external reminders for important tasks with visual cues",
    "Use the 2-minute rule: If it takes less than 2 minutes, do it now",
    "Gamify your tasks and reward yourself for completing them"
  ];
  
  // Always start with the first tip for consistent server-client rendering
  const [productivityTip, setProductivityTip] = useState<string>(tips[0]);
  
  // After component mounts, we can safely randomize the tip on client side only
  useEffect(() => {
    // Pick a random tip on the client side after hydration
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setProductivityTip(randomTip);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Define loadTasks outside useEffect so it can be used by the retry button
  const loadTasks = async () => {
    try {
      setIsLoadingTasks(true);
      setTaskError(null);
      
      // Use TaskService to fetch tasks
      const fetchedTasks = await TaskService.getTasks();
      
      // Process tasks to add UI-specific properties
      const processedTasks = fetchedTasks.map(task => ({
        ...task,
        completed: task.status === 'done',
        date: task.createdAt
      }));
      
      setTasks(processedTasks.length > 0 ? processedTasks : tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setTaskError('Unable to load tasks. You can still use the dashboard.');
      // Keep the sample tasks if there's an error
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
    
    // Listen for task creation events
    const handleTaskCreated = (event: CustomEvent<TaskType>) => {
      const newTask = event.detail;
      console.log('New task created event received:', newTask);
      
      // Add the new task to the state
      setTasks(prevTasks => {
        // Check if the task already exists (prevent duplicates)
        if (prevTasks.some(task => task.id === newTask.id)) {
          return prevTasks;
        }
        return [
          {
            ...newTask,
            // Ensure the task has the properties expected by the UI
            completed: newTask.status === 'done',
            date: newTask.createdAt || new Date().toISOString(),
          },
          ...prevTasks
        ];
      });
    };
    
    // Type assertion for CustomEvent
    window.addEventListener('task-created', handleTaskCreated as EventListener);
    
    return () => {
      window.removeEventListener('task-created', handleTaskCreated as EventListener);
    };
  }, []);

  const handleTaskComplete = async (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: 'done', completed: true, completedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const handleTaskUpdate = (updatedTask: TaskType) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  // Add task stats calculation with null safety
  const todaysTasks = tasks?.filter(task => {
    try {
      // Use createdAt or date property to check for today's tasks
      const taskDate = new Date(task.createdAt || task.date);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    } catch (e) {
      console.error('Error processing task date:', e);
      return false;
    }
  }) || [];
  
  const completedTasks = todaysTasks.filter(task => task.status === 'done').length;
  const totalTasks = todaysTasks.length;

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-primary-600/20 via-primary-600/5 to-secondary-600/20 rounded-xl p-6 border border-primary-100 shadow-sm relative overflow-hidden"
      >
        {/* Background subtle pattern */}
        <div className="absolute inset-0 bg-grid-white/10 opacity-30" />
        
        {/* Floating shapes for visual interest */}
        <motion.div 
          className="absolute top-4 right-8 w-20 h-20 rounded-full bg-primary-400/10 z-0"
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-4 right-24 w-12 h-12 rounded-full bg-secondary-400/10 z-0"
          animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-neutral-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-700"
            >
              {getTimeBasedGreeting()}!
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-neutral-700 max-w-md"
          >
            Let's focus on what matters today and keep your momentum going
          </motion.p>
        </div>
      </motion.div>

      {/* Two-column layout for top sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Task Progress with enhanced visuals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TaskProgress
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            isLoading={isLoadingTasks}
            error={taskError || undefined}
            onRetry={loadTasks}
          />
        </motion.div>

        {/* Daily Tip Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-secondary-50 to-purple-50 rounded-xl border border-secondary-100 p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Daily Neurodivergent Tip</h3>
              <p className="text-neutral-700">{productivityTip}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid with enhanced visuals */}
      <StatsCards />

      {/* Activity Chart with better visual framing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Daily Patterns</h2>
                <p className="text-sm text-neutral-600">Track your focus and energy levels</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-lg">
              {(['day', 'week', 'month'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-all duration-200 ${
                    selectedTimeframe === timeframe
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <SimpleActivityChart selectedTimeframe={selectedTimeframe} />
        </div>
      </motion.div>

      {/* Tasks Section with enhanced visuals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 text-green-600">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Your Tasks</h2>
              <p className="text-sm text-neutral-600">Organized by energy level and priority</p>
            </div>
          </div>
        </div>
        <TaskList 
          tasks={tasks}
          isLoading={isLoadingTasks}
          onTaskComplete={handleTaskComplete}
          onTaskUpdate={handleTaskUpdate}
        />
      </motion.div>
    </div>
  );
}

const stats = [
  {
    title: 'Focus Time',
    value: '2h 15m',
    icon: Clock,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    title: 'Energy Level',
    value: 'Medium',
    icon: Zap,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-50',
  },
  {
    title: 'Flow States',
    value: '2 today',
    icon: Brain,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
  {
    title: 'Next Break',
    value: '15 mins',
    icon: Calendar,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
]; 