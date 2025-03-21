
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Upload } from 'lucide-react';
import { useMusicLibrary } from '@/hooks/useMusicLibrary';
import MusicUploadForm from '@/components/MusicUploadForm';
import MusicLibraryList from '@/components/MusicLibraryList';

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
    <div className="min-h-screen flex flex-col bg-[url('/lovable-uploads/03d64fc7-3a06-4a05-bb16-d5f23d3983f5.png')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/95 via-purple-950/95 to-black/95 backdrop-blur-sm -z-10"></div>
      
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 space-y-8">
        <div className="text-center space-y-3 mb-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-shadow-lg">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-purple-300 to-blue-300">
              Meditation Music Library
            </span>
          </h2>
          <p className="text-slate-100 max-w-2xl mx-auto text-lg text-shadow-sm">
            Upload and manage meditation music for different healing frequencies.
          </p>
        </div>
        
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-black/40 border border-white/10">
            <TabsTrigger value="library" className="data-[state=active]:bg-white/20">
              <Library className="h-4 w-4 mr-2" />
              Browse Library
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              Upload Music
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="mt-6">
            <Card className="border-none shadow-xl bg-black/70 backdrop-blur-md border border-purple-500/30 overflow-hidden rounded-xl">
              <CardContent className="p-6 text-white">
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
          
          <TabsContent value="upload" className="mt-6">
            <div className="max-w-2xl mx-auto">
              <MusicUploadForm onUpload={uploadMusic} isUploading={isUploading} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="w-full py-6 text-center text-sm text-slate-300">
        <p>Sacred Shifter - Upload and share meditation music with healing frequencies.</p>
      </footer>
    </div>
  );
};

export default MusicLibrary;
