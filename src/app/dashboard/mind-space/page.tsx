'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Save, Trash2, Download, Upload, Zap, Brain, FileImage, FilePdf, LayoutTemplate } from 'lucide-react';
import CustomNode from '@/components/mind-space/CustomNode';
import NodeCreationPanel from '@/components/mind-space/NodeCreationPanel';
import TemplateSelector from '@/components/mind-space/TemplateSelector';
import ExportOptions from '@/components/mind-space/ExportOptions';
import { MindMapService, MindMapTemplate } from '@/lib/services/MindMapService';
import { cn } from '@/lib/utils';

// Define node types
const nodeTypes = {
  custom: CustomNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Welcome to Mind Space!', 
      type: 'THOUGHT',
      theme: 'PURPLE',
      energyLevel: 'MEDIUM',
      isExpanded: true,
      notes: 'This is your visual thinking space. Connect ideas, track thoughts, and organize your mind.',
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 300 },
    data: { 
      label: 'Create new nodes', 
      type: 'IDEA',
      theme: 'BLUE',
      energyLevel: 'HIGH',
      isExpanded: false,
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 300 },
    data: { 
      label: 'Connect your thoughts', 
      type: 'TASK',
      theme: 'GREEN',
      energyLevel: 'LOW',
      isExpanded: false,
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
];

