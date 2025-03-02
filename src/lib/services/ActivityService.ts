import { supabase } from '@/lib/supabase';

export interface UserActivity {
  id: string;
  userId: string;
  timestamp: string;
  focusScore: number;
  energyLevel: number;
  productivityScore: number;
  tasksCompleted: number;
  focusMinutes: number;
  flowStateMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyActivitySummary {
  date: string;
  avgFocusScore: number;
  avgEnergyLevel: number;
  avgProductivityScore: number;
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  totalFlowStateMinutes: number;
}

export class ActivityService {
  static async recordActivity(data: Partial<UserActivity>): Promise<UserActivity> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to record activity');
    }

    const { data: activity, error } = await supabase
      .from('user_activity')
      .insert([{
        focus_score: data.focusScore,
        energy_level: data.energyLevel,
        productivity_score: data.productivityScore,
        tasks_completed: data.tasksCompleted,
        focus_minutes: data.focusMinutes,
        flow_state_minutes: data.flowStateMinutes,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error recording activity:', error);
      throw error;
    }

    return this.transformActivity(activity);
  }

  static async getDailyActivity(
    startDate: Date,
    endDate: Date
  ): Promise<DailyActivitySummary[]> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to fetch activity data');
    }

    const { data, error } = await supabase
      .rpc('get_user_daily_activity', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
      });

    if (error) {
      console.error('Error fetching daily activity:', error);
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((item: any) => ({
      date: item.date,
      avgFocusScore: item.avg_focus_score || 0,
      avgEnergyLevel: item.avg_energy_level || 0,
      avgProductivityScore: item.avg_productivity_score || 0,
      totalTasksCompleted: item.total_tasks_completed || 0,
      totalFocusMinutes: item.total_focus_minutes || 0,
      totalFlowStateMinutes: item.total_flow_state_minutes || 0,
    }));
  }

  static async getCurrentActivity(): Promise<UserActivity | null> {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      throw new Error('User must be logged in to fetch activity');
    }

    const { data: activity, error } = await supabase
      .from('user_activity')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No activity found
      }
      console.error('Error fetching current activity:', error);
      throw error;
    }

    return activity ? this.transformActivity(activity) : null;
  }

  private static transformActivity(activity: any): UserActivity {
    return {
      id: activity.id,
      userId: activity.user_id,
      timestamp: activity.timestamp,
      focusScore: activity.focus_score || 0,
      energyLevel: activity.energy_level || 0,
      productivityScore: activity.productivity_score || 0,
      tasksCompleted: activity.tasks_completed || 0,
      focusMinutes: activity.focus_minutes || 0,
      flowStateMinutes: activity.flow_state_minutes || 0,
      createdAt: activity.created_at,
      updatedAt: activity.updated_at,
    };
  }
} 