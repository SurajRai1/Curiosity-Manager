'use client';

import { ReactNode, useState, useCallback } from 'react';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Task } from '@/lib/services/TaskService';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [recentlyCreatedTask, setRecentlyCreatedTask] = useState<Task | null>(null);

  const handleTaskCreated = useCallback((task: Task) => {
    setRecentlyCreatedTask(task);
    
    // Dispatch a custom event that child components can listen for
    const event = new CustomEvent('task-created', { detail: task });
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50/80">
      {/* Left Sidebar Navigation */}
      <DashboardNav />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        {/* Header */}
        <DashboardHeader onTaskCreated={handleTaskCreated} />

        {/* Main Content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {recentlyCreatedTask && (
              <input 
                type="hidden" 
                id="recently-created-task" 
                value={JSON.stringify(recentlyCreatedTask)} 
              />
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 