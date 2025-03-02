'use client';

import { AnimatePresence } from 'framer-motion';
import { Project } from '@/types/dashboard';
import ProjectDetails from './ProjectDetails';

interface ProjectDetailProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdate: (updatedProject: Project) => void;
  onDelete: () => void;
}

export default function ProjectDetail({ 
  isOpen, 
  onClose, 
  project, 
  onUpdate, 
  onDelete 
}: ProjectDetailProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <ProjectDetails 
          project={project} 
          onClose={onClose}
          onUpdate={onUpdate}
        />
      )}
    </AnimatePresence>
  );
} 