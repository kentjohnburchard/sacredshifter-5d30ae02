
import React from "react";
import SacredShifterInfoDropdown from "@/components/SacredShifterInfoDropdown";

const SacredShifterHow: React.FC = () => (
  <div className="min-h-screen bg-[#11141B] flex flex-col items-center py-16">
    <SacredShifterInfoDropdown />
    <div className="mt-10 max-w-3xl w-full flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold mb-4 text-purple-200 text-center">How do I use Sacred Shifter?</h2>
      <p className="text-lg md:text-xl text-gray-100 mb-5 text-center">
        Start by exploring the frequency library or take the Sacred Blueprint assessment. These tools reveal insights about your energetic nature.
      </p>
      <p className="text-base text-gray-400 text-center">
        Embark on sound journeys, meditate, engage with visual tools, and track your alignment. Each module is a gateway; follow your curiosity and let resonance guide your steps.
      </p>
    </div>
  </div>
);

export default SacredShifterHow;
