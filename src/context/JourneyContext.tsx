
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Journey {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  type?: string;
  chakra?: string;
  startedAt?: Date;
  completedAt?: Date | null;
}

interface JourneyContextType {
  activeJourney: Journey | null;
  setActiveJourney: (journey: Journey | null) => void;
  startJourney: (journey: Journey) => void;
  completeJourney: () => void;
  resetJourney: () => void;
  recordActivity: (activityType: string, details?: any) => Promise<void>;
  isJourneyActive: boolean;
  journeyDuration: number | null;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [journeyDuration, setJourneyDuration] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load active journey from localStorage on mount
  useEffect(() => {
    const storedJourney = localStorage.getItem('activeJourney');
    if (storedJourney) {
      try {
        const journeyData = JSON.parse(storedJourney);
        // Only restore if the journey hasn't been completed
        if (journeyData && !journeyData.completedAt) {
          setActiveJourney(journeyData);
          console.log("Restored active journey from storage:", journeyData);
        } else {
          // Clear completed journeys
          localStorage.removeItem('activeJourney');
        }
      } catch (error) {
        console.error("Error parsing stored journey:", error);
        localStorage.removeItem('activeJourney');
      }
    }
  }, []);
  
  // Save journey state to localStorage whenever it changes
  useEffect(() => {
    if (activeJourney) {
      localStorage.setItem('activeJourney', JSON.stringify(activeJourney));
    } else {
      localStorage.removeItem('activeJourney');
    }
  }, [activeJourney]);
  
  // Calculate journey duration
  useEffect(() => {
    if (activeJourney?.startedAt && !activeJourney.completedAt) {
      const intervalId = setInterval(() => {
        const startTime = new Date(activeJourney.startedAt!).getTime();
        const currentTime = new Date().getTime();
        const duration = Math.floor((currentTime - startTime) / 1000); // duration in seconds
        setJourneyDuration(duration);
      }, 1000);
      
      return () => clearInterval(intervalId);
    } else if (activeJourney?.completedAt && activeJourney.startedAt) {
      const startTime = new Date(activeJourney.startedAt).getTime();
      const endTime = new Date(activeJourney.completedAt).getTime();
      setJourneyDuration(Math.floor((endTime - startTime) / 1000));
    } else {
      setJourneyDuration(null);
    }
  }, [activeJourney]);

  const startJourney = (journey: Journey) => {
    const enrichedJourney = {
      ...journey,
      startedAt: new Date(),
      completedAt: null
    };
    setActiveJourney(enrichedJourney);
    
    // Record journey start in timeline if logged in
    recordActivity('journey_start', { journeyId: journey.id, title: journey.title });
    
    // Optionally navigate to journey player or relevant page
    if (journey.id && !location.pathname.includes('journey-player')) {
      navigate(`/journey-player/${journey.id}`);
    }
    
    toast.success(`Journey "${journey.title}" started`);
  };

  const completeJourney = () => {
    if (!activeJourney) return;
    
    const completedJourney = {
      ...activeJourney,
      completedAt: new Date()
    };
    setActiveJourney(completedJourney);
    
    // Record journey completion in timeline
    recordActivity('journey_complete', { 
      journeyId: activeJourney.id,
      duration: journeyDuration
    });
    
    toast.success(`Journey "${activeJourney.title}" completed`);
    
    // Clear journey after a delay
    setTimeout(() => resetJourney(), 5000);
  };

  const resetJourney = () => {
    setActiveJourney(null);
    setJourneyDuration(null);
  };

  const recordActivity = async (activityType: string, details: any = {}) => {
    if (!activeJourney) return;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("User not logged in, activity not recorded");
        return;
      }
      
      // Add journey info to timeline
      const activityData = {
        user_id: user.id,
        title: `${activityType.replace(/_/g, ' ')} - ${activeJourney.title}`,
        tag: activityType,
        notes: JSON.stringify({
          ...details,
          journeyId: activeJourney.id,
          journeyTitle: activeJourney.title
        })
      };
      
      const { error } = await supabase
        .from('timeline_snapshots')
        .insert(activityData);
        
      if (error) {
        console.error("Error recording journey activity:", error);
      } else {
        console.log(`Journey activity recorded: ${activityType}`);
      }
      
      // If it's a significant milestone, add lightbearer points
      if (['journey_complete', 'frequency_shift', 'meditation_complete'].includes(activityType)) {
        const { data: pointsData, error: pointsError } = await supabase
          .rpc('add_lightbearer_points', {
            user_id: user.id,
            activity_type: activityType,
            points: activityType === 'journey_complete' ? 15 : 5,
            description: `${activeJourney.title} - ${activityType.replace(/_/g, ' ')}`
          });
          
        if (pointsError) {
          console.error("Error adding lightbearer points:", pointsError);
        } else if (pointsData) {
          // Fix the type issue by safely accessing the data
          const leveledUp = typeof pointsData === 'object' && 
            pointsData !== null && 
            'leveled_up' in pointsData && 
            pointsData.leveled_up === true;
            
          if (leveledUp) {
            toast.success("You leveled up as a Lightbearer! ✨");
          }
        }
      }
      
    } catch (error) {
      console.error("Error in recordActivity:", error);
    }
  };

  const value = {
    activeJourney,
    setActiveJourney,
    startJourney,
    completeJourney,
    resetJourney,
    recordActivity,
    isJourneyActive: !!activeJourney && !activeJourney.completedAt,
    journeyDuration
  };

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
