
import React from 'react';

export interface JourneyProgressProps {
  currentPhase: 'grounding' | 'aligning' | 'activating' | 'integration' | 'complete';
}

const JourneyProgress: React.FC<JourneyProgressProps> = ({ currentPhase }) => {
  const phases = [
    { id: 'grounding', label: 'Grounding' },
    { id: 'aligning', label: 'Aligning' },
    { id: 'activating', label: 'Activating' },
    { id: 'integration', label: 'Integration' }
  ];

  const currentIndex = phases.findIndex(phase => phase.id === currentPhase);
  const progressPercent = currentPhase === 'complete' 
    ? 100 
    : Math.round((currentIndex + 1) / phases.length * 100);

  return (
    <div className="flex items-center space-x-3">
      <div className="h-2 w-36 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <span className="text-xs text-white/70">{progressPercent}%</span>
    </div>
  );
};

export default JourneyProgress;
