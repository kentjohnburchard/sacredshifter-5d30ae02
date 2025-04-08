
import React, { useEffect } from "react";
import FrequencyShiftPrompt from "@/components/FrequencyShiftPrompt";

const FrequencyShiftTab = () => {
  // Add debugging
  useEffect(() => {
    console.log('FrequencyShiftTab rendered');
    setTimeout(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        console.log('Footer visibility in FrequencyShiftTab:', {
          rect: footer.getBoundingClientRect(),
          isVisible: footer.getBoundingClientRect().top < window.innerHeight
        });
      }
    }, 1000);
  }, []);

  return (
    <div className="w-full pb-16">
      <FrequencyShiftPrompt />
    </div>
  );
};

export default FrequencyShiftTab;
