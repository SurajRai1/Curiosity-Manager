'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Sparkles,
  Brain,
  Timer,
  Calendar,
  Network,
  Settings,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

const mainNavItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Your productivity at a glance',
  },
  {
    title: 'Mind Space',
    href: '/dashboard/mind-space',
    icon: Brain,
    description: 'Organize your thoughts freely',
  },
  {
    title: 'Focus Timer',
    href: '/dashboard/focus',
    icon: Timer,
    description: 'Stay focused and track time',
  },
  {
    title: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    description: 'Visual schedule and reminders',
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: Network,
    description: 'Manage your ongoing projects',
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Add debounce to prevent rapid state changes causing jitter
  const handleMouseEnter = useCallback((title: string) => {
    // Only update if it's different to avoid unnecessary re-renders
    if (activeSection !== title) {
      setActiveSection(title);
    }
  }, [activeSection]);
  
  const handleMouseLeave = useCallback(() => {
    setActiveSection(null);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-sm border border-neutral-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-neutral-600" />
        ) : (
          <Menu className="w-5 h-5 text-neutral-600" />
        )}
      </button>

      {/* Sidebar Container */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-neutral-200 transition-transform duration-200 ease-in-out transform will-change-transform',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
            Curiosity Manager
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                pathname === item.href
                  ? 'bg-primary-50 text-primary-900'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <item.icon className={cn(
                'w-5 h-5 transition-colors duration-200',
                pathname === item.href
                  ? 'text-primary-600'
                  : 'text-neutral-400 group-hover:text-neutral-600'
              )} />
              <span>{item.title}</span>

              {/* Tooltip with optimized animation */}
              <AnimatePresence>
                {activeSection === item.title && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full top-1/2 ml-2 -translate-y-1/2 px-3 py-2 rounded-lg bg-neutral-900 text-white text-xs whitespace-nowrap z-50 pointer-events-none"
                  >
                    {item.description}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-neutral-400" />
            Profile
          </Link>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
} 