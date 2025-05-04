import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJourneys, Journey } from '@/services/journeyService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Clock, Music, Star } from 'lucide-react';
import { extractFrequencyValue, fileNameToSlug } from '@/utils/journeyLoader';
import { getAllJourneys } from '@/utils/coreJourneyLoader';

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
            
            const tags = journey.tags.split(',').map(t => t.trim());
            const primaryTag = tags[0] || 'Other';
            
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

  const filteredJourneys = filter
    ? journeys.filter(journey => 
        journey.title?.toLowerCase().includes(filter.toLowerCase()) ||
        journey.tags?.toLowerCase().includes(filter.toLowerCase()))
    : journeys;

  const displayedJourneys = maxItems > 0
    ? filteredJourneys.slice(0, maxItems)
    : filteredJourneys;

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-purple-500 rounded-full"></div>
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

  const renderJourneyCard = (journey: Journey) => {
    const slug = journey.filename || '';
    const frequency = extractFrequencyValue(journey.sound_frequencies);
    
    return (
      <Card key={journey.id} className="h-full flex flex-col transition-transform hover:scale-102">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium line-clamp-2">{journey.title}</CardTitle>
          {journey.intent && (
            <CardDescription className="line-clamp-2">
              {journey.intent}
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          {showTags && journey.tags && (
            <div className="flex flex-wrap gap-1 mb-2">
              {journey.tags.split(',').map((tag, i) => (
                <Badge variant="outline" key={i} className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 flex gap-4 text-xs text-muted-foreground">
          {journey.duration && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{journey.duration}</span>
            </div>
          )}
          
          {frequency && (
            <div className="flex items-center gap-1">
              <Music size={14} />
              <span>{frequency}Hz</span>
            </div>
          )}
        </CardFooter>
      </Card>
    );
  };

  // If using groups
  if (Object.keys(groupedJourneys).length > 0 && !filter) {
    return (
      <div className="space-y-6">
        {Object.entries(groupedJourneys).map(([group, journeys]) => (
          <div key={group}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Tag size={16} />
              {group}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {journeys.map(journey => (
                <Link to={`/journey/${journey.filename}`} key={journey.id}>
                  {renderJourneyCard(journey)}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {displayedJourneys.map(journey => (
        <Link to={`/journey/${journey.filename}`} key={journey.id}>
          {renderJourneyCard(journey)}
        </Link>
      ))}
    </div>
  );
};

export default JourneysList;
