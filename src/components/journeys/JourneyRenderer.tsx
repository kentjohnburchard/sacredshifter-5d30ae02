
import React from 'react';
import { Link } from 'react-router-dom';
import { JourneyMetadata } from '@/types/journeys'; 
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { ChakraIcon } from '@/components/frequency-library/ChakraIcon';

interface JourneyRendererProps {
  content: string;
  metadata: JourneyMetadata;
}

// Map chakra tags to Tailwind utility classes
const chakraStyles: Record<string, string> = {
  'root': 'bg-red-500/10 text-red-500 ring-red-500/30',
  'sacral': 'bg-orange-500/10 text-orange-500 ring-orange-500/30',
  'solar plexus': 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/30',
  'solar-plexus': 'bg-yellow-400/10 text-yellow-400 ring-yellow-400/30',
  'heart': 'bg-green-500/10 text-green-500 ring-green-500/30',
  'throat': 'bg-blue-500/10 text-blue-500 ring-blue-500/30',
  'third eye': 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/30',
  'third-eye': 'bg-indigo-500/10 text-indigo-500 ring-indigo-500/30',
  'crown': 'bg-violet-500/10 text-violet-500 ring-violet-500/30',
  'sound': 'bg-cyan-400/10 text-cyan-400 ring-cyan-400/30',
  'breathwork': 'bg-white/10 text-white ring-white/30',
};

const JourneyRenderer: React.FC<JourneyRendererProps> = ({ content, metadata }) => {
  const { liftTheVeil, isContentAccessible } = useTheme();
  
  // Check if journey is accessible based on veil requirements
  const isAccessible = isContentAccessible(!!metadata.requiresVeil, false);
  
  // Find chakra tag if present
  const chakraTag = metadata.tags?.find(tag => 
    Object.keys(chakraStyles).includes(tag.toLowerCase())
  )?.toLowerCase();
  
  const chakraClass = chakraTag ? chakraStyles[chakraTag] : '';
  const hasPulsing = !!chakraTag;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to="/journey-scroll" 
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Journey Scroll</span>
        </Link>
      </div>
      
      {/* Journey header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
          {metadata.title}
        </h1>
        
        {metadata.description && (
          <p className="text-lg text-gray-300 mb-4">
            {metadata.description}
          </p>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {metadata.tags?.map(tag => {
            const lowercaseTag = tag.toLowerCase();
            const isChakraTag = Object.keys(chakraStyles).includes(lowercaseTag);
            
            return (
              <Badge 
                key={tag} 
                className={`
                  px-3 py-1 ring-1 transition-all
                  ${isChakraTag ? chakraStyles[lowercaseTag] : 'bg-purple-500/10 text-purple-300 ring-purple-500/30'}
                  ${isChakraTag ? 'animate-pulse shadow-glow' : ''}
                `}
              >
                {isChakraTag && (
                  <ChakraIcon chakra={tag} className="mr-1 h-3 w-3 inline" />
                )}
                {tag}
              </Badge>
            );
          })}
          
          {metadata.requiresVeil && (
            <Badge
              variant="outline"
              className="bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/30 px-3 py-1"
            >
              <Sparkles className="mr-1 h-3 w-3 inline" />
              Veil Required
            </Badge>
          )}
        </div>
        
        {/* Author and date info */}
        {(metadata.author || metadata.date) && (
          <div className="text-sm text-gray-400 mb-8">
            {metadata.author && <span>By {metadata.author}</span>}
            {metadata.author && metadata.date && <span> • </span>}
            {metadata.date && <span>{new Date(metadata.date).toLocaleDateString()}</span>}
            {metadata.readingTime && <span> • {metadata.readingTime} min read</span>}
          </div>
        )}
      </div>
      
      {/* Content */}
      <Card 
        className={`
          border-t-4 overflow-hidden backdrop-blur-md
          ${hasPulsing ? chakraClass.replace('text-', 'border-') : 'border-purple-500'}
        `}
      >
        {/* Veil lock overlay */}
        {metadata.requiresVeil && !isAccessible ? (
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 bg-black/50">
              <motion.div
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="mb-6"
              >
                <Lock className="h-16 w-16 text-pink-500 opacity-80" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-center mb-4 text-pink-400">
                Lift the Veil to Access This Scroll
              </h3>
              
              <p className="text-center text-gray-300 max-w-md mb-8">
                This sacred wisdom requires an elevated consciousness state. 
                Use the consciousness toggle in the top right to lift the veil.
              </p>
              
              <div className="flex items-center justify-center opacity-30">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-40 h-40 bg-pink-500/20 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                  className="absolute w-60 h-60 bg-purple-500/10 rounded-full"
                />
                <Sparkles className="h-12 w-12 text-pink-500/70" />
              </div>
            </div>
            
            <div className="p-8 min-h-[300px] blur-md">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-pink-400"
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className={`p-8 relative ${hasPulsing ? 'journey-chakra-content' : ''}`}>
            {/* Chakra background effect */}
            {hasPulsing && (
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <motion.div
                  className={`absolute inset-0 ${chakraClass.replace('text-', 'bg-')} rounded-full blur-3xl`}
                  animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.1, 0.3, 0.1] 
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
              </div>
            )}
            
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              className="prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-pink-400"
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </Card>
      
      {/* Back to journey scroll button */}
      <div className="mt-8 text-center">
        <Link 
          to="/journey-scroll" 
          className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 px-6 py-2 rounded-md inline-flex items-center transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Sacred Journey Scroll
        </Link>
      </div>
    </div>
  );
};

export default JourneyRenderer;
