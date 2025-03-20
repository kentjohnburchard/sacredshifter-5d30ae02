
import React, { useState } from "react";
import Header from "@/components/Header";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import FrequencySelector from "@/components/FrequencySelector";
import FrequencyInfo from "@/components/FrequencyInfo";
import { healingFrequencies } from "@/data/frequencies";

const Index = () => {
  const [selectedFrequency, setSelectedFrequency] = useState(healingFrequencies[0]);
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">
              Sacred Shifter
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience the healing power of sound frequencies. Select a frequency to begin your journey to balance and harmony.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FrequencySelector 
              frequencies={healingFrequencies} 
              selectedFrequency={selectedFrequency}
              onSelect={setSelectedFrequency}
            />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <FrequencyPlayer frequency={selectedFrequency} />
            <FrequencyInfo frequency={selectedFrequency} />
          </div>
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-muted-foreground">
        <p>Sacred Shifter - Heal with the power of sound.</p>
      </footer>
    </div>
  );
};

export default Index;
