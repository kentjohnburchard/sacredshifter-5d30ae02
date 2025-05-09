
import React, { useState, useEffect } from 'react';
import { fetchJourneys } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { PageLayout } from '@/components/layout/PageLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Info, Search, BookOpen, ArrowLeft } from 'lucide-react';
import { getAllJourneys } from '@/utils/coreJourneyLoader';
import { normalizeStringArray } from '@/utils/parsers';
import { toast } from 'sonner';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import JourneyCard from '@/components/journey/JourneyCard';
import { Link, useNavigate } from 'react-router-dom';

const JourneyIndex: React.FC = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredJourney, setFeaturedJourney] = useState<Journey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setIsLoading(true);
        // First load journeys from the database
        const dbJourneys = await fetchJourneys();
        
        // Then combine with journeys from core_content
        const allJourneys = await getAllJourneys(dbJourneys);
        
        console.log(`Loaded ${allJourneys.length} total journeys`);
        
        // Find the Akashic Reconnection journey and set it as featured
        const akashicJourney = allJourneys.find(j => 
          j.filename === 'journey_akashic_reconnection' || 
          j.title?.includes('Akashic') || 
          (j.tags && normalizeStringArray(j.tags).some(t => t && t.toLowerCase().includes('akashic')))
        );
        
        if (akashicJourney) {
          console.log("Found Akashic journey:", akashicJourney);
          setFeaturedJourney(akashicJourney);
        } else if (allJourneys.length > 0) {
          // If no Akashic journey, use the first one as featured
          console.log("No Akashic journey found, using first journey as featured");
          setFeaturedJourney(allJourneys[0]);
        }
        
        setJourneys(allJourneys);
        setError(null);
      } catch (err) {
        console.error('Error loading journeys:', err);
        setError('Failed to load journeys. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJourneys();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStartFeaturedJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    if (featuredJourney) {
      const journeyId = featuredJourney.filename || featuredJourney.id;
      navigate(`/journey/${journeyId}/experience`);
    }
  };
  
  const filteredJourneys = searchQuery 
    ? journeys.filter(journey => 
        journey.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (journey.tags && normalizeStringArray(journey.tags).some(
          tag => tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      )
    : journeys;
  
  return (
    <AppShell 
      pageTitle="Sacred Journeys Directory"
      chakraColor="#8B5CF6"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4 p-2 bg-purple-900/30 hover:bg-purple-900/50 rounded-md">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Sacred Journeys</h1>
        </div>
        
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4 text-white leading-tight">
            Sacred Journey <span className="text-purple-400">Portals</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore divine pathways for personal transformation, healing, and expansion of consciousness
          </p>
        </motion.div>
        
        {/* Search Box */}
        <motion.div 
          className="mb-8 relative max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Search className="absolute left-3 top-3 h-5 w-5 text-white/50" />
          <Input
            placeholder="Search for a journey..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-purple-500 rounded-full"></div>
          </div>
        ) : error ? (
          <Alert className="mb-6 bg-red-500/20 border border-red-500/50">
            <Info className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {featuredJourney && !searchQuery && (
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-white inline-block relative">
                  Featured Journey
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
                </h2>
                
                <div className="relative overflow-hidden rounded-xl">
                  <div className="absolute inset-0 -z-10">
                    <JourneyAwareSpiralVisualizer 
                      journeyId={featuredJourney.id || featuredJourney.filename}
                      autoSync={false}
                      showControls={false}
                      containerId="featuredJourneySpiral"
                      className="opacity-30"
                    />
                  </div>
                  
                  <div className="relative z-10 grid md:grid-cols-2 gap-8 p-6 bg-black/50 backdrop-blur-md">
                    <div className="space-y-4">
                      <div className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full inline-block text-sm text-white/70">
                        Featured Experience
                      </div>
                      
                      <h3 className="text-3xl font-playfair font-bold text-white">{featuredJourney.title}</h3>
                      
                      {featuredJourney.intent && (
                        <p className="text-white/80 leading-relaxed">{featuredJourney.intent}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 pt-2">
                        {normalizeStringArray(featuredJourney.tags || []).map((tag, i) => (
                          <span key={i} className="px-2.5 py-1 text-sm bg-white/10 rounded-full text-white/70">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      
                      <Button 
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white mt-4 px-6 py-6 h-auto group"
                        onClick={handleStartFeaturedJourney}
                      >
                        <BookOpen className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                        <span>Begin Featured Journey</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="rounded-full w-64 h-64 bg-black/20 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
                        <JourneyAwareSpiralVisualizer
                          journeyId={featuredJourney.id || featuredJourney.filename}
                          autoSync={true}
                          showControls={false}
                          containerId="featuredJourneyVisualizer"
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {filteredJourneys.length === 0 && (
              <Alert className="mb-6 bg-amber-500/20 border border-amber-500/50">
                <Info className="h-4 w-4" />
                <AlertTitle>No journeys found</AlertTitle>
                <AlertDescription>
                  Try adjusting your search query or browse the full collection.
                </AlertDescription>
              </Alert>
            )}
            
            {filteredJourneys.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-white inline-block relative">
                  {searchQuery ? 'Search Results' : 'All Sacred Journeys'}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
                </h2>
                
                <div className="journey-grid mb-12">
                  {filteredJourneys.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredJourneys.map((journey) => (
                        <motion.div
                          key={journey.id || journey.filename}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: Math.random() * 0.3 }}
                          className="h-full"
                        >
                          <JourneyCard journey={journey} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
};

export default JourneyIndex;
