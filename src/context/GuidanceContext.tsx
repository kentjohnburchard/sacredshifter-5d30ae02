
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserTimeline } from '@/services/timelineService';
import { JourneyTimelineItem } from '@/types/journey';

// Recommendation types
export interface GuidanceRecommendation {
  id: string;
  title: string;
  reason: string;
  actionType: 'journey' | 'reflection' | 'meditation' | 'frequency';
  actionId: string;
  chakra?: string;
  priority: number; // 1-10, higher is more important
  actionLabel: string;
}

interface ChakraBalance {
  root: number;
  sacral: number;
  solarPlexus: number;
  heart: number;
  throat: number;
  thirdEye: number;
  crown: number;
}

interface UserState {
  recentTimeline: JourneyTimelineItem[];
  chakraFocus: string[];
  totalJourneys: number;
  completedJourneys: number;
  lightbearerLevel: number;
  lastActivity?: Date;
  chakraBalance: ChakraBalance;
}

interface GuidanceContextType {
  recommendations: GuidanceRecommendation[];
  loadingRecommendations: boolean;
  userState: UserState | null;
  refreshRecommendations: () => Promise<void>;
  dismissRecommendation: (recommendationId: string) => void;
  applyRecommendation: (recommendation: GuidanceRecommendation) => void;
}

const GuidanceContext = createContext<GuidanceContextType | undefined>(undefined);

