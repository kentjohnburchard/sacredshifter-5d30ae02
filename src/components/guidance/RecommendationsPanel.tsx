
import React from 'react';
import { useGuidance } from '@/context/GuidanceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface RecommendationsPanelProps {
  maxRecommendations?: number;
  showTitle?: boolean;
}

/**
 * Component that displays personalized recommendations based on user activity.
 * Designed to be embedded in the dashboard or other pages.
 */
const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ 
  maxRecommendations = 3,
  showTitle = true
}) => {
  const { 
    recommendations, 
    loadingRecommendations, 
    dismissRecommendation,
    applyRecommendation
  } = useGuidance();

  // Display only the top X recommendations
  const topRecommendations = recommendations.slice(0, maxRecommendations);

  if (loadingRecommendations) {
    return (
      <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Personalized Guidance
            </CardTitle>
            <CardDescription>Loading your recommendations...</CardDescription>
          </CardHeader>
        )}
        <CardContent className="py-2">
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
        {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              Personalized Guidance
            </CardTitle>
            <CardDescription>Your sacred journey insights</CardDescription>
          </CardHeader>
        )}
        <CardContent className="py-2">
          <div className="text-center p-4 text-sm text-gray-400">
            Continue your sacred practice to receive personalized recommendations.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-500/30 bg-black/40 backdrop-blur-sm">
      {showTitle && (
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" />
            Personalized Guidance
          </CardTitle>
          <CardDescription>Adaptive insights for your sacred journey</CardDescription>
        </CardHeader>
      )}
      <CardContent className="py-2">
        <div className="space-y-3">
          {topRecommendations.map((recommendation) => (
            <div 
              key={recommendation.id}
              className="relative bg-black/60 p-3 pr-8 rounded-lg border border-purple-900/30"
            >
              <button 
                onClick={() => dismissRecommendation(recommendation.id)}
                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800/50"
                aria-label="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
              
              <h4 className="font-medium text-white">{recommendation.title}</h4>
              <p className="text-xs text-gray-400 mt-1 mb-2">{recommendation.reason}</p>
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-purple-300">
                  {recommendation.chakra ? `${recommendation.chakra.charAt(0).toUpperCase() + recommendation.chakra.slice(1)} Focus` : 'Sacred Insight'}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs flex items-center gap-1 text-purple-300 hover:text-white hover:bg-purple-900/30"
                  onClick={() => applyRecommendation(recommendation)}
                >
                  {recommendation.actionLabel}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsPanel;
