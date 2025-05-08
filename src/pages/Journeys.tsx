
import React from "react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SacredJourneyScroll from "@/components/sacred-journey/SacredJourneyScroll";
import { useAuth } from "@/context/AuthContext";
import PremiumGuard from "@/components/PremiumGuard";
import { Crown } from "lucide-react";

const Journeys = () => {
  const { user, profile } = useAuth();
  const isPremium = profile?.is_premium || false;

  // Regular journeys available to all users
  const regularJourneys = ['heart-center', 'chakra-alignment', 'meditation'];
  
  // Premium journeys only available to premium users
  const premiumJourneys = ['trinity-gateway', 'dna-activation', 'cosmic-consciousness'];

  return (
    <AppShell pageTitle="Sacred Journeys">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Sacred Journeys</h1>
          <p className="text-gray-300 mb-4">
            Experience curated frequency journeys for transformation and healing
          </p>
          <div className="flex flex-wrap mt-4 gap-3">
            <Link to="/journey-templates">
              <Button variant="outline">Journey Templates</Button>
            </Link>
            {user && (
              <Link to="/dashboard">
                <Button variant="secondary">Dashboard</Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth">
                <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                  Sign In to Track Progress
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Regular Journeys Available to All */}
          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-200">Available Journeys</h2>
            <div className="space-y-4">
              {regularJourneys.map((journey) => (
                <Link 
                  key={journey} 
                  to={`/journey/${journey}`}
                  className="block p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg hover:border-purple-400/50 transition-all"
                >
                  <h3 className="text-lg font-medium capitalize text-white">
                    {journey.split('-').join(' ')}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    Explore sacred vibrations and frequencies for transformation.
                  </p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Premium Journeys */}
          <div className="bg-black/30 backdrop-blur-sm border border-amber-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2 text-amber-200 flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Premium Journeys
            </h2>
            <p className="text-gray-400 text-sm mb-4">Advanced frequency experiences for premium members</p>
            
            <PremiumGuard>
              <div className="space-y-4">
                {premiumJourneys.map((journey) => (
                  <Link 
                    key={journey} 
                    to={`/journey/${journey}`}
                    className="block p-4 bg-amber-900/30 border border-amber-500/30 rounded-lg hover:border-amber-400/50 transition-all"
                  >
                    <h3 className="text-lg font-medium capitalize text-white">
                      {journey.split('-').join(' ')}
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-amber-500/30 text-amber-200">
                        PREMIUM
                      </span>
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      Enhanced frequency journey with advanced sacred geometry.
                    </p>
                  </Link>
                ))}
              </div>
            </PremiumGuard>
          </div>
          
          <div className="md:col-span-2">
            <SacredJourneyScroll />
          </div>
        </div>
        
        {/* Subscription CTA for non-premium users */}
        {user && !isPremium && (
          <div className="mt-12 p-6 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-lg border border-purple-500/30 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Unlock the Full Sacred Experience
            </h3>
            <p className="text-gray-300 mb-4 max-w-2xl mx-auto">
              Upgrade to Premium to access all sacred journeys, advanced frequencies, and personalized guidance on your spiritual path.
            </p>
            <Link to="/subscription">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                <Crown className="h-4 w-4 mr-2" /> Upgrade to Premium
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Journeys;
