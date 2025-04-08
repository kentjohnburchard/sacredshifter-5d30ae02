
import React, { useEffect, useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { ToggleLeft, ToggleRight, Sparkles } from "lucide-react";
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from "sonner";
import { useTheme } from '@/context/ThemeContext';

const VibeCustomizer = () => {
  const { preferences, saveUserPreferences, loading } = useUserPreferences();
  const { liftTheVeil, setLiftTheVeil } = useTheme();

  const handleLiftTheVeilChange = async (checked: boolean) => {
    try {
      // Update in ThemeContext for immediate UI response
      setLiftTheVeil(checked);
      
      // Update the database preferences
      await saveUserPreferences({
        ...preferences,
        consciousness_mode: checked ? "lift-the-veil" : "standard",
      });
      
      // Show toast notification
      toast.success(
        checked 
          ? "Lift the Veil mode activated. Seeing beyond the ordinary." 
          : "Standard mode activated. Back to normal perception.",
        {
          icon: checked 
            ? <Sparkles className="h-4 w-4 text-brand-aurapink" /> 
            : <Sparkles className="h-4 w-4 text-gray-400" />,
        }
      );
    } catch (error) {
      console.error("Failed to update consciousness mode:", error);
      toast.error("Failed to update your vibe settings");
      
      // Revert UI state on error
      setLiftTheVeil(!checked);
    }
  };

  // Initialize local state from preferences when loaded
  useEffect(() => {
    if (preferences?.consciousness_mode) {
      const isLiftTheVeil = preferences.consciousness_mode === "lift-the-veil";
      if (liftTheVeil !== isLiftTheVeil) {
        setLiftTheVeil(isLiftTheVeil);
      }
    }
  }, [preferences, setLiftTheVeil, liftTheVeil]);

  return (
    <>
      {/* Lift the Veil Toggle */}
      <div className="mt-6 p-4 border border-purple-100 rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-medium">Lift the Veil</h3>
            <p className="text-sm text-gray-500">
              {liftTheVeil ? "Lift the Veil: Show your true self" : "Standard Mode: Hide your true self"}
              <span className="ml-1 text-xs text-amber-500">(Saved to your profile)</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              checked={liftTheVeil} 
              onCheckedChange={handleLiftTheVeilChange} 
              className={liftTheVeil ? "bg-brand-aurapink" : ""}
              disabled={loading}
            />
            {liftTheVeil ? 
              <ToggleRight className="h-4 w-4 text-brand-aurapink" /> : 
              <ToggleLeft className="h-4 w-4 text-gray-400" />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default VibeCustomizer;