export function GuidanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { activeJourney, startJourney } = useJourney();
  
  const [recommendations, setRecommendations] = useState<GuidanceRecommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);

  // Initialize the user state by analyzing timeline data
  useEffect(() => {
    if (user?.id) {
      loadUserState();
    }
  }, [user?.id, activeJourney?.id]);

  // Load user state from timeline and other data
  const loadUserState = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingRecommendations(true);
      
      // Get timeline data
      const timeline = await fetchUserTimeline(user.id);
      
      // Get user profile for Lightbearer level
      const { data: profile } = await supabase
        .from('profiles')
        .select('light_level, lightbearer_level, badges')
        .eq('id', user.id)
        .single();
      
      // Calculate chakra focus based on timeline entries
      const chakraCounts: Record<string, number> = {};
      let completedJourneyCount = 0;
      
      timeline.forEach(entry => {
        try {
          const notes = entry.notes ? JSON.parse(entry.notes) : {};
          
          // Count completed journeys
          if (entry.tag === 'journey_complete') {
            completedJourneyCount++;
          }
          
          // Count chakra frequencies
          if (entry.chakra) {
            chakraCounts[entry.chakra] = (chakraCounts[entry.chakra] || 0) + 1;
          }
        } catch (error) {
          console.error("Error parsing timeline entry notes:", error);
        }
      });
      
      // Get top chakras
      const chakraFocus = Object.entries(chakraCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([chakra]) => chakra);
      
      // Calculate chakra balance
      const chakraBalance: ChakraBalance = {
        root: chakraCounts['root'] || 0,
        sacral: chakraCounts['sacral'] || 0,
        solarPlexus: chakraCounts['solar-plexus'] || 0,
        heart: chakraCounts['heart'] || 0,
        throat: chakraCounts['throat'] || 0,
        thirdEye: chakraCounts['third-eye'] || 0,
        crown: chakraCounts['crown'] || 0
      };
      
      // Create user state
      const newUserState: UserState = {
        recentTimeline: timeline.slice(0, 20),
        chakraFocus,
        totalJourneys: timeline.filter(entry => entry.tag?.includes('journey')).length,
        completedJourneys: completedJourneyCount,
        lightbearerLevel: profile?.lightbearer_level || 1,
        lastActivity: timeline.length > 0 ? new Date(timeline[0].created_at) : undefined,
        chakraBalance
      };
      
      setUserState(newUserState);
      
      // Generate recommendations based on user state
      generateRecommendations(newUserState);
    } catch (error) {
      console.error("Error loading user state:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Generate recommendations based on user state
  const generateRecommendations = async (state: UserState) => {
    if (!state) return;
    
    try {
      const newRecommendations: GuidanceRecommendation[] = [];
      
      // 1. Check for chakra imbalance
      const chakraValues = Object.values(state.chakraBalance);
      const maxChakraValue = Math.max(...chakraValues);
      const minChakraValue = Math.min(...chakraValues);
      
      // If there's a significant imbalance, recommend balancing
      if (maxChakraValue > 0 && maxChakraValue / (minChakraValue || 1) > 3) {
        // Find the weakest chakra
        const weakestChakra = Object.entries(state.chakraBalance)
          .sort(([, a], [, b]) => a - b)[0][0];
          
        // Get a journey related to the weakest chakra
        const { data: journeys } = await supabase
          .from('journeys')
          .select('id, title, filename, description')
          .like('tags', `%${weakestChakra}%`)
          .limit(1);
          
        if (journeys && journeys.length > 0) {
          newRecommendations.push({
            id: `chakra-balance-${Date.now()}`,
            title: `Balance Your ${weakestChakra.charAt(0).toUpperCase() + weakestChakra.slice(1)} Chakra`,
            reason: `You've been focusing on higher energy centers. Ground yourself with ${weakestChakra} work.`,
            actionType: 'journey',
            actionId: journeys[0].filename,
            chakra: weakestChakra,
            priority: 8,
            actionLabel: 'Start Journey'
          });
        }
      }
      
      // 2. Check for stalled progress (no activity in last 7 days)
      if (state.lastActivity && (new Date().getTime() - state.lastActivity.getTime() > 7 * 24 * 60 * 60 * 1000)) {
        newRecommendations.push({
          id: `reactivate-${Date.now()}`,
          title: 'Reactivate Your Sacred Journey',
          reason: "It's been a while since your last activity. Reconnect with your practice.",
          actionType: 'meditation',
          actionId: 'reconnect',
          priority: 9,
          actionLabel: 'Quick Reconnection'
        });
      }
      
      // 3. Check for Lightbearer progression opportunities
      if (state.lightbearerLevel < 3 && state.completedJourneys >= 3) {
        newRecommendations.push({
          id: `lightbearer-${Date.now()}`,
          title: 'Unlock Deeper Lightbearer Wisdom',
          reason: "You're ready to access more advanced sacred knowledge.",
          actionType: 'journey',
          actionId: 'lightbearer-initiation',
          priority: 7,
          actionLabel: 'Begin Initiation'
        });
      }
      
      // 4. Check for journey patterns - if focused on one chakra, suggest variety
      if (state.chakraFocus.length === 1 && state.completedJourneys > 2) {
        const dominantChakra = state.chakraFocus[0];
        const { data: alternateJourneys } = await supabase
          .from('journeys')
          .select('id, title, filename, description')
          .not('tags', 'like', `%${dominantChakra}%`)
          .limit(1);
          
        if (alternateJourneys && alternateJourneys.length > 0) {
          newRecommendations.push({
            id: `diversify-${Date.now()}`,
            title: 'Explore Different Energy Centers',
            reason: `You've been focusing on ${dominantChakra}. Try expanding your practice.`,
            actionType: 'journey',
            actionId: alternateJourneys[0].filename,
            priority: 6,
            actionLabel: 'Explore New Territory'
          });
        }
      }
      
      // Sort recommendations by priority
      setRecommendations(newRecommendations.sort((a, b) => b.priority - a.priority));
      
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
  };

  // Refresh recommendations
  const refreshRecommendations = async () => {
    await loadUserState();
  };

  // Dismiss a recommendation
  const dismissRecommendation = (recommendationId: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  };

  // Apply a recommendation (e.g., start a journey)
  const applyRecommendation = (recommendation: GuidanceRecommendation) => {
    switch (recommendation.actionType) {
      case 'journey':
        // Start the recommended journey
        if (recommendation.actionId) {
          // Fetch the journey details first
          supabase
            .from('journeys')
            .select('*')
            .eq('filename', recommendation.actionId)
            .single()
            .then(({ data }) => {
              if (data) {
                startJourney({
                  id: data.id.toString(),
                  title: data.title,
                  slug: data.filename,
                  description: data.description,
                  type: data.tags,
                  chakra: recommendation.chakra
                });
              }
            });
        }
        break;
      
      case 'reflection':
        // Navigate to reflection page
        window.location.href = `/reflection/${recommendation.actionId}`;
        break;
        
      case 'meditation':
        // Navigate to meditation page
        window.location.href = `/meditation/${recommendation.actionId}`;
        break;
        
      case 'frequency':
        // Navigate to frequency page
        window.location.href = `/frequency/${recommendation.actionId}`;
        break;
    }
    
    // Remove the applied recommendation
    dismissRecommendation(recommendation.id);
  };

  const value = {
    recommendations,
    loadingRecommendations,
    userState,
    refreshRecommendations,
    dismissRecommendation,
    applyRecommendation
  };

  return <GuidanceContext.Provider value={value}>{children}</GuidanceContext.Provider>;
}

export function useGuidance() {
  const context = useContext(GuidanceContext);
  if (context === undefined) {
    throw new Error('useGuidance must be used within a GuidanceProvider');
  }
  return context;
}
