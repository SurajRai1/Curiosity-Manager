import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Brain, Lightbulb, CheckSquare, HelpCircle, Layers } from 'lucide-react';
import { NODE_TYPES, NODE_THEMES, ENERGY_LEVELS } from './CustomNode';
import { cn } from '@/lib/utils';

interface NodeCreationPanelProps {
  onCreateNode: (nodeData: any) => void;
  position?: { x: number; y: number } | null;
  onClose?: () => void;
  isFloating?: boolean;
}

export default function NodeCreationPanel({ 
  onCreateNode, 
  position = null, 
  onClose,
  isFloating = false
}: NodeCreationPanelProps) {
  const [nodeType, setNodeType] = useState<keyof typeof NODE_TYPES>('THOUGHT');
  const [nodeTheme, setNodeTheme] = useState<keyof typeof NODE_THEMES>('PURPLE');
  const [energyLevel, setEnergyLevel] = useState<keyof typeof ENERGY_LEVELS | null>(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [step, setStep] = useState(1);
  const [isExpanded, setIsExpanded] = useState(!isFloating);

  // Get icon for node type
  const getNodeTypeIcon = (type: keyof typeof NODE_TYPES) => {
    switch (type) {
      case 'THOUGHT':
        return Brain;
      case 'IDEA':
        return Lightbulb;
      case 'TASK':
        return CheckSquare;
      case 'QUESTION':
        return HelpCircle;
      case 'PROJECT':
        return Layers;
      default:
        return Brain;
    }
  };

  // Handle node creation
  const handleCreateNode = () => {
    if (!nodeLabel.trim()) return;
    
    onCreateNode({
      type: nodeType,
      theme: nodeTheme,
      energyLevel: energyLevel,
      label: nodeLabel,
      isExpanded: false,
      position: position || { x: Math.random() * 300, y: Math.random() * 300 },
    });
    
    // Reset form
    setNodeLabel('');
    setStep(1);
    
    // Close panel if floating
    if (isFloating && onClose) {
      onClose();
    }
  };

  // Toggle panel expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 shadow-md overflow-hidden",
        isFloating ? "absolute z-10" : "w-full"
      )}
      style={position ? { top: position.y, left: position.x } : undefined}
    >
      {/* Panel Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 flex items-center justify-between">
        <h3 className="text-white font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isExpanded ? 'Create New Node' : ''}
        </h3>
        <div className="flex items-center gap-1">
          {!isFloating && (
            <button
              onClick={toggleExpanded}
              className="p-1 rounded-full hover:bg-white/20 text-white"
            >
              {isExpanded ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          )}
          {isFloating && onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Node Type
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.keys(NODE_TYPES).map((type) => {
                        const TypeIcon = getNodeTypeIcon(type as keyof typeof NODE_TYPES);
                        return (
                          <button
                            key={type}
                            onClick={() => setNodeType(type as keyof typeof NODE_TYPES)}
                            className={cn(
                              "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                              nodeType === type 
                                ? "border-primary-400 bg-primary-50" 
                                : "border-neutral-200 hover:border-primary-200"
                            )}
                          >
                            <TypeIcon className={cn(
                              "w-5 h-5 mb-1",
                              nodeType === type ? "text-primary-500" : "text-neutral-500"
                            )} />
                            <span className={cn(
                              "text-sm font-bold px-2 py-0.5 rounded",
                              nodeType === type 
                                ? "bg-primary-100 text-primary-700" 
                                : "bg-neutral-100 text-neutral-700"
                            )}>
                              {type.charAt(0) + type.slice(1).toLowerCase()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Color Theme
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(NODE_THEMES).map((theme) => {
                        const themeData = NODE_THEMES[theme as keyof typeof NODE_THEMES];
                        return (
                          <button
                            key={theme}
                            onClick={() => setNodeTheme(theme as keyof typeof NODE_THEMES)}
                            className={cn(
                              "w-8 h-8 rounded-full border-2 transition-all",
                              `bg-gradient-to-r ${themeData.gradient}`,
                              nodeTheme === theme 
                                ? "ring-2 ring-offset-2 ring-primary-400" 
                                : "hover:ring-2 hover:ring-offset-1 hover:ring-primary-200"
                            )}
                            title={theme.charAt(0) + theme.slice(1).toLowerCase()}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Energy Level (Optional)
                    </label>
                    <div className="flex gap-2">
                      {Object.keys(ENERGY_LEVELS).map((level) => {
                        const levelData = ENERGY_LEVELS[level as keyof typeof ENERGY_LEVELS];
                        return (
                          <button
                            key={level}
                            onClick={() => setEnergyLevel(
                              energyLevel === level as keyof typeof ENERGY_LEVELS 
                                ? null 
                                : level as keyof typeof ENERGY_LEVELS
                            )}
                            className={cn(
                              "px-4 py-2 rounded-lg text-sm font-bold shadow-sm border transition-all",
                              energyLevel === level 
                                ? `${levelData.color.replace('bg-', 'bg-opacity-100 text-white bg-')} border-transparent` 
                                : `${levelData.color.replace('bg-', 'bg-opacity-20 text-neutral-800 bg-')} border-neutral-200 hover:border-neutral-300`
                            )}
                          >
                            {levelData.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="w-full py-2 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Node Label
                    </label>
                    <input
                      type="text"
                      value={nodeLabel}
                      onChange={(e) => setNodeLabel(e.target.value)}
                      placeholder="Enter node label..."
                      className="w-full px-4 py-3 text-base font-medium text-neutral-800 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="flex-1 py-2.5 px-4 bg-neutral-100 text-neutral-800 rounded-lg font-bold border border-neutral-200 shadow-sm hover:bg-neutral-200 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateNode}
                      disabled={!nodeLabel.trim()}
                      className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg font-bold shadow-sm",
                        nodeLabel.trim() 
                          ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white" 
                          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      )}
                    >
                      Create Node
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 