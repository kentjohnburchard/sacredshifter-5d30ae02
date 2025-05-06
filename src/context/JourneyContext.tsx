
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LightbearerLevel } from '@/types/lightbearer';
import { showLevelUpNotification } from '@/components/lightbearer/LevelUpNotification';

export interface Journey {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  type?: string;
  chakra?: string;
  startedAt?: Date;
  completedAt?: Date | null;
  stage?: string;
}

export interface JourneyPrompt {
  id: string;
  journey_id: string;
  location: string;
  trigger: string;
  content: string;
  priority_level: number;
  display_type: 'dialog' | 'tooltip' | 'modal';
  active: boolean;
}

export interface LightbearerCode {
  id: string;
  code_name: string;
  title: string;
  description: string;
  icon?: string;
  unlock_activity: string;
  unlock_count: number;
  journey_id?: string;
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
  
  // New functionality
  journeyStage: string | null;
  setJourneyStage: (stage: string) => void;
  activePrompts: JourneyPrompt[];
  fetchPromptsForLocation: (location: string) => Promise<void>;
  dismissPrompt: (promptId: string) => Promise<void>;
  completePrompt: (promptId: string) => Promise<void>;
  savePrompt: (promptId: string) => Promise<void>;
  currentLightbearerCode: LightbearerCode | null;
  checkLightbearerProgress: () => Promise<void>;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [journeyDuration, setJourneyDuration] = useState<number | null>(null);
  const [journeyStage, setJourneyStage] = useState<string | null>(null);
  const [activePrompts, setActivePrompts] = useState<JourneyPrompt[]>([]);
  const [currentLightbearerCode, setCurrentLightbearerCode] = useState<LightbearerCode | null>(null);
  
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
          
