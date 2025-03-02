import React from 'react';
import { useRouter } from 'next/router';
import { Hero, Features, PricingCards, CTASection, Testimonials } from '../components';

// This is a simple placeholder component that redirects to the app router home page
export default function Home() {
  const router = useRouter();
  
  React.useEffect(() => {
    // Redirect to the main home page in the app directory
    router.replace('/');
  }, [router]);

  // Return a simple loading screen
  // The actual components are just empty placeholders to satisfy the build
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Redirecting...</h1>
        <p className="mt-2 text-gray-600">Please wait while we redirect you to the homepage.</p>
      </div>
    </div>
  );
} 