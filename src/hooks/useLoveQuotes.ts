
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LoveQuote {
  id: string;
  text: string;
  topic?: string;
  mood?: string;
  frequency_level?: number;
  created_at?: string;
}

export const useLoveQuotes = () => {
  const [quotes, setQuotes] = useState<LoveQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [randomQuote, setRandomQuote] = useState<LoveQuote | null>(null);

  // Fetch quotes from Supabase
  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use type assertion since the love_quotes table isn't in the generated types yet
      const { data, error } = await (supabase
        .from('love_quotes')
        .select('*')
        .order('created_at', { ascending: false }) as any);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setQuotes(data as LoveQuote[]);
        
        // Set a random quote for display
        if (data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.length);
          setRandomQuote(data[randomIndex] as LoveQuote);
        }
      }
    } catch (error) {
      console.error('Error fetching love quotes:', error);
      // For now, use fallback quotes if database is not yet created
      const fallbackQuotes = getFallbackQuotes();
      setQuotes(fallbackQuotes);
      
      // Set a random fallback quote
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      setRandomQuote(fallbackQuotes[randomIndex]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new quote to the database
  const addQuote = async (quote: Omit<LoveQuote, 'id' | 'created_at'>) => {
    try {
      // Need to use any type since the table isn't in the generated types
      const { data, error } = await (supabase
        .from('love_quotes')
        .insert(quote as any)
        .select()
        .single() as any);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setQuotes(prevQuotes => [data as LoveQuote, ...prevQuotes]);
        toast.success("New love quote added");
        return data as LoveQuote;
      }
    } catch (error) {
      console.error('Error adding quote:', error);
      toast.error("Failed to add quote");
      return null;
    }
  };

  // Get a random quote
  const getRandomQuote = useCallback(() => {
    if (quotes.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, [quotes]);

  // Get a random quote by mood
  const getRandomQuoteByMood = useCallback((mood: string) => {
    if (quotes.length === 0) return null;
    
    const filteredQuotes = quotes.filter(q => q.mood?.toLowerCase() === mood.toLowerCase());
    
    if (filteredQuotes.length === 0) {
      // Fallback to any quote if no quotes match the mood
      return getRandomQuote();
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  }, [quotes, getRandomQuote]);

  // Get a random quote by topic
  const getRandomQuoteByTopic = useCallback((topic: string) => {
    if (quotes.length === 0) return null;
    
    const filteredQuotes = quotes.filter(q => q.topic?.toLowerCase() === topic.toLowerCase());
    
    if (filteredQuotes.length === 0) {
      // Fallback to any quote if no quotes match the topic
      return getRandomQuote();
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  }, [quotes, getRandomQuote]);

  // Get a new random quote for display
  const refreshRandomQuote = useCallback(() => {
    setRandomQuote(getRandomQuote());
  }, [getRandomQuote]);

  // Load quotes on mount
  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    addQuote,
    getRandomQuote,
    getRandomQuoteByMood,
    getRandomQuoteByTopic,
    randomQuote,
    refreshRandomQuote,
    fetchQuotes
  };
};

// Fallback quotes for when the database is not yet available
const getFallbackQuotes = (): LoveQuote[] => {
  return [
    {
      id: '1',
      text: 'Your heart knows the way. Run in that direction.',
      topic: 'Self-Worth',
      mood: 'Uplifting',
      frequency_level: 5
    },
    {
      id: '2',
      text: 'Love is not something you find. Love is something that finds you.',
      topic: 'Romance',
      mood: 'Soothing',
      frequency_level: 4
    },
    {
      id: '3',
      text: 'The most powerful weapon on earth is the human soul on fire with love.',
      topic: 'Passion',
      mood: 'Fierce',
      frequency_level: 5
    },
    {
      id: '4',
      text: 'Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.',
      topic: 'Self-Love',
      mood: 'Contemplative',
      frequency_level: 3
    },
    {
      id: '5',
      text: 'The heart that gives, gathers.',
      topic: 'Gratitude',
      mood: 'Peaceful',
      frequency_level: 4
    },
    {
      id: '6',
      text: 'Where there is love, there is life.',
      topic: 'Flow',
      mood: 'Soothing',
      frequency_level: 3
    }
  ];
};
