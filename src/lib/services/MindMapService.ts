import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Node, Edge } from 'reactflow';

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export interface MindMap {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  created_at?: string;
  updated_at?: string;
}

export interface MindMapTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

export class MindMapService {
  /**
   * Save a mind map to the database
   */
  static async saveMindMap(mindMap: MindMap): Promise<MindMap> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const userId = session.data.session.user.id;
    
    const { data, error } = await supabase
      .from('mind_maps')
      .insert({
        user_id: userId,
        name: mindMap.name,
        description: mindMap.description || '',
        nodes: mindMap.nodes,
        edges: mindMap.edges,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving mind map:', error);
      throw error;
    }
    
    return data as MindMap;
  }

  /**
   * Update an existing mind map
   */
  static async updateMindMap(mindMap: MindMap): Promise<MindMap> {
    if (!mindMap.id) {
      throw new Error('Mind map ID is required for updates');
    }

    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('mind_maps')
      .update({
        name: mindMap.name,
        description: mindMap.description,
        nodes: mindMap.nodes,
        edges: mindMap.edges,
        updated_at: new Date().toISOString(),
      })
      .eq('id', mindMap.id)
      .eq('user_id', session.data.session.user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating mind map:', error);
      throw error;
    }
    
    return data as MindMap;
  }

