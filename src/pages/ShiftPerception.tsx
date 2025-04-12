
import React from 'react';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';
import { Brain, Sparkles } from 'lucide-react';
import QuoteSlider from '@/components/shift-perception/QuoteSlider';
import PerceptionChecklist from '@/components/shift-perception/PerceptionChecklist';

const ShiftPerception: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <Layout pageTitle="Shift Perception" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          {liftTheVeil ? <Sparkles className="text-pink-500" /> : <Brain className="text-purple-500" />}
          Shift Perception
        </h1>
        
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg mb-8">
          <p className="mb-4">
            Transform your consciousness and expand your awareness with our perception-shifting 
            practices and tools designed to elevate your spiritual journey.
          </p>
          {liftTheVeil ? (
            <div className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg mt-4">
              <p className="italic text-pink-200">
                Your consciousness has been elevated. You are seeing beyond the veil of ordinary reality.
                The frequency of your awareness has shifted to a higher dimensional plane.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg mt-4">
              <p>
                Use the consciousness toggle in the bottom right to lift the veil and expand your perception.
                Experience a shift in frequency and awareness.
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Signs of Shifting</h2>
              <p className="text-gray-200 mb-4">
                Check which of these experiences resonate with your own journey:
              </p>
              <PerceptionChecklist />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Awakening Wisdom</h2>
              <p className="text-gray-200 mb-4">
                Contemplate these insights to help shift your perception:
              </p>
              <QuoteSlider />
            </div>
            
            <div className={`p-6 rounded-lg border transition-all duration-500 ${
              liftTheVeil 
                ? "bg-pink-900/20 border-pink-500/30 text-pink-100" 
                : "bg-purple-900/20 border-purple-500/30 text-purple-100"
            }`}>
              <h3 className="text-xl font-medium mb-2">Daily Practice</h3>
              <p className="mb-3">
                Set aside 10 minutes each day to observe your thoughts without judgment. 
                Notice how your perception shifts when you become the witness rather than the thinker.
              </p>
              <div className="flex justify-end">
                <a 
                  href="/focus" 
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    liftTheVeil
                      ? "bg-pink-700/50 hover:bg-pink-700/70 text-pink-100"
                      : "bg-purple-700/50 hover:bg-purple-700/70 text-purple-100"
                  }`}
                >
                  <Brain className="h-4 w-4" />
                  <span>Try Focused Awareness</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
