
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import JourneyTemplatesGrid from '@/components/frequency-journey/JourneyTemplatesGrid';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const JourneyTemplatesPage = () => {
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // Simulate checking data loading
    const checkDataLoading = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(checkDataLoading);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900/20 to-black">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <h2 className="text-xl text-white">Loading Sacred Journeys...</h2>
        </div>
      </div>
    );
  }

  return (
    <PageLayout title="Journey Templates">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sacred Journey Templates</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Experience curated frequency journeys for transformation and healing
          </p>
          <div className="flex mt-4 gap-3 flex-wrap">
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Link to="/journeys">
              <Button variant="secondary">Browse All Journeys</Button>
            </Link>
            <Link to="/journey-index">
              <Button variant="secondary">Journey Index</Button>
            </Link>
          </div>
        </div>

        <TooltipProvider>
          <JourneyTemplatesGrid />
        </TooltipProvider>
      </div>
    </PageLayout>
  );
};

export default JourneyTemplatesPage;
