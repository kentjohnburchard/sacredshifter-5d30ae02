
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { getElementForZodiac, getSoundscapeForElement } from '@/utils/customizationOptions';

export interface UserPreferences {
  id?: string;
  user_id?: string;
  theme_gradient: string;
  element: string;
  zodiac_sign: string;
  watermark_style: string;
  soundscapeMode: string;
  kent_mode?: boolean;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme_gradient: "linear-gradient(to right, #4facfe, #00f2fe)",
    element: "water",
    zodiac_sign: "cancer",
    watermark_style: "zodiac",
    soundscapeMode: "bubbles",
    kent_mode: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserPreferences();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserPreferences = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user preferences:", error);
        toast.error("Couldn't load your vibe settings");
        return;
      }

      if (data) {
        setPreferences({
          ...data,
          soundscapeMode: data.soundscape_mode,
          kent_mode: data.kent_mode || false
        });
      } else {
        // User doesn't have preferences yet, we can try to use astrology data
        const { data: astrologyData } = await supabase
          .from('user_astrology_data')
          .select('sun_sign')
          .eq('user_id', user.id)
          .maybeSingle();

        if (astrologyData?.sun_sign) {
          const sunSign = astrologyData.sun_sign.toLowerCase();
          const element = getElementForZodiac(sunSign);
          const soundscape = getSoundscapeForElement(element);

          setPreferences({
            theme_gradient: element === "fire" 
              ? "linear-gradient(to right, #ff416c, #ff4b2b)"
              : element === "water"
              ? "linear-gradient(to right, #4facfe, #00f2fe)"
              : element === "earth"
              ? "linear-gradient(to right, #a8caba, #5d4157)"
              : "linear-gradient(to right, #e0eafc, #cfdef3)",
            element,
            zodiac_sign: sunSign,
            watermark_style: "zodiac",
            soundscapeMode: soundscape,
            kent_mode: false
          });
        }
      }
    } catch (err) {
      console.error("Error in fetchUserPreferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserPreferences = async (newPreferences: UserPreferences) => {
    try {
      if (!user?.id) {
        toast.error("You need to be logged in to save preferences");
        return;
      }

      const prefsToSave = {
        ...newPreferences,
        user_id: user.id,
        updated_at: new Date().toISOString(),
        soundscape_mode: newPreferences.soundscapeMode,
        kent_mode: newPreferences.kent_mode
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(prefsToSave);

      if (error) {
        console.error("Error saving preferences:", error);
        toast.error("Failed to save your vibe settings");
        return false;
      }

      setPreferences(newPreferences);
      toast.success("Your cosmic vibe has been saved!");
      return true;
    } catch (err) {
      console.error("Error in saveUserPreferences:", err);
      toast.error("Something went wrong while saving your preferences");
      return false;
    }
  };

  return {
    preferences,
    setPreferences,
    saveUserPreferences,
    loading,
    refreshPreferences: fetchUserPreferences
  };
};
