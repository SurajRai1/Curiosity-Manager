import { Metadata } from 'next';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export const metadata: Metadata = {
  title: 'Welcome to Curiosity Manager - Quick Setup',
  description: 'Set up your personalized ADHD-friendly workspace in just a few steps.',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <OnboardingFlow />
    </div>
  );
} 