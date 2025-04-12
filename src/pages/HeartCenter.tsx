
import React from 'react';
import Layout from '@/components/Layout';
import { Heart } from 'lucide-react';

const HeartCenter: React.FC = () => {
  return (
    <Layout pageTitle="Heart Center" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="text-pink-500" />
          Heart Center
        </h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-4">
            Welcome to the Heart Center, a space for cultivating love, compassion and emotional healing.
            Here you can access heart-centered practices and frequencies designed to open and balance
            your heart chakra.
          </p>
          <div className="text-center my-8">
            <div className="inline-block p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full animate-pulse">
              <Heart className="h-16 w-16 text-pink-500" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HeartCenter;
