
import React from "react";
import { useTheme } from "@/context/ThemeContext";

const Watermark: React.FC = () => {
  const { kentMode } = useTheme();

  // Apply styling based on kent mode
  const watermarkStyle = kentMode ? "text-pink-500" : "text-indigo-500";

  return (
    <div className="fixed top-4 left-6 z-10 pointer-events-none select-none opacity-30">
      <div className={`text-sm font-light ${watermarkStyle}`}>
        Sacred Shifter
      </div>
    </div>
  );
};

export default Watermark;
