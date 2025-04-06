
import React from 'react';
import { Sparkles } from 'lucide-react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

const ConsciousnessToggle: React.FC = () => {
  const { preferences, saveUserPreferences, loading } = useUserPreferences();
  const { kentMode, setKentMode } = useTheme();
  
  const toggleConsciousnessMode = async () => {
    try {
      if (!loading) {
        // Use the theme context function to toggle the mode
        setKentMode(!kentMode);
        
        toast.success(kentMode ? "Returning to standard consciousness" : "Kent Mode activated! Cosmic sass unlocked.", {
          icon: <Sparkles className={`${kentMode ? "text-purple-400" : "text-brand-aurapink"}`} />,
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
      className="fixed bottom-6 right-6 z-40 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-300 group"
      title={kentMode ? "Switch to Standard Mode" : "Enable Kent Mode"}
      aria-label="Toggle consciousness mode"
    >
      <Sparkles 
        className={`h-5 w-5 ${kentMode ? 'text-pink-500 animate-pulse-subtle' : 'text-purple-400'} group-hover:scale-110 transition-all`}
      />
    </button>
  );
};

export default ConsciousnessToggle;
