
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Sparkles } from "lucide-react";
import { CosmicContainer } from "@/components/sacred-geometry/CosmicContainer";

// Enhanced Sacred Blueprint page with optimized animations
const SacredBlueprint = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading with smoother progress animation
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsLoading(false);
        clearInterval(interval);
      } else {
        setProgress(Math.min(currentProgress, 95)); // Cap at 95% until actually loaded
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Layout pageTitle="Sacred Blueprint™" theme="cosmic">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-playfair mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
            Sacred Blueprint™
          </h1>
          <p className="text-lg text-purple-100/90 max-w-2xl mx-auto">
            Discover your unique energetic signature and align with your soul's purpose
          </p>
        </div>
        
        <CosmicContainer>
          <div className="w-full max-w-md mx-auto p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-500/30 p-2 rounded-full">
                <Sparkles className="h-7 w-7 text-purple-200" />
              </div>
            </div>
            
            <div className="text-center p-4">
              <h2 className="text-xl font-semibold mb-2">Blueprint Creator</h2>
              <p>{isLoading ? "Your sacred blueprint is loading..." : "Your blueprint is ready!"}</p>
              <div className="mt-4 bg-purple-500/20 h-2 w-full rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              {!isLoading && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <h3 className="font-medium text-purple-300 mb-2">Soul Frequency</h3>
                    <p className="text-2xl font-light">528 Hz</p>
                  </div>
                  
                  <div className="p-4 bg-indigo-500/10 rounded-lg">
                    <h3 className="font-medium text-indigo-300 mb-2">Primary Element</h3>
                    <p className="text-2xl font-light">Water</p>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 rounded-lg">
                    <h3 className="font-medium text-blue-300 mb-2">Blueprint Pattern</h3>
                    <p className="text-2xl font-light">Sacred Spiral</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CosmicContainer>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
