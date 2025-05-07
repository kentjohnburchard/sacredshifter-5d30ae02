
import React from 'react';

// This is a placeholder component to satisfy imports
// The real implementation has been removed as part of cleanup
const VisualThemeEditor: React.FC<{journeyId?: string}> = ({ journeyId }) => {
  return (
    <div className="p-4 text-center border border-dashed rounded-md">
      <p className="text-gray-500">Visual theme editing has been deprecated</p>
      <p className="text-sm text-gray-400">Journey ID: {journeyId}</p>
    </div>
  );
};

export default VisualThemeEditor;
