
import React from 'react';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CircleInfo: React.FC = () => {
  return (
    <Layout 
      pageTitle="Circle Information | Sacred Shifter"
      showNavbar={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">The Sacred Circle</h1>
          
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mb-8">
            <p className="text-lg mb-4">
              The Sacred Circle is our community of light-bearers and consciousness shifters who support each other on their spiritual journeys.
            </p>
            <p className="mb-4">
              By joining the Sacred Circle, you connect with like-minded individuals dedicated to raising their vibration and expanding their awareness.
            </p>
            <p>
              Members gain access to exclusive content, special guided journeys, and community events focused on spiritual growth and transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✦</span>
                  <span>Exclusive spiritual practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✦</span>
                  <span>Community support and connection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✦</span>
                  <span>Sacred geometry activations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">✦</span>
                  <span>Frequency healing sessions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">How It Works</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">1.</span>
                  <span>Join the Sacred Circle community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">2.</span>
                  <span>Complete your energetic profile</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">3.</span>
                  <span>Connect with other light-bearers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">4.</span>
                  <span>Participate in collective consciousness shifts</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link to="/sacred-circle">
              <Button className="bg-purple-700 hover:bg-purple-600">
                Enter the Sacred Circle
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CircleInfo;
