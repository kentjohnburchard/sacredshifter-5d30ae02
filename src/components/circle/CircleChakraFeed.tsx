
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import LightCodeMessage from './LightCodeMessage';
import ResonanceInput from './ResonanceInput';
import { ChakraTag } from '@/types/chakras';
import { useCommunity } from '@/contexts/CommunityContext';

interface CircleChakraFeedProps {
  activeChakra?: ChakraTag;
  onChakraChange?: (chakra: ChakraTag) => void;
}

const CircleChakraFeed: React.FC<CircleChakraFeedProps> = ({
  activeChakra,
  onChakraChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChakra, setFilterChakra] = useState<ChakraTag | null>(null);
  const { posts, likePost, addComment, createNewPost } = useCommunity();
  
  // Convert community posts to messages format
  const messagesFromPosts = posts.map(post => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    author: post.author,
    emotionalTone: Math.random() > 0.5 ? 
      (Math.random() > 0.5 ? 'Peaceful' : 'Uplifted') : 
      (Math.random() > 0.5 ? 'Grounded' : 'Activated') as 'Peaceful' | 'Uplifted' | 'Grounded' | 'Activated',
    chakra: ['Root', 'Sacral', 'Heart', 'Throat', 'Third Eye', 'Crown'][Math.floor(Math.random() * 6)] as ChakraTag,
    frequency: [432, 528, 639, 741, 852, 963][Math.floor(Math.random() * 6)],
    reactions: [
      { type: '432Hz', count: Math.floor(Math.random() * 5), userIds: [] },
      { type: '528Hz', count: Math.floor(Math.random() * 3), userIds: [] }
    ]
  }));

  // Filter messages based on search and chakra filter
  const filteredMessages = messagesFromPosts.filter(message => {
    const matchesSearch = searchQuery === '' || 
      message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesChakra = filterChakra === null || message.chakra === filterChakra;
    
    return matchesSearch && matchesChakra;
  });

  // Handle reaction click
  const handleReact = (messageId: string, reactionType: string) => {
    likePost(messageId);
    // Play a soft sound based on the frequency
    const frequency = parseInt(reactionType.replace('Hz', ''));
    if (!isNaN(frequency)) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = 0.1; // Quiet sound
      oscillator.start();
      
      // Stop after 0.5 seconds
      setTimeout(() => {
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        setTimeout(() => oscillator.stop(), 500);
      }, 500);
    }
  };

  // Handle reply
  const handleReply = (messageId: string) => {
    // For now just focus on the input
    document.getElementById('message-input')?.focus();
  };

  // Handle new message submission
  const handleSubmit = (message: { content: string; emotionalTone: string; frequency?: number }) => {
    createNewPost(message.content, message.emotionalTone as any);
  };

  // Define chakra filters
  const chakraFilters: ChakraTag[] = ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search in the circle..."
            className="pl-10 bg-black/30 border-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {chakraFilters.map((chakra) => (
            <Button
              key={chakra}
              variant={filterChakra === chakra ? "default" : "outline"}
              size="sm"
              className={filterChakra === chakra ? "" : "border-white/20"}
              onClick={() => {
                setFilterChakra(chakra === filterChakra ? null : chakra);
                onChakraChange && onChakraChange(chakra);
              }}
            >
              {chakra}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {filteredMessages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <p className="text-gray-400">No messages found. Start a new conversation!</p>
            </motion.div>
          ) : (
            filteredMessages.map((message) => (
              <LightCodeMessage
                key={message.id}
                message={message}
                currentUserId="1" // Hardcoded current user for now
                onReact={handleReact}
                onReply={handleReply}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <div id="message-input">
        <ResonanceInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CircleChakraFeed;
