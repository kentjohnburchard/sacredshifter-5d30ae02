
import React from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";

interface ProfileProps {
  userId?: string;
}

const CircleProfile: React.FC<ProfileProps> = ({ userId }) => {
  const { getUserProfile } = useCommunity();
  const profile = getUserProfile(userId);

  if (!profile) {
    return (
      <Card className="p-6 text-center ethereal-card">
        <p className="text-glow-light">This soul's journey has yet to be discovered...</p>
      </Card>
    );
  }
  
  // Get light level title based on contribution score
  const getLightLevelTitle = (score: number) => {
    if (score >= 500) return 'Ascended Master';
    if (score >= 300) return 'Light Bearer';
    if (score >= 200) return 'Soul Guide';
    if (score >= 100) return 'Wisdom Keeper';
    if (score >= 50) return 'Path Walker';
    return 'Awakening Soul';
  };
  
  // Get progress to next level
  const getNextLevelProgress = (score: number) => {
    if (score >= 500) return 100;
    if (score >= 300) return ((score - 300) / 200) * 100;
    if (score >= 200) return ((score - 200) / 100) * 100;
    if (score >= 100) return ((score - 100) / 100) * 100;
    if (score >= 50) return ((score - 50) / 50) * 100;
    return (score / 50) * 100;
  };
  
  // Get next level threshold
  const getNextLevelThreshold = (score: number) => {
    if (score >= 500) return '∞';
    if (score >= 300) return '500';
    if (score >= 200) return '300';
    if (score >= 100) return '200';
    if (score >= 50) return '100';
    return '50';
  };

  return (
    <Card className="ethereal-card overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-purple-900 to-blue-900 relative">
        <div className="absolute inset-0 opacity-30">
          {/* Sacred geometry pattern overlay */}
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <line 
                key={i}
                x1="50"
                y1="50"
                x2={50 + 45 * Math.cos(angle * Math.PI / 180)}
                y2={50 + 45 * Math.sin(angle * Math.PI / 180)}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>
      </div>
      <CardHeader className="relative pb-2">
        <div className="absolute -top-12 left-6">
          <Avatar className="h-20 w-20 border-4 border-black">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-purple-900 text-purple-100 text-xl">
              {profile.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-glow-purple">{profile.name}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className="bg-gradient-to-r from-purple-700 to-indigo-700">
              {getLightLevelTitle(profile.contributionScore)}
            </Badge>
            <span className="text-amber-400 font-medium">✦ {profile.contributionScore}</span>
          </div>
          <p className="text-muted-foreground mt-2">{profile.bio || "No biography yet"}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Light level progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Light Level Progress</span>
            <span>{profile.contributionScore} / {getNextLevelThreshold(profile.contributionScore)}</span>
          </div>
          <Progress 
            value={getNextLevelProgress(profile.contributionScore)} 
            className="h-2 bg-gray-800"
          />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Sacred Badges</h3>
          <div className="flex flex-wrap gap-2">
            {profile.badges.length > 0 ? (
              profile.badges.map((badge) => (
                <Badge key={badge.id} className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600">
                  {badge.name}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-gray-400">Begin your journey to earn sacred badges</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-2">Active Circles</h3>
          <div className="grid grid-cols-2 gap-2">
            {profile.circles.length > 0 ? (
              profile.circles.map((circle) => (
                <div key={circle.id} className="bg-black/30 p-3 rounded-md">
                  <h4 className="font-medium text-sm">{circle.name}</h4>
                  <p className="text-xs text-gray-400">{circle.memberCount} members</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 col-span-2">Join a circle to connect with like-minded souls</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircleProfile;
