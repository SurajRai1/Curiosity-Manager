'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectService } from '@/lib/services/ProjectService';
import { Project } from '@/types/dashboard';
import { 
  FolderKanban, 
  PlusCircle, 
  ListTodo, 
  Calendar, 
  Grid3X3, 
  Search,
  Info,
  SlidersHorizontal,
  Hourglass,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import CreateProjectDialog from './components/CreateProjectDialog';
import FilterPanel from './components/FilterPanel';

// Layout view options
type LayoutView = 'grid' | 'list';

export default function ProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutView, setLayoutView] = useState<LayoutView>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Extract a more user-friendly error message
      let errorMessage = 'Failed to load projects. Please try again.';
      
      if (error instanceof Error) {
        // If it's an authentication error, provide a specific message
        if (error.message.includes('Authentication required')) {
          errorMessage = 'Please sign in to view your projects.';
        } else if (error.message.includes('Database error')) {
          errorMessage = 'There was an issue connecting to the database. Please try again later.';
        } else {
          // Use the error message but keep it user-friendly
          errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredProjects(filtered);
  };

  const handleCreateProject = async (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
    toast({
      title: 'Project created',
      description: `Successfully created project "${newProject.name}"`,
    });
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(p => p.id === updatedProject.id ? updatedProject : p)
    );
    
    if (selectedProject && selectedProject.id === updatedProject.id) {
      setSelectedProject(updatedProject);
    }
    
    toast({
      title: 'Project updated',
      description: `Successfully updated project "${updatedProject.name}"`,
    });
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await ProjectService.deleteProject(projectId);
      
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
        setIsDetailViewOpen(false);
      }
      
      toast({
        title: 'Project deleted',
        description: 'Project has been successfully deleted',
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailViewOpen(true);
  };

  const handleRetry = () => {
    fetchProjects();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section - Moved outside AnimatePresence */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-primary-500" />
              Projects
            </h1>
            <p className="text-neutral-500 mt-2">
              Organize your work into manageable projects with visual cues
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-primary-500 hover:bg-primary-600 transition-colors text-white py-3 px-5 rounded-xl font-medium flex items-center gap-2 self-start mt-2 md:mt-0 shadow-sm"
          >
            <PlusCircle className="h-5 w-5" />
            New Project
          </motion.button>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 mt-6 items-start md:items-center">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
            />
          </div>
          
          <div className="flex items-center ml-auto gap-2">
            <div className="bg-white rounded-xl overflow-hidden flex border border-neutral-200 p-1 shadow-sm">
              <button
                onClick={() => setLayoutView('grid')}
                className={`p-2 rounded-lg ${
                  layoutView === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setLayoutView('list')}
                className={`p-2 rounded-lg ${
                  layoutView === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-neutral-500 hover:bg-neutral-100'
                }`}
                aria-label="List view"
              >
                <ListTodo className="h-5 w-5" />
              </button>
            </div>
            
            <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`p-2 rounded-xl border ${
                isFilterPanelOpen
                  ? 'bg-primary-100 text-primary-600 border-primary-200'
                  : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>
      
      {/* Main Content - Single AnimatePresence */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 h-80"
          >
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <RefreshCw className="w-12 h-12 text-primary-500" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-neutral-700">Loading projects...</h3>
              <p className="mt-2 text-neutral-500 text-center max-w-md">
                Hang tight while we fetch your projects. This should only take a moment.
              </p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 h-80"
          >
            <div className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-neutral-700">{error}</h3>
              <p className="mt-2 text-neutral-500 text-center max-w-md">
                We encountered an issue while loading your projects. This might be due to a connection problem.
              </p>
              <button
                onClick={handleRetry}
                className="mt-6 px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 h-80"
          >
            <div className="flex flex-col items-center">
              <FolderKanban className="w-16 h-16 text-neutral-300" />
              <h3 className="mt-4 text-lg font-medium text-neutral-700">
                {searchQuery ? 'No matching projects found' : 'No projects yet'}
              </h3>
              <p className="mt-2 text-neutral-500 text-center max-w-md">
                {searchQuery
                  ? `We couldn't find any projects matching "${searchQuery}". Try a different search or clear your filters.`
                  : "You haven't created any projects yet. Create your first project to get started."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-6 px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create First Project
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <div key="content">
            <div className="flex mb-6">
              {isFilterPanelOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="mr-6 w-72"
                >
                  <FilterPanel onClose={() => setIsFilterPanelOpen(false)} />
                </motion.div>
              )}
              
              <div className={`flex-1 ${layoutView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    layoutView={layoutView}
                    onClick={() => handleProjectClick(project)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Project Detail View */}
      {selectedProject && (
        <ProjectDetail
          isOpen={isDetailViewOpen}
          onClose={() => setIsDetailViewOpen(false)}
          project={selectedProject}
          onUpdate={handleUpdateProject}
          onDelete={() => handleDeleteProject(selectedProject.id)}
        />
      )}
      
      {/* Create Project Dialog */}
      <CreateProjectDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onProjectCreated={handleCreateProject}
      />
    </div>
  );
} 