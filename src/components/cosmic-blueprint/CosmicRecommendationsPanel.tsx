import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Flame, Music, Compass, Zap } from 'lucide-react';
import { CosmicRecommendation } from '@/types/cosmic-blueprint';

interface CosmicRecommendationsPanelProps {
  recommendations: CosmicRecommendation[];
  loading?: boolean;
  onViewAll?: () => void;
  className?: string;
}

const chakraColors: Record<string, string> = {
  'Root': '#FF0000',
  'Sacral': '#FF7F00',
  'Solar Plexus': '#FFFF00',
  'Heart': '#00FF00',
  'Throat': '#00FFFF',
  'Third Eye': '#0000FF',
  'Crown': '#8B00FF',
  'Transpersonal': '#FFFFFF'
};

const CosmicRecommendationsPanel: React.FC<CosmicRecommendationsPanelProps> = ({
  recommendations,
  loading = false,
  onViewAll,
  className
}) => {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'journey': return <Compass className="h-5 w-5 text-indigo-400" />;
      case 'symbol': return <Sparkles className="h-5 w-5 text-purple-400" />;
      case 'frequency': return <Music className="h-5 w-5 text-blue-400" />;
      case 'practice': return <Flame className="h-5 w-5 text-amber-400" />;
      default: return <Zap className="h-5 w-5 text-indigo-400" />;
    }
  };

  if (loading) {
    return (
      <Card className={`border-indigo-500/30 bg-black/50 backdrop-blur-md ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            Cosmic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-4 rounded-lg bg-indigo-900/20">
                <div className="h-5 w-2/3 bg-indigo-800/30 rounded mb-2" />
                <div className="h-3 w-full bg-indigo-800/20 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-indigo-500/30 bg-black/50 backdrop-blur-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          Cosmic Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg bg-gradient-to-br from-black/60 to-indigo-950/20 border border-indigo-500/20 hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getRecommendationIcon(recommendation.type)}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-white mb-1">{recommendation.title}</h4>
                    <p className="text-sm text-gray-300 mb-2">{recommendation.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        {recommendation.chakraTag && (
                          <Badge 
                            variant="outline" 
                            className="text-xs py-0"
                            style={{ 
                              borderColor: `${chakraColors[recommendation.chakraTag]}40`,
                              background: `${chakraColors[recommendation.chakraTag]}15`
                            }}
                          >
                            {recommendation.chakraTag}
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className="text-xs py-0 bg-indigo-900/20 border-indigo-500/20"
                        >
                          {recommendation.resonanceMatch}% Match
                        </Badge>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-xs text-indigo-300 hover:text-white">
                        Explore
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {onViewAll && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2 bg-black/30 border-indigo-500/20 text-indigo-300 hover:text-indigo-100"
                onClick={onViewAll}
              >
                View All Recommendations
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Sparkles className="h-12 w-12 text-indigo-500/40 mb-3" />
            <h3 className="text-lg font-medium">No Recommendations Yet</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-xs">
              Continue your journey to receive personalized cosmic recommendations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CosmicRecommendationsPanel;
