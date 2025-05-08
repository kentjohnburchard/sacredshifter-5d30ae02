
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/context/ThemeContext';
import { Play, Star, ChevronRight, Calendar, Heart, Brain, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRealityOptimizer } from '@/hooks/useRealityOptimizer';
import { getChakraColor } from '@/types/chakras';

const moodOptions = [
  { label: 'Calm', value: 'calm', color: 'blue' },
  { label: 'Open', value: 'open', color: 'green' },
  { label: 'Focused', value: 'focused', color: 'purple' },
];

const HomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { liftTheVeil } = useTheme();
  const [selectedMood, setSelectedMood] = React.useState('');
  
  // This will be replaced with actual data once the hooks are implemented
  const optimizationResults = {
    nextSuggestedJourney: 'Chakra Column Alignment',
    underusedChakra: 'Root',
    dominantArchetype: 'Alchemist',
    frequencySuggestion: 396,
    lightbearerLevel: 3
  };

  const username = user?.email?.split('@')[0] || 'Sacred Shifter';
  const chakraColor = getChakraColor(optimizationResults.underusedChakra as any);

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{username}</span>
          </h1>
          <p className="text-gray-300 mt-1">Lightbearer Level: {optimizationResults.lightbearerLevel}</p>
        </div>
        <div className="flex gap-2">
          {moodOptions.map(mood => (
            <Button 
              key={mood.value}
              variant={selectedMood === mood.value ? "default" : "outline"}
              size="sm"
              className={`${selectedMood === mood.value ? `bg-${mood.color}-600` : 'bg-black/30'}`}
              onClick={() => setSelectedMood(mood.value)}
            >
              {mood.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Optimization Card */}
        <Card className={`bg-gradient-to-br from-black/40 to-${liftTheVeil ? 'pink' : 'purple'}-900/20 border-${liftTheVeil ? 'pink' : 'purple'}-500/30 backdrop-blur-md`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Soul Optimization
            </CardTitle>
            <CardDescription>Your personal energy alignment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: `${chakraColor}30`, border: `2px solid ${chakraColor}` }}>
                  <span className="text-white font-bold">{optimizationResults.underusedChakra?.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Focus Chakra</p>
                  <p className="text-white font-medium">{optimizationResults.underusedChakra} Chakra</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Suggested Journey</p>
                <Link to="/journeys" className="text-white font-medium underline decoration-dotted underline-offset-4 hover:text-purple-300 transition-colors">
                  {optimizationResults.nextSuggestedJourney}
                </Link>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Dominant Archetype</p>
                <p className="text-white font-medium">{optimizationResults.dominantArchetype}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Suggested Frequency</p>
                <p className="text-white font-medium">{optimizationResults.frequencySuggestion} Hz</p>
              </div>
              
              <Button asChild variant="outline" className="w-full mt-2 bg-white/5 border-white/10">
                <Link to="/frequency">
                  <Play className="mr-2 h-4 w-4" />
                  Try This Frequency
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Intention */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              Today's Intention
            </CardTitle>
            <CardDescription>Set your vibrational intention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20">
                <p className="text-gray-300 italic">
                  "I am aligned with my highest purpose. My energy flows freely through all chakras, and I welcome divine guidance."
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Badge variant="outline" className="bg-white/5 hover:bg-purple-900/20 cursor-pointer">Trust</Badge>
                <Badge variant="outline" className="bg-white/5 hover:bg-purple-900/20 cursor-pointer">Flow</Badge>
                <Badge variant="outline" className="bg-white/5 hover:bg-purple-900/20 cursor-pointer">Presence</Badge>
              </div>
              
              <Button variant="default" size="sm" className="w-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500">
                Set New Intention
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Sacred Circle Spotlight */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-400" />
              Sacred Circle Spotlight
            </CardTitle>
            <CardDescription>Community reflections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-black/20 rounded-lg p-4 border border-pink-500/20">
                <p className="text-gray-300 text-sm">
                  "After completing the Root Awakening journey, I've noticed a profound shift in my ability to stay grounded during challenging situations. The 396 Hz tone continues to resonate deeply with me."
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">Lightbearer Aurora</p>
                  <Badge className="bg-pink-900/40">Root</Badge>
                </div>
              </div>
              
              <Button asChild variant="outline" className="w-full bg-white/5 border-white/10">
                <Link to="/sacred-circle">
                  <User className="mr-2 h-4 w-4" />
                  Visit Sacred Circle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access to Frequency Engine */}
        <Card className="bg-gradient-to-br from-black/40 to-indigo-900/20 border-indigo-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.Music className="h-5 w-5 text-indigo-400" />
              Frequency Engine
            </CardTitle>
            <CardDescription>Tune your energetic field</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-red-900/20 hover:text-red-300">396 Hz</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-orange-900/20 hover:text-orange-300">417 Hz</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-yellow-900/20 hover:text-yellow-300">528 Hz</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-green-900/20 hover:text-green-300">639 Hz</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-blue-900/20 hover:text-blue-300">741 Hz</Button>
              <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-violet-900/20 hover:text-violet-300">852 Hz</Button>
            </div>
            
            <Button asChild variant="default" className="w-full bg-gradient-to-r from-indigo-500/80 to-purple-500/80 hover:from-indigo-500 hover:to-purple-500">
              <Link to="/frequency">
                <Icons.AudioWaveform className="mr-2 h-4 w-4" />
                Open Frequency Engine
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Lightbearer Progress */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Lightbearer Progress
            </CardTitle>
            <CardDescription>Your spiritual evolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-400"
                  style={{ width: '45%' }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>Level {optimizationResults.lightbearerLevel}</span>
                <span>45% to Level {optimizationResults.lightbearerLevel + 1}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg border border-purple-500/20">
                <div className="w-10 h-10 bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Complete a journey</p>
                  <p className="text-xs text-gray-400">+100 XP</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500 ml-auto" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Reality Optimizer */}
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" />
              Reality Optimizer
            </CardTitle>
            <CardDescription>Spiritual guidance system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-black/20 rounded-lg p-4 border border-cyan-500/20">
              <p className="text-gray-300 text-sm">
                The Reality Optimization Engine has analyzed your journey patterns and detected an opportunity to balance your Root chakra energy.
              </p>
            </div>
            
            <Button asChild variant="outline" className="w-full bg-white/5 border-white/10">
              <Link to="/journey/root-activation">
                <Icons.Zap className="mr-2 h-4 w-4" />
                Start Root Activation Journey
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeDashboard;

const Icons = {
  ...lucide,
  Music: lucide.Music,
  Zap: lucide.Zap,
  AudioWaveform: lucide.AudioWaveform,
};

// Import at the top 
import * as lucide from 'lucide-react';
