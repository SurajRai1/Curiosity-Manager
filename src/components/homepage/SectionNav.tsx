'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: Section[];
}

/**
 * SectionNav component provides a floating navigation for the homepage sections.
 * It highlights the current section as the user scrolls.
 */
export default function SectionNav({ sections }: SectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6, // Section is considered active when 60% visible
    };

    // Create observer to track which section is currently in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      // Cleanup
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections]);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <div className="flex flex-col items-center space-y-4 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="relative p-2 rounded-full transition-colors duration-300 group"
            aria-label={section.label}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(section.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
          >
            {activeSection === section.id ? (
              <motion.div
                layoutId="activeSectionIndicator"
                className="absolute inset-0 bg-primary-500 rounded-full"
                transition={{ duration: 0.3 }}
              />
            ) : null}
            <div
              className={`relative z-10 w-2 h-2 rounded-full ${
                activeSection === section.id
                  ? 'bg-white'
                  : 'bg-neutral-400 group-hover:bg-neutral-600'
              }`}
            />
            <span className="absolute left-0 transform -translate-x-full -translate-y-1/2 top-1/2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium text-neutral-800 whitespace-nowrap">
              {section.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
} 