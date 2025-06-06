
import React, { useState, useEffect } from 'react';

// Utility function to extract YouTube video ID from URL
export const extractYoutubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2]?.length === 11 ? match[2] : null;
};

interface YouTubeEmbedProps {
  youtubeUrl: string;
  title?: string;
  className?: string;
  allowControls?: boolean;
  height?: string;
  autoplay?: boolean;
  muted?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  youtubeUrl,
  title = 'YouTube video player',
  className = '',
  allowControls = true,
  height = '315px',
  autoplay = false,
  muted = false
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

  const embedUrl = `https://www.youtube.com/embed/${videoId}${allowControls ? '' : '?controls=0'}${autoplay ? (allowControls ? '?autoplay=1' : '&autoplay=1') : ''}${muted ? (autoplay || allowControls ? '&mute=1' : '?mute=1') : ''}`;

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
