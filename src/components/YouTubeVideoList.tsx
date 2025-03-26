
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, PlayCircle, Maximize, Minimize, Play, Pause } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';

interface YouTubeVideo {
  id: string;
  title: string;
  embedId: string;
  frequency: string;
  duration: string;
}

const YouTubeVideoList: React.FC = () => {
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const [videos] = useState<YouTubeVideo[]>([
    {
      id: "video1",
      title: "432Hz Sacred Geometry",
      embedId: "XJZc0GEQ_wY",
      frequency: "432Hz",
      duration: "3:33"
    },
    {
      id: "video2",
      title: "528Hz Let You Go To Find Myself",
      embedId: "JnRwJ4v7yGc",
      frequency: "528Hz",
      duration: "3:25"
    },
    {
      id: "video3",
      title: "432Hz Back to Mundubbera",
      embedId: "x0TH6uFYt24",
      frequency: "432Hz",
      duration: "4:01"
    },
    {
      id: "video4",
      title: "639Hz Connections",
      embedId: "bnT8GD1Rv-Y",
      frequency: "639Hz",
      duration: "5:12"
    },
    {
      id: "video5",
      title: "741Hz Expression & Solutions",
      embedId: "oKPmjyonSBc",
      frequency: "741Hz",
      duration: "6:18"
    }
  ]);

  const openYouTubeChannel = () => {
    window.open('https://www.youtube.com/@sacredshifter', '_blank');
  };

  const toggleExpandVideo = (videoId: string) => {
    if (expandedVideo === videoId) {
      setExpandedVideo(null);
    } else {
      setExpandedVideo(videoId);
    }
  };

  return (
    <Card className="border border-purple-500/20 shadow-md overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Sacred Shifter YouTube Videos</h3>
          <button
            onClick={openYouTubeChannel}
            className="flex items-center gap-1 text-sm text-brand-purple hover:text-brand-deep transition-colors"
          >
            <ExternalLink size={16} />
            <span>Visit Channel</span>
          </button>
        </div>
        
        {expandedVideo ? (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border border-purple-500/20 shadow-lg">
              <AspectRatio ratio={16/9}>
                <iframe 
                  src={`https://www.youtube.com/embed/${videos.find(v => v.id === expandedVideo)?.embedId}?autoplay=1`}
                  title={videos.find(v => v.id === expandedVideo)?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </AspectRatio>
              <Button
                onClick={() => toggleExpandVideo(expandedVideo)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black/90"
                size="icon"
                variant="ghost"
              >
                <Minimize className="h-5 w-5" />
              </Button>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800">
                {videos.find(v => v.id === expandedVideo)?.title}
              </h3>
              <p className="text-sm text-brand-purple">
                {videos.find(v => v.id === expandedVideo)?.frequency}
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div 
                  key={video.id}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-purple-200 bg-white"
                >
                  <div className="aspect-video relative">
                    <AspectRatio ratio={16/9}>
                      <iframe 
                        src={`https://www.youtube.com/embed/${video.embedId}`}
                        title={video.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </AspectRatio>
                    <Button
                      onClick={() => toggleExpandVideo(video.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90"
                      size="icon"
                      variant="ghost"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-gray-800 line-clamp-1">{video.title}</h4>
                    <p className="text-sm text-brand-purple">{video.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default YouTubeVideoList;
