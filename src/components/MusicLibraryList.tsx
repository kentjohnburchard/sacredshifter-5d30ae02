
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
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp3`;
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
      <div className="text-center py-10 text-white">
        <p className="animate-pulse">Loading meditation music...</p>
      </div>
    );
  }

  if (musicList.length === 0) {
    return (
      <div className="text-center py-10 text-white">
        <Music className="h-16 w-16 mx-auto text-purple-400 opacity-50 mb-4" />
        <p className="text-lg">No meditation music has been uploaded yet.</p>
        <p className="text-sm text-white/70 mt-2">
          Use the form above to upload your first meditation track.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {musicList.map((music) => (
        <Card key={music.id} className="bg-black/70 backdrop-blur-md border border-purple-500/30 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">{music.title}</h3>
                <p className="text-sm text-white/70 mt-1">
                  {getFrequencyName(music.frequency_id)}
                </p>
                {music.description && (
                  <p className="text-sm text-white/70 mt-2 line-clamp-2">{music.description}</p>
                )}
                <p className="text-xs text-white/50 mt-2">
                  Added {formatDistanceToNow(new Date(music.created_at), { addSuffix: true })}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => handlePlay(music.id, music.audio_url)}
                >
                  {playingId === music.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={() => handleDownload(music.audio_url, music.title)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400"
                  onClick={() => handleDeleteClick(music.id, music.audio_url)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="bg-gray-950 border-purple-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meditation Music</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete this meditation music? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-none"
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
