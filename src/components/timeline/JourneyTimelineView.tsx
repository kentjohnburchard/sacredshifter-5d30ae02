
import React from 'react';

interface JourneyTimelineViewProps {
  journeyId?: string;
  autoSync?: boolean;
  limit?: number;
}

const JourneyTimelineView: React.FC<JourneyTimelineViewProps> = ({ 
  journeyId,
  autoSync = true,
  limit = 10
}) => {
  return (
    <div className="journey-timeline">
      <h3 className="text-lg font-semibold mb-3">Journey Timeline</h3>
      <p className="text-sm opacity-70 mb-4">
        Recent activity for this journey will appear here
      </p>
      
      <div className="timeline-entries space-y-2 max-h-64 overflow-y-auto">
        <div className="p-2 border border-purple-500/30 rounded bg-purple-900/20">
          <p className="text-sm font-medium">Journey started</p>
          <p className="text-xs opacity-70">Just now</p>
        </div>
        
        {/* Timeline entry examples */}
        <div className="p-2 border border-purple-500/30 rounded bg-purple-900/20">
          <p className="text-sm font-medium">Frequency changed to 432Hz</p>
          <p className="text-xs opacity-70">2 minutes ago</p>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimelineView;
