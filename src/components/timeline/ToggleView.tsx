
import React from 'react';
import { Button } from '@/components/ui/button';
import { ViewVertical, CircleDot } from 'lucide-react';

interface ToggleViewProps {
  viewMode: 'vertical' | 'spiral';
  onViewChange: (mode: 'vertical' | 'spiral') => void;
}

const ToggleView: React.FC<ToggleViewProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant={viewMode === 'vertical' ? 'default' : 'outline'}
        onClick={() => onViewChange('vertical')}
      >
        <ViewVertical className="h-4 w-4 mr-1" />
        Linear
      </Button>
      <Button
        size="sm"
        variant={viewMode === 'spiral' ? 'default' : 'outline'}
        onClick={() => onViewChange('spiral')}
      >
        <CircleDot className="h-4 w-4 mr-1" />
        Spiral
      </Button>
    </div>
  );
};

export default ToggleView;
