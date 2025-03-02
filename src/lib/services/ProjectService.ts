import { supabase } from '@/lib/supabase';
import { Project } from '@/types/dashboard';
import { v4 as uuidv4 } from 'uuid';

export interface CreateProjectData {
  name: string;
  description?: string;
  color: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
}

export class ProjectService {
  /**
   * Fetch all projects for the authenticated user
   */
  static async getProjects(): Promise<Project[]> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('Authentication error:', userError);
        throw new Error('Authentication required: ' + (userError?.message || 'User not found'));
      }
      
      // Fetch projects without trying to join tasks
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase query error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Database error: ${error.message || 'Unknown error'}`);
      }
      
      if (!data) {
        console.log('No data returned from Supabase, returning empty array');
        return [];
      }
      
      console.log(`Successfully fetched ${data.length} projects`);
      
      // Transform the data to match our Project interface
      return data.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        color: project.color,
        tasks: [], // Initialize with empty tasks array
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Re-throw with a more descriptive message
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching projects');
      }
    }
  }
  
  /**
   * Fetch a single project by ID
   */
  static async getProject(id: string): Promise<Project> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required');
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', userData.user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Transform the data to match our Project interface
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        tasks: [], // Initialize with empty tasks array
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new project
   */
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required');
      }
      
      const projectId = uuidv4();
      const newProject = {
        id: projectId,
        user_id: userData.user.id,
        name: projectData.name,
        description: projectData.description || '',
        color: projectData.color,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      // Return the created project
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        tasks: [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing project
   */
  static async updateProject(id: string, projectData: UpdateProjectData): Promise<Project> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required');
      }
      
      const updateData = {
        ...projectData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userData.user.id)
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      // Return the updated project
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        color: data.color,
        tasks: [], // Initialize with empty tasks array
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error(`Error updating project with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a project
   */
  static async deleteProject(id: string): Promise<void> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required');
      }
      
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Add a task to a project
   */
  static async addTaskToProject(projectId: string, taskId: string): Promise<void> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required');
      }
      
      // Update the task to add the project ID
      const { error } = await supabase
        .from('tasks')
        .update({ project_id: projectId })
        .eq('id', taskId)
        .eq('user_id', userData.user.id);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error adding task ${taskId} to project ${projectId}:`, error);
      throw error;
    }
  }
  
  /**
   * Remove a task from a project
   */
  static async removeTaskFromProject(taskId: string): Promise<void> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('Authentication required');
      }
      
      // Update the task to remove the project ID
      const { error } = await supabase
        .from('tasks')
        .update({ project_id: null })
        .eq('id', taskId)
        .eq('user_id', userData.user.id);
        
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error removing task ${taskId} from project:`, error);
      throw error;
    }
  }
  
  /**
   * Get sample project colors
   */
  static getProjectColors() {
    return [
      { name: 'Berry Red', value: '#e01e5a' },
      { name: 'Orange', value: '#ff8000' },
      { name: 'Yellow', value: '#ffcc00' },
      { name: 'Olive Green', value: '#94c14f' },
      { name: 'Cyan Blue', value: '#00b8d9' },
      { name: 'Royal Blue', value: '#4c9aff' },
      { name: 'Purple', value: '#9e48cd' },
      { name: 'Magenta', value: '#fc0fc0' },
      { name: 'Gray', value: '#808080' },
      { name: 'Brown', value: '#8d6e63' }
    ];
  }
} 