
import React from 'react';
import { JourneyPhase } from './JourneyExperience';
import { Check } from 'lucide-react';

interface JourneyProgressProps {
  currentPhase: JourneyPhase;
}

const JourneyProgress: React.FC<JourneyProgressProps> = ({ currentPhase }) => {
  const phases: JourneyPhase[] = ['grounding', 'aligning', 'activating', 'integration'];
  
  const getPhaseStatus = (phase: JourneyPhase) => {
    const phaseIndex = phases.indexOf(phase);
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex > phaseIndex || currentPhase === 'complete') {
      return 'completed';
    } else if (currentIndex === phaseIndex) {
      return 'active';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="journey-progress flex items-center space-x-1 sm:space-x-2">
      {phases.map((phase, index) => {
        const status = getPhaseStatus(phase);
        
        return (
          <React.Fragment key={phase}>
            <div 
              className={`
                relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                ${status === 'completed' ? 'bg-white text-black' : ''}
                ${status === 'active' ? 'bg-purple-500 text-white ring-2 ring-white/50' : ''}
                ${status === 'upcoming' ? 'bg-gray-500/30 text-white/50' : ''}
              `}
            >
              {status === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
              
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white/70 whitespace-nowrap hidden sm:block capitalize">
                {phase}
              </span>
            </div>
            
            {index < phases.length - 1 && (
              <div 
                className={`
                  h-0.5 w-4 sm:w-8 transition-all duration-300
                  ${status === 'completed' ? 'bg-white' : 'bg-gray-500/30'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default JourneyProgress;
