
import React from 'react';
import { JourneyPhase } from './JourneyExperience';
import { motion } from 'framer-motion';
import { CircleCheck, CircleDashed } from 'lucide-react';

interface JourneyProgressProps {
  currentPhase: JourneyPhase;
}

const JourneyProgress: React.FC<JourneyProgressProps> = ({ currentPhase }) => {
  const phases: { id: JourneyPhase; label: string }[] = [
    { id: 'grounding', label: 'Ground' },
    { id: 'aligning', label: 'Align' },
    { id: 'activating', label: 'Activate' },
    { id: 'integration', label: 'Integrate' },
  ];

  // Find the current phase index
  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);

  return (
    <div className="journey-progress flex items-center space-x-2">
      {phases.map((phase, index) => {
        const isActive = index === currentPhaseIndex;
        const isCompleted = index < currentPhaseIndex;
        
        return (
          <div key={phase.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : isCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-800 text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CircleCheck size={18} />
                ) : (
                  <CircleDashed size={18} />
                )}
              </div>
              <span 
                className={`text-xs mt-1 ${
                  isActive 
                    ? 'text-white font-medium' 
                    : isCompleted 
                    ? 'text-white/80' 
                    : 'text-gray-400'
                }`}
              >
                {phase.label}
              </span>
            </div>
            
            {index < phases.length - 1 && (
              <div 
                className={`h-0.5 w-4 mx-1 ${
                  index < currentPhaseIndex ? 'bg-green-600' : 'bg-gray-700'
                }`}
              >
                {index === currentPhaseIndex - 1 && (
                  <motion.div 
                    className="h-full bg-purple-600" 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JourneyProgress;
