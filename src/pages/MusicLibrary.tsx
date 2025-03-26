
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Upload, Youtube, Music } from 'lucide-react';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import MusicUploadForm from '@/components/MusicUploadForm';
import MusicLibraryList from '@/components/MusicLibraryList';
import YouTubeVideoList from '@/components/YouTubeVideoList';

const MusicLibrary: React.FC = () => {
  const {
    isLoading,
    meditationMusic,
    isUploading,
    uploadMusic,
    deleteMusic,
    getFrequencyName
  } = useMusicLibrary();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-brand-lavender to-blue-400">
              Sacred Sound Library
            </span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Upload and manage meditation music for different healing frequencies.
          </p>
        </div>
        
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-800/50 border border-purple-500/20">
            <TabsTrigger value="library" className="data-[state=active]:bg-brand-purple/20 data-[state=active]:text-brand-lavender">
              <Library className="h-4 w-4 mr-2" />
              Browse Library
            </TabsTrigger>
            <TabsTrigger value="youtube" className="data-[state=active]:bg-brand-purple/20 data-[state=active]:text-brand-lavender">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube Videos
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-brand-purple/20 data-[state=active]:text-brand-lavender">
              <Upload className="h-4 w-4 mr-2" />
              Upload Music
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="mt-6">
            <Card className="border border-purple-500/20 shadow-md overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                  <MusicLibraryList
                    musicList={meditationMusic}
                    isLoading={isLoading}
                    onDelete={deleteMusic}
                    getFrequencyName={getFrequencyName}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="youtube" className="mt-6">
            <YouTubeVideoList />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <MusicUploadForm onUpload={uploadMusic} isUploading={isUploading} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-gray-400">
        <p>Sacred Shifter - Upload and share sacred sound healing music with healing frequencies.</p>
      </footer>
    </div>
  );
};

export default MusicLibrary;
