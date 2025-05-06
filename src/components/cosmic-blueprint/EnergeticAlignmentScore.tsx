
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, BarChart3, Clock, Zap } from 'lucide-react';
import { EnergicAlignmentMetrics } from '@/types/cosmic-blueprint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnergeticAlignmentScoreProps {
  metrics: EnergicAlignmentMetrics | null;
  loading?: boolean;
  onRecalculate?: () => void;
  calculating?: boolean;
  resonantSignature?: string;
  className?: string;
}

const EnergeticAlignmentScore: React.FC<EnergeticAlignmentScoreProps> = ({
  metrics,
  loading = false,
  onRecalculate,
  calculating = false,
  resonantSignature,
  className
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-purple-500 to-indigo-500';
    if (score >= 60) return 'from-blue-500 to-sky-500';
    if (score >= 40) return 'from-green-500 to-emerald-500';
    if (score >= 20) return 'from-yellow-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };
  
  const formatScore = (score: number | undefined) => {
    if (score === undefined) return '0';
    return Math.round(score).toString();
  };

  if (loading) {
    return (
      <Card className={`border-blue-500/30 bg-black/50 backdrop-blur-md ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Energetic Alignment Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <div className="animate-pulse h-36 w-36 rounded-full bg-blue-900/30"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-500/30 bg-black/50 backdrop-blur-md ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            Energetic Alignment Score
          </div>
          <Button 
            variant="outline"
            size="sm" 
            onClick={onRecalculate}
            disabled={calculating}
            className="bg-black/30 border-blue-500/20 text-blue-300 hover:text-blue-100"
          >
            {calculating ? 'Calculating...' : 'Recalculate'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Main score dial */}
          <div className="relative my-4">
            <svg className="w-40 h-40 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="8"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * (metrics?.overallScore || 0) / 100)}
                strokeLinecap="round"
              />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`stop-${getScoreColor((metrics?.overallScore || 0)).split(' ')[0]}`} />
                  <stop offset="100%" className={`stop-${getScoreColor((metrics?.overallScore || 0)).split(' ')[1]}`} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn(
                "text-4xl font-bold",
                metrics?.overallScore && metrics.overallScore >= 60 ? "text-blue-300" : "text-white"
              )}>
                {formatScore(metrics?.overallScore)}
              </span>
              <span className="text-sm text-gray-400">Alignment Score</span>
            </div>
          </div>
          
          {/* Resonant signature */}
          {resonantSignature && (
            <div className="mb-6 text-center">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Your Resonant Signature</h3>
              <p className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                {resonantSignature}
              </p>
            </div>
          )}
          
          {/* Individual metrics */}
          <div className="w-full space-y-4 mt-4">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-sm">Chakra Balance</span>
                </div>
                <span className="text-sm font-medium">{formatScore(metrics?.chakraBalance)}</span>
              </div>
              <Progress className="h-1.5" value={metrics?.chakraBalance} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-sm">Timeline Engagement</span>
                </div>
                <span className="text-sm font-medium">{formatScore(metrics?.timelineEngagement)}</span>
              </div>
              <Progress className="h-1.5" value={metrics?.timelineEngagement} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-sm">Lightbearer Progress</span>
                </div>
                <span className="text-sm font-medium">{formatScore(metrics?.lightbearerProgress)}</span>
              </div>
              <Progress className="h-1.5" value={metrics?.lightbearerProgress} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-sm">Reflection Consistency</span>
                </div>
                <span className="text-sm font-medium">{formatScore(metrics?.reflectionConsistency)}</span>
              </div>
              <Progress className="h-1.5" value={metrics?.reflectionConsistency} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnergeticAlignmentScore;