  /**
   * Get all mind maps for the current user
   */
  static async getMindMaps(): Promise<MindMap[]> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .eq('user_id', session.data.session.user.id)
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching mind maps:', error);
      throw error;
    }
    
    return data as MindMap[];
  }

  /**
   * Get a specific mind map by ID
   */
  static async getMindMap(id: string): Promise<MindMap> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('mind_maps')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.data.session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching mind map:', error);
      throw error;
    }
    
    return data as MindMap;
  }

  /**
   * Delete a mind map
   */
  static async deleteMindMap(id: string): Promise<void> {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('mind_maps')
      .delete()
      .eq('id', id)
      .eq('user_id', session.data.session.user.id);
    
    if (error) {
      console.error('Error deleting mind map:', error);
      throw error;
    }
  }

  /**
   * Export mind map as PNG
   */
  static async exportAsPNG(element: HTMLElement, fileName: string = 'mind-map'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#f5f5f5',
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${fileName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      throw error;
    }
  }

  /**
   * Export mind map as PDF
   */
  static async exportAsPDF(element: HTMLElement, fileName: string = 'mind-map'): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#f5f5f5',
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions based on canvas
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      const pdf = new jsPDF('p', 'mm');
      let position = 0;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if the mind map is larger than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${fileName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('Error exporting as PDF:', error);
      throw error;
    }
  }

  /**
   * Get predefined templates
   */
  static getTemplates(): MindMapTemplate[] {
    return [
      {
        id: 'brainstorming',
        name: 'Brainstorming',
        description: 'Organize ideas around a central concept',
        nodes: [
          {
            id: 'central',
            type: 'custom',
            position: { x: 250, y: 200 },
            data: { 
              label: 'Central Idea', 
              type: 'THOUGHT',
              theme: 'PURPLE',
              energyLevel: 'HIGH',
              isExpanded: true,
              width: 200,
            },
          },
          {
            id: 'idea1',
            type: 'custom',
            position: { x: 100, y: 100 },
            data: { 
              label: 'Idea 1', 
              type: 'IDEA',
              theme: 'BLUE',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'idea2',
            type: 'custom',
            position: { x: 400, y: 100 },
            data: { 
              label: 'Idea 2', 
              type: 'IDEA',
              theme: 'GREEN',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'idea3',
            type: 'custom',
            position: { x: 100, y: 300 },
            data: { 
              label: 'Idea 3', 
              type: 'IDEA',
              theme: 'AMBER',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'idea4',
            type: 'custom',
            position: { x: 400, y: 300 },
            data: { 
              label: 'Idea 4', 
              type: 'IDEA',
              theme: 'PINK',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
        ],
        edges: [
          { id: 'e-central-1', source: 'central', target: 'idea1', animated: true },
          { id: 'e-central-2', source: 'central', target: 'idea2', animated: true },
          { id: 'e-central-3', source: 'central', target: 'idea3', animated: true },
          { id: 'e-central-4', source: 'central', target: 'idea4', animated: true },
        ],
      },
      {
        id: 'project-planning',
        name: 'Project Planning',
        description: 'Organize project tasks and milestones',
        nodes: [
          {
            id: 'project',
            type: 'custom',
            position: { x: 250, y: 100 },
            data: { 
              label: 'Project Name', 
              type: 'THOUGHT',
              theme: 'PURPLE',
              energyLevel: 'HIGH',
              isExpanded: true,
              width: 200,
            },
          },
          {
            id: 'phase1',
            type: 'custom',
            position: { x: 100, y: 250 },
            data: { 
              label: 'Phase 1', 
              type: 'TASK',
              theme: 'BLUE',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'phase2',
            type: 'custom',
            position: { x: 400, y: 250 },
            data: { 
              label: 'Phase 2', 
              type: 'TASK',
              theme: 'BLUE',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'task1',
            type: 'custom',
            position: { x: 50, y: 400 },
            data: { 
              label: 'Task 1', 
              type: 'TASK',
              theme: 'GREEN',
              energyLevel: 'LOW',
              isExpanded: false,
              width: 120,
            },
          },
          {
            id: 'task2',
            type: 'custom',
            position: { x: 150, y: 400 },
            data: { 
              label: 'Task 2', 
              type: 'TASK',
              theme: 'GREEN',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 120,
            },
          },
          {
            id: 'task3',
            type: 'custom',
            position: { x: 350, y: 400 },
            data: { 
              label: 'Task 3', 
              type: 'TASK',
              theme: 'GREEN',
              energyLevel: 'HIGH',
              isExpanded: false,
              width: 120,
            },
          },
          {
            id: 'task4',
            type: 'custom',
            position: { x: 450, y: 400 },
            data: { 
              label: 'Task 4', 
              type: 'TASK',
              theme: 'GREEN',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 120,
            },
          },
        ],
        edges: [
          { id: 'e-project-1', source: 'project', target: 'phase1', animated: true },
          { id: 'e-project-2', source: 'project', target: 'phase2', animated: true },
          { id: 'e-phase1-1', source: 'phase1', target: 'task1' },
          { id: 'e-phase1-2', source: 'phase1', target: 'task2' },
          { id: 'e-phase2-1', source: 'phase2', target: 'task3' },
          { id: 'e-phase2-2', source: 'phase2', target: 'task4' },
        ],
      },
      {
        id: 'problem-solving',
        name: 'Problem Solving',
        description: 'Analyze problems and find solutions',
        nodes: [
          {
            id: 'problem',
            type: 'custom',
            position: { x: 250, y: 100 },
            data: { 
              label: 'Problem Statement', 
              type: 'THOUGHT',
              theme: 'AMBER',
              energyLevel: 'HIGH',
              isExpanded: true,
              width: 220,
            },
          },
          {
            id: 'cause1',
            type: 'custom',
            position: { x: 100, y: 250 },
            data: { 
              label: 'Cause 1', 
              type: 'THOUGHT',
              theme: 'PINK',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'cause2',
            type: 'custom',
            position: { x: 400, y: 250 },
            data: { 
              label: 'Cause 2', 
              type: 'THOUGHT',
              theme: 'PINK',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'solution1',
            type: 'custom',
            position: { x: 100, y: 400 },
            data: { 
              label: 'Solution 1', 
              type: 'IDEA',
              theme: 'GREEN',
              energyLevel: 'HIGH',
              isExpanded: false,
              width: 150,
            },
          },
          {
            id: 'solution2',
            type: 'custom',
            position: { x: 400, y: 400 },
            data: { 
              label: 'Solution 2', 
              type: 'IDEA',
              theme: 'GREEN',
              energyLevel: 'MEDIUM',
              isExpanded: false,
              width: 150,
            },
          },
        ],
        edges: [
          { id: 'e-problem-1', source: 'problem', target: 'cause1' },
          { id: 'e-problem-2', source: 'problem', target: 'cause2' },
          { id: 'e-cause1-1', source: 'cause1', target: 'solution1' },
          { id: 'e-cause2-1', source: 'cause2', target: 'solution2' },
        ],
      },
    ];
  }
} 