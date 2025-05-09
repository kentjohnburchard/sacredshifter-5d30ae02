
import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { fetchJourneys } from '@/services/journeyService';
import { getAllJourneys } from '@/utils/coreJourneyLoader';
import { Journey } from '@/types/journey';
import JourneysGrid from '@/components/journey/JourneysGrid';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const JourneysPage: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setLoading(true);
        // First load journeys from the database
        const dbJourneys = await fetchJourneys();
        
        // Then combine with journeys from core_content
        const allJourneys = await getAllJourneys(dbJourneys);
        
        console.log(`Loaded ${allJourneys.length} total journeys`);
        setJourneys(allJourneys);
        setError(null);
      } catch (err) {
        console.error('Error loading journeys:', err);
        setError('Failed to load journeys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadJourneys();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredJourneys = searchQuery 
    ? journeys.filter(journey => 
        journey.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        journey.tags?.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : journeys;

  return (
    <AppShell 
      pageTitle="Sacred Journeys"
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
            Sacred <span className="text-purple-400">Journeys</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Explore transformative energetic experiences aligned with your chakras and archetypal
            resonance. Each journey combines breathwork, sound, and sacred visuals to elevate your
            consciousness.
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
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-md text-white">
            {error}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white inline-block relative">
              {searchQuery ? 'Search Results' : 'All Sacred Journeys'}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></span>
            </h2>
            
            <JourneysGrid journeys={filteredJourneys} className="mb-12" />
          </motion.div>
        )}
      </div>
    </AppShell>
  );
};

export default JourneysPage;
