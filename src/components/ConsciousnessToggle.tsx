
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

const ConsciousnessToggle: React.FC = () => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  
  // Simple toggle function
  const handleToggle = () => {
    const newState = !liftTheVeil;
    console.log("ConsciousnessToggle: Toggling consciousness state to:", newState);
    setLiftTheVeil(newState);
    
    toast.success(newState ? "Veil Lifted! Consciousness Expanded" : "Standard Mode activated", {
      icon: <Sparkles className={newState ? "text-pink-500" : "text-indigo-500"} />,
      duration: 3000,
      position: "top-center"
    });
  };
  
  // Return only the toggle triggers
  return (
    <>
      {/* Hidden clickable areas */}
      <div 
        className="fixed bottom-16 right-4 z-[1000] w-12 h-12 opacity-0"
        onClick={handleToggle}
        aria-hidden="true"
      />
      
      <div 
        className="fixed top-2 left-1/2 transform -translate-x-1/2 z-[1000] w-40 h-10 opacity-0"
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
