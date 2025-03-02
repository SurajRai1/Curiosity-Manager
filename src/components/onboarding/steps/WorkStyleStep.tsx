import { motion } from 'framer-motion';
import { Brain, Check } from 'lucide-react';

interface WorkStyleStepProps {
  data: string[];
  onUpdate: (data: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function WorkStyleStep({ data, onUpdate }: WorkStyleStepProps) {
  const handleToggleStyle = (style: string) => {
    if (data.includes(style)) {
      onUpdate(data.filter(s => s !== style));
    } else {
      onUpdate([...data, style]);
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
          How do you work best?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-neutral-600 max-w-md mx-auto"
        >
          Select all that apply to help us personalize your experience
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {workStyles.map((style, index) => (
          <motion.button
            key={style.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            onClick={() => handleToggleStyle(style.id)}
            className={`relative p-6 text-left rounded-xl border-2 transition-all duration-200 ${
              data.includes(style.id)
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 bg-white hover:border-primary-200'
            }`}
          >
            {data.includes(style.id) && (
              <div className="absolute top-4 right-4">
                <Check className="w-5 h-5 text-primary-600" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className={`mt-1 rounded-lg p-2 ${
                data.includes(style.id) ? 'bg-primary-100' : 'bg-neutral-100'
              }`}>
                <style.icon className={`w-5 h-5 ${
                  data.includes(style.id) ? 'text-primary-600' : 'text-neutral-600'
                }`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  data.includes(style.id) ? 'text-primary-900' : 'text-neutral-900'
                }`}>
                  {style.title}
                </h3>
                <p className={`text-sm ${
                  data.includes(style.id) ? 'text-primary-700' : 'text-neutral-600'
                }`}>
                  {style.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-neutral-500"
      >
        You can always change these preferences later
      </motion.p>
    </div>
  );
}

const workStyles = [
  {
    id: 'visual',
    title: 'Visual Thinker',
    description: 'I process information better with images, colors, and visual organization.',
    icon: Brain,
  },
  {
    id: 'flexible',
    title: 'Flexible Schedule',
    description: 'I prefer adapting my work schedule to my energy levels and focus.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'hyperfocus',
    title: 'Deep Focus Sessions',
    description: 'I work best in intense, uninterrupted periods of concentration.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'creative',
    title: 'Creative Problem Solver',
    description: 'I thrive when finding unique solutions and thinking outside the box.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    id: 'collaborative',
    title: 'Team Player',
    description: 'I enjoy collaborating and bouncing ideas off others.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    id: 'spontaneous',
    title: 'Spontaneous Planner',
    description: 'I prefer flexible plans that can adapt to my changing interests.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]; 