
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Sparkles, Music, Zap } from 'lucide-react';
import { CosmicBlueprint, StarseedResonanceType } from '@/types/cosmic-blueprint';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CosmicBlueprintProfileProps {
  blueprint: CosmicBlueprint | null;
  loading?: boolean;
  onUpdateResonance?: (resonance: StarseedResonanceType[]) => void;
  className?: string;
}

const CosmicBlueprintProfile: React.FC<CosmicBlueprintProfileProps> = ({
  blueprint,
  loading = false,
  onUpdateResonance,
  className
}) => {
  const starseedOptions: StarseedResonanceType[] = [
    'Pleiadian',
    'Sirian',
    'Lyran',
    'Arcturian',
    'Andromedan',
    'Orion',
    'Venusian',
    'Lemurian',
    'Atlantean',
    'Crystalline'
  ];

  const handleResonanceChange = (value: string) => {
    const newResonance = [value as StarseedResonanceType];
    if (onUpdateResonance) {
      onUpdateResonance(newResonance);
    }
  };

  if (loading) {
    return (
      <Card className={`border-purple-500/30 bg-black/50 backdrop-blur-md ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-400" />
            Cosmic Blueprint Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 items-center justify-center min-h-[200px]">
            <div className="animate-pulse h-40 w-40 rounded-full bg-purple-900/30"></div>
            <div className="animate-pulse h-6 w-40 rounded bg-purple-900/30"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!blueprint) {
    return (
      <Card className={`border-purple-500/30 bg-black/50 backdrop-blur-md ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-400" />
            Cosmic Blueprint Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Star className="h-16 w-16 text-purple-500/50 mb-4" />
            <h3 className="text-lg font-medium">Blueprint Not Available</h3>
            <p className="text-sm text-gray-400 mt-2">
              Your cosmic blueprint will appear here once you've progressed further on your journey.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-purple-500/30 bg-black/50 backdrop-blur-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-purple-400" />
          Cosmic Blueprint Profile
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sacred Geometry Visual */}
          <div className="flex-none">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 flex items-center justify-center border border-purple-500/20">
              {/* This would be replaced with an actual sacred geometry SVG */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-purple-400/70" />
              </div>
            </div>
          </div>
          
          {/* Blueprint Details */}
          <div className="flex-grow space-y-4">
            {/* Resonant Signature */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Resonant Signature</h3>
              <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
                {blueprint.resonant_signature || "Awakening Cosmic Resonator"}
              </p>
            </div>
            
            {/* Starseed Resonance */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Starseed Resonance</h3>
              <Select 
                value={(blueprint.starseed_resonance && blueprint.starseed_resonance[0]) || undefined}
                onValueChange={handleResonanceChange}
              >
                <SelectTrigger className="w-full md:w-[240px] bg-black/30 border-purple-500/20">
                  <SelectValue placeholder="Select your resonance..." />
                </SelectTrigger>
                <SelectContent>
                  {starseedOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Light Frequency */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Light Frequency Base Tone</h3>
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-purple-400" />
                <span>528Hz</span>
                <Badge variant="outline" className="ml-2 bg-purple-900/20 border-purple-500/20">
                  Miracle Tone
                </Badge>
              </div>
            </div>
            
            {/* Sacred Geometry */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Sacred Geometry Archetype</h3>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Flower of Life</span>
              </div>
            </div>
            
            {/* DNA Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">DNA Strand Activation</h3>
              <div className="flex items-center gap-1 mt-1">
                {blueprint.dna_strand_status.map((active, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-6 rounded-full ${active ? 'bg-purple-500' : 'bg-gray-700'}`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {blueprint.dna_strand_status.filter(Boolean).length} of 12 strands activated
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CosmicBlueprintProfile;
