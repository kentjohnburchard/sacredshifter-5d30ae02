
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { JourneyProvider } from '@/context/JourneyContext';
import JourneyExperience from '@/components/journey/JourneyExperience';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { fetchJourneyBySlug } from '@/services/journeyService';
import { parseJourneyMarkdown } from '@/utils/parseJourneyMarkdown';
import { ChakraTag } from '@/types/chakras';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const JourneyExperiencePage: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJourney = async () => {
      if (!journeySlug) {
        setError("No journey specified");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Load journey from service
        const journeyData = await fetchJourneyBySlug(journeySlug);
        
        if (!journeyData) {
          setError("Journey not found");
          toast.error("Journey not found");
          setLoading(false);
          return;
        }
        
        // Process journey data
        const parsedData = {
          id: journeyData.id,
          title: journeyData.title,
          intent: journeyData.intent,
          script: journeyData.content || '',
          frequency: journeyData.frequencies?.[0] ? parseInt(journeyData.frequencies[0]) : undefined,
          chakra: journeyData.chakra_tag as ChakraTag,
          audioFile: journeyData.audio_filename ? 
            `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${journeyData.audio_filename}` : 
            undefined
        };
        
        setJourneyData(parsedData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading journey:', err);
        setError("Error loading journey");
        toast.error("Error loading journey");
        setLoading(false);
      }
    };
    
    loadJourney();
  }, [journeySlug]);
  
  if (loading) {
    return (
      <Layout className="bg-black min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !journeyData) {
    return (
      <Layout className="bg-black min-h-screen">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-6 text-white">Journey Not Found</h1>
          <p className="text-white/70 mb-8">{error || "The requested journey could not be found."}</p>
          <Link to="/journeys">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Journeys
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <JourneyProvider>
      <JourneyExperience journeyData={journeyData} />
    </JourneyProvider>
  );
};

export default JourneyExperiencePage;
