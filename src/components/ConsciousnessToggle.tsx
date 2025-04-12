
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const ConsciousnessToggle: React.FC = () => {
  const { preferences, saveUserPreferences, loading } = useUserPreferences();
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  
  const toggleConsciousnessMode = async () => {
    try {
      if (!loading) {
        // Toggle the mode
        const newMode = !liftTheVeil;
        
        // Use the theme context function to update the mode
        setLiftTheVeil(newMode);
        
        // Show success toast
        toast.success(newMode ? "Lifted the Veil! Cosmic insights unlocked." : "Returning to standard perception", {
          icon: <Sparkles className={newMode ? "text-pink-500" : "text-purple-400"} />,
          position: "bottom-center"
        });
      }
    } catch (error) {
      console.error('Error toggling consciousness mode:', error);
      toast.error('Could not update consciousness mode');
    }
  };

  return (
    <button 
      onClick={toggleConsciousnessMode}
      className={`fixed bottom-6 right-6 z-40 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 group ${
        liftTheVeil 
          ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-pink-500/30" 
          : "bg-black/60 backdrop-blur-sm text-purple-300 border border-purple-500/30"
      }`}
      title={liftTheVeil ? "Return to standard perception" : "Lift the Veil"}
      aria-label="Toggle consciousness mode"
    >
      <Sparkles 
        className={`h-5 w-5 ${liftTheVeil ? 'animate-pulse' : ''} group-hover:scale-110 transition-all`}
      />
    </button>
  );
};

export default ConsciousnessToggle;
