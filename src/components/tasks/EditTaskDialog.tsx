import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Clock, AlertCircle, Timer, Sparkles } from 'lucide-react';
import { TaskService, Task } from '@/lib/services/TaskService';
import { cn } from '@/lib/utils';

interface EditTaskDialogProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

export default function EditTaskDialog({ task, isOpen, onClose, onUpdate }: EditTaskDialogProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || '',
    energyLevel: task.energyLevel,
    estimatedTime: task.estimatedTime || '',
    priority: task.priority,
    isQuickWin: task.isQuickWin,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('basic');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: task.title,
        description: task.description || '',
        energyLevel: task.energyLevel,
        estimatedTime: task.estimatedTime || '',
        priority: task.priority,
        isQuickWin: task.isQuickWin,
      });
    }
  }, [isOpen, task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedTask = await TaskService.updateTask(task.id, {
        ...formData,
        estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime.toString()) : undefined,
      });
      onUpdate(updatedTask);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getEnergyColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-700 hover:bg-yellow-200';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-700 hover:bg-red-200';
      default:
        return 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-700 hover:bg-red-200';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-700 hover:bg-yellow-200';
      case 'low':
        return 'bg-green-100 border-green-200 text-green-700 hover:bg-green-200';
      default:
        return 'bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-6"
        >
          {/* Dialog Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900">
              Edit Task
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {['basic', 'details', 'review'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                  activeSection === section
                    ? "bg-primary-100 text-primary-700"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
              >
                {section}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {activeSection === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}

              {activeSection === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Energy Level */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Energy Level Required
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, energyLevel: level }))}
                          className={cn(
                            "flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all",
                            formData.energyLevel === level
                              ? getEnergyColor(level)
                              : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                          )}
                        >
                          <Zap className="w-4 h-4 mb-1 mx-auto" />
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Priority Level
                    </label>
                    <div className="flex gap-2">
                      {['low', 'medium', 'high'].map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, priority }))}
                          className={cn(
                            "flex-1 px-3 py-2 rounded-lg border text-sm font-medium capitalize transition-all",
                            formData.priority === priority
                              ? getPriorityColor(priority)
                              : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                          )}
                        >
                          {priority === 'high' ? (
                            <AlertCircle className="w-4 h-4 mb-1 mx-auto" />
                          ) : priority === 'medium' ? (
                            <Clock className="w-4 h-4 mb-1 mx-auto" />
                          ) : (
                            <Timer className="w-4 h-4 mb-1 mx-auto" />
                          )}
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Time */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Estimated Time (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      min="1"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Quick Win Toggle */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isQuickWin: !prev.isQuickWin }))}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2",
                        formData.isQuickWin
                          ? "bg-primary-100 border-primary-200 text-primary-700"
                          : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                      Quick Win
                    </button>
                  </div>
                </motion.div>
              )}

              {activeSection === 'review' && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-3">
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Title:</span>
                      <p className="text-neutral-900">{formData.title}</p>
                    </div>
                    {formData.description && (
                      <div>
                        <span className="text-sm font-medium text-neutral-600">Description:</span>
                        <p className="text-neutral-900">{formData.description}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <div className={cn(
                        "px-2 py-1 rounded-md border text-sm",
                        getEnergyColor(formData.energyLevel)
                      )}>
                        <span className="capitalize">{formData.energyLevel} Energy</span>
                      </div>
                      <div className={cn(
                        "px-2 py-1 rounded-md border text-sm",
                        getPriorityColor(formData.priority)
                      )}>
                        <span className="capitalize">{formData.priority} Priority</span>
                      </div>
                      {formData.estimatedTime && (
                        <div className="px-2 py-1 rounded-md border border-neutral-200 bg-white text-sm text-neutral-700">
                          {formData.estimatedTime} minutes
                        </div>
                      )}
                      {formData.isQuickWin && (
                        <div className="px-2 py-1 rounded-md border border-primary-200 bg-primary-50 text-sm text-primary-700">
                          Quick Win
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  if (activeSection === 'details') setActiveSection('basic');
                  if (activeSection === 'review') setActiveSection('details');
                }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeSection === 'basic'
                    ? "invisible"
                    : "text-neutral-700 hover:text-neutral-900"
                )}
              >
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 rounded-lg transition-colors"
                >
                  Cancel
                </button>

                {activeSection === 'review' ? (
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all",
                      isSaving
                        ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                    )}
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSection === 'basic') setActiveSection('details');
                      if (activeSection === 'details') setActiveSection('review');
                    }}
                    className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 