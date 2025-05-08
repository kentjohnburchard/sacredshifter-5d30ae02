
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getChakraColor } from '@/types/chakras';
import { useTheme } from '@/context/ThemeContext';

// This is a placeholder component that would normally use the useRealityOptimizer hook
const RealityDashboard: React.FC = () => {
  const { liftTheVeil } = useTheme();

  // Placeholder data - in real usage, this would come from useRealityOptimizer()
  const results = {
    nextSuggestedJourney: 'Root Awakening',
    underusedChakra: 'Root',
    dominantArchetype: 'Alchemist',
    frequencySuggestion: 396,
    lightbearerLevel: 3
  };
  
  const chakraColor = getChakraColor(results.underusedChakra as any);
  
  return (
    <Card className={`bg-gradient-to-br from-black/40 to-${liftTheVeil ? 'pink' : 'indigo'}-900/20 border-${liftTheVeil ? 'pink' : 'indigo'}-500/30 backdrop-blur-md`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          Reality Optimization Engine
        </CardTitle>
        <CardDescription>Your personalized spiritual guidance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                 style={{ backgroundColor: `${chakraColor}30`, border: `2px solid ${chakraColor}` }}>
              <span className="text-white font-bold">{results.underusedChakra?.charAt(0)}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Focus Chakra</p>
              <p className="text-white font-medium">{results.underusedChakra} Chakra</p>
            </div>
          </div>
          
          <div className="bg-black/20 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">Next Suggested Journey</p>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-white font-medium">{results.nextSuggestedJourney}</p>
          </div>
          
          <div className="bg-black/20 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">Dominant Archetype</p>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-white font-medium">{results.dominantArchetype}</p>
          </div>
          
          <div className="bg-black/20 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">Frequency Suggestion</p>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-white font-medium">{results.frequencySuggestion} Hz</p>
          </div>
          
          <div className="bg-black/20 p-3 rounded-md">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <p className="text-xs text-gray-400">Lightbearer Level</p>
              </div>
              <p className="text-white font-medium ml-auto">{results.lightbearerLevel}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="default" className="flex-1 bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-500 hover:to-purple-500">
            <Link to={`/journey/${results.nextSuggestedJourney.toLowerCase().replace(/\s+/g, '-')}`}>
              Start Journey
            </Link>
          </Button>
          <Button variant="outline" className="flex-1 bg-white/5 border-white/10">
            Explore Options
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealityDashboard;
