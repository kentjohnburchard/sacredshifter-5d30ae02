
import React from 'react';
import { motion } from 'framer-motion';
import { LightbearerStats, LightbearerLevel } from '@/types/lightbearer';
import LightProgress from './LightProgress';

interface LightbearerStatsCardProps {
  stats: LightbearerStats | null;
  currentLevel: LightbearerLevel | null;
  progressPercentage: number;
}

const LightbearerStatsCard: React.FC<LightbearerStatsCardProps> = ({
  stats,
  currentLevel,
  progressPercentage
}) => {
  if (!stats || !currentLevel) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 text-center">
        <p className="text-gray-400">Loading stats...</p>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-purple-900/40 to-indigo-900/30 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left: Level Info */}
        <div className="md:col-span-1 flex flex-col items-center justify-center mb-4 md:mb-0">
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full bg-purple-900/50 flex items-center justify-center border-2 border-purple-400">
              <span className="text-4xl font-bold text-white">{stats.light_level}</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center text-sm font-bold">
              {currentLevel.level_num}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white">{currentLevel.title || 'Lightbearer'}</h3>
          <p className="text-sm text-gray-300">{stats.ascension_title || 'Seeker'}</p>
        </div>
        
        {/* Right: Progress Info */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold text-white">Light Progress</h3>
            <div className="text-right">
              <p className="text-sm text-gray-300">
                {stats.light_points} / {currentLevel.next_threshold} Light Points
              </p>
            </div>
          </div>
          
          <LightProgress value={progressPercentage} color="#9b87f5" size="lg" />
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Stats Tiles */}
            <div className="p-3 bg-gray-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-white">{stats.light_points}</p>
              <p className="text-xs text-gray-400">Total Points</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-white">{stats.earned_badges?.length || 0}</p>
              <p className="text-xs text-gray-400">Badges</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-white">{stats.badges?.length || 0}</p>
              <p className="text-xs text-gray-400">Achievements</p>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-white">
                {stats.last_level_up ? 
                  new Date(stats.last_level_up).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 
                  '-'
                }
              </p>
              <p className="text-xs text-gray-400">Last Level Up</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LightbearerStatsCard;
