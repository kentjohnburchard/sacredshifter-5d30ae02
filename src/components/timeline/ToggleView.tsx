
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Circle } from 'lucide-react';

type ViewMode = 'vertical' | 'spiral';

interface ToggleViewProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ToggleView: React.FC<ToggleViewProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button
        variant={viewMode === 'vertical' ? 'default' : 'outline'}
        size="sm"
        className={viewMode === 'vertical' 
          ? 'bg-purple-600 hover:bg-purple-700' 
          : 'border-purple-500/30 text-purple-200'
        }
        onClick={() => onViewChange('vertical')}
      >
        <Calendar className="h-4 w-4 mr-1.5" />
        Vertical Timeline
      </Button>
      
      <Button
        variant={viewMode === 'spiral' ? 'default' : 'outline'}
        size="sm"
        className={viewMode === 'spiral' 
          ? 'bg-purple-600 hover:bg-purple-700' 
          : 'border-purple-500/30 text-purple-200'
        }
        onClick={() => onViewChange('spiral')}
      >
        <Circle className="h-4 w-4 mr-1.5" />
        Cosmic Spiral
      </Button>
    </div>
  );
};

export default ToggleView;
