
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import JourneyTemplatesGrid from '@/components/frequency-journey/JourneyTemplatesGrid';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const JourneyTemplatesPage = () => {
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  const { templates, loading, error } = useJourneyTemplates();

  return (
    <PageLayout title="Journey Templates">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Sacred Journey Templates</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Experience curated frequency journeys for transformation and healing
          </p>
          <div className="flex mt-4 gap-3">
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
            <Link to="/admin/journey-content">
              <Button variant="secondary">Manage Journey Content</Button>
            </Link>
            <Link to="/admin/journey-spirals">
              <Button variant="secondary">Manage Journey Spirals</Button>
            </Link>
            <Link to="/sitemap">
              <Button variant="ghost">Site Map</Button>
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
