import { supabase } from '@/lib/supabase';

export interface CreateTaskData {
  title: string;
  description?: string;
  energyLevel: 'low' | 'medium' | 'high';
  estimatedTime?: number;
  priority: 'low' | 'medium' | 'high';
  isQuickWin: boolean;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  status?: 'todo' | 'in-progress' | 'done';
  actualTime?: number;
  completedAt?: string;
}

export interface Task extends CreateTaskData {
  id: string;
  userId: string;
  status: 'todo' | 'in-progress' | 'done';
  actualTime?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export class TaskService {
  static async createTask(taskData: CreateTaskData): Promise<Task> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to create a task');
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert([{
        user_id: session.session.user.id,
        title: taskData.title,
        description: taskData.description,
        energy_level: taskData.energyLevel,
        estimated_time: taskData.estimatedTime,
        priority: taskData.priority,
        is_quick_win: taskData.isQuickWin,
        status: 'todo',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return this.transformTask(task);
  }

  static async updateTask(taskId: string, updateData: UpdateTaskData): Promise<Task> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to update a task');
    }

    const updates = {
      ...(updateData.title && { title: updateData.title }),
      ...(updateData.description !== undefined && { description: updateData.description }),
      ...(updateData.energyLevel && { energy_level: updateData.energyLevel }),
      ...(updateData.estimatedTime !== undefined && { estimated_time: updateData.estimatedTime }),
      ...(updateData.priority && { priority: updateData.priority }),
      ...(updateData.isQuickWin !== undefined && { is_quick_win: updateData.isQuickWin }),
      ...(updateData.status && { status: updateData.status }),
      ...(updateData.actualTime !== undefined && { actual_time: updateData.actualTime }),
      ...(updateData.completedAt !== undefined && { completed_at: updateData.completedAt }),
      updated_at: new Date().toISOString(),
    };

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', session.session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return this.transformTask(task);
  }

  static async getTasks(filters?: {
    status?: 'todo' | 'in-progress' | 'done';
    energyLevel?: 'low' | 'medium' | 'high';
    priority?: 'low' | 'medium' | 'high';
    isQuickWin?: boolean;
  }): Promise<Task[]> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to fetch tasks');
    }

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.session.user.id);

    if (filters) {
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.energyLevel) {
        query = query.eq('energy_level', filters.energyLevel);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.isQuickWin !== undefined) {
        query = query.eq('is_quick_win', filters.isQuickWin);
      }
    }

    const { data: tasks, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return tasks.map(this.transformTask);
  }

  static async updateTaskStatus(taskId: string, status: 'todo' | 'inProgress' | 'done'): Promise<boolean> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to update task status');
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        status,
        ...(status === 'done' ? { completed_at: new Date().toISOString() } : {}),
      })
      .eq('id', taskId)
      .eq('user_id', session.session.user.id);

    if (error) {
      console.error('Error updating task status:', error);
      throw error;
    }

    return true;
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to delete a task');
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', session.session.user.id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }

    return true;
  }

  static async getQuickWins(): Promise<Task[]> {
    return this.getTasks({ isQuickWin: true, status: 'todo' });
  }

  static async getTasksByEnergyLevel(energyLevel: 'low' | 'medium' | 'high'): Promise<Task[]> {
    return this.getTasks({ energyLevel, status: 'todo' });
  }

  private static transformTask(task: any): Task {
    return {
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      energyLevel: task.energy_level,
      estimatedTime: task.estimated_time,
      priority: task.priority,
      isQuickWin: task.is_quick_win,
      status: task.status,
      actualTime: task.actual_time,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
    };
  }
} 