
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SacredJourneys: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <Layout 
      pageTitle="Sacred Journeys | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-purple-100">
            Sacred Journeys
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['heart-center', 'chakra-alignment', 'meditation', 'inner-peace'].map((journey) => (
              <div 
                key={journey} 
                className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-all"
              >
                <h3 className="text-xl font-semibold mb-2 capitalize">
                  {journey.split('-').join(' ')}
                </h3>
                <p className="text-gray-300 mb-4">
                  Embark on a journey to elevate your consciousness and align with your true self.
                </p>
                <Link to={`/journey/${journey}`}>
                  <Button className="w-full bg-purple-700 hover:bg-purple-600">
                    Begin Journey
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          
          {!user && (
            <div className="mt-10 text-center">
              <p className="text-gray-300 mb-4">
                Sign in to access your personal journey history and saved experiences.
              </p>
              <Link to="/auth">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SacredJourneys;
