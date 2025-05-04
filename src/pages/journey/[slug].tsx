
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTheme } from '@/context/ThemeContext';
import JourneyRenderer from '@/components/journeys/JourneyRenderer';
import { JourneyMetadata } from '@/types/journeys';
import { motion } from 'framer-motion';

const JourneyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [journey, setJourney] = useState<{
    content: string;
    metadata: JourneyMetadata;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch journey content
  useEffect(() => {
    const fetchJourney = async () => {
      if (!slug) {
        setError("Journey not found");
        setLoading(false);
        return;
      }
      
      try {
        // In a production app, this would be a server API call
        // For this demo, we'll fetch directly from the filesystem
        const response = await fetch(`/src/core_content/journeys/${slug}.md`);
        
        if (!response.ok) {
          throw new Error("Journey not found");
        }
        
        const content = await response.text();
        
        // Parse frontmatter and content using gray-matter
        // This would normally be done on the server
        // We're importing dynamically to avoid issues with SSR/build
        const matter = (await import('gray-matter')).default;
        const { data, content: markdownContent } = matter(content);
        
        setJourney({
          content: markdownContent,
          metadata: {
            title: data.title || "Untitled Journey",
            slug: slug,
            description: data.description || "",
            tags: data.tags || [],
            requiresVeil: !!data.veil,
            date: data.date,
            author: data.author,
            coverImage: data.coverImage,
            readingTime: data.readingTime,
            featured: !!data.featured
          }
        });
      } catch (err) {
        console.error("Error loading journey:", err);
        setError(err instanceof Error ? err.message : "Failed to load journey");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJourney();
  }, [slug]);
  
  return (
    <Layout
      pageTitle={journey?.metadata.title ? `${journey.metadata.title} | Sacred Shifter` : "Journey | Sacred Shifter"}
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
              className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-red-500">{error}</h2>
            <p className="mt-4">This journey scroll couldn't be located in the sacred archives.</p>
          </div>
        ) : journey ? (
          <JourneyRenderer 
            content={journey.content}
            metadata={journey.metadata}
          />
        ) : null}
      </div>
    </Layout>
  );
};

export default JourneyPage;
