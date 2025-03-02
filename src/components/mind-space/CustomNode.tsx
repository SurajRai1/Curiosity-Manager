import { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { Edit, Trash2, Maximize2, Minimize2, Plus, X, Check, MoveHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

// Node types for different visual styles
export const NODE_TYPES = {
  THOUGHT: 'thought',
  TASK: 'task',
  PROJECT: 'project',
  IDEA: 'idea',
  QUESTION: 'question',
};

// Color themes for nodes
export const NODE_THEMES = {
  PURPLE: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    hoverBorder: 'group-hover:border-purple-400',
    icon: 'text-purple-500',
    gradient: 'from-purple-400 to-indigo-500',
  },
  BLUE: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    hoverBorder: 'group-hover:border-blue-400',
    icon: 'text-blue-500',
    gradient: 'from-blue-400 to-cyan-500',
  },
  GREEN: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    hoverBorder: 'group-hover:border-green-400',
    icon: 'text-green-500',
    gradient: 'from-green-400 to-emerald-500',
  },
  AMBER: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    hoverBorder: 'group-hover:border-amber-400',
    icon: 'text-amber-500',
    gradient: 'from-amber-400 to-orange-500',
  },
  PINK: {
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    hoverBorder: 'group-hover:border-pink-400',
    icon: 'text-pink-500',
    gradient: 'from-pink-400 to-rose-500',
  },
};

// Energy levels for visual indication
export const ENERGY_LEVELS = {
  HIGH: { label: 'High Energy', color: 'bg-green-400' },
  MEDIUM: { label: 'Medium Energy', color: 'bg-amber-400' },
  LOW: { label: 'Low Energy', color: 'bg-blue-400' },
};

interface CustomNodeData {
  label: string;
  type?: keyof typeof NODE_TYPES;
  theme?: keyof typeof NODE_THEMES;
  energyLevel?: keyof typeof ENERGY_LEVELS;
  details?: string;
  tags?: string[];
  isExpanded?: boolean;
  width?: number;
  onResize?: (nodeId: string, width: number) => void;
  onLabelChange?: (nodeId: string, label: string) => void;
  onExpandToggle?: (nodeId: string, isExpanded: boolean) => void;
  onDelete?: (nodeId: string) => void;
  onAddConnection?: (nodeId: string) => void;
}

export default function CustomNode({ data, id, selected }: NodeProps<CustomNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeLabel, setNodeLabel] = useState(data.label);
  const [isExpanded, setIsExpanded] = useState(data.isExpanded || false);
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(data.width || (isExpanded ? 280 : 200));
  
  // Default to THOUGHT type and PURPLE theme if not specified
  const nodeType = data.type || 'THOUGHT';
  const nodeTheme = NODE_THEMES[data.theme || 'PURPLE'];
  const energyLevel = data.energyLevel ? ENERGY_LEVELS[data.energyLevel] : undefined;

  // Handle mouse move for resizing
  useEffect(() => {
    let startX = 0;
    let startWidth = 0;

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startWidth = nodeWidth;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        // Calculate new width based on mouse movement from the starting point
        const deltaX = e.clientX - startX;
        const newWidth = Math.max(200, startWidth + deltaX);
        setNodeWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        // Save the new width to the node data
        if (data.onResize) {
          data.onResize(id, nodeWidth);
        }
      }
    };

    if (isResizing) {
      // Capture the starting position
      handleMouseDown(window.event as MouseEvent);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, id, nodeWidth, data.onResize]);

  // Update label in parent when editing is complete
  const handleLabelUpdate = () => {
    setIsEditing(false);
    // Here you would typically update the node data in the parent component
    // This would require a callback function passed through data
    if (data.onLabelChange) {
      data.onLabelChange(id, nodeLabel);
    }
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    // Here you would typically update the node data in the parent component
    if (data.onExpandToggle) {
      data.onExpandToggle(id, !isExpanded);
    }
  };

  // Handle delete node
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: selected 
          ? '0 0 0 2px rgba(99, 102, 241, 0.8)' 
          : isHovered 
            ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
            : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-xl border-2 transition-all duration-200',
        nodeTheme.bg,
        nodeTheme.border,
        nodeTheme.hoverBorder,
        selected && 'ring-2 ring-primary-200',
        isResizing && 'ring-2 ring-amber-400'
      )}
      style={{ 
        width: `${nodeWidth}px`,
        minWidth: isExpanded ? '280px' : '200px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Width indicator - only visible when resizing */}
      {isResizing && (
        <div className="absolute -top-7 right-0 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-md">
          {Math.round(nodeWidth)}px
        </div>
      )}
      
      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-primary-400 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-primary-400 border-2 border-white"
      />
      
      {/* Energy level indicator */}
      {energyLevel && (
        <div className="absolute -top-1 -right-1">
          <div 
            className={cn(
              "w-3 h-3 rounded-full border border-white",
              energyLevel.color
            )}
            title={energyLevel.label}
          />
        </div>
      )}

      {/* Node header with controls */}
      <div className="p-3 flex items-center justify-between border-b border-neutral-200">
        {isEditing ? (
          <div className="flex items-center w-full">
            <input
              type="text"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
              className="flex-1 bg-white rounded px-3 py-2 text-base font-medium text-neutral-800 border-2 border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 shadow-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLabelUpdate();
                if (e.key === 'Escape') {
                  setNodeLabel(data.label);
                  setIsEditing(false);
                }
              }}
            />
            <button 
              onClick={handleLabelUpdate}
              className="ml-2 p-2 rounded-full hover:bg-green-100 text-green-600 border border-green-200 shadow-sm"
            >
              <Check className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                setNodeLabel(data.label);
                setIsEditing(false);
              }}
              className="ml-1 p-2 rounded-full hover:bg-red-100 text-red-600 border border-red-200 shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <div className="text-base font-bold text-neutral-800 break-words max-w-[calc(100%-80px)]">
              {nodeLabel}
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setIsEditing(true)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
                title="Edit"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={toggleExpanded}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button 
                onClick={handleDelete}
                className="p-1 rounded-full hover:bg-red-100 text-red-500"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Node content */}
      <div className="p-3">
        {isExpanded && data.details && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-2.5 bg-white/80 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-800 shadow-sm break-words"
          >
            {data.details}
          </motion.div>
        )}

        {/* Tags */}
        {isExpanded && data.tags && data.tags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-1 mt-2"
          >
            {data.tags.map((tag, index) => (
              <span 
                key={index}
                className={cn(
                  "px-2.5 py-1 text-sm font-medium rounded-full shadow-sm",
                  `bg-gradient-to-r ${nodeTheme.gradient} text-white`
                )}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Add connection button - visible on hover */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <button 
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shadow-md",
              `bg-gradient-to-r ${nodeTheme.gradient} text-white`
            )}
            title="Add connection"
            onClick={() => {
              if (data.onAddConnection) {
                data.onAddConnection(id);
              }
            }}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Resize handle - visible on hover */}
      <div 
        className="absolute bottom-0 right-0 w-6 h-6 cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={(e) => {
          e.stopPropagation();
          setIsResizing(true);
        }}
        title="Resize node"
      >
        <div className="absolute bottom-1 right-1 p-1 rounded-full bg-white/80 border border-neutral-200 shadow-sm hover:bg-neutral-100 text-neutral-500">
          <MoveHorizontal className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
} 