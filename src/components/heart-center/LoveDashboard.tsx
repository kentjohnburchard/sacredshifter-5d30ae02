import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Star, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoveDashboardProps {
  loveScore?: number;
  loveLevel?: number;
  loveBadges?: Array<{
    id: string;
    name: string;
    description: string;
    level: number;
  }>;
  loveJourneys?: Array<{
    id: string;
    name: string;
    completedAt: Date;
    score: number;
  }>;
  loveCommunity?: Array<{
    id: string;
    name: string;
    avatar: string;
    connectionLevel: number;
  }>;
}

const LoveDashboard: React.FC<LoveDashboardProps> = ({
  loveScore = 78,
  loveLevel = 3,
  loveBadges = [
    { id: '1', name: 'Heart Opener', description: 'Completed first heart meditation', level: 1 },
    { id: '2', name: 'Compassion Guide', description: 'Shared love with 5 others', level: 2 },
    { id: '3', name: 'Divine Love', description: 'Achieved heart-mind coherence', level: 3 },
  ],
  loveJourneys = [
    { id: '1', name: 'Heart Opening', completedAt: new Date(2023, 5, 15), score: 85 },
    { id: '2', name: 'Compassion Flow', completedAt: new Date(2023, 6, 22), score: 92 },
    { id: '3', name: 'Divine Connection', completedAt: new Date(2023, 7, 10), score: 78 },
  ],
  loveCommunity = [
    { id: '1', name: 'Sophia Light', avatar: '/avatars/sophia.jpg', connectionLevel: 4 },
    { id: '2', name: 'Aiden Star', avatar: '/avatars/aiden.jpg', connectionLevel: 3 },
    { id: '3', name: 'Luna Wisdom', avatar: '/avatars/luna.jpg', connectionLevel: 5 },
  ]
}) => {
  // Calculate next level threshold
  const currentLevelThreshold = loveLevel * 25;
  const nextLevelThreshold = (loveLevel + 1) * 25;
  const progressToNextLevel = ((loveScore - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100;
  
  // Get heart level title
  const getHeartLevelTitle = (level: number) => {
    switch(level) {
      case 1: return 'Heart Awakening';
      case 2: return 'Compassion Flowing';
      case 3: return 'Heart Coherence';
      case 4: return 'Divine Love';
      case 5: return 'Universal Heart';
      default: return 'Heart Explorer';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Main Love Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="ethereal-card overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600/30 to-purple-600/30 h-3"></div>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-6 w-6 text-pink-400" />
              Heart Center Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-glow-pink">{getHeartLevelTitle(loveLevel)}</h3>
                <p className="text-sm text-gray-400">Level {loveLevel} Heart Explorer</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress to Level {loveLevel + 1}</span>
                    <span>{loveScore} / {nextLevelThreshold}</span>
                  </div>
                  <Progress 
                    value={progressToNextLevel} 
                    className="h-2 bg-gray-800"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30">
                <div className="text-center">
                  <div className="text-4xl font-bold text-glow-pink">{loveScore}</div>
                  <div className="text-xs text-gray-300">LOVE SCORE</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-pink-400 mr-1" />
                  <span className="font-medium">Heart Achievements</span>
                </div>
                <div className="text-3xl font-bold text-glow-pink">{loveBadges.length}</div>
                <div className="text-xs text-gray-400">Badges Earned</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-pink-400 mr-1" />
                  <span className="font-medium">Heart Journeys</span>
                </div>
                <div className="text-3xl font-bold text-glow-pink">{loveJourneys.length}</div>
                <div className="text-xs text-gray-400">Journeys Completed</div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-pink-400 mr-1" />
                  <span className="font-medium">Heart Community</span>
                </div>
                <div className="text-3xl font-bold text-glow-pink">{loveCommunity.length}</div>
                <div className="text-xs text-gray-400">Soul Connections</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Recent Heart Journeys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="ethereal-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-pink-400" />
              Recent Heart Journeys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loveJourneys.map((journey) => (
                <div key={journey.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div>
                    <h4 className="font-medium text-glow-light">{journey.name}</h4>
                    <p className="text-xs text-gray-400">
                      Completed {journey.completedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 text-pink-400 mr-1" />
                    <span className="font-medium">{journey.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Heart Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="ethereal-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-pink-400" />
              Heart Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {loveBadges.map((badge) => (
                <div key={badge.id} className="bg-black/20 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-pink-600/30 to-purple-600/30 flex items-center justify-center text-xl font-bold">
                    {badge.level}
                  </div>
                  <h4 className="font-medium text-glow-pink">{badge.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoveDashboard;
