
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
  consciousness_mode?: "standard" | "lift-the-veil";
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme_gradient: "linear-gradient(to right, #4facfe, #00f2fe)",
    element: "water",
    zodiac_sign: "cancer",
    watermark_style: "zodiac",
    soundscapeMode: "bubbles",
    kent_mode: false,
    consciousness_mode: "standard"
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
        .eq('user_id', user.id);

      if (error) {
        console.error("Error fetching user preferences:", error);
        toast.error("Couldn't load your vibe settings");
        return;
      }

      if (data && data.length > 0) {
        const latestPrefs = data.sort((a: any, b: any) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];
        
        // Map database fields to our interface
        setPreferences({
          ...latestPrefs,
          soundscapeMode: latestPrefs.soundscape_mode,
          kent_mode: latestPrefs.kent_mode || false,
          consciousness_mode: latestPrefs.consciousness_mode || "standard"
        });
      } else {
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
            kent_mode: false,
            consciousness_mode: "standard"
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
        return false;
      }

      console.log("Saving user preferences:", newPreferences);

      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id);
      
      const prefsToSave = {
        user_id: user.id,
        theme_gradient: newPreferences.theme_gradient,
        element: newPreferences.element,
        zodiac_sign: newPreferences.zodiac_sign,
        watermark_style: newPreferences.watermark_style,
        soundscape_mode: newPreferences.soundscapeMode,
        kent_mode: newPreferences.kent_mode || false,
        consciousness_mode: newPreferences.consciousness_mode || "standard",
        updated_at: new Date().toISOString()
      };

      let error;
      
      if (existingPrefs && existingPrefs.length > 0) {
        const latestPref = existingPrefs[0];
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update(prefsToSave)
          .eq('id', latestPref.id);
          
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert(prefsToSave);
          
        error = insertError;
      }

      if (error) {
        console.error("Error saving preferences:", error);
        toast.error("Failed to save your vibe settings");
        return false;
      }

      setPreferences({
        ...newPreferences
      });
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
