
import React, { useState, useEffect } from 'react';
import { extractYoutubeVideoId } from '@/services/soundscapeService';

interface YouTubeEmbedProps {
  youtubeUrl: string;
  title?: string;
  className?: string;
  allowControls?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  youtubeUrl,
  title = 'YouTube video player',
  className = '',
  allowControls = true
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = extractYoutubeVideoId(youtubeUrl);
    if (!id) {
      setError('Invalid YouTube URL');
      return;
    }
    setVideoId(id);
  }, [youtubeUrl]);

  if (error) {
    return <div className="text-red-500 text-sm py-2">{error}</div>;
  }

  if (!videoId) {
    return <div className="animate-pulse bg-gray-200 h-56 rounded-lg"></div>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}${allowControls ? '' : '?controls=0'}`;

  return (
    <div className={`relative pt-[56.25%] w-full overflow-hidden rounded-lg shadow-inner ${className}`}>
      <iframe
        className="absolute top-0 left-0 w-full h-full border-0"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default YouTubeEmbed;
