
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlignVerticalJustifyCenter, CircleDot } from 'lucide-react';

interface ToggleViewProps {
  view: 'timeline' | 'grid';
  onViewChange: (view: 'timeline' | 'grid') => void;
}

const ToggleView: React.FC<ToggleViewProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={view === 'timeline' ? 'secondary' : 'outline'}
        size="sm"
        className="h-8 px-2"
        onClick={() => onViewChange('timeline')}
        aria-label="Timeline view"
      >
        <AlignVerticalJustifyCenter className="h-4 w-4 mr-1" />
        Timeline
      </Button>
      <Button
        variant={view === 'grid' ? 'secondary' : 'outline'}
        size="sm"
        className="h-8 px-2"
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
      >
        <CircleDot className="h-4 w-4 mr-1" />
        Grid
      </Button>
    </div>
  );
};

export default ToggleView;
