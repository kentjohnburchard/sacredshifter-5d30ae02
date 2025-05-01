
import React from 'react';

export interface SpiralViewProps {
  activeTagFilter: string;
  onEdit: (entry: any) => void;
}

const SpiralView: React.FC<SpiralViewProps> = ({ activeTagFilter, onEdit }) => {
  return (
    <div className="spiral-view">
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-400">Spiral timeline visualization</p>
          <p className="text-sm text-gray-500">Filter: {activeTagFilter}</p>
        </div>
      </div>
    </div>
  );
};

export default SpiralView;
