'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Battery, Clock, X } from 'lucide-react';

type EnergyLevel = 'high' | 'medium' | 'low';

interface EnergyLevelPromptProps {
  userEnergyLevel: EnergyLevel;
  setUserEnergyLevel: (level: EnergyLevel) => void;
  showEnergyPrompt: boolean;
  setShowEnergyPrompt: (show: boolean) => void;
}

export default function EnergyLevelPrompt({
  userEnergyLevel,
  setUserEnergyLevel,
  showEnergyPrompt,
  setShowEnergyPrompt
}: EnergyLevelPromptProps) {
  const getEnergyLevelDetails = (level: EnergyLevel) => {
    switch (level) {
      case 'high':
        return {
          icon: Zap,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          hoverColor: 'hover:bg-orange-100',
          description: 'Ready for challenging tasks'
        };
      case 'medium':
        return {
          icon: Battery,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          hoverColor: 'hover:bg-blue-100',
          description: 'Can handle moderate tasks'
        };
      case 'low':
        return {
          icon: Clock,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          hoverColor: 'hover:bg-green-100',
          description: 'Best for easy, routine tasks'
        };
    }
  };

  return (
    <AnimatePresence>
      {showEnergyPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mb-6 p-4 bg-white rounded-xl border border-neutral-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-neutral-900">How's your energy today?</h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEnergyPrompt(false)}
              className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          
          <p className="text-neutral-600 mb-4">
            Select your current energy level to see tasks that match how you're feeling.
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {(['high', 'medium', 'low'] as const).map((level) => {
              const { icon: Icon, color, bgColor, borderColor, hoverColor, description } = getEnergyLevelDetails(level);
              return (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUserEnergyLevel(level)}
                  className={`flex flex-col items-center p-3 rounded-lg border ${
                    userEnergyLevel === level
                      ? `${bgColor} ${borderColor} ring-2 ring-primary-200`
                      : `border-neutral-200 hover:border-neutral-300 ${hoverColor}`
                  }`}
                >
                  <div className={`p-2 rounded-full ${bgColor} mb-2`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span className="font-medium text-neutral-900 capitalize mb-1">{level}</span>
                  <span className="text-xs text-neutral-500 text-center">{description}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 