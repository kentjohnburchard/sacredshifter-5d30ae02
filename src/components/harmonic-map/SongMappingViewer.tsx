import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Music, ListMusic, Filter } from 'lucide-react';
import { AppFunctionality, SongMapping } from '@/types/music';
import songMappings, { 
  functionalityDescriptions, 
  getSongsByFunctionality 
} from '@/utils/songMappings';
import FrequencyPlayer from '@/components/FrequencyPlayer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";

const SongMappingViewer = () => {
  const [selectedFunctionality, setSelectedFunctionality] = useState<AppFunctionality>('hermetic-principle');
  const [selectedSong, setSelectedSong] = useState<SongMapping | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const functionalities = Object.keys(functionalityDescriptions) as AppFunctionality[];
  const filteredSongs = getSongsByFunctionality(selectedFunctionality);
  
  const handlePlayToggle = (song: SongMapping) => {
    if (selectedSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <Card className="bg-white shadow-md rounded-lg overflow-hidden border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Music className="h-5 w-5 text-purple-600 mr-2" />
            <span>Harmonic Sound Mappings</span>
          </div>
          <Select 
            value={selectedFunctionality}
            onValueChange={(value) => setSelectedFunctionality(value as AppFunctionality)}
          >
            <SelectTrigger className="w-[180px] text-sm bg-white">
              <SelectValue placeholder="Select function" />
            </SelectTrigger>
            <SelectContent>
              {functionalities.map(func => (
                <SelectItem key={func} value={func} className="text-sm capitalize">
                  {functionalityDescriptions[func].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
        <p className="text-sm text-gray-600">
          {selectedFunctionality && functionalityDescriptions[selectedFunctionality].description}
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-50">
            <TabsTrigger value="list" className="data-[state=active]:bg-white">
              <ListMusic className="h-4 w-4 mr-1" /> Song List
            </TabsTrigger>
            <TabsTrigger value="filter" className="data-[state=active]:bg-white">
              <Filter className="h-4 w-4 mr-1" /> Map Filter
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="p-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredSongs.length > 0 ? (
                  filteredSongs.map(song => (
                    <div 
                      key={song.id} 
                      className={`p-3 rounded-lg border ${
                        selectedSong?.id === song.id 
                          ? 'border-purple-400 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200'
                      } transition-colors`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-purple-900">{song.title}</h3>
                          <p className="text-sm text-gray-600">{song.artist}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {song.frequency && (
                              <Badge variant="outline" className="text-xs">
                                {song.frequency}Hz
                              </Badge>
                            )}
                            {song.chakra && (
                              <Badge variant="outline" className="text-xs bg-purple-50">
                                {song.chakra} Chakra
                              </Badge>
                            )}
                            <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
                              {functionalityDescriptions[song.functionality].name}
                            </Badge>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">{song.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`rounded-full h-8 w-8 p-0 ${
                            selectedSong?.id === song.id && isPlaying
                              ? 'bg-purple-600 text-white hover:bg-purple-700 border-purple-600'
                              : 'border-purple-300 text-purple-700'
                          }`}
                          onClick={() => handlePlayToggle(song)}
                        >
                          {selectedSong?.id === song.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>
                      </div>
                      
                      {selectedSong?.id === song.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <SacredAudioPlayer
                            audioUrl={song.audioUrl}
                            frequency={song.frequency}
                            isPlaying={isPlaying}
                            onPlayToggle={() => setIsPlaying(!isPlaying)}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Music className="h-12 w-12 mx-auto opacity-30 mb-2" />
                    <p>No songs found for this functionality.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="filter" className="p-4">
            <div className="rounded-lg bg-purple-50 p-4">
              <h3 className="text-lg font-medium text-purple-900 mb-4">Functionality Map</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {functionalities.map(func => {
                  const desc = functionalityDescriptions[func];
                  const count = getSongsByFunctionality(func).length;
                  
                  return (
                    <div 
                      key={func}
                      className={`p-4 rounded-lg bg-white border cursor-pointer hover:shadow-md transition-shadow ${
                        selectedFunctionality === func 
                          ? 'border-purple-400 shadow-sm' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedFunctionality(func)}
                    >
                      <h4 className="font-medium">{desc.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{desc.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge 
                          className={`bg-gradient-to-r ${desc.color} text-white border-0`}
                        >
                          {count} Songs
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 text-xs text-gray-500">
        All audio files are mapped to specific functionalities based on their frequency and purpose.
      </CardFooter>
    </Card>
  );
};

export default SongMappingViewer;
