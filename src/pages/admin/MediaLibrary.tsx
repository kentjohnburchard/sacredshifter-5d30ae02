
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Image, Music, Video, FileText, Upload, Search, Filter, Grid3x3 } from 'lucide-react';

// Mock media data
const mockImages = Array.from({ length: 6 }).map((_, i) => ({
  id: `img-${i}`,
  title: `Image ${i + 1}`,
  type: 'image',
  thumbnail: `https://picsum.photos/seed/${i + 10}/300/200`,
  uploadedDate: '2023-05-03',
}));

const mockAudios = Array.from({ length: 4 }).map((_, i) => ({
  id: `audio-${i}`,
  title: `Sacred Frequency ${i + 1}`,
  type: 'audio',
  duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  uploadedDate: '2023-04-27',
}));

const mockVideos = Array.from({ length: 3 }).map((_, i) => ({
  id: `video-${i}`,
  title: `Sacred Journey Video ${i + 1}`,
  type: 'video',
  thumbnail: `https://picsum.photos/seed/${i + 20}/300/200`,
  duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  uploadedDate: '2023-04-15',
}));

const mockDocuments = Array.from({ length: 2 }).map((_, i) => ({
  id: `doc-${i}`,
  title: `Sacred Text ${i + 1}`,
  type: 'document',
  pages: Math.floor(Math.random() * 20) + 5,
  uploadedDate: '2023-03-22',
}));

const MediaLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <PageLayout title="Media Library">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Media Library
            </span>
          </h1>
          <p className="text-muted-foreground text-center md:text-left">
            Manage all media assets including images, audio, videos, and documents
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search media..."
              className="pl-8 pr-4 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button size="sm" className="flex-1 md:flex-none">
              <Upload className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Upload</span>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 md:flex-none">
              <Filter className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">Filter</span>
            </Button>
            <Button size="sm" variant="outline" className="flex-1 md:flex-none">
              <Grid3x3 className="mr-1 h-4 w-4" />
              <span className="hidden md:inline">View</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full md:w-auto grid grid-cols-5 gap-1">
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-purple-600" />
                  Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {mockImages.map((image) => (
                    <div key={image.id} className="space-y-2">
                      <Card className="overflow-hidden">
                        <AspectRatio ratio={3/2}>
                          <img
                            src={image.thumbnail}
                            alt={image.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </Card>
                      <div>
                        <p className="text-sm font-medium truncate">{image.title}</p>
                        <p className="text-xs text-muted-foreground">{image.uploadedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5 text-purple-600" />
                  Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockAudios.map((audio) => (
                    <Card key={audio.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                            <Music className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{audio.title}</p>
                            <p className="text-xs text-muted-foreground">{audio.duration}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Play</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-600" />
                  Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockVideos.map((video) => (
                    <div key={video.id} className="space-y-2">
                      <Card className="overflow-hidden relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-2">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </AspectRatio>
                      </Card>
                      <div>
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.uploadedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <Card key={doc.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{doc.pages} pages</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="images">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {mockImages.map((image) => (
                    <div key={image.id} className="space-y-2">
                      <Card className="overflow-hidden">
                        <AspectRatio ratio={3/2}>
                          <img
                            src={image.thumbnail}
                            alt={image.title}
                            className="object-cover w-full h-full"
                          />
                        </AspectRatio>
                      </Card>
                      <div>
                        <p className="text-sm font-medium truncate">{image.title}</p>
                        <p className="text-xs text-muted-foreground">{image.uploadedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="audio">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {mockAudios.map((audio) => (
                    <Card key={audio.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                            <Music className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{audio.title}</p>
                            <p className="text-xs text-muted-foreground">{audio.duration}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Play</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="video">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockVideos.map((video) => (
                    <div key={video.id} className="space-y-2">
                      <Card className="overflow-hidden relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/50 rounded-full p-2">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </AspectRatio>
                      </Card>
                      <div>
                        <p className="text-sm font-medium truncate">{video.title}</p>
                        <p className="text-xs text-muted-foreground">{video.uploadedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <Card key={doc.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">{doc.pages} pages</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default MediaLibrary;
