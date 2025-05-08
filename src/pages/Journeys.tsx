
import React from "react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SacredJourneyScroll from "@/components/sacred-journey/SacredJourneyScroll";

const Journeys = () => {
  return (
    <AppShell pageTitle="Sacred Journeys">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Sacred Journeys</h1>
          <p className="text-gray-300">
            Experience curated frequency journeys for transformation and healing
          </p>
          <div className="flex mt-4 gap-3">
            <Link to="/journey-templates">
              <Button variant="outline">Journey Templates</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary">Dashboard</Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-200">Featured Journeys</h2>
            <div className="space-y-4">
              {['heart-center', 'chakra-alignment', 'meditation'].map((journey) => (
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
          
          <SacredJourneyScroll />
        </div>
      </div>
    </AppShell>
  );
};

export default Journeys;
