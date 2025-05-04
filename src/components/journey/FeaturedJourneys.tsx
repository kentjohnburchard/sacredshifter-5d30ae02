
import React from 'react';
import { Link } from 'react-router-dom';
import JourneysList from './JourneysList';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface FeaturedJourneysProps {
  title?: string;
  description?: string;
  maxItems?: number;
  filter?: string;
}

const FeaturedJourneys: React.FC<FeaturedJourneysProps> = ({
  title = "Sacred Journeys",
  description = "Explore guided journeys for personal transformation, healing, and expansion",
  maxItems = 6,
  filter = ""
}) => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <Button asChild variant="ghost" className="mt-4 md:mt-0">
            <Link to="/journeys-directory" className="flex items-center">
              View all journeys
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <JourneysList maxItems={maxItems} filter={filter} />
      </div>
    </section>
  );
};

export default FeaturedJourneys;
