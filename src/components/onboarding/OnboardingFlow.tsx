'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Brain, Clock, Zap, Target, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import WelcomeStep from './steps/WelcomeStep';
import WorkStyleStep from './steps/WorkStyleStep';
import ADHDTraitsStep from './steps/ADHDTraitsStep';
import CustomizationStep from './steps/CustomizationStep';
import FinalStep from './steps/FinalStep';

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'workStyle', title: 'Work Style', icon: Brain },
  { id: 'adhdTraits', title: 'ADHD Profile', icon: Target },
  { id: 'customization', title: 'Customize', icon: Zap },
  { id: 'final', title: 'All Set!', icon: Clock },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    workStyle: [],
    adhdTraits: [],
    preferences: {},
    goals: [],
  });

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleUpdateData = (stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const renderStep = () => {
    switch (currentStep.id) {
      case 'welcome':
        return <WelcomeStep onNext={handleNext} />;
      case 'workStyle':
        return (
          <WorkStyleStep
            data={formData.workStyle}
            onUpdate={(data) => handleUpdateData('workStyle', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'adhdTraits':
        return (
          <ADHDTraitsStep
            data={formData.adhdTraits}
            onUpdate={(data) => handleUpdateData('adhdTraits', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'customization':
        return (
          <CustomizationStep
            data={formData.preferences}
            onUpdate={(data) => handleUpdateData('preferences', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 'final':
        return (
          <FinalStep
            data={formData}
            onComplete={() => router.push('/dashboard')}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress Header */}
      <div className="fixed top-0 inset-x-0 h-2 bg-neutral-100">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps Indicator */}
      <div className="pt-8 px-6 pb-4 bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index <= currentStepIndex
                  ? 'text-primary-600'
                  : 'text-neutral-400'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStepIndex
                      ? 'bg-primary-100'
                      : 'bg-neutral-100'
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                <span className="hidden sm:block ml-2 text-sm font-medium">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`hidden sm:block w-12 h-px mx-2 ${
                    index < currentStepIndex
                      ? 'bg-primary-600'
                      : 'bg-neutral-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 overflow-y-auto min-h-[calc(100vh-13rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-neutral-200 p-4 z-10">
        <div className="max-w-3xl mx-auto flex justify-between">
          {currentStepIndex > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            {currentStepIndex === steps.length - 1 ? 'Get Started' : 'Continue'}
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
} 