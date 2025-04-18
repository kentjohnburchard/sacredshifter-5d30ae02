import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import SacredGridVisualizer from '@/components/SacredGridVisualizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Music, Play, Pause, Maximize, Minimize, 
  Upload, ExternalLink, HelpCircle,
  RotateCcw, Download, Volume2
} from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { VisualizationSettings } from '@/types/visualization';

const SacredGridDemo: React.FC = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>('visualizer');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  
  // Get global audio player
  const { 
    playAudio, 
    isPlaying: isGlobalPlaying,
    currentAudio,
    togglePlayPause,
    forceVisualSync
  } = useGlobalAudioPlayer();
  
  const [settings, setSettings] = useState<VisualizationSettings>({
    activeShapes: ['flower-of-life', 'fibonacci-spiral', 'prime-spiral', 'metatron-cube'],
    speed: 1.0,
    colorTheme: 'cosmic-violet',
    symmetry: 6,
    mode: '3d',
    mirrorEnabled: true,
    chakraAlignmentMode: false,
    sensitivity: 1.0,
    brightness: 1.0
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }
  };

  // Toggle local audio play/pause
  const toggleLocalAudio = () => {
    if (audioRef.current) {
      if (isLocalPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsLocalPlaying(!isLocalPlaying);
    }
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  // Play a preset track through the global audio player
  const playPresetTrack = (track: number) => {
    const tracks = [
      {
        title: "Sacred Frequency 432Hz",
        source: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/432hz_meditation.mp3",
        frequency: 432
      },
      {
        title: "Crown Chakra Activation",
        source: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/crown_chakra_963hz.mp3",
        frequency: 963
      },
      {
        title: "Heart Opening",
        source: "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/heart_chakra_528hz.mp3",
        frequency: 528
      }
    ];
    
    playAudio(tracks[track]);
  };

  return (
    <Layout pageTitle="Sacred Grid Visualizer">
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-900 dark:text-purple-400">
            Sacred Grid Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Experience sacred geometry patterns synchronized with audio frequencies.
          </p>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6 grid grid-cols-3">
            <TabsTrigger value="visualizer" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Visualizer</span>
            </TabsTrigger>
            <TabsTrigger value="howto" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>How It Works</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Audio Options</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizer">
            {/* Visualizer Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Button 
                onClick={toggleFullScreen}
                className="flex items-center gap-2"
                variant="outline"
              >
                {fullScreen ? (
                  <>
                    <Minimize className="h-4 w-4" />
                    <span>Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize className="h-4 w-4" />
                    <span>Fullscreen</span>
                  </>
                )}
              </Button>
              
              {currentAudio?.source ? (
                <Button 
                  onClick={togglePlayPause}
                  className="flex items-center gap-2"
                  variant={isGlobalPlaying ? "destructive" : "default"}
                >
                  {isGlobalPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Play</span>
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select a preset track or upload your own audio
                </p>
              )}
              
              {forceVisualSync && (
                <Button 
                  onClick={() => forceVisualSync()}
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Sync Visuals</span>
                </Button>
              )}
            </div>
            
            {/* Visualizer Container */}
            <div 
              className={`rounded-lg overflow-hidden border border-purple-200 dark:border-purple-800 mb-6`}
              style={{
                height: fullScreen ? '90vh' : '70vh',
                transition: 'height 0.3s ease'
              }}
            >
              <SacredGridVisualizer 
                width="100%"
                height="100%"
                fullScreen={fullScreen}
                initialSettings={settings}
                onSettingsChange={setSettings}
                autoConnect={true}
                showControls={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="howto">
            <Card>
              <CardHeader>
                <CardTitle>How Sacred Grid Visualizer Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sacred Geometry & Audio Sync</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      The Sacred Grid Visualizer creates dynamic sacred geometry patterns that react 
                      to audio frequencies in real-time. Each shape represents different aspects of 
                      universal consciousness and cosmic harmony.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Audio Analysis</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      The visualizer analyzes several aspects of sound:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Amplitude (volume) affects the size and intensity of shapes</li>
                      <li>Frequency spectrum maps to different geometric patterns</li>
                      <li>Beat detection creates pulsations aligned with music tempo</li>
                      <li>Dominant frequencies influence color transformations</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Visualization Modes</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      Switch between 2D and 3D modes to experience different dimensions of sacred patterns:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                      <li><strong>2D Mode:</strong> Classic sacred geometry patterns with fluid animations</li>
                      <li><strong>3D Mode:</strong> Immersive three-dimensional representations with depth and perspective</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sacred Shapes</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium">Flower of Life</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Ancient pattern showing the fundamental forms of space and time, representing the 
                          interconnectedness of life and the unified field of consciousness.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Metatron's Cube</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Derived from the Tree of Life, contains all Platonic solids and represents 
                          the flow of energy and protection.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Fibonacci Spiral</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Based on the golden ratio (1.618), represents natural growth patterns found 
                          throughout nature and the cosmos.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Prime Spiral</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Visualizes prime numbers in a spiral pattern, revealing the mysterious 
                          distribution of these fundamental mathematical elements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Audio Settings & Presets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Preset Sacred Frequencies</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Select from these healing frequency tracks to experience their unique visualizations.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30">
                        <CardContent className="p-4">
                          <h4 className="font-medium">432 Hz Meditation</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tuned to cosmic harmony</p>
                          <Button onClick={() => playPresetTrack(0)} size="sm" className="w-full">
                            <Play className="h-4 w-4 mr-2" /> Play 432 Hz
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30">
                        <CardContent className="p-4">
                          <h4 className="font-medium">963 Hz Crown Chakra</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Divine consciousness</p>
                          <Button onClick={() => playPresetTrack(1)} size="sm" className="w-full">
                            <Play className="h-4 w-4 mr-2" /> Play 963 Hz
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30">
                        <CardContent className="p-4">
                          <h4 className="font-medium">528 Hz Heart Chakra</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">DNA repair frequency</p>
                          <Button onClick={() => playPresetTrack(2)} size="sm" className="w-full">
                            <Play className="h-4 w-4 mr-2" /> Play 528 Hz
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Upload Your Own Audio</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Upload any MP3, WAV, or OGG file to visualize your favorite music.
                    </p>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Select Audio File</span>
                      </Button>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      
                      {localAudioUrl && (
                        <div className="flex items-center gap-2">
                          <audio ref={audioRef} src={localAudioUrl} />
                          
                          <Button 
                            onClick={toggleLocalAudio}
                            variant={isLocalPlaying ? "destructive" : "default"}
                            className="flex items-center gap-2"
                            size="sm"
                          >
                            {isLocalPlaying ? (
                              <>
                                <Pause className="h-4 w-4" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4" />
                                <span>Play</span>
                              </>
                            )}
                          </Button>
                          
                          <span className="text-sm truncate max-w-xs">
                            {fileInputRef.current?.files?.[0]?.name || "Selected file"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Additional Options</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-gray-50 dark:bg-gray-900/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium">Use with Microphone Input</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Connect to your microphone to visualize live sounds or spoken words.
                          </p>
                          <Button variant="outline" disabled className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" /> Microphone Input (Coming Soon)
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50 dark:bg-gray-900/50">
                        <CardContent className="p-4">
                          <h4 className="font-medium">Download Visuals</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Capture the current visualization as an image or video.
                          </p>
                          <Button variant="outline" disabled className="w-full">
                            <Download className="h-4 w-4 mr-2" /> Capture Image (Coming Soon)
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SacredGridDemo;
