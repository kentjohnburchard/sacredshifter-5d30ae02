
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useEasterEggContext } from "@/context/EasterEggContext";

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const { toggleEasterEggMode } = useEasterEggContext();
  
  // Simple toggle function with enhanced logging
  const handleToggle = () => {
    console.log("ConsciousnessToggle: Initiating toggle, current state:", liftTheVeil);
    toggleEasterEggMode();
  };
  
  return (
    <>
      {/* Larger clickable area with better z-index to ensure toggle works */}
      <div 
        className="fixed bottom-16 right-4 z-[1000] w-24 h-24 opacity-30 hover:opacity-80 bg-purple-500/20 rounded-full cursor-pointer flex items-center justify-center"
        onClick={handleToggle}
        aria-hidden="true"
        data-testid="consciousness-toggle"
      >
        <div className="w-12 h-12 rounded-full bg-purple-600/40 flex items-center justify-center">
          <span className="sr-only">Toggle Consciousness Mode</span>
        </div>
      </div>

      {/* Theme state indicator (visible in all modes for debugging) */}
      <div className="fixed bottom-2 right-2 z-[1000] bg-black/70 text-white text-xs p-1 rounded">
        Mode: {liftTheVeil ? 'Veil Lifted' : 'Standard'} (Click to toggle)
      </div>
    </>
  );
};

export default ConsciousnessToggle;
