
import React from "react";
import Layout from "@/components/Layout";
import { JourneyTemplatesGrid } from "@/components/frequency-journey";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const JourneyTemplates = () => {
  const { user } = useAuth();
  const isAdmin = user && user.email === "admin@example.com"; // You can adjust the admin check based on your auth logic
  
  return (
    <Layout pageTitle="Sacred Healing Journeys">
      <div className="max-w-5xl mx-auto py-4 pb-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Sacred Healing Journeys</h1>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Explore our curated journeys designed to address specific healing needs. Each journey combines frequencies, 
              soundscapes, and guidance to support your path to wellness.
            </p>
          </div>
          
          {isAdmin && (
            <Link to="/admin/journey-audio-admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
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
