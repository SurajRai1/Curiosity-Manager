'use client';

import { motion } from 'framer-motion';
import { Target, Check } from 'lucide-react';

interface ADHDTraitsStepProps {
  data: string[];
  onUpdate: (data: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ADHDTraitsStep({ data, onUpdate }: ADHDTraitsStepProps) {
  const handleToggleTrait = (trait: string) => {
    if (data.includes(trait)) {
      onUpdate(data.filter(t => t !== trait));
    } else {
      onUpdate([...data, trait]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold text-neutral-900"
        >
          Your ADHD Profile
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-neutral-600 max-w-md mx-auto"
        >
          Select the traits that resonate with you most
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {adhdTraits.map((trait, index) => (
          <motion.button
            key={trait.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            onClick={() => handleToggleTrait(trait.id)}
            className={`relative p-6 text-left rounded-xl border-2 transition-all duration-200 ${
              data.includes(trait.id)
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 bg-white hover:border-primary-200'
            }`}
          >
            {data.includes(trait.id) && (
              <div className="absolute top-4 right-4">
                <Check className="w-5 h-5 text-primary-600" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`mt-1 rounded-lg p-2 ${
                data.includes(trait.id) ? 'bg-primary-100' : 'bg-neutral-100'
              }`}>
                <trait.icon className={`w-5 h-5 ${
                  data.includes(trait.id) ? 'text-primary-600' : 'text-neutral-600'
                }`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  data.includes(trait.id) ? 'text-primary-900' : 'text-neutral-900'
                }`}>
                  {trait.title}
                </h3>
                <p className={`text-sm ${
                  data.includes(trait.id) ? 'text-primary-700' : 'text-neutral-600'
                }`}>
                  {trait.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-2"
      >
        <p className="text-sm text-neutral-500">
          Your selections help us tailor the experience to your needs
        </p>
        <p className="text-xs text-neutral-400">
          This information is private and only used for personalization
        </p>
      </motion.div>
    </div>
  );
}

const adhdTraits = [
  {
    id: 'hyperfocus',
    title: 'Hyperfocus Powers',
    description: 'I can become deeply absorbed in tasks that interest me.',
    icon: Target,
  },
  {
    id: 'creativity',
    title: 'Creative Thinking',
    description: 'I often come up with unique solutions and ideas.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'multitasking',
    title: 'Active Mind',
    description: 'I often work on multiple projects or ideas simultaneously.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'timeBlind',
    title: 'Time Awareness',
    description: 'I sometimes struggle with estimating or managing time.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'emotionalIntensity',
    title: 'Emotional Intensity',
    description: 'I experience emotions and reactions more intensely.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'noveltySeeker',
    title: 'Novelty Seeker',
    description: "I'm drawn to new experiences and get excited by fresh ideas.",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'sensoryProcessing',
    title: 'Sensory Sensitivity',
    description: "I'm sensitive to environmental stimuli like noise or light.",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    id: 'procrastination',
    title: 'Task Initiation',
    description: 'I sometimes delay starting tasks until pressure builds.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]; 