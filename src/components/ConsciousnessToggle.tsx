
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { ToggleLeft, ToggleRight } from "lucide-react";

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil, toggleConsciousnessMode } = useTheme();

  // Minimal, always-correct toggle button: top-right, large
  return (
    <>
      <button
        onClick={toggleConsciousnessMode}
        className="fixed top-4 right-4 z-[1000] bg-gray-800/80 hover:bg-pink-500/80 transition-colors rounded-full shadow-lg p-3 flex items-center justify-center"
        aria-label="Toggle Consciousness Mode"
        data-testid="consciousness-toggle"
      >
        {liftTheVeil ? (
          <ToggleRight className="h-8 w-8 text-pink-400" />
        ) : (
          <ToggleLeft className="h-8 w-8 text-purple-300" />
        )}
      </button>
      {/* Small mode indicator below */}
      <div className="fixed top-20 right-4 z-[1000] bg-black/80 text-white text-xs px-2 py-1 rounded">
        Mode: <span className={liftTheVeil ? 'text-pink-400' : 'text-purple-400'}>
          {liftTheVeil ? 'Veil Lifted' : 'Standard'}
        </span>
      </div>
    </>
  );
};

export default ConsciousnessToggle;
