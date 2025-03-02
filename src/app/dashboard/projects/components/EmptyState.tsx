'use client';

import { motion } from 'framer-motion';
import { Folders, Plus, ArrowRight, Lightbulb, Target, Clock } from 'lucide-react';

interface EmptyStateProps {
  onCreateProject: () => void;
}

export default function EmptyState({ onCreateProject }: EmptyStateProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12
      }
    }
  };
  
  const tips = [
    {
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
      title: "Start small",
      description: "Break down bigger goals into smaller, manageable projects"
    },
    {
      icon: <Target className="h-5 w-5 text-red-500" />,
      title: "Set clear goals",
      description: "Define what success looks like for each project"
    },
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      title: "Track progress",
      description: "Visualize your accomplishments to stay motivated"
    }
  ];
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto my-12 px-4"
    >
      <motion.div 
        variants={itemVariants}
        className="flex justify-center mb-6"
      >
        <div className="p-6 rounded-full bg-blue-100">
          <Folders className="h-12 w-12 text-blue-600" />
        </div>
      </motion.div>
      
      <motion.h2 
        variants={itemVariants}
        className="text-3xl font-bold text-center text-neutral-900 mb-3"
      >
        No projects yet
      </motion.h2>
      
      <motion.p 
        variants={itemVariants}
        className="text-center text-neutral-600 text-lg mb-8 max-w-md mx-auto"
      >
        Projects help you organize related tasks and track progress toward your goals.
      </motion.p>
      
      <motion.div
        variants={itemVariants}
        className="flex justify-center mb-12"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateProject}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl shadow-sm hover:shadow-md flex items-center gap-2 text-lg"
        >
          <Plus className="h-5 w-5" />
          Create Your First Project
        </motion.button>
      </motion.div>
      
      {/* Tips Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Project Tips for ADHD Management</h3>
        </div>
        
        <div className="p-6 space-y-6">
          {tips.map((tip, index) => (
            <motion.div
              key={`tip-${index}-${tip.title.substring(0, 10)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex gap-4"
            >
              <div className="p-2 bg-neutral-100 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
                {tip.icon}
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-1">{tip.title}</h4>
                <p className="text-neutral-600 text-sm">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="p-6 bg-neutral-50">
          <motion.a
            whileHover={{ x: 4 }}
            href="/dashboard/mind-space"
            className="text-blue-600 font-medium flex items-center gap-1 text-sm"
          >
            Explore more ADHD productivity tips
            <ArrowRight className="h-4 w-4" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
} 