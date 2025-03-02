'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Palette, FileText, Plus } from 'lucide-react';
import { ProjectService } from '@/lib/services/ProjectService';
import { CreateProjectData } from '@/types/dashboard';

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

// Define a type for color objects
interface ColorOption {
  name: string;
  value: string;
}

export default function CreateProjectDialog({ 
  isOpen, 
  onClose, 
  onProjectCreated 
}: CreateProjectDialogProps) {
  // Get color options first to use in initial state
  const projectColors = ProjectService.getProjectColors();
  const defaultColor = projectColors.length > 0 ? projectColors[0].value : '#3B82F6';
  
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    color: defaultColor // Use the first color from the list as default
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // Step 1: Name and description, Step 2: Color
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleColorSelect = (colorValue: string) => {
    setFormData({ ...formData, color: colorValue });
  };
  
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return false;
    }
    setError(null);
    return true;
  };
  
  const goToNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const goToPreviousStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const newProject = await ProjectService.createProject(formData);
      onProjectCreated(newProject);
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        color: defaultColor
      });
      setStep(1);
      onClose();
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Dialog Header */}
        <div 
          className="relative px-6 py-4 border-b border-neutral-200 flex justify-between items-center"
        >
          <h3 className="text-xl font-bold text-neutral-900">
            {step === 1 ? 'Create New Project' : 'Choose Project Color'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Step 1: Project Details */}
        {step === 1 && (
          <div className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-neutral-900 text-base"
                  placeholder="Enter project name"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-neutral-900 text-base"
                  placeholder="Describe your project (optional)"
                  rows={4}
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Color Selection */}
        {step === 2 && (
          <div className="p-6">
            <div>
              <p className="text-sm text-neutral-600 mb-4">
                Choose a color for your project. This helps visually distinguish between different projects. 
              </p>
              
              <div className="grid grid-cols-5 gap-3 mb-6">
                {projectColors.map((colorOption: ColorOption) => (
                  <motion.button
                    key={colorOption.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform ${formData.color === colorOption.value ? 'ring-2 ring-offset-2 ring-neutral-800' : ''}`}
                    style={{ backgroundColor: colorOption.value }}
                    onClick={() => handleColorSelect(colorOption.value)}
                    aria-label={`Select color ${colorOption.name}`}
                  >
                    {formData.color === colorOption.value && (
                      <Check className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div
                className="p-6 rounded-xl mb-4"
                style={{ backgroundColor: formData.color }}
              >
                <h4 
                  className="text-lg font-bold"
                  style={{ color: formData.color.match(/(#fff|#ffffff|white|light)/i) ? '#1a1a1a' : 'white' }}
                >
                  {formData.name || 'Project Preview'}
                </h4>
                {formData.description && (
                  <p 
                    className="text-sm mt-1 opacity-90"
                    style={{ color: formData.color.match(/(#fff|#ffffff|white|light)/i) ? '#1a1a1a' : 'white' }}
                  >
                    {formData.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Dialog Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-between">
          {step === 1 ? (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-700 font-medium"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-700 font-medium flex items-center gap-2"
            >
              Back
            </button>
          )}
          
          {step === 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={goToNextStep}
              className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg shadow-sm hover:shadow flex items-center gap-2"
            >
              Next
              <Palette className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg shadow-sm hover:shadow flex items-center gap-2"
            >
              {loading ? 'Creating...' : 'Create Project'}
              {!loading && <Plus className="h-4 w-4" />}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 