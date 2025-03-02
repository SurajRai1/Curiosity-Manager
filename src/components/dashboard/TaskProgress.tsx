import { motion } from 'framer-motion';
import { CheckCircle2, ListTodo, AlertCircle, RefreshCw, Award, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskProgressProps {
  completedTasks: number;
  totalTasks: number;
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export function TaskProgress({ completedTasks, totalTasks, isLoading, error, onRetry }: TaskProgressProps) {
  const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Generate encouraging message based on progress
  const getEncouragingMessage = () => {
    if (totalTasks === 0) return "Add your first task to get started!";
    if (percentage === 0) return "You've got this! Start with just one task.";
    if (percentage < 25) return "Great start! Keep going!";
    if (percentage < 50) return "You're making progress! Keep it up!";
    if (percentage < 75) return "Look at you go! Almost there!";
    if (percentage < 100) return "So close to completing everything!";
    return "Amazing! You completed all your tasks today!";
  };

  // Choose the progress icon based on completion percentage
  const ProgressIcon = percentage === 100 ? Trophy : Award;

  // Choose the progress color based on completion percentage - using purple color scheme
  const getProgressColor = () => {
    if (percentage === 100) return { start: 'rgb(236, 72, 153)', end: 'rgb(139, 92, 246)' }; // pink-500 to violet-500
    if (percentage >= 75) return { start: 'rgb(168, 85, 247)', end: 'rgb(139, 92, 246)' }; // purple-500 to violet-500
    if (percentage >= 50) return { start: 'rgb(192, 132, 252)', end: 'rgb(168, 85, 247)' }; // violet-400 to purple-500
    if (percentage >= 25) return { start: 'rgb(216, 180, 254)', end: 'rgb(192, 132, 252)' }; // violet-300 to violet-400
    return { start: 'rgb(233, 213, 255)', end: 'rgb(216, 180, 254)' }; // violet-200 to violet-300
  };

  const progressColor = getProgressColor();

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 bg-white border border-amber-200 rounded-xl shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Task Loading Status</p>
              <p className="text-sm text-neutral-600">{error}</p>
            </div>
          </div>
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col sm:flex-row items-center gap-6 p-5 bg-white rounded-xl border border-neutral-200 shadow-sm",
        isLoading && "animate-pulse"
      )}
    >
      {/* Redesigned Progress Ring - focused on percentage only */}
      <div className="relative w-32 h-32 flex-shrink-0">
        {/* Background circle with soft color for ADHD audiences */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="40"
            className="fill-none stroke-purple-100"
            strokeWidth="10"
          />
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={progressColor.start} />
              <stop offset="100%" stopColor={progressColor.end} />
            </linearGradient>
          </defs>
          <motion.circle
            cx="64"
            cy="64"
            r="40"
            className={cn(
              "fill-none",
              isLoading && "opacity-50"
            )}
            stroke="url(#progressGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset,
              transition: { duration: 1.5, ease: "easeOut" }
            }}
            style={{ 
              strokeDasharray: circumference,
              filter: "drop-shadow(0px 0px 3px rgba(139, 92, 246, 0.5))"
            }}
          />
        </svg>
        
        {/* Centered percentage text with optimized styling */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <div className="w-14 h-7 bg-neutral-200 rounded animate-pulse" />
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center"
            >
              <motion.span
                className="text-xl tracking-wider font-bold bg-clip-text text-transparent bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${progressColor.start}, ${progressColor.end})`
                }}
              >
                {percentage}%
              </motion.span>
              {percentage === 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <ProgressIcon className="w-5 h-5 mt-1 text-purple-500" />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats and encouraging message */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Today's Progress
        </h3>
        
        {/* Encouraging message */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-700 mb-3 text-sm"
        >
          {getEncouragingMessage()}
        </motion.p>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle2 className={cn(
              "w-4 h-4 text-green-500",
              isLoading && "opacity-50"
            )} />
            <span className="text-sm text-green-700 font-medium">
              {isLoading ? (
                <div className="w-16 h-4 bg-green-200/50 rounded animate-pulse" />
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {completedTasks} completed
                </motion.span>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
            <ListTodo className={cn(
              "w-4 h-4 text-blue-500",
              isLoading && "opacity-50"
            )} />
            <span className="text-sm text-blue-700 font-medium">
              {isLoading ? (
                <div className="w-16 h-4 bg-blue-200/50 rounded animate-pulse" />
              ) : (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {totalTasks} total
                </motion.span>
              )}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 