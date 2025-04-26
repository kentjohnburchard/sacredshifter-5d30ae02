
import React from "react";
import SacredShifterInfoDropdown from "@/components/SacredShifterInfoDropdown";

const SacredShifterWhy: React.FC = () => (
  <div className="min-h-screen bg-[#11141B] flex flex-col items-center py-16">
    <SacredShifterInfoDropdown />
    <div className="mt-10 max-w-3xl w-full flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold mb-4 text-purple-200 text-center">Why was Sacred Shifter created?</h2>
      <p className="text-lg md:text-xl text-gray-100 mb-5 text-center">
        Sacred Shifter was created to guide you back to your authentic frequency—when the noise of the world and our own minds makes us forget our truth.
      </p>
      <p className="text-base text-gray-400 text-center">
        We believe every soul deserves a blueprint for remembrance—a map home to self-awareness, connection, and resonance. The “why” is simple: to help you shift from surviving in the old paradigm, to thriving in a new one.
      </p>
    </div>
  </div>
);

export default SacredShifterWhy;
