
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
      {/* Larger clickable area to ensure toggle works */}
      <div 
        className="fixed bottom-16 right-4 z-[1000] w-16 h-16 opacity-0 cursor-pointer"
        onClick={handleToggle}
        aria-hidden="true"
        data-testid="consciousness-toggle"
      />

      {/* Theme state indicator (visible in all modes for debugging) */}
      <div className="fixed bottom-2 right-2 z-[1000] bg-black/70 text-white text-xs p-1 rounded">
        Mode: {liftTheVeil ? 'Veil Lifted' : 'Standard'}
      </div>
    </>
  );
};

export default ConsciousnessToggle;
