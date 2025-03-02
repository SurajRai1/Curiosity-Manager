import { supabase, CalendarEvent } from '@/lib/supabase';

export interface CreateCalendarEventData {
  title: string;
  type: 'task' | 'appointment' | 'reminder' | 'break';
  date: string; // ISO format date
  time?: string;
  energyRequired: 'low' | 'medium' | 'high';
  isCompleted?: boolean;
  isUrgent?: boolean;
  duration?: number;
  description?: string;
}

export interface UpdateCalendarEventData extends Partial<CreateCalendarEventData> {}

export class CalendarService {
  /**
   * Create a new calendar event
   */
  static async createEvent(eventData: CreateCalendarEventData): Promise<CalendarEvent> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to create an event');
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([{
          user_id: session.session.user.id,
          title: eventData.title,
          type: eventData.type,
          date: eventData.date,
          time: eventData.time,
          energy_required: eventData.energyRequired,
          is_completed: eventData.isCompleted || false,
          is_urgent: eventData.isUrgent || false,
          duration: eventData.duration,
          description: eventData.description,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating calendar event:', error);
        throw error;
      }

      return this.transformEvent(data);
    } catch (error) {
      console.error('Error in createEvent:', error);
      throw error;
    }
  }

  /**
   * Get all events for a specific date range
   */
  static async getEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to fetch events');
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', session.session.user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        throw error;
      }

      return data.map(this.transformEvent);
    } catch (error) {
      console.error('Error in getEvents:', error);
      throw error;
    }
  }

  /**
   * Get all events for a specific date
   */
  static async getEventsByDate(date: string): Promise<CalendarEvent[]> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to fetch events');
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('date', date)
        .order('time', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        throw error;
      }

      return data.map(this.transformEvent);
    } catch (error) {
      console.error('Error in getEventsByDate:', error);
      throw error;
    }
  }

  /**
   * Update an existing calendar event
   */
  static async updateEvent(eventId: string, eventData: UpdateCalendarEventData): Promise<CalendarEvent> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to update an event');
      }

      const updateData: any = {};
      
      if (eventData.title !== undefined) updateData.title = eventData.title;
      if (eventData.type !== undefined) updateData.type = eventData.type;
      if (eventData.date !== undefined) updateData.date = eventData.date;
      if (eventData.time !== undefined) updateData.time = eventData.time;
      if (eventData.energyRequired !== undefined) updateData.energy_required = eventData.energyRequired;
      if (eventData.isCompleted !== undefined) updateData.is_completed = eventData.isCompleted;
      if (eventData.isUrgent !== undefined) updateData.is_urgent = eventData.isUrgent;
      if (eventData.duration !== undefined) updateData.duration = eventData.duration;
      if (eventData.description !== undefined) updateData.description = eventData.description;
      
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('calendar_events')
        .update(updateData)
        .eq('id', eventId)
        .eq('user_id', session.session.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating calendar event:', error);
        throw error;
      }

      return this.transformEvent(data);
    } catch (error) {
      console.error('Error in updateEvent:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to delete an event');
      }

      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error deleting calendar event:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      throw error;
    }
  }

  /**
   * Toggle the completion status of an event
   */
  static async toggleEventCompletion(eventId: string): Promise<CalendarEvent> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to update an event');
      }

      // First, get the current event to check its completion status
      const { data: currentEvent, error: fetchError } = await supabase
        .from('calendar_events')
        .select('is_completed')
        .eq('id', eventId)
        .eq('user_id', session.session.user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching calendar event:', fetchError);
        throw fetchError;
      }

      // Toggle the completion status
      const { data, error } = await supabase
        .from('calendar_events')
        .update({
          is_completed: !currentEvent.is_completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('user_id', session.session.user.id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling event completion:', error);
        throw error;
      }

      return this.transformEvent(data);
    } catch (error) {
      console.error('Error in toggleEventCompletion:', error);
      throw error;
    }
  }

  /**
   * Get events by energy level
   */
  static async getEventsByEnergyLevel(energyLevel: 'low' | 'medium' | 'high'): Promise<CalendarEvent[]> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('User must be logged in to fetch events');
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', session.session.user.id)
        .eq('energy_required', energyLevel)
        .eq('is_completed', false)
        .gte('date', new Date().toISOString().split('T')[0]) // Only future events
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events by energy level:', error);
        throw error;
      }

      return data.map(this.transformEvent);
    } catch (error) {
      console.error('Error in getEventsByEnergyLevel:', error);
      throw error;
    }
  }

  /**
   * Transform database record to CalendarEvent type
   */
  private static transformEvent(event: any): CalendarEvent {
    return {
      id: event.id,
      user_id: event.user_id,
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      energy_required: event.energy_required,
      is_completed: event.is_completed,
      is_urgent: event.is_urgent,
      duration: event.duration,
      description: event.description,
      created_at: event.created_at,
      updated_at: event.updated_at,
    };
  }
} 