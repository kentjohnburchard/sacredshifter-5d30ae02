
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Placeholder: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <PageLayout title="Page Under Construction">
      <div className="container mx-auto py-12 px-4">
        <div className="bg-black/60 backdrop-blur-lg rounded-lg p-8 text-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-white">This page is under construction</h1>
          <p className="mb-6 text-gray-300">
            This sacred journey is still being created. Please check back later or explore our other journeys.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/journeys')} variant="default">
              Explore Journeys
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Placeholder;
