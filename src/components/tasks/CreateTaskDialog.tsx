'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Zap,
  Clock,
  Brain,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: CreateTaskData) => Promise<void>;
}

interface CreateTaskData {
  title: string;
  description?: string;
  energyLevel: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  priority: 'low' | 'medium' | 'high';
  isQuickWin: boolean;
}

export default function CreateTaskDialog({ isOpen, onClose, onCreateTask }: CreateTaskDialogProps) {
  const [step, setStep] = useState(1);
  const [taskData, setTaskData] = useState<CreateTaskData>({
    title: '',
    description: '',
    energyLevel: 'medium',
    estimatedTime: undefined,
    priority: 'medium',
    isQuickWin: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateTask(taskData);
      onClose();
      setStep(1);
      setTaskData({
        title: '',
        description: '',
        energyLevel: 'medium',
        estimatedTime: undefined,
        priority: 'medium',
        isQuickWin: false,
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getEnergyIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <Brain className="w-5 h-5" />;
      case 'medium':
        return <Zap className="w-5 h-5" />;
      case 'high':
        return <Sparkles className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getEnergyColors = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-300';
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300';
      default:
        return '';
    }
  };

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300';
      case 'medium':
        return 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300';
      case 'high':
        return 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100 hover:border-pink-300';
      default:
        return '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative min-h-screen flex items-center justify-center p-4"
          >
            <div className="relative bg-white w-full max-w-lg rounded-xl shadow-lg overflow-hidden">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-neutral-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  initial={{ width: '50%' }}
                  animate={{ width: step === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center justify-between p-6 border-b border-neutral-200"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    {step === 1 ? "What's on your mind?" : "Let's add some details"}
                  </h2>
                  <p className="text-sm text-neutral-600">
                    {step === 1 ? "Capture your thought quickly" : "Help us understand the task better"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-all duration-200 hover:rotate-90"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </motion.div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      <div className="group">
                        <input
                          type="text"
                          placeholder="Task title"
                          value={taskData.title}
                          onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                          className="w-full px-4 py-3 text-lg text-neutral-900 placeholder-neutral-400 bg-white border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 group-hover:border-primary-300"
                          required
                        />
                      </div>
                      <div className="group">
                        <textarea
                          placeholder="Add description (optional)"
                          value={taskData.description}
                          onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                          className="w-full px-4 py-3 text-neutral-900 placeholder-neutral-400 bg-white border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 group-hover:border-primary-300 min-h-[120px] resize-none"
                        />
                      </div>
                      <motion.div
                        className="flex justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                        >
                          Continue
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            →
                          </motion.div>
                        </button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Energy Level */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-neutral-900">
                          Energy Level Required
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['low', 'medium', 'high'].map((level) => (
                            <motion.button
                              key={level}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setTaskData({ ...taskData, energyLevel: level as any })}
                              className={cn(
                                'px-4 py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all duration-200 flex flex-col items-center gap-2',
                                taskData.energyLevel === level
                                  ? getEnergyColors(level)
                                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                              )}
                            >
                              {getEnergyIcon(level)}
                              {level}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Priority */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-neutral-900">
                          Priority Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {['low', 'medium', 'high'].map((priority) => (
                            <motion.button
                              key={priority}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setTaskData({ ...taskData, priority: priority as any })}
                              className={cn(
                                'px-4 py-3 rounded-xl border-2 text-sm font-medium capitalize transition-all duration-200',
                                taskData.priority === priority
                                  ? getPriorityColors(priority)
                                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                              )}
                            >
                              {priority}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Estimated Time */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-neutral-900">
                          Estimated Time
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[5, 15, 30, 60].map((time) => (
                            <motion.button
                              key={time}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setTaskData({ ...taskData, estimatedTime: time })}
                              className={cn(
                                'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200',
                                taskData.estimatedTime === time
                                  ? 'bg-primary-50 border-primary-500 text-primary-700'
                                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300'
                              )}
                            >
                              {time}m
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Win */}
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200"
                        onClick={() => setTaskData({ ...taskData, isQuickWin: !taskData.isQuickWin })}
                        style={{
                          borderColor: taskData.isQuickWin ? '#047857' : '#e5e7eb',
                          background: taskData.isQuickWin ? '#ecfdf5' : 'white',
                        }}
                      >
                        <div className={cn(
                          'w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200',
                          taskData.isQuickWin
                            ? 'bg-green-600 border-green-600'
                            : 'border-neutral-300'
                        )}>
                          <motion.div
                            initial={false}
                            animate={{ scale: taskData.isQuickWin ? 1 : 0 }}
                          >
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </motion.div>
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium transition-colors",
                            taskData.isQuickWin ? 'text-green-700' : 'text-neutral-900'
                          )}>
                            Quick Win
                          </p>
                          <p className={cn(
                            "text-sm transition-colors",
                            taskData.isQuickWin ? 'text-green-600' : 'text-neutral-600'
                          )}>
                            This task takes less than 15 minutes
                          </p>
                        </div>
                      </motion.div>

                      <div className="flex justify-between pt-2">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStep(1)}
                          className="px-6 py-2 bg-white text-neutral-700 font-medium rounded-xl border-2 border-neutral-200 hover:border-neutral-300 transition-all duration-200"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-200"
                        >
                          Create Task
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 