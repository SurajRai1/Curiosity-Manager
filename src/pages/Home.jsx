import React from 'react';
import { useRouter } from 'next/router';

// Simple redirect component with no external dependencies
export default function Home() {
  const router = useRouter();
  
  React.useEffect(() => {
    // Redirect to the main home page in the app directory
    router.replace('/');
  }, [router]);

  // Simple loading screen with no component dependencies
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#111827'
        }}>
          Redirecting...
        </h1>
        <p style={{ 
          marginTop: '0.5rem',
          color: '#4b5563'
        }}>
          Please wait while we redirect you to the homepage.
        </p>
      </div>
    </div>
  );
} 