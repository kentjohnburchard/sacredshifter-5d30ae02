
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useEasterEggContext } from "@/context/EasterEggContext";

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const { toggleEasterEggMode } = useEasterEggContext();
  
  // Simple toggle function that triggers the state change through the context
  const handleToggle = () => {
    console.log("ConsciousnessToggle: Initiating toggle, current state:", liftTheVeil);
    toggleEasterEggMode();
  };
  
  return (
    <>
      {/* Single clickable area */}
      <div 
        className="fixed bottom-16 right-4 z-[1000] w-12 h-12 opacity-0"
        onClick={handleToggle}
        aria-hidden="true"
      />

      {/* Theme state indicator (visible only in dev mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 z-[1000] bg-black/70 text-white text-xs p-1 rounded">
          Mode: {liftTheVeil ? 'Veil Lifted' : 'Standard'}
        </div>
      )}
    </>
  );
};

export default ConsciousnessToggle;
