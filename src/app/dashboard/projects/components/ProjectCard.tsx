'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types/dashboard';
import { MoreHorizontal, Trash2, BarChart, Clock, CheckCircle, Hourglass, ListTodo } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  layoutView: 'grid' | 'list';
  onClick: () => void;
  onDelete: () => void;
}

export default function ProjectCard({ project, layoutView, onClick, onDelete }: ProjectCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  // Calculate project stats
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Determine the status indicator color based on progress
  const getStatusColor = () => {
    if (progressPercentage === 100) return 'bg-green-500';
    if (progressPercentage >= 75) return 'bg-emerald-500';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    if (progressPercentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // Define a date formatter
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Generate a complementary text color based on the background color
  const getTextColor = (bgColor: string) => {
    // Check if the background color is light or dark
    // This is a simplified version - for production, consider using a more sophisticated algorithm
    const isLight = bgColor.match(/(#fff|#ffffff|white|light)/i);
    return isLight ? 'text-neutral-900' : 'text-white';
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };
  
  const renderGridView = () => (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all relative group"
      onClick={onClick}
    >
      {/* Color header based on project color */}
      <div 
        className="h-3 w-full" 
        style={{ backgroundColor: project.color }}
      ></div>
      
      {/* Project body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-neutral-900 line-clamp-1 flex-1">{project.name}</h3>
          
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions(!showOptions);
              }}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <MoreHorizontal className="h-5 w-5" />
            </motion.button>
            
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 w-36 py-1 overflow-hidden"
              >
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        </div>
        
        {project.description && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        )}
        
        {/* Project stats */}
        <div className="mt-4 space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute left-0 top-0 bottom-0 ${getStatusColor()}`}
              ></motion.div>
            </div>
            <span className="text-xs font-medium text-neutral-700">{progressPercentage}%</span>
          </div>
          
          {/* Task stats with icons */}
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-neutral-600">
              <div className="p-1 rounded-full bg-blue-50">
                <ListTodo className="h-3 w-3 text-blue-500" />
              </div>
              <span>{totalTasks} Tasks</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-neutral-600">
              <div className="p-1 rounded-full bg-green-50">
                <CheckCircle className="h-3 w-3 text-green-500" />
              </div>
              <span>{completedTasks} Done</span>
            </div>
          </div>
        </div>
        
        {/* Created Date */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock className="h-3 w-3" />
          <span>Created {formatDate(project.createdAt)}</span>
        </div>
      </div>
    </motion.div>
  );
  
  const renderListView = () => (
    <motion.div
      whileHover={{ x: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.99 }}
      className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all group"
      onClick={onClick}
    >
      <div className="flex items-center px-5 py-4">
        {/* Color indicator */}
        <div 
          className="w-3 h-12 rounded-full mr-4 flex-shrink-0" 
          style={{ backgroundColor: project.color }}
        ></div>
        
        {/* Project info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-neutral-900 line-clamp-1">{project.name}</h3>
          {project.description && (
            <p className="text-neutral-600 text-sm line-clamp-1 mt-1">{project.description}</p>
          )}
        </div>
        
        {/* Project stats */}
        <div className="flex gap-6 items-center mr-8">
          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
            <ListTodo className="h-4 w-4 text-blue-500" />
            <span>{totalTasks}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm text-neutral-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{completedTasks}</span>
          </div>
          
          <div className="w-16 flex items-center gap-2">
            <div className="relative flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`absolute left-0 top-0 bottom-0 ${getStatusColor()}`}
              ></motion.div>
            </div>
            <span className="text-xs font-medium text-neutral-700">{progressPercentage}%</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
          >
            <MoreHorizontal className="h-5 w-5" />
          </motion.button>
          
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 w-36 py-1 overflow-hidden"
            >
              <button
                onClick={handleDeleteClick}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  return layoutView === 'grid' ? renderGridView() : renderListView();
} 