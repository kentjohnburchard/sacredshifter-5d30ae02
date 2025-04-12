
import React from 'react';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';
import { Brain, Sparkles } from 'lucide-react';

const ShiftPerception: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <Layout pageTitle="Shift Perception" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          {liftTheVeil ? <Sparkles className="text-pink-500" /> : <Brain className="text-purple-500" />}
          Shift Perception
        </h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-4">
            Transform your consciousness and expand your awareness with our perception-shifting 
            practices and tools designed to elevate your spiritual journey.
          </p>
          {liftTheVeil ? (
            <div className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg mt-4">
              <p className="italic">
                Your consciousness has been elevated. You are seeing beyond the veil of ordinary reality.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg mt-4">
              <p>
                Use the consciousness toggle in the bottom right to lift the veil and expand your perception.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShiftPerception;
