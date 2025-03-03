'use client';

import { useEffect } from 'react';

/**
 * SmoothScroll component adds smooth scrolling behavior to anchor links
 * without affecting the design of the page.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Function to handle smooth scrolling
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the clicked element is an anchor link with a hash
      if (target.tagName === 'A') {
        const link = target as HTMLAnchorElement;
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Smooth scroll to the target element
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without causing a page reload
            window.history.pushState(null, '', href);
          }
        }
      }
    };
    
    // Add event listener to the document
    document.addEventListener('click', handleLinkClick);
    
    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
} 