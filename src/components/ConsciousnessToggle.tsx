
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil, toggleConsciousnessMode } = useTheme();
  
  // Log mount state
  useEffect(() => {
    console.log("ConsciousnessToggle mounted, current state:", liftTheVeil);
  }, [liftTheVeil]);
  
  // Log when state changes
  useEffect(() => {
    console.log("ConsciousnessToggle detected state change:", liftTheVeil);
  }, [liftTheVeil]);
  
  // Direct simple toggle that calls ThemeContext
  const handleToggle = () => {
    console.log("ConsciousnessToggle: Click detected, calling toggle function");
    toggleConsciousnessMode();
  };
  
  return (
    <>
      {/* Larger clickable area with better z-index */}
      <div 
        className="fixed bottom-16 right-4 z-[1000] w-24 h-24 opacity-50 hover:opacity-100 
                  bg-purple-500/30 rounded-full cursor-pointer flex items-center justify-center
                  transition-all duration-300 ease-in-out hover:scale-110"
        onClick={handleToggle}
        aria-hidden="true"
        data-testid="consciousness-toggle"
      >
        <div className={`w-12 h-12 rounded-full ${liftTheVeil ? 'bg-pink-600/70' : 'bg-purple-600/60'} 
                        flex items-center justify-center transition-colors duration-500`}>
          <span className="sr-only">Toggle Consciousness Mode</span>
        </div>
      </div>

      {/* Enhanced theme state indicator */}
      <div className="fixed bottom-2 right-2 z-[1000] bg-black/80 text-white text-xs p-1 rounded">
        Mode: <span className={liftTheVeil ? 'text-pink-400' : 'text-purple-400'}>
          {liftTheVeil ? 'Veil Lifted' : 'Standard'}
        </span>
      </div>
    </>
  );
};

export default ConsciousnessToggle;
