import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, Brain, Timer, Trophy, Target, Flame, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { ActivityService, UserActivity } from '@/lib/services/ActivityService';
import { TaskService } from '@/lib/services/TaskService';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface StatsData {
  focusTime: number;
  energyLevel: number;
  flowStates: number;
  nextBreak: number;
  lastUpdate: Date;
  isInFlow: boolean;
  completedTasks: number;
  streakDays: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    focusTime: 0,
    energyLevel: 0,
    flowStates: 0,
    nextBreak: 25,
    lastUpdate: new Date(),
    isInFlow: false,
    completedTasks: 0,
    streakDays: 3, // Default to show some streak
  });
  const [isLoading, setIsLoading] = useState(true);
  const [focusStartTime, setFocusStartTime] = useState<Date | null>(null);
  const [animateStats, setAnimateStats] = useState<{ [key: string]: boolean }>({
    focusTime: false,
    energyLevel: false,
    flowStates: false,
    completedTasks: false,
  });

  // For animations when values change
  useEffect(() => {
    const animationTimers: NodeJS.Timeout[] = [];
    
    Object.keys(animateStats).forEach(stat => {
      if (animateStats[stat]) {
        const timer = setTimeout(() => {
          setAnimateStats(prev => ({ ...prev, [stat]: false }));
        }, 1000);
        animationTimers.push(timer);
      }
    });
    
    return () => {
      animationTimers.forEach(timer => clearTimeout(timer));
    };
  }, [animateStats]);

  // Load initial stats and set up real-time subscription
  useEffect(() => {
    loadStats();
    
    // Update stats every minute for active focus sessions
    const interval = setInterval(() => {
      if (focusStartTime) {
        updateFocusTime();
      }
      updateNextBreak();
    }, 60000);

    // Set up real-time subscriptions
    const activityChannel = supabase.channel('activity_updates');
    const taskChannel = supabase.channel('task_updates');

    // Subscribe to activity changes
    activityChannel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activity',
        },
        (payload) => {
          handleActivityUpdate(payload.new as any);
        }
      )
      .subscribe();

    // Subscribe to task completions
    taskChannel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          if (payload.new.status === 'done') {
            updateEnergyLevel(10); // Boost energy on task completion
            setStats(prev => ({
              ...prev,
              completedTasks: prev.completedTasks + 1,
            }));
            setAnimateStats(prev => ({ ...prev, completedTasks: true }));
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(activityChannel);
      supabase.removeChannel(taskChannel);
    };
  }, []);

  // Handle incoming activity updates
  const handleActivityUpdate = (activity: UserActivity) => {
    setStats(prev => {
      const newStats = {
        ...prev,
        focusTime: activity.focusMinutes,
        energyLevel: activity.energyLevel,
        flowStates: Math.floor(activity.flowStateMinutes / 20),
        lastUpdate: new Date(activity.timestamp),
      };
      
      // Trigger animations for changed values
      const animations: { [key: string]: boolean } = {};
      if (newStats.focusTime !== prev.focusTime) animations.focusTime = true;
      if (newStats.energyLevel !== prev.energyLevel) animations.energyLevel = true;
      if (newStats.flowStates !== prev.flowStates) animations.flowStates = true;
      
      setAnimateStats(prev => ({ ...prev, ...animations }));
      
      return newStats;
    });
  };

  // Load initial stats
  const loadStats = async () => {
    try {
      const [activity, tasks] = await Promise.all([
        ActivityService.getCurrentActivity(),
        TaskService.getTasks({ status: 'done' }),
      ]);

      if (activity) {
        const currentTime = new Date();
        const activityTime = new Date(activity.timestamp);
        const timeDiff = Math.floor((currentTime.getTime() - activityTime.getTime()) / 1000 / 60);

        // If there's an active focus session
        if (timeDiff < 30) {
          setFocusStartTime(activityTime);
        }

        const completedToday = tasks.filter(t => 
          new Date(t.completedAt!).toDateString() === new Date().toDateString()
        ).length;

        setStats({
          focusTime: activity.focusMinutes + (focusStartTime ? timeDiff : 0),
          energyLevel: activity.energyLevel,
          flowStates: Math.floor(activity.flowStateMinutes / 20),
          nextBreak: calculateNextBreak(activity.focusMinutes),
          lastUpdate: activityTime,
          isInFlow: timeDiff >= 20, // Consider in flow after 20 minutes of focus
          completedTasks: completedToday,
          streakDays: 3, // For demo purposes
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update focus time for active sessions
  const updateFocusTime = useCallback(() => {
    if (!focusStartTime) return;

    const currentTime = new Date();
    const focusMinutes = Math.floor(
      (currentTime.getTime() - focusStartTime.getTime()) / 1000 / 60
    );

    setStats(prev => {
      const wasInFlow = prev.isInFlow;
      const newStats = {
        ...prev,
        focusTime: prev.focusTime + 1,
        isInFlow: focusMinutes >= 20,
      };

      // Record flow state if conditions are met
      if (focusMinutes >= 20 && !wasInFlow) {
        newStats.flowStates = prev.flowStates + 1;
        setAnimateStats(prev => ({ ...prev, flowStates: true }));
      }
      
      setAnimateStats(prev => ({ ...prev, focusTime: true }));

      return newStats;
    });

    // Record activity every 5 minutes
    if (focusMinutes % 5 === 0) {
      ActivityService.recordActivity({
        focusMinutes: stats.focusTime,
        energyLevel: stats.energyLevel,
        flowStateMinutes: stats.isInFlow ? focusMinutes : 0,
      });
    }
  }, [focusStartTime, stats.focusTime, stats.energyLevel, stats.isInFlow]);

  // Update energy level
  const updateEnergyLevel = (change: number) => {
    setStats(prev => {
      const newEnergyLevel = Math.max(0, Math.min(100, prev.energyLevel + change));
      setAnimateStats(prev => ({ ...prev, energyLevel: true }));
      return {
        ...prev,
        energyLevel: newEnergyLevel,
      };
    });
  };

  // Calculate next break time
  const calculateNextBreak = (focusMinutes: number): number => {
    const sessionLength = stats.energyLevel > 70 ? 30 : 25; // Longer sessions when energy is high
    const minutesUntilBreak = sessionLength - (focusMinutes % sessionLength);
    return Math.max(1, minutesUntilBreak);
  };

  // Update next break time
  const updateNextBreak = () => {
    setStats(prev => ({
      ...prev,
      nextBreak: calculateNextBreak(prev.focusTime),
    }));
  };

  const getEnergyColor = (level: number) => {
    if (level >= 70) return 'from-green-500 to-emerald-600';
    if (level >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getEnergyLabel = (level: number) => {
    if (level >= 70) return 'High Energy';
    if (level >= 40) return 'Medium Energy';
    return 'Low Energy';
  };

  const getEnergyIcon = (level: number) => {
    if (level >= 70) return Flame;
    if (level >= 40) return Zap;
    return Activity;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // For fun streak animations
  const streakVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.3,
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    })
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div 
            key={i} 
            className="h-24 bg-neutral-100 rounded-lg"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              transition: { 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }
            }}
          />
        ))}
      </div>
    );
  }

  const EnergyIcon = getEnergyIcon(stats.energyLevel);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Focus Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-start justify-between">
          <motion.div 
            className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100"
            whileHover={{ rotate: 15 }}
            animate={animateStats.focusTime ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Clock className="w-5 h-5" />
          </motion.div>
          <motion.div 
            className="text-2xl font-bold text-neutral-900"
            animate={animateStats.focusTime ? 
              { scale: [1, 1.2, 1], color: ['#333', '#2563eb', '#333'] } : 
              {}
            }
            transition={{ duration: 0.5 }}
          >
            {formatTime(stats.focusTime)}
          </motion.div>
        </div>
        <p className="mt-2 text-sm font-medium text-neutral-600 relative">Focus Time Today</p>
        
        {stats.focusTime > 60 && (
          <motion.div 
            className="absolute bottom-2 right-2 text-blue-400 opacity-30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-8 h-8" />
          </motion.div>
        )}
      </motion.div>

      {/* Energy Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-start justify-between">
          <motion.div 
            className="p-2 rounded-lg bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100"
            whileHover={{ rotate: 15 }}
            animate={animateStats.energyLevel ? 
              { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : 
              {}
            }
            transition={{ duration: 0.5 }}
          >
            <EnergyIcon className="w-5 h-5" />
          </motion.div>
          <div className="flex flex-col items-end">
            <div className="h-2.5 w-28 rounded-full bg-neutral-100 overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r",
                  getEnergyColor(stats.energyLevel)
                )}
                style={{ width: `${stats.energyLevel}%` }}
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${stats.energyLevel}%`,
                  transition: { 
                    duration: 0.5, 
                    ease: "easeOut" 
                  }
                }}
              >
                {stats.energyLevel > 80 && (
                  <motion.div 
                    className="h-full w-full relative overflow-hidden"
                    animate={{ 
                      background: [
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)',
                        'linear-gradient(90deg, rgba(255,255,255,0) 100%, rgba(255,255,255,0.5) 150%, rgba(255,255,255,0) 200%)'
                      ],
                      transition: { 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }
                    }}
                  />
                )}
              </motion.div>
            </div>
            <motion.span 
              className="text-sm font-medium text-neutral-900 mt-1"
              animate={animateStats.energyLevel ? 
                { scale: [1, 1.1, 1], color: ['#333', '#ca8a04', '#333'] } : 
                {}
              }
              transition={{ duration: 0.5 }}
            >
              {getEnergyLabel(stats.energyLevel)}
            </motion.span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-neutral-600 relative">Current Energy</p>
      </motion.div>

      {/* Flow States / Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-start justify-between">
          <motion.div 
            className="p-2 rounded-lg bg-purple-50 text-purple-600 group-hover:bg-purple-100"
            whileHover={{ rotate: 15 }}
            animate={animateStats.flowStates ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Trophy className="w-5 h-5" />
          </motion.div>
          <div className="flex -space-x-1.5">
            {stats.streakDays > 0 && (
              <div className="flex items-center">
                {[...Array(Math.min(stats.streakDays, 5))].map((_, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={streakVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -5, scale: 1.1 }}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center ml-0.5",
                      i === 0 ? "bg-bronze text-white" :
                      i === 1 ? "bg-silver text-white" :
                      i === 2 ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-white" :
                      "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    )}
                    style={{
                      background: i === 0 ? "#cd7f32" : 
                                i === 1 ? "#C0C0C0" : 
                                i === 2 ? "linear-gradient(90deg, #ffc017 0%, #ffcb38 100%)" : 
                                "linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)"
                    }}
                  >
                    <motion.div
                      animate={i === stats.streakDays - 1 ? { 
                        scale: [1, 1.2, 1], 
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{ 
                        repeat: i === stats.streakDays - 1 ? Infinity : 0, 
                        repeatDelay: 3, 
                        duration: 1
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-neutral-600 relative">Current Streak</p>
        
        {stats.streakDays >= 3 && (
          <motion.div 
            className="absolute bottom-1 right-1 text-purple-400 opacity-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
          >
            <Sparkles className="w-10 h-10" />
          </motion.div>
        )}
      </motion.div>

      {/* Completed Tasks / Next Break */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative flex items-start justify-between">
          <motion.div 
            className="p-2 rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100"
            whileHover={{ rotate: 15 }}
            animate={animateStats.completedTasks ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Target className="w-5 h-5" />
          </motion.div>
          <motion.div 
            className="text-2xl font-bold text-neutral-900 flex items-center"
            animate={animateStats.completedTasks ? 
              { scale: [1, 1.2, 1], color: ['#333', '#16a34a', '#333'] } : 
              {}
            }
            transition={{ duration: 0.5 }}
          >
            {stats.completedTasks}
            <span className="text-sm text-neutral-500 ml-1">tasks</span>
          </motion.div>
        </div>
        <p className="mt-2 text-sm font-medium text-neutral-600 relative">Completed Today</p>
        
        {stats.nextBreak <= 5 && (
          <motion.div 
            className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-medium"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Timer className="w-3.5 h-3.5" />
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Break in {stats.nextBreak}m
            </motion.span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 