          // Also restore journey stage if available
          if (journeyData.stage) {
            setJourneyStage(journeyData.stage);
          }
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
      // Make sure we save the current stage with the journey
      const journeyToSave = {
        ...activeJourney,
        stage: journeyStage 
      };
      localStorage.setItem('activeJourney', JSON.stringify(journeyToSave));
    } else {
      localStorage.removeItem('activeJourney');
    }
  }, [activeJourney, journeyStage]);
  
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
  
  // Fetch prompts when location changes or journey changes
  useEffect(() => {
    if (activeJourney && location.pathname) {
      fetchPromptsForLocation(location.pathname);
    } else {
      setActivePrompts([]);
    }
  }, [location.pathname, activeJourney?.id]);
  
  // Check Lightbearer progress when journey starts/changes
  useEffect(() => {
    if (activeJourney) {
      checkLightbearerProgress();
    }
  }, [activeJourney]);

  const startJourney = (journey: Journey) => {
    const enrichedJourney = {
      ...journey,
      startedAt: new Date(),
      completedAt: null,
      stage: 'started'
    };
    setActiveJourney(enrichedJourney);
    setJourneyStage('started');
    
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
      completedAt: new Date(),
      stage: 'completed'
    };
    setActiveJourney(completedJourney);
    setJourneyStage('completed');
    
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
    setJourneyStage(null);
    setActivePrompts([]);
    setCurrentLightbearerCode(null);
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
  
  // New methods for prompts
  const fetchPromptsForLocation = async (location: string) => {
    if (!activeJourney) return;
    
    try {
      // Get current user to check authentication
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get prompts for this journey and location
      const { data: prompts, error } = await supabase
        .from('journey_prompts')
        .select('*')
        .eq('journey_id', activeJourney.id)
        .eq('location', location)
        .eq('active', true)
        .order('priority_level', { ascending: false });
      
      if (error) {
        console.error("Error fetching prompts:", error);
        return;
      }
      
      if (prompts && prompts.length > 0) {
        console.log(`Found ${prompts.length} prompts for location ${location}`);
        setActivePrompts(prompts);
        
        // Record prompt view if user is logged in
        if (user) {
          await recordActivity('prompt_view', { 
            location, 
            promptCount: prompts.length 
          });
        }
      } else {
        setActivePrompts([]);
      }
    } catch (error) {
      console.error("Error in fetchPromptsForLocation:", error);
    }
  };
  
  const handlePromptAction = async (promptId: string, action: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !activeJourney) {
        console.log("User not logged in or no active journey");
        return;
      }
      
      // Record the interaction
      const { error } = await supabase
        .from('prompt_interactions')
        .insert({
          user_id: user.id,
          prompt_id: promptId,
          journey_id: activeJourney.id,
          action: action
        });
      
      if (error) {
        console.error(`Error recording prompt ${action}:`, error);
        return;
      }
      
      // Remove this prompt from active prompts
      setActivePrompts(current => current.filter(p => p.id !== promptId));
      
      // Check for lightbearer progress after significant interactions
      await checkLightbearerProgress();
      
      console.log(`Prompt ${action} recorded successfully`);
    } catch (error) {
      console.error(`Error in ${action}Prompt:`, error);
    }
  };
  
  const dismissPrompt = async (promptId: string) => {
    await handlePromptAction(promptId, 'dismissed');
  };
  
  const completePrompt = async (promptId: string) => {
    await handlePromptAction(promptId, 'completed');
  };
  
  const savePrompt = async (promptId: string) => {
    await handlePromptAction(promptId, 'saved');
  };
  
  // New method for lightbearer codes
  const checkLightbearerProgress = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !activeJourney) {
        console.log("User not logged in or no active journey");
        return;
      }
      
      // First check for journey-specific codes
      let { data: journeyCodeData, error: journeyCodeError } = await supabase
        .from('lightbearer_codes')
        .select('*')
        .eq('journey_id', activeJourney.id);
      
      if (journeyCodeError) {
        console.error("Error fetching journey codes:", journeyCodeError);
        return;
      }
      
      // Then check for global codes
      const { data: globalCodeData, error: globalCodeError } = await supabase
        .from('lightbearer_codes')
        .select('*')
        .is('journey_id', null);
      
      if (globalCodeError) {
        console.error("Error fetching global codes:", globalCodeError);
        return;
      }
      
      // Combine the code sets
      const allCodes = [...(journeyCodeData || []), ...(globalCodeData || [])];
      if (!allCodes || allCodes.length === 0) return;
      
      // For each code, check if user has performed the required activities
      for (const code of allCodes) {
        const { data: activities, error: activityError } = await supabase
          .from('timeline_snapshots')
          .select('*')
          .eq('user_id', user.id)
          .eq('tag', code.unlock_activity);
        
        if (activityError) {
          console.error(`Error checking activities for code ${code.code_name}:`, activityError);
          continue;
        }
        
        // Check if user has enough activities to unlock this code
        if (activities && activities.length >= code.unlock_count) {
          console.log(`User has unlocked lightbearer code: ${code.title}`);
          
          // Save the current code
          setCurrentLightbearerCode(code);
          
          // Notify the user if this is a new code
          if (!currentLightbearerCode || currentLightbearerCode.code_name !== code.code_name) {
            toast.success(
              <div className="space-y-1">
                <div className="font-bold">New Lightbearer Code Unlocked!</div>
                <div className="text-sm">{code.title}</div>
              </div>, 
              {
                duration: 5000,
                icon: '✨'
              }
            );
            
            // Add the badge to user's profile
            const { error: badgeError } = await supabase
              .rpc('add_lightbearer_points', {
                user_id: user.id,
                activity_type: 'code_unlocked',
                points: 10,
                description: `Unlocked ${code.title} code`
              });
            
            if (badgeError) {
              console.error("Error updating badges:", badgeError);
            }
          }
          
          // We prioritize journey-specific codes, so break after finding first match
          if (code.journey_id === activeJourney.id) break;
        }
      }
    } catch (error) {
      console.error("Error checking lightbearer progress:", error);
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
    journeyDuration,
    
    // New functionality
    journeyStage,
    setJourneyStage,
    activePrompts,
    fetchPromptsForLocation,
    dismissPrompt,
    completePrompt,
    savePrompt,
    currentLightbearerCode,
    checkLightbearerProgress
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
