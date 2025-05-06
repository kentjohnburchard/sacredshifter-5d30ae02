
import React from 'react';
import { useJourney } from '@/context/JourneyContext';
import { VisualThemeProvider } from '@/context/VisualThemeContext';
import VisualRenderer from '@/components/visualizer/VisualRenderer';
import { JourneyAwareComponentProps } from '@/types/journey';

interface JourneyAwareVisualRendererProps extends JourneyAwareComponentProps {
  className?: string;
  height?: string | number;
  showControls?: boolean;
  containerId?: string;
}

const JourneyAwareVisualRenderer: React.FC<JourneyAwareVisualRendererProps> = ({
  journeyId,
  autoSync = true,
  className = '',
  height = '100%',
  showControls = true,
  containerId = 'journeyVisualRenderer'
}) => {
  const { activeJourney } = useJourney();
  
  // Either use provided journeyId or get from context if autoSync is true
  const effectiveJourneyId = journeyId || (autoSync && activeJourney?.id);
  
  if (!effectiveJourneyId) {
    return null;
  }
  
  return (
    <VisualThemeProvider>
      <VisualRenderer
        className={className}
        height={height}
        showControls={showControls}
        containerId={containerId}
      />
    </VisualThemeProvider>
  );
};

export default JourneyAwareVisualRenderer;
