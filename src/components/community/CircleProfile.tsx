
import React from 'react';
import { useCommunity } from '@/hooks/useCommunity';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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

  return (
    <Card className="ethereal-card overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-purple-900 to-blue-900"></div>
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
          <p className="text-muted-foreground">{profile.bio || "No biography yet"}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
