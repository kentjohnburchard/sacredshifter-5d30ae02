
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Heart, Play, Pause, ChevronRight, ChevronLeft, Music2, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { toast } from 'sonner';

// Sample Heart Frequency Playlists
const heartPlaylists = [
  {
    id: "love-codes",
    title: "Love Codes",
    description: "Activate the universal frequency of unconditional love",
    frequency: 528,
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=3276&h=3276&auto=format&fit=crop",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_e6b2c62b4a.mp3",
    tags: ["Gentle", "Healing", "Heart Opening"],
    testimonial: "This frequency helped me feel a deep connection to everything around me."
  },
  {
    id: "forgive-flow",
    title: "Forgive & Flow",
    description: "Release old heart wounds through the power of resonant frequencies",
    frequency: 639,
    imageUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=3270&h=3270&auto=format&fit=crop",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_2cad3ce65c.mp3",
    tags: ["Soothing", "Emotional Release", "Clearing"],
    testimonial: "Cried in the best way. Felt lighter afterward."
  },
  {
    id: "divine-romance",
    title: "Divine Romance",
    description: "Connect with the sacred marriage of divine feminine and masculine",
    frequency: 741,
    imageUrl: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=3270&h=3270&auto=format&fit=crop",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3",
    tags: ["Uplifting", "Sacred Union", "Balance"],
    testimonial: "This playlist helped me feel whole and complete within myself."
  },
  {
    id: "self-embrace",
    title: "Self-Embrace",
    description: "Learn to love yourself completely with these heart-affirming frequencies",
    frequency: 432,
    imageUrl: "https://images.unsplash.com/photo-1516575828471-8076F8022f3f?q=80&w=3177&h=3177&auto=format&fit=crop",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_270f8897e1.mp3",
    tags: ["Gentle", "Self-Love", "Nurturing"],
    testimonial: "This playlist became my daily self-care ritual. Life-changing!"
  }
];

interface HeartPlaylist {
  id: string;
  title: string;
  description: string;
  frequency: number;
  imageUrl: string;
  audioUrl: string;
  tags: string[];
  testimonial?: string;
}

const HeartFrequencyPlaylists: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showIntentionDialog, setShowIntentionDialog] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<HeartPlaylist | null>(null);
  const [intention, setIntention] = useState('');
  const { isAudioPlaying, togglePlayPause, setAudioSource } = useAudioPlayer();

  // Handle playlist carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === heartPlaylists.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heartPlaylists.length - 1 : prev - 1));
  };

  // Open intention dialog before playing
  const handlePlayWithIntention = (playlist: HeartPlaylist) => {
    setCurrentPlaylist(playlist);
    setShowIntentionDialog(true);
  };

  // Play the selected playlist after setting intention
  const startPlaylistWithIntention = () => {
    if (!currentPlaylist) return;
    
    // Save the intention to local storage or database (simplified)
    localStorage.setItem(`intention-${currentPlaylist.id}`, intention);
    
    // Start playing the audio
    setAudioSource(currentPlaylist.audioUrl);
    togglePlayPause();
    
    // Close the dialog
    setShowIntentionDialog(false);
    
    // Show confirmation toast
    toast.success(`Playing ${currentPlaylist.title} with your sacred intention`);
  };

  // Calculate items to display in carousel
  const visiblePlaylists = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentSlide + i) % heartPlaylists.length;
    visiblePlaylists.push({
      playlist: heartPlaylists[index],
      position: i
    });
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-purple-900">Heart Frequency Playlists</h2>
        <p className="text-purple-600 mt-1">Sound healing for your emotional heart center</p>
      </div>

      {/* Playlist Carousel */}
      <div className="relative py-6">
        {/* Navigation buttons */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white/90 rounded-full shadow-md"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6 text-purple-800" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white/90 rounded-full shadow-md"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6 text-purple-800" />
        </Button>
        
        {/* Carousel content */}
        <div className="flex justify-center items-center overflow-hidden relative h-[400px]">
          {visiblePlaylists.map(({ playlist, position }) => {
            // Determine styling based on position
            const isCenter = position === 1;
            const scale = isCenter ? 1 : 0.85;
            const opacity = isCenter ? 1 : 0.7;
            const zIndex = isCenter ? 10 : 5;
            
            // Position calculation
            let translateX;
            if (position === 0) translateX = "-65%";
            else if (position === 1) translateX = "0%";
            else translateX = "65%";
            
            return (
              <motion.div
                key={playlist.id}
                className="absolute w-full max-w-[330px]"
                initial={{ scale, opacity, x: translateX, zIndex }}
                animate={{ scale, opacity, x: translateX, zIndex }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`overflow-hidden border-2 ${isCenter ? 'border-pink-300' : 'border-transparent'} shadow-xl`}>
                  <div 
                    className="h-[200px] bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${playlist.imageUrl})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <h3 className="text-xl font-bold text-white">{playlist.title}</h3>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-pink-500 text-white border-none">{playlist.frequency}Hz</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <p className="text-sm text-purple-800 mb-3">{playlist.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {playlist.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {isCenter && playlist.testimonial && (
                      <div className="mb-3 italic text-xs text-purple-600 bg-purple-50 p-2 rounded-md">
                        "{playlist.testimonial}"
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-2">
                      <Button 
                        variant="default"
                        size="sm"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        onClick={() => handlePlayWithIntention(playlist)}
                      >
                        {isAudioPlaying && currentPlaylist?.id === playlist.id ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Play with Intention
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Heart Frequency Information */}
      <Card className="bg-white/70 backdrop-blur-sm border-pink-200 p-4">
        <div className="flex items-start gap-4">
          <div className="bg-pink-100 p-3 rounded-full">
            <Heart className="h-5 w-5 text-pink-600" />
          </div>
          <div>
            <h3 className="font-medium text-purple-900">The Science of Heart Frequencies</h3>
            <p className="text-sm text-purple-700 mt-1">
              The heart emits the body's strongest electromagnetic field. These specially tuned frequencies help realign and 
              harmonize your heart's energetic patterns, promoting emotional healing and connection.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-purple-800">
              <div>• 528 Hz: Transformation &amp; Love</div>
              <div>• 639 Hz: Relationships &amp; Connection</div>
              <div>• 741 Hz: Expression &amp; Awakening</div>
              <div>• 432 Hz: Universal Harmony</div>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Set Intention Dialog */}
      <Dialog open={showIntentionDialog} onOpenChange={setShowIntentionDialog}>
        <DialogContent className="bg-white/90 backdrop-blur-md border-pink-300">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-purple-900 flex items-center justify-center">
              <BookOpen className="h-5 w-5 mr-2 text-pink-600" />
              Set Your Heart Intention
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-purple-800 text-sm">
              Setting an intention before listening deepens your heart frequency experience.
              What would you like to cultivate or release?
            </p>
            
            <Textarea
              placeholder="I intend to open my heart to..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              className="border-pink-200 min-h-[100px]"
            />
            
            {currentPlaylist && (
              <div className="flex items-center space-x-2 text-sm text-purple-700">
                <Music2 className="h-4 w-4 text-pink-600" />
                <span>Playing: {currentPlaylist.title} ({currentPlaylist.frequency}Hz)</span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="border-pink-300" onClick={() => setShowIntentionDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600"
              onClick={startPlaylistWithIntention}
            >
              <Play className="mr-2 h-4 w-4" />
              Begin Heart Journey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeartFrequencyPlaylists;
