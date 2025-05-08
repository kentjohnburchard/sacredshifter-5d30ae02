
import React from 'react';
import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { useLightbearerProgress } from '@/hooks/useLightbearerProgress';
import { useChakraActivations } from '@/hooks/useChakraActivations';
import { useAuth } from '@/context/AuthContext';
import { getArchetypeForChakra } from '@/utils/archetypes';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import LightbearerStatsCard from '@/components/lightbearer/LightbearerStatsCard';
import LightProgress from '@/components/lightbearer/LightProgress';
import MilestoneBadge from '@/components/lightbearer/MilestoneBadge';

const LightbearerPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    stats, 
    levels, 
    currentLevel, 
    progressPercentage, 
    loading: statsLoading 
  } = useLightbearerProgress();
  
  const { 
    activations, 
    activationCounts, 
    getDominantChakra, 
    loading: chakraLoading 
  } = useChakraActivations();

  const dominantChakra = getDominantChakra();
  const dominantArchetype = dominantChakra ? getArchetypeForChakra(dominantChakra) : null;
  
  const loading = statsLoading || chakraLoading;

  return (
    <Layout 
      pageTitle="Lightbearer Progress" 
      className="bg-gradient-to-b from-purple-900/30 to-black min-h-screen"
    >
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Lightbearer Progress
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Track your spiritual journey, chakra activations, and archetype alignment as you progress through Sacred Shifter.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lightbearer Stats */}
            <div className="lg:col-span-3 mb-6">
              <LightbearerStatsCard 
                stats={stats} 
                currentLevel={currentLevel} 
                progressPercentage={progressPercentage}
              />
            </div>
            
            {/* Chakra Progress */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-white">Chakra Activations</h2>
              <div className="space-y-4">
                {Object.entries(activationCounts).length === 0 ? (
                  <p className="text-gray-400">No chakra activations yet. Complete a journey to begin your path.</p>
                ) : (
                  Object.entries(activationCounts).map(([chakra, count]) => (
                    <ChakraProgressItem 
                      key={chakra} 
                      chakra={chakra as ChakraTag} 
                      count={count} 
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Archetype Alignment */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-white">Archetype Alignment</h2>
              {dominantArchetype ? (
                <div className="text-center">
                  <div className="mb-4 p-3 inline-block rounded-full bg-gray-700/50">
                    <img 
                      src={dominantArchetype.symbol} 
                      alt={dominantArchetype.name} 
                      className="w-16 h-16" 
                      style={{ filter: `drop-shadow(0 0 8px ${dominantArchetype.themeColor})` }}
                    />
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">{dominantArchetype.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">Your Dominant Archetype</p>
                  
                  <div className="p-3 bg-gray-700/30 rounded-lg">
                    <p className="text-gray-300">{dominantArchetype.description}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Complete journeys to discover your archetype alignment.</p>
              )}
            </div>
            
            {/* Journey Timeline */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-white">Recent Activities</h2>
              {activations.length > 0 ? (
                <div className="space-y-3">
                  {activations.slice(0, 5).map((activation, index) => (
                    <div 
                      key={activation.id} 
                      className="p-3 bg-gray-700/30 rounded-lg flex items-center"
                    >
                      <div 
                        className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: getChakraColor(activation.chakra_tag) }}
                      ></div>
                      <div>
                        <p className="text-white font-medium">{activation.chakra_tag} Chakra Activated</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(activation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No recent activity. Begin your journey to see your progress.</p>
              )}
            </div>
          </div>
        )}
        
        {/* Unlocked Milestones */}
        {!loading && stats && stats.earned_badges && stats.earned_badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Unlocked Milestones</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {stats.earned_badges.map((badge) => (
                <MilestoneBadge key={badge} name={badge} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

// Helper component for chakra progress items
const ChakraProgressItem: React.FC<{ chakra: ChakraTag; count: number }> = ({ chakra, count }) => {
  const chakraColor = getChakraColor(chakra);
  const archetype = getArchetypeForChakra(chakra);
  
  return (
    <div className="bg-gray-700/30 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: chakraColor }}
          ></span>
          <span className="text-white">{chakra}</span>
        </div>
        <span className="text-gray-300 text-sm">{count} activation{count !== 1 ? 's' : ''}</span>
      </div>
      <LightProgress 
        value={Math.min(count * 10, 100)} 
        color={chakraColor} 
        size="sm" 
      />
      {archetype && (
        <div className="mt-2 flex items-center text-xs text-gray-400">
          <img 
            src={archetype.symbol} 
            alt={archetype.name} 
            className="w-4 h-4 mr-1 opacity-70" 
          />
          {archetype.name}
        </div>
      )}
    </div>
  );
};

export default LightbearerPage;