export default function MindSpacePage() {
  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showCreationPanel, setShowCreationPanel] = useState(false);
  const [creationPanelPosition, setCreationPanelPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [mindMapName, setMindMapName] = useState('Untitled Mind Map');
  const reactFlowRef = useRef<HTMLDivElement | null>(null);

  // Load saved mind space data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate loading
      const savedData = localStorage.getItem('mindSpaceData');
      if (savedData) {
        try {
          const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
          setNodes(savedNodes);
          setEdges(savedEdges);
        } catch (error) {
          console.error('Failed to load saved mind space data:', error);
        }
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setNodes, setEdges]);

  // Save mind space data
  const saveMindSpace = useCallback(() => {
    setIsSaving(true);
    try {
      localStorage.setItem('mindSpaceData', JSON.stringify({ nodes, edges }));
      
      // Show success animation
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save mind space data:', error);
      setIsSaving(false);
    }
  }, [nodes, edges]);

  // Handle connection between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    setSelectedNodes(nodes);
  }, []);

  // Delete selected nodes
  const deleteSelectedNodes = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !selectedNodes.some((n) => n.id === node.id)));
    
    // Also remove any connected edges
    const selectedNodeIds = selectedNodes.map((node) => node.id);
    setEdges((eds) => 
      eds.filter(
        (edge) => 
          !selectedNodeIds.includes(edge.source) && 
          !selectedNodeIds.includes(edge.target)
      )
    );
    
    setSelectedNodes([]);
  }, [selectedNodes, setNodes, setEdges]);

  // Handle node creation
  const handleCreateNode = useCallback(
    (nodeData: any) => {
      const newNode = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position: nodeData.position,
        data: {
          label: nodeData.label,
          type: nodeData.type,
          theme: nodeData.theme,
          energyLevel: nodeData.energyLevel,
          isExpanded: nodeData.isExpanded,
          width: nodeData.width || 200, // Default width
        },
      };
      
      setNodes((nds) => [...nds, newNode]);
      setShowCreationPanel(false);
    },
    [setNodes]
  );

  // Handle node resize
  const handleNodeResize = useCallback(
    (nodeId: string, newWidth: number) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            // Update the node width in the data
            return {
              ...node,
              data: {
                ...node.data,
                width: newWidth,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Handle node label update
  const handleNodeLabelChange = useCallback(
    (nodeId: string, newLabel: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label: newLabel,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Handle node expansion toggle
  const handleNodeExpandToggle = useCallback(
    (nodeId: string, isExpanded: boolean) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                isExpanded,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  // Handle node deletion
  const handleNodeDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      
      // Also remove any connected edges
      setEdges((eds) => 
        eds.filter(
          (edge) => 
            edge.source !== nodeId && 
            edge.target !== nodeId
        )
      );
    },
    [setNodes, setEdges]
  );

  // Handle background click to create a node
  const onBackgroundClick = useCallback(
    (event: React.MouseEvent) => {
      if (reactFlowWrapper.current && reactFlowInstance) {
        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        });
        
        setCreationPanelPosition(position);
        setShowCreationPanel(true);
      }
    },
    [reactFlowInstance]
  );

  // Export mind space as JSON
  const exportMindSpace = useCallback(() => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `mind-space-export-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  // Import mind space from JSON
  const importMindSpace = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const { nodes: importedNodes, edges: importedEdges } = JSON.parse(event.target.result);
          setNodes(importedNodes);
          setEdges(importedEdges);
        } catch (error) {
          console.error('Failed to import mind space data:', error);
          alert('Failed to import mind space data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  }, [setNodes, setEdges]);

  // Apply template
  const applyTemplate = useCallback((template: MindMapTemplate) => {
    if (template.id === 'blank') {
      // Clear the canvas
      setNodes([]);
      setEdges([]);
    } else {
      // Apply the template nodes and edges
      setNodes(template.nodes.map(node => ({
        ...node,
        type: 'custom',
      })));
      setEdges(template.edges);
    }
    setShowTemplateSelector(false);
    setMindMapName(template.name);
  }, [setNodes, setEdges]);

  // Export mind space as PNG
  const exportAsPNG = useCallback(async () => {
    if (!reactFlowRef.current) return;
    
    try {
      await MindMapService.exportAsPNG(reactFlowRef.current, mindMapName);
    } catch (error) {
      console.error('Failed to export as PNG:', error);
      alert('Failed to export as PNG. Please try again.');
    }
  }, [reactFlowRef, mindMapName]);

  // Export mind space as PDF
  const exportAsPDF = useCallback(async () => {
    if (!reactFlowRef.current) return;
    
    try {
      await MindMapService.exportAsPDF(reactFlowRef.current, mindMapName);
    } catch (error) {
      console.error('Failed to export as PDF:', error);
      alert('Failed to export as PDF. Please try again.');
    }
  }, [reactFlowRef, mindMapName]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Loading Mind Space</h2>
          <p className="text-neutral-600">Preparing your visual thinking environment...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-50">
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className="h-full w-full">
          <ReactFlow
            ref={reactFlowRef}
            nodes={nodes.map(node => ({
              ...node,
              data: {
                ...node.data,
                onResize: handleNodeResize,
                onLabelChange: handleNodeLabelChange,
                onExpandToggle: handleNodeExpandToggle,
                onDelete: handleNodeDelete,
              }
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onPaneClick={onBackgroundClick}
            nodeTypes={nodeTypes}
            fitView
            onInit={setReactFlowInstance}
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{
              style: { strokeWidth: 2 },
              type: 'smoothstep',
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#aaa" gap={16} size={1} />
            <Controls />
            <MiniMap 
              nodeStrokeColor={(n) => {
                const nodeData = n.data;
                if (nodeData.theme === 'PURPLE') return '#8b5cf6';
                if (nodeData.theme === 'BLUE') return '#3b82f6';
                if (nodeData.theme === 'GREEN') return '#10b981';
                if (nodeData.theme === 'AMBER') return '#f59e0b';
                if (nodeData.theme === 'PINK') return '#ec4899';
                return '#888';
              }}
              nodeColor={(n) => {
                const nodeData = n.data;
                if (nodeData.theme === 'PURPLE') return '#c4b5fd';
                if (nodeData.theme === 'BLUE') return '#93c5fd';
                if (nodeData.theme === 'GREEN') return '#6ee7b7';
                if (nodeData.theme === 'AMBER') return '#fcd34d';
                if (nodeData.theme === 'PINK') return '#f9a8d4';
                return '#ddd';
              }}
              maskColor="rgba(240, 240, 240, 0.6)"
            />
            
            {/* Fixed Node Creation Panel */}
            <Panel position="top-left" className="p-2">
              <NodeCreationPanel 
                onCreateNode={handleCreateNode}
                isFloating={false}
              />
            </Panel>
            
            {/* Floating Node Creation Panel */}
            <AnimatePresence>
              {showCreationPanel && creationPanelPosition && (
                <div className="absolute" style={{ top: 0, left: 0, zIndex: 10 }}>
                  <NodeCreationPanel 
                    onCreateNode={handleCreateNode}
                    position={creationPanelPosition}
                    onClose={() => setShowCreationPanel(false)}
                    isFloating={true}
                  />
                </div>
              )}
            </AnimatePresence>
            
            {/* Action Buttons */}
            <Panel position="top-right" className="p-2 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={mindMapName}
                  onChange={(e) => setMindMapName(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-neutral-300 bg-white/80 text-neutral-800 font-medium shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Mind Map Name"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveMindSpace}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md",
                  isSaving 
                    ? "bg-green-500" 
                    : "bg-gradient-to-r from-primary-500 to-secondary-500"
                )}
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Save className="w-4 h-4" />
                    </motion.div>
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </motion.button>
              
              {selectedNodes.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteSelectedNodes}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium shadow-md"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedNodes.length})
                </motion.button>
              )}
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExportOptions(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-neutral-700 text-white font-medium shadow-md"
                  title="Export Mind Space"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={importMindSpace}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-neutral-700 text-white font-medium shadow-md"
                  title="Import Mind Space"
                >
                  <Upload className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTemplateSelector(true)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-neutral-700 text-white font-medium shadow-md"
                  title="Choose Template"
                >
                  <LayoutTemplate className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTips(!showTips)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg font-medium shadow-md",
                    showTips 
                      ? "bg-amber-500 text-white" 
                      : "bg-neutral-200 text-neutral-700"
                  )}
                  title={showTips ? "Hide Tips" : "Show Tips"}
                >
                  <Zap className="w-4 h-4" />
                </motion.button>
              </div>
            </Panel>
            
            {/* Tips Panel */}
            <AnimatePresence>
              {showTips && (
                <Panel position="bottom-center" className="p-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-amber-200 max-w-2xl"
                  >
                    <h3 className="text-lg font-bold text-amber-600 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Mind Space Tips
                    </h3>
                    <ul className="text-sm text-neutral-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Click anywhere</strong> on the background to create a new node</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Drag from handles</strong> to connect nodes together</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Select multiple nodes</strong> by dragging a selection box</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Double-click</strong> on a node to edit its content</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Resize nodes</strong> using the handle in the bottom-right corner</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Use templates</strong> to quickly start with common mind map structures</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span><strong>Export your mind map</strong> as PNG or PDF to share or print</span>
                      </li>
                    </ul>
                  </motion.div>
                </Panel>
              )}
            </AnimatePresence>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      
      {/* Template Selector Modal */}
      <AnimatePresence>
        {showTemplateSelector && (
          <TemplateSelector 
            onSelectTemplate={applyTemplate}
            onClose={() => setShowTemplateSelector(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Export Options Modal */}
      <AnimatePresence>
        {showExportOptions && (
          <ExportOptions 
            onExportPNG={exportAsPNG}
            onExportPDF={exportAsPDF}
            onClose={() => setShowExportOptions(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 