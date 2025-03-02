'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Task } from '@/types/dashboard';
import { 
  X, Edit, Plus, Calendar, Clock, CheckCircle, 
  ArrowUpRight, MoreHorizontal, ListTodo,
  ChevronLeft, Trash2, AlertTriangle, Users
} from 'lucide-react';
import { ProjectService } from '@/lib/services/ProjectService';
import { TaskService } from '@/lib/services/TaskService';

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
  onUpdate: (updatedProject: Project) => void;
}

// Define a type for color objects
interface ColorOption {
  name: string;
  value: string;
}

export default function ProjectDetails({ project, onClose, onUpdate }: ProjectDetailsProps) {
  const [tasks, setTasks] = useState<Task[]>(project.tasks || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({
    name: project.name,
    description: project.description,
    color: project.color
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use static methods instead of instantiating the classes
  // No need to create instances for static methods
  
  // Calculate project stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const pendingTasks = totalTasks - completedTasks;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return task.status !== 'done';
    if (selectedFilter === 'completed') return task.status === 'done';
    return true;
  });
  
  // Sort tasks by due date (most recent first) and prioritize non-completed tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by completion status
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;
    
    // Then sort by due date if both have due dates
    if (a.dueDate && b.dueDate) {
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    
    // If only one has a due date, prioritize the one with a due date
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // If neither has a due date, sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const handleSaveChanges = async () => {
    if (!editedProject.name?.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await ProjectService.updateProject(project.id, editedProject);
      
      // Update the local project state with the edited values
      const updatedProject = {
        ...project,
        ...editedProject
      };
      
      // Notify parent component of the update
      onUpdate(updatedProject);
      
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update project. Please try again.');
      console.error('Error updating project:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    
    try {
      await TaskService.updateTask(taskId, { status: newStatus });
      
      // Update local state
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (err) {
      console.error('Error updating task status:', err);
      // You could add some error handling UI here
    }
  };
  
  const getStatusColor = () => {
    if (progressPercentage === 100) return 'bg-green-500';
    if (progressPercentage >= 75) return 'bg-emerald-500';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    if (progressPercentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-orange-500 bg-orange-50';
      case 'low': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };
  
  const renderIndicator = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <ListTodo className="h-3 w-3" />;
      default: return <ListTodo className="h-3 w-3" />;
    }
  };
  
  const getEnergyLevelIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': return '🔥';
      case 'medium': return '✨';
      case 'low': return '☕';
      default: return '✨';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Project Header */}
        <div 
          className="p-6 relative flex flex-col gap-4"
          style={{ 
            backgroundColor: project.color, 
            color: project.color.match(/(#fff|#ffffff|white|light)/i) ? '#1a1a1a' : 'white' 
          }}
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedProject.name}
                onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                className="w-full text-2xl font-bold px-4 py-2 rounded-lg bg-white text-neutral-900 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Project Name"
              />
              
              <textarea
                value={editedProject.description || ''}
                onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                className="w-full text-base px-4 py-2 rounded-lg bg-white text-neutral-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Project Description"
                rows={3}
              />
              
              <div className="flex gap-2 flex-wrap">
                {ProjectService.getProjectColors().map((colorOption: ColorOption) => (
                  <button
                    key={colorOption.value}
                    onClick={() => setEditedProject({ ...editedProject, color: colorOption.value })}
                    className={`w-8 h-8 rounded-full transition-transform ${editedProject.color === colorOption.value ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: colorOption.value }}
                    title={colorOption.name}
                  />
                ))}
              </div>
              
              <div className="flex gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-white text-neutral-900 font-medium flex items-center gap-2 shadow-sm hover:shadow"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsEditing(false);
                    setEditedProject({
                      name: project.name,
                      description: project.description,
                      color: project.color
                    });
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 font-medium"
                >
                  Cancel
                </motion.button>
              </div>
              
              {error && (
                <p className="text-white bg-red-500/20 px-4 py-2 rounded-lg">{error}</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-3xl font-bold tracking-tight">{project.name}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <Edit className="h-5 w-5" />
                </motion.button>
              </div>
              
              {project.description && (
                <p className="text-lg opacity-90">{project.description}</p>
              )}
              
              <div className="mt-2 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-80" />
                  <span className="text-sm opacity-80">Created {formatDate(project.createdAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 opacity-80" />
                  <span className="text-sm opacity-80">Updated {formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Project Progress */}
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
          <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`absolute left-0 top-0 bottom-0 ${getStatusColor()}`}
            ></motion.div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-full bg-blue-50">
                  <ListTodo className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-neutral-700">{totalTasks} Tasks</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-full bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-sm font-medium text-neutral-700">{completedTasks} Completed</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-full bg-orange-50">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <span className="text-sm font-medium text-neutral-700">{pendingTasks} Pending</span>
              </div>
            </div>
            
            <span className="text-sm font-semibold">{progressPercentage}% Complete</span>
          </div>
        </div>
        
        {/* Tasks Section */}
        <div className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-neutral-900">Tasks</h3>
            <div className="flex">
              <div className="bg-neutral-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === 'all' 
                      ? 'bg-white text-neutral-900 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('pending')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === 'pending' 
                      ? 'bg-white text-neutral-900 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setSelectedFilter('completed')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    selectedFilter === 'completed' 
                      ? 'bg-white text-neutral-900 shadow-sm' 
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
          
          {/* Task List */}
          <div className="space-y-3">
            {sortedTasks.length > 0 ? (
              sortedTasks.map(task => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 bg-white border border-neutral-200 rounded-xl shadow-sm transition-all ${
                    task.status === 'done' ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleTaskToggle(task.id, task.status)}
                      className={`mt-1 h-5 w-5 rounded-full flex-shrink-0 ${
                        task.status === 'done' 
                          ? 'bg-green-500 text-white flex items-center justify-center' 
                          : 'border-2 border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      {task.status === 'done' && <CheckCircle className="h-4 w-4" />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-base font-semibold ${
                          task.status === 'done' ? 'line-through text-neutral-500' : 'text-neutral-900'
                        }`}>
                          {task.title}
                        </h4>
                        
                        <div className="flex gap-2 items-center ml-4">
                          {task.energyLevel && (
                            <span className="text-sm" title={`Energy Level: ${task.energyLevel}`}>
                              {getEnergyLevelIcon(task.energyLevel)}
                            </span>
                          )}
                          
                          {task.priority && (
                            <span 
                              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getPriorityColor(task.priority)}`}
                              title={`Priority: ${task.priority}`}
                            >
                              {renderIndicator(task.priority)}
                              <span>{task.priority}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-neutral-600 text-sm mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 mt-3">
                        {task.dueDate && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Calendar className="h-3 w-3" />
                            <span>Due {formatDate(task.dueDate)}</span>
                          </div>
                        )}
                        
                        {task.estimatedTime && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <Clock className="h-3 w-3" />
                            <span>Est. {task.estimatedTime} min</span>
                          </div>
                        )}
                        
                        {task.subtasks?.length > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <ListTodo className="h-3 w-3" />
                            <span>{task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks</span>
                          </div>
                        )}
                      </div>
                      
                      {task.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag, index) => (
                            <span 
                              key={`tag-${index}-${tag}`}
                              className="px-2 py-0.5 text-xs rounded-full bg-neutral-100 text-neutral-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <button className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-8 text-center text-neutral-500">
                <p className="mb-2">No tasks found</p>
                <p className="text-sm">Add tasks to this project to start tracking progress</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-200 bg-white">
          <div className="flex justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 font-medium flex items-center gap-2"
              onClick={onClose}
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Projects
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium flex items-center gap-2 shadow-sm hover:shadow"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 