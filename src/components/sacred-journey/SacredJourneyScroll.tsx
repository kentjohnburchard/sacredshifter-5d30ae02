
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJourneys, Journey } from '@/services/journeyService';
import { useAuth } from '@/context/AuthContext';
import { Scroll, ScrollBar, ScrollArea, ScrollViewport } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

const SacredJourneyScroll: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        const data = await fetchJourneys();
        setJourneys(data);
      } catch (error) {
        console.error('Failed to load journeys:', error);
        toast.error('Failed to load sacred journeys');
      } finally {
        setLoading(false);
      }
    };

    loadJourneys();
  }, []);

  const handleLockedJourney = (e: React.MouseEvent, journey: Journey) => {
    if (journey.veil_locked && !user) {
      e.preventDefault();
      toast.info('This sacred journey is locked. Sign in to access it.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-lg p-6 my-8">
      <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
        Sacred Journey Scroll
      </h2>
      
      <ScrollArea className="h-[400px] rounded-md border border-purple-100 p-4 bg-white/80 backdrop-blur-sm">
        <div className="space-y-6 pr-3">
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : journeys.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No sacred journeys available yet.</p>
          ) : (
            journeys.map((journey) => (
              <div key={journey.id} className="group">
                <Link 
                  to={`/journey/${journey.filename}`}
                  onClick={(e) => handleLockedJourney(e, journey)}
                  className={`block p-4 rounded-lg transition-all ${
                    journey.veil_locked && !user 
                      ? 'bg-gray-100 cursor-not-allowed' 
                      : 'bg-white hover:bg-purple-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg text-purple-900 group-hover:text-purple-700">
                      {journey.title}
                    </h3>
                    {journey.veil_locked && (
                      <Lock 
                        size={16} 
                        className={`${user ? 'text-green-500' : 'text-amber-500'}`} 
                        title={user ? "Unlocked with your account" : "Login required"}
                      />
                    )}
                  </div>
                  
                  {journey.tags && (
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {journey.tags.split(',').map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))
          )}
        </div>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
};

export default SacredJourneyScroll;
