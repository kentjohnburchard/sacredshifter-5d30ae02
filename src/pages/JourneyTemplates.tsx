
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const JourneyTemplates = () => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const isAdmin = user && user.email === "admin@example.com"; // You can adjust the admin check based on your auth logic
  
  return (
    <Layout 
      pageTitle="Sound Journeys & Sacred Meditation" 
      useBlueWaveBackground={false}
      theme="cosmic"
    >
      <div className="max-w-5xl mx-auto py-4 pb-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Sound Journeys & Sacred Meditation</h1>
            <p className="text-base text-white">
              Explore our curated journeys and meditations designed to address specific healing needs. 
              Each experience combines frequencies, soundscapes, and guidance to support your path to wellness.
            </p>
          </div>
          
          {isAdmin && (
            <Link to="/admin/journey-audio-admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2 text-white border-white/40 hover:bg-white/10">
                <Settings className="h-4 w-4" />
                Manage Journey Audio
              </Button>
            </Link>
          )}
        </div>
        
        <JourneyTemplatesGrid />
      </div>
    </Layout>
  );
};

export default JourneyTemplates;
