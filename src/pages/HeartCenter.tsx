
import React from 'react';
import Layout from '@/components/Layout';
import HeartFrequencyPlaylists from '@/components/heart-center/HeartFrequencyPlaylists';
import LoveDashboard from '@/components/heart-center/LoveDashboard';
import MirrorPortal from '@/components/heart-center/MirrorPortal';
import SoulHug from '@/components/heart-center/SoulHug';
import { Card } from '@/components/ui/card';

const HeartCenter: React.FC = () => {
  return (
    <Layout pageTitle="Heart Center">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Heart Center</h1>
        <p className="text-lg text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Welcome to the Heart Center, a space for emotional balance and healing.
        </p>
        
        <div className="space-y-16">
          <section className="py-8">
            <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-pink-300">Love Dashboard</h2>
              <LoveDashboard />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-pink-300">Mirror Portal</h2>
              <MirrorPortal />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-pink-300">Soul Hug</h2>
              <SoulHug />
            </Card>
          </section>
          
          <section className="py-8">
            <Card className="bg-black/40 border-pink-500/20 backdrop-blur-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-center text-pink-300">Heart Frequency Playlists</h2>
              <HeartFrequencyPlaylists />
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default HeartCenter;
