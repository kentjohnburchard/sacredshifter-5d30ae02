
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJourneys } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { getAllJourneys } from '@/utils/coreJourneyLoader';
import { normalizeStringArray } from '@/utils/parsers';
import { Loader2, Tag } from 'lucide-react';
import JourneyCard from './JourneyCard';

interface JourneysListProps {
  filter?: string;
  maxItems?: number;
  showTags?: boolean;
}

interface GroupedJourneys {
  [key: string]: Journey[];
}

const JourneysList: React.FC<JourneysListProps> = ({ 
  filter = '', 
  maxItems = 0,
  showTags = true
}) => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedJourneys, setGroupedJourneys] = useState<GroupedJourneys>({});

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setLoading(true);
        // Fetch journeys from the database
        const dbData = await fetchJourneys();
        
        // Combine with journeys from core_content
        const allJourneys = await getAllJourneys(dbData || []);
        
        if (allJourneys) {
          console.log(`Loaded ${allJourneys.length} total journeys (DB + core_content)`);
          setJourneys(allJourneys);
          
          // Group journeys by first tag
          const grouped: GroupedJourneys = {};
          allJourneys.forEach(journey => {
            if (!journey.tags) {
              const group = 'Other';
              if (!grouped[group]) grouped[group] = [];
              grouped[group].push(journey);
              return;
            }
            
            const tagsArray = normalizeStringArray(journey.tags);
            const primaryTag = tagsArray[0] || 'Other';
            
            if (!grouped[primaryTag]) {
              grouped[primaryTag] = [];
            }
            grouped[primaryTag].push(journey);
          });
          
          setGroupedJourneys(grouped);
        }
      } catch (err) {
        console.error("Error loading journeys:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadJourneys();
  }, []);

  // Helper function to safely filter on tags
  const matchesTags = (journey: Journey, searchTerm: string): boolean => {
    if (!journey.tags) return false;
    
    const tagsArray = normalizeStringArray(journey.tags);
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return tagsArray.some(tag => 
      tag.toLowerCase().includes(lowerSearchTerm)
    );
  };

  const filteredJourneys = filter
    ? journeys.filter(journey => 
        journey.title?.toLowerCase().includes(filter.toLowerCase()) ||
        matchesTags(journey, filter))
    : journeys;

  const displayedJourneys = maxItems > 0
    ? filteredJourneys.slice(0, maxItems)
    : filteredJourneys;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (displayedJourneys.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium">No journeys found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  // If using groups
  if (Object.keys(groupedJourneys).length > 0 && !filter) {
    return (
      <div className="space-y-12">
        {Object.entries(groupedJourneys).map(([group, journeys]) => (
          <div key={group} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white/90">
              <Tag size={16} className="text-purple-400" />
              {group}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {journeys.map(journey => (
                <Link 
                  to={`/journey/${journey.filename}`} 
                  key={journey.id} 
                  className="block h-full"
                >
                  <JourneyCard journey={journey} />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Simple list without grouping
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedJourneys.map(journey => (
        <Link 
          to={`/journey/${journey.filename}`} 
          key={journey.id} 
          className="block h-full"
        >
          <JourneyCard journey={journey} />
        </Link>
      ))}
    </div>
  );
};

export default JourneysList;
