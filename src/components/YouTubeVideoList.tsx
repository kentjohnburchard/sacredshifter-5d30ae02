import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    },
    {
      id: "video6",
      title: "963Hz Heart Opening",
      embedId: "pFuABQcTKPU",
      frequency: "963Hz",
      duration: "5:47"
    },
    {
      id: "video7",
      title: "852Hz Third Eye Opening",
      embedId: "cNYlCpypJxQ",
      frequency: "852Hz",
      duration: "4:33"
    },
    {
      id: "video8",
      title: "396Hz Liberation from Fear",
      embedId: "xYxnwDlS5aY",
      frequency: "396Hz",
      duration: "7:22"
    },
    {
      id: "video9",
      title: "417Hz Facilitating Change",
      embedId: "YbiFO9e8i7Q",
      frequency: "417Hz",
      duration: "5:14"
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
    <Card className="border border-purple-500/20 shadow-md overflow-hidden rounded-xl bg-white/40 backdrop-blur-sm h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sacred Shifter YouTube Videos</h3>
          <button
            onClick={openYouTubeChannel}
            className="flex items-center gap-1 text-xs text-brand-purple hover:text-brand-deep transition-colors"
          >
            <ExternalLink size={14} />
            <span>Visit Channel</span>
          </button>
        </div>
        
        {expandedVideo ? (
          <div className="space-y-3 flex-1">
            <div className="relative rounded-lg overflow-hidden border border-purple-500/20 shadow-lg">
              <AspectRatio ratio={16/9}>
                <iframe 
                  src={`https://www.youtube.com/embed/${videos.find(v => v.id === expandedVideo)?.embedId}`}
                  title={videos.find(v => v.id === expandedVideo)?.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </AspectRatio>
              <Button
                onClick={() => toggleExpandVideo(expandedVideo)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black/90"
                size="icon"
                variant="ghost"
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center">
              <h3 className="text-base font-medium text-gray-800">
                {videos.find(v => v.id === expandedVideo)?.title}
              </h3>
              <p className="text-xs text-brand-purple">
                {videos.find(v => v.id === expandedVideo)?.frequency}
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-220px)] pr-3 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {videos.map((video) => (
                <div 
                  key={video.id}
                  className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-purple-200 bg-white"
                >
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <iframe 
                        src={`https://www.youtube.com/embed/${video.embedId}`}
                        title={video.title}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        loading="lazy"
                        className="w-full h-full"
                      ></iframe>
                    </AspectRatio>
                    <Button
                      onClick={() => toggleExpandVideo(video.id)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black/90"
                      size="icon"
                      variant="ghost"
                    >
                      <Maximize className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-2">
                    <h4 className="font-medium text-xs text-gray-800 line-clamp-1">{video.title}</h4>
                    <p className="text-xs text-brand-purple">{video.frequency}</p>
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
