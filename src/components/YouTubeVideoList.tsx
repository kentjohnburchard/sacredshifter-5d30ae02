
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, PlayCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  frequency: string;
  duration: string;
}

const YouTubeVideoList: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([
    {
      id: "video1",
      title: "432Hz Sacred Geometry",
      thumbnail: "https://i.ytimg.com/vi/sample1/maxresdefault.jpg",
      frequency: "432Hz",
      duration: "3:33"
    },
    {
      id: "video2",
      title: "528Hz Let You Go To Find Myself",
      thumbnail: "https://i.ytimg.com/vi/sample2/maxresdefault.jpg",
      frequency: "528Hz",
      duration: "3:25"
    },
    {
      id: "video3",
      title: "432Hz Back to Mundubbera",
      thumbnail: "https://i.ytimg.com/vi/sample3/maxresdefault.jpg",
      frequency: "432Hz",
      duration: "4:01"
    },
    {
      id: "video4",
      title: "639Hz Connections",
      thumbnail: "https://i.ytimg.com/vi/sample4/maxresdefault.jpg",
      frequency: "639Hz",
      duration: "5:12"
    },
    {
      id: "video5",
      title: "741Hz Expression & Solutions",
      thumbnail: "https://i.ytimg.com/vi/sample5/maxresdefault.jpg",
      frequency: "741Hz",
      duration: "6:18"
    }
  ]);

  const openYouTubeChannel = () => {
    window.open('https://www.youtube.com/@sacredshifter', '_blank');
  };

  const openYouTubeVideo = (videoId: string) => {
    // In a real implementation, this would open the actual video URL
    window.open(`https://www.youtube.com/@sacredshifter`, '_blank');
  };

  return (
    <Card className="border border-gray-200 shadow-md overflow-hidden rounded-xl mt-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Sacred Shifter YouTube Videos</h3>
          <button
            onClick={openYouTubeChannel}
            className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800"
          >
            <ExternalLink size={16} />
            <span>Visit Channel</span>
          </button>
        </div>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div 
                key={video.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video bg-gray-200 relative">
                  {/* Placeholder for thumbnail - in a real implementation use actual thumbnails */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full text-center">
                      <p className="font-bold text-white text-lg px-4 text-shadow">{video.title}</p>
                      <p className="text-white/90 text-sm">{video.frequency}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => openYouTubeVideo(video.id)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <PlayCircle size={64} className="text-white drop-shadow-lg" />
                  </button>
                </div>
                <div className="p-3 bg-white">
                  <h4 className="font-medium text-gray-800 line-clamp-1">{video.title}</h4>
                  <p className="text-sm text-gray-600">{video.frequency}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default YouTubeVideoList;
