import React from 'react';
import { Hero, Features, PricingCards, CTASection, Testimonials } from '../components';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* Main Features Section */}
      <Features />
      
      {/* Pricing Section */}
      <PricingCards />
      
      {/* Call to Action */}
      <CTASection />
      
      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home; 