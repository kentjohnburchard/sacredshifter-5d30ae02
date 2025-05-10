
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChakraTag } from '@/types/chakras';
import { MessageSquare, Users, Plus, Settings } from 'lucide-react';
import CircleChakraFeed from './CircleChakraFeed';
import CirclePulseMeter from './CirclePulseMeter';
import VibeOrb from './VibeOrb';
import InviteModal from './InviteModal';

interface CircleFeedProps {
  initialChakra?: ChakraTag;
}

const CircleFeed: React.FC<CircleFeedProps> = ({
  initialChakra = 'Heart'
}) => {
  const [activeChakra, setActiveChakra] = useState<ChakraTag>(initialChakra);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Mock online users data
  const onlineUsers = [
    {
      id: '1',
      name: 'Sacred Explorer',
      currentVibe: 'Heart Opening',
      chakraAlignment: 'Heart' as ChakraTag,
      currentFrequency: 528,
      isActive: true
    },
    {
      id: '2',
      name: 'Cosmic Guide',
      avatarUrl: '/symbols/lotus.svg',
      currentVibe: 'Deep Wisdom',
      chakraAlignment: 'Third Eye' as ChakraTag,
      currentFrequency: 852,
      isActive: true
    },
    {
      id: '3',
      name: 'Light Seeker',
      currentVibe: 'Grounding',
      chakraAlignment: 'Root' as ChakraTag,
      currentFrequency: 396,
      isActive: true
    },
    {
      id: '4',
      name: 'Harmony Celestia',
      currentVibe: 'Cosmic Connection',
      chakraAlignment: 'Crown' as ChakraTag,
      currentFrequency: 963,
      isActive: true
    }
  ];
  
  // Handle chakra change
  const handleChakraChange = (chakra: ChakraTag) => {
    setActiveChakra(chakra);
  };
  
  // Handle invite
  const handleSendInvite = (email: string) => {
    console.log(`Sending invite to: ${email}`);
    // Implement actual invite functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Sacred Circle</h2>
          <p className="text-sm text-white/60">Connect with your spiritual community</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="border-white/20"
            onClick={() => setIsInviteModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Invite
          </Button>
          <Button variant="outline" size="sm" className="border-white/20">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Circle Pulse Meter */}
      <CirclePulseMeter
        dominantChakra={activeChakra}
        activity={75}
        currentResonance={`${activeChakra} Chakra Activation`}
        frequencies={activeChakra === 'Heart' ? [528, 639, 741] : 
                    activeChakra === 'Third Eye' ? [852, 963, 396] :
                    activeChakra === 'Root' ? [396, 417, 528] :
                    [528, 852, 963]}
      />
      
      {/* Circle Members - Online Now */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardHeader className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-400" />
              <h3 className="text-sm font-medium text-white">Circle Members</h3>
            </div>
            <span className="text-xs text-white/60">{onlineUsers.length} Online</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {onlineUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <VibeOrb user={user} size="md" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Circle Feed */}
      <Card className="bg-black/30 backdrop-blur-sm border-white/10">
        <CardHeader className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-purple-400" />
            <h3 className="text-sm font-medium text-white">Circle Feed</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CircleChakraFeed activeChakra={activeChakra} onChakraChange={handleChakraChange} />
        </CardContent>
      </Card>
      
      <InviteModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onInvite={handleSendInvite}
      />
    </div>
  );
};

export default CircleFeed;
