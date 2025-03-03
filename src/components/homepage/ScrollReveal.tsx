'use client';

import { useRef, useEffect, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

/**
 * ScrollReveal component that adds subtle animations to elements
 * as they enter the viewport, without affecting the overall design.
 */
export default function ScrollReveal({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  direction = 'up'
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    // Initial state - hidden
    currentRef.style.opacity = '0';
    currentRef.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    
    // Set initial transform based on direction
    switch (direction) {
      case 'up':
        currentRef.style.transform = 'translateY(30px)';
        break;
      case 'down':
        currentRef.style.transform = 'translateY(-30px)';
        break;
      case 'left':
        currentRef.style.transform = 'translateX(30px)';
        break;
      case 'right':
        currentRef.style.transform = 'translateX(-30px)';
        break;
      case 'none':
        currentRef.style.transform = 'none';
        break;
    }
    
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is in view - animate in
            currentRef.style.opacity = '1';
            currentRef.style.transform = 'translate(0, 0)';
            
            // Stop observing after animation
            observer.unobserve(currentRef);
          }
        });
      },
      { threshold }
    );
    
    // Start observing
    observer.observe(currentRef);
    
    // Cleanup
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, delay, direction]);
  
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
} 