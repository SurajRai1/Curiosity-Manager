import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Check, AlertCircle, CheckCircle2, Timer, XCircle, Edit2, Activity, Tag } from 'lucide-react';
import { TaskService } from '@/lib/services/TaskService';
import type { Task } from '@/lib/services/TaskService';
import { cn } from '@/lib/utils';
import EditTaskDialog from './EditTaskDialog';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskComplete: (taskId: string) => void;
}

export function TaskList({ tasks, isLoading, onTaskUpdate, onTaskComplete }: TaskListProps) {
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [showCompletionMessage, setShowCompletionMessage] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingTasks(prev => new Set(prev).add(taskId));
      
      // Start the completion animation
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setShowCompletionMessage(`Great job completing "${task.title}"! 🎉`);
        setTimeout(() => setShowCompletionMessage(null), 3000); // Clear message after 3 seconds
      }

      // Update task status
      await TaskService.updateTaskStatus(taskId, 'done');
      
      // Notify parent component
      onTaskComplete(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setCompletingTasks(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    onTaskUpdate(updatedTask);
    setEditingTask(null);
  };

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getEnergyEmoji = (level: string) => {
    switch (level) {
      case 'low':
        return '🧘';
      case 'medium':
        return '🚶';
      case 'high':
        return '🏃';
      default:
        return '🙂';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Check className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-600';
    }
  };

  const toggleTaskExpanded = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-8 w-8 border-b-2 border-primary-600" 
        />
      </div>
    );
  }

  // Group tasks by status
  const groupedTasks = {
    'todo': tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'done': tasks.filter(task => task.status === 'done')
  };

  return (
    <div className="space-y-6">
      {/* Completion Message */}
      <AnimatePresence>
        {showCompletionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {showCompletionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Dialog */}
      {editingTask && (
        <EditTaskDialog
          task={editingTask}
          isOpen={true}
          onClose={() => setEditingTask(null)}
          onUpdate={handleUpdateTask}
        />
      )}

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 rounded-xl border border-dashed border-neutral-300 bg-neutral-50"
        >
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-neutral-100">
            <Tag className="w-7 h-7 text-neutral-400" />
          </div>
          <p className="text-neutral-600 mb-2">No tasks yet!</p>
          <p className="text-sm text-neutral-500">Click the "Add Task" button to create your first task</p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Tasks by status */}
          {Object.entries(groupedTasks).map(([status, statusTasks]) => statusTasks.length > 0 && (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
                  {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                </h3>
                <div className="h-px flex-1 bg-neutral-200"></div>
                <span className="text-xs font-medium bg-neutral-100 text-neutral-500 rounded-full px-2 py-0.5">
                  {statusTasks.length}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 bg-white rounded-xl border hover:shadow-md transition-all duration-200 group relative overflow-hidden",
                      task.status === 'done' 
                        ? 'border-green-200 bg-green-50/30' 
                        : task.status === 'in-progress'
                          ? 'border-blue-200 bg-blue-50/10'
                          : 'border-neutral-200 hover:border-primary-200'
                    )}
                    onClick={() => toggleTaskExpanded(task.id)}
                  >
                    {/* Task priority indicator line */}
                    <div 
                      className={cn(
                        "absolute top-0 left-0 right-0 h-1",
                        task.priority === 'high' 
                          ? 'bg-red-500' 
                          : task.priority === 'medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                      )}
                    />
                    
                    {/* Energy emoji indicator */}
                    <div className="absolute top-3 right-3 opacity-10 text-3xl z-0">
                      {getEnergyEmoji(task.energyLevel)}
                    </div>

                    {/* Task Content */}
                    <div className="flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between gap-2 mb-3 pt-2">
                        <h3 className={cn(
                          "text-lg font-medium truncate transition-colors",
                          task.status === 'done' 
                            ? 'text-green-700 line-through' 
                            : 'text-neutral-900 group-hover:text-primary-600'
                        )}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(task.priority)}
                          {task.status !== 'done' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTask(task);
                              }}
                              className="p-1 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {(expandedTask === task.id || !expandedTask) && task.description && (
                          <motion.p 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className={cn(
                              "text-sm mb-4 flex-grow",
                              task.status === 'done' ? 'text-green-600' : 'text-neutral-600'
                            )}
                          >
                            {task.description}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Task Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-sm mt-auto">
                        <div className={`px-2 py-1 rounded-md border flex items-center gap-1.5 ${getEnergyColor(task.energyLevel)}`}>
                          <Zap className="w-4 h-4" />
                          <span className="capitalize">{task.energyLevel}</span>
                        </div>

                        {task.estimatedTime && (
                          <div className="flex items-center gap-1.5 text-neutral-600 px-2 py-1 rounded-md border border-neutral-200">
                            <Timer className="w-4 h-4" />
                            <span>{task.estimatedTime}m</span>
                          </div>
                        )}

                        {task.isQuickWin && (
                          <span className="px-2 py-1 rounded-md bg-primary-50 text-primary-700 border border-primary-200">
                            Quick Win
                          </span>
                        )}

                        <div className={cn(
                          "px-2 py-1 rounded-md border flex items-center gap-1.5",
                          getTaskStatusColor(task.status)
                        )}>
                          {task.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : task.status === 'in-progress' ? (
                            <Activity className="w-4 h-4" />
                          ) : (
                            <Timer className="w-4 h-4" />
                          )}
                          <span className="capitalize">{task.status.replace('-', ' ')}</span>
                        </div>
                      </div>

                      {/* Complete Task Button */}
                      {task.status !== 'done' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTask(task.id);
                          }}
                          disabled={completingTasks.has(task.id)}
                          className={cn(
                            "mt-4 w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all",
                            completingTasks.has(task.id)
                              ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                              : "bg-green-50 text-green-700 hover:bg-green-100 shadow-sm hover:shadow"
                          )}
                        >
                          {completingTasks.has(task.id) ? (
                            <>
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="rounded-full h-4 w-4 border-b-2 border-green-700" 
                              />
                              Completing...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Complete Task
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 