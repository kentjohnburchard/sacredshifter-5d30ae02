
import React, { useState } from 'react';
import { MeditationMusic } from '@/hooks/useMusicLibrary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Download, Trash2, Music } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface MusicLibraryListProps {
  musicList: MeditationMusic[];
  isLoading: boolean;
  onDelete: (id: string, audioUrl: string) => Promise<void>;
  getFrequencyName: (frequencyId: string) => string;
}

const MusicLibraryList: React.FC<MusicLibraryListProps> = ({
  musicList,
  isLoading,
  onDelete,
  getFrequencyName,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string>('');

  const handlePlay = (id: string, url: string) => {
    if (playingId === id) {
      // Pause if already playing this track
      audioElement?.pause();
      setPlayingId(null);
      setAudioElement(null);
    } else {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
      }
      
      // Play the new track
      const audio = new Audio(url);
      audio.addEventListener('ended', () => {
        setPlayingId(null);
        setAudioElement(null);
      });
      audio.play();
      setPlayingId(id);
      setAudioElement(audio);
    }
  };

  const handleDownload = (url: string, title: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `sacred_sound_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteClick = (id: string, url: string) => {
    setDeletingId(id);
    setDeletingUrl(url);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      // If the track being deleted is currently playing, stop it
      if (playingId === deletingId && audioElement) {
        audioElement.pause();
        setPlayingId(null);
        setAudioElement(null);
      }
      
      await onDelete(deletingId, deletingUrl);
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-600">
        <p className="animate-pulse">Loading sacred sound tracks...</p>
      </div>
    );
  }

  if (musicList.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <Music className="h-12 w-12 mx-auto text-brand-purple opacity-50 mb-3" />
        <p className="text-sm">No sacred sound tracks have been uploaded yet.</p>
        <p className="text-xs text-gray-500 mt-1">
          Use the upload tab to add your first sacred sound track.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {musicList.map((music) => (
        <Card key={music.id} className="bg-white/90 backdrop-blur-md border border-purple-200 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-gray-800 truncate">{music.title}</h3>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-brand-purple">
                    {getFrequencyName(music.frequency_id)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(music.created_at), { addSuffix: true })}
                  </p>
                </div>
                {music.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">{music.description}</p>
                )}
              </div>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20"
                  onClick={() => handlePlay(music.id, music.audio_url)}
                >
                  {playingId === music.id ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3 ml-0.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20"
                  onClick={() => handleDownload(music.audio_url, music.title)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full bg-brand-purple/10 text-red-500 hover:bg-red-500/20"
                  onClick={() => handleDeleteClick(music.id, music.audio_url)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-white border-purple-200 text-gray-800 max-w-xs mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">Delete Sacred Sound Track</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-600">
              Are you sure you want to delete this track? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="text-xs bg-red-600 hover:bg-red-700 text-white border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MusicLibraryList;
