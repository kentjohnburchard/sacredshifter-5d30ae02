
import React from 'react';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';

const SacredBlueprint: React.FC = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <Layout pageTitle="Sacred Blueprint" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Sacred Blueprint</h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-4">
            Your Sacred Blueprint is your unique vibrational fingerprint that reveals your energetic signature,
            spiritual identity, and soul purpose through a personalized frequency assessment.
          </p>
          {liftTheVeil ? (
            <p className="italic text-pink-300">
              The veil has been lifted. Your cosmic attunement has been activated at the highest level.
            </p>
          ) : (
            <p className="text-purple-300">
              Discover your unique resonance pattern and unlock your spiritual potential.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SacredBlueprint;
