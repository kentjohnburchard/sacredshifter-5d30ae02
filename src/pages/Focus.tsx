
import React from 'react';
import Layout from '@/components/Layout';
import { Brain } from 'lucide-react';

const Focus: React.FC = () => {
  return (
    <Layout pageTitle="Focus" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="text-indigo-500" />
          Focus
        </h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-4">
            Welcome to the Focus section, a space for concentration and manifestation.
            Here you can access focus-enhancing frequencies and practices designed to 
            sharpen your mind and strengthen your ability to manifest intentions.
          </p>
          <div className="text-center my-8">
            <div className="inline-block p-8 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse">
              <Brain className="h-16 w-16 text-indigo-500" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;
