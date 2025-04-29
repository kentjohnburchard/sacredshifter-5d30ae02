
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Music } from 'lucide-react';

interface MeditationTypeCardProps {
  meditation: any;
  onSelect: () => void;
}

const MeditationTypeCard: React.FC<MeditationTypeCardProps> = ({ meditation, onSelect }) => {
  return (
    <Card className="overflow-hidden border border-white/30 backdrop-blur-sm bg-black/80 hover:bg-black/90 transition-all duration-300 hover:shadow-xl shadow-lg">
      <CardContent className="p-0">
        <div className={`p-1 bg-gradient-to-r ${meditation.gradientClasses || 'from-purple-500/90 to-indigo-500/90'}`}>
          {/* Decorative header strip */}
        </div>
        
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 text-purple-200"
              style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.7)'}}>
            {meditation.title}
          </h3>
          <p className="text-gray-200 text-sm mb-4"
             style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'}}>
            {meditation.description}
          </p>
          
          <div className="flex justify-between items-center mb-4 text-gray-200">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-purple-300" />
              <span className="text-sm">{meditation.duration} min</span>
            </div>
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-1 text-purple-300" />
              <span className="text-sm">{meditation.frequency} Hz</span>
            </div>
          </div>
          
          <button 
            onClick={onSelect}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md flex items-center justify-center transition-colors shadow-lg"
            style={{textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'}}
          >
            <span className="mr-2">Start Meditation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeditationTypeCard;
