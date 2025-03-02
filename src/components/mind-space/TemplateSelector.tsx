import { useState } from 'react';
import { motion } from 'framer-motion';
import { MindMapTemplate, MindMapService } from '@/lib/services/MindMapService';
import { cn } from '@/lib/utils';

interface TemplateSelectorProps {
  onSelectTemplate: (template: MindMapTemplate) => void;
  onClose: () => void;
}

export default function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [templates] = useState<MindMapTemplate[]>(MindMapService.getTemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        onSelectTemplate(template);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">Choose a Template</h2>
          <p className="text-neutral-600 mt-1">
            Start with a pre-designed template or create from scratch
          </p>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Blank template */}
          <div
            className={cn(
              "border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
              selectedTemplate === 'blank' 
                ? "border-primary-500 bg-primary-50" 
                : "border-neutral-200 hover:border-primary-200"
            )}
            onClick={() => setSelectedTemplate('blank')}
          >
            <div className="aspect-video bg-neutral-100 rounded-md flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center">
                <span className="text-2xl text-neutral-400">+</span>
              </div>
            </div>
            <h3 className="font-semibold text-neutral-900">Blank Canvas</h3>
            <p className="text-sm text-neutral-600 mt-1">Start with an empty mind map</p>
          </div>

          {/* Template options */}
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedTemplate === template.id 
                  ? "border-primary-500 bg-primary-50" 
                  : "border-neutral-200 hover:border-primary-200"
              )}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="aspect-video bg-neutral-100 rounded-md overflow-hidden mb-4">
                {/* This would ideally be an image of the template */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
                  <span className="text-lg font-medium text-primary-700">{template.name}</span>
                </div>
              </div>
              <h3 className="font-semibold text-neutral-900">{template.name}</h3>
              <p className="text-sm text-neutral-600 mt-1">{template.description}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-neutral-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectTemplate}
            disabled={!selectedTemplate}
            className={cn(
              "px-4 py-2 rounded-lg font-medium",
              selectedTemplate
                ? "bg-primary-600 text-white hover:bg-primary-700"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            Use Template
          </button>
        </div>
      </motion.div>
    </div>
  );
} 