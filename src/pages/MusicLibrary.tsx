import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Upload, Youtube } from 'lucide-react';
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

  // Add debugging
  useEffect(() => {
    console.log('MusicLibrary page rendered');
    const footer = document.querySelector('[class*="fixed bottom-0"]');
    if (footer) {
      console.log('FixedFooter position:', footer.getBoundingClientRect());
    }
  }, []);

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#f8f4ff] to-white pb-36">
      <Header />
      
      <main className="w-full max-w-6xl mx-auto px-4 py-4 sm:px-6">
        <div className="text-center space-y-1 mb-4 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-purple via-brand-lavender to-brand-amythyst">
              Sacred Sound Library
            </span>
          </h2>
          <p className="text-[#7510c9]/70 max-w-2xl mx-auto text-sm">
            Upload and manage meditation music for different healing frequencies.
          </p>
        </div>
        
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white border border-purple-200 mb-4">
            <TabsTrigger value="library" className="data-[state=active]:bg-brand-purple/20 data-[state=active]:text-brand-purple">
              <Library className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">Browse Library</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="data-[state=active]:bg-brand-purple/20 data-[state=active]:text-brand-purple">
              <Youtube className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">YouTube Videos</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-brand-purple/20 data-[state=active]:text-brand-purple">
              <Upload className="h-4 w-4 mr-1" />
              <span className="text-xs sm:text-sm">Upload Music</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="library">
            <Card className="border border-purple-200 shadow-md overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <ScrollArea className="h-[calc(100vh-450px)] pr-4">
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
          
          <TabsContent value="youtube">
            <YouTubeVideoList />
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="max-w-2xl mx-auto">
              <MusicUploadForm onUpload={uploadMusic} isUploading={isUploading} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MusicLibrary;
