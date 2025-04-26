
import React from "react";
import SacredShifterInfoDropdown from "@/components/SacredShifterInfoDropdown";

const SacredShifterWhat: React.FC = () => (
  <div className="min-h-screen bg-[#11141B] flex flex-col items-center py-16">
    <SacredShifterInfoDropdown />
    <div className="mt-10 max-w-3xl w-full flex flex-col items-center px-4">
      <h2 className="text-3xl font-bold mb-4 text-purple-200 text-center">What is Sacred Shifter?</h2>
      <p className="text-lg md:text-xl text-gray-100 mb-5 text-center">
        Sacred Shifter is a digital spiritual toolkit—a place where sound, geometry, and the wisdom of the ancients come together to help you awaken, remember, and realign.
      </p>
      <p className="text-base text-gray-400 text-center">
        Inside, you’ll find frequency tools, cosmic soundscapes, meditation journeys, and interactive modules designed to shift your state—mind, body, and soul. Sacred Shifter is more than an app, it’s your portal to remembrance.
      </p>
    </div>
  </div>
);

export default SacredShifterWhat;
