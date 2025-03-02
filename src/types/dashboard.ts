export interface UserPreferences {
  theme: string;
  layout: string;
  notifications: string[];
  workStyle: string[];
  adhdTraits: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  tags: string[];
  project?: string;
  energyLevel?: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  actualTime?: number;
  notes?: string;
  subtasks?: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

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