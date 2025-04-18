
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sliders, Eye, EyeOff, Circle, Square, 
  LayoutGrid, Palette, RefreshCw, Infinity,
  Volume2, Music, RotateCw, Sparkles
} from 'lucide-react';
import { 
  VisualizationSettings, 
  SacredGeometryShape, 
  VisualizationMode,
  ColorTheme 
} from '@/types/visualization';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SacredGridControlsProps {
  settings: VisualizationSettings;
  onChange: (settings: VisualizationSettings) => void;
  expanded: boolean;
  onToggle: () => void;
  className?: string;
  showAudioIndicator?: boolean;
  audioLevel?: number;
  bpm?: number | null;
}

const SacredGridControls: React.FC<SacredGridControlsProps> = ({
  settings,
  onChange,
  expanded,
  onToggle,
  className,
  showAudioIndicator = false,
  audioLevel = 0,
  bpm = null
}) => {
  // Shape options
  const shapeOptions: { value: SacredGeometryShape; label: string; icon: React.ReactNode }[] = [
    { value: 'flower-of-life', label: 'Flower of Life', icon: <Circle className="h-4 w-4" /> },
    { value: 'metatron-cube', label: 'Metatron\'s Cube', icon: <Square className="h-4 w-4" /> },
    { value: 'fibonacci-spiral', label: 'Fibonacci Spiral', icon: <RefreshCw className="h-4 w-4" /> },
    { value: 'prime-spiral', label: 'Prime Spiral', icon: <Infinity className="h-4 w-4" /> }
  ];

  // Theme options
  const themeOptions: { value: ColorTheme; label: string }[] = [
    { value: 'cosmic-violet', label: 'Cosmic Violet' },
    { value: 'chakra-rainbow', label: 'Chakra Rainbow' },
    { value: 'earth-tones', label: 'Earth Tones' },
    { value: 'ocean-depths', label: 'Ocean Depths' },
    { value: 'fire-essence', label: 'Fire Essence' },
    { value: 'ethereal-mist', label: 'Ethereal Mist' }
  ];

  // Handle shape toggle
  const toggleShape = (shape: SacredGeometryShape) => {
    const currentShapes = [...settings.activeShapes];
    
    if (currentShapes.includes(shape)) {
      onChange({
        ...settings,
        activeShapes: currentShapes.filter(s => s !== shape)
      });
    } else {
      onChange({
        ...settings,
        activeShapes: [...currentShapes, shape]
      });
    }
  };

  // Handle mode change
  const handleModeChange = (mode: VisualizationMode) => {
    onChange({ ...settings, mode });
  };

  // Handle theme change
  const handleThemeChange = (theme: ColorTheme) => {
    onChange({ ...settings, colorTheme: theme });
  };

  // Handle slider changes
  const handleSpeedChange = (value: number[]) => {
    onChange({ ...settings, speed: value[0] });
  };

  const handleSymmetryChange = (value: number[]) => {
    onChange({ ...settings, symmetry: value[0] });
  };

  const handleSensitivityChange = (value: number[]) => {
    onChange({ ...settings, sensitivity: value[0] });
  };

  const handleBrightnessChange = (value: number[]) => {
    onChange({ ...settings, brightness: value[0] });
  };

  // Handle switch toggles
  const handleMirrorToggle = (checked: boolean) => {
    onChange({ ...settings, mirrorEnabled: checked });
  };

  const handleChakraAlignmentToggle = (checked: boolean) => {
    onChange({ ...settings, chakraAlignmentMode: checked });
  };

  return (
    <Card className={`sacred-grid-controls ${expanded ? 'expanded' : 'collapsed'} ${className || ''}`}>
      <Collapsible open={expanded}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-between py-2"
            onClick={(e) => {
              e.preventDefault();
              onToggle();
            }}
          >
            <div className="flex items-center">
              <Sliders className="h-4 w-4 mr-2" />
              <span>Sacred Grid Controls</span>
            </div>
            {showAudioIndicator && (
              <div className="flex items-center gap-2">
                {bpm && <span className="text-xs bg-purple-200 dark:bg-purple-900 px-1.5 py-0.5 rounded">{bpm} BPM</span>}
                <div className="h-4 flex items-center">
                  <div className="audio-level-indicator flex space-x-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="w-0.5 h-4 rounded-sm transition-all duration-100"
                        style={{ 
                          height: `${(i + 1) * 4}px`,
                          backgroundColor: audioLevel >= (i + 1) * 0.2 
                            ? 'var(--purple-500, #8b5cf6)' 
                            : 'var(--gray-300, #d1d5db)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {expanded ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  Sacred Geometry Layers
                </h3>
                <div className="space-y-2">
                  {shapeOptions.map(shape => (
                    <div key={shape.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`shape-${shape.value}`}
                        checked={settings.activeShapes.includes(shape.value)}
                        onCheckedChange={() => toggleShape(shape.value)}
                      />
                      <Label 
                        htmlFor={`shape-${shape.value}`}
                        className="flex items-center cursor-pointer"
                      >
                        {shape.icon}
                        <span className="ml-2">{shape.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Animation Speed
                </h3>
                <Slider
                  value={[settings.speed]}
                  min={0.1}
                  max={5}
                  step={0.1}
                  onValueChange={handleSpeedChange}
                  className="py-4"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Brightness
                </h3>
                <Slider
                  value={[settings.brightness]}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onValueChange={handleBrightnessChange}
                  className="py-4"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Visualization Mode</h3>
                <Tabs defaultValue={settings.mode} onValueChange={handleModeChange as any}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="2d">2D Mode</TabsTrigger>
                    <TabsTrigger value="3d">3D Mode</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Color Theme
                </h3>
                <select
                  value={settings.colorTheme}
                  onChange={(e) => handleThemeChange(e.target.value as ColorTheme)}
                  className="w-full border rounded py-1.5 px-2 text-sm"
                >
                  {themeOptions.map(theme => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio Sensitivity
                </h3>
                <Slider
                  value={[settings.sensitivity]}
                  min={0.1}
                  max={2}
                  step={0.1}
                  onValueChange={handleSensitivityChange}
                  className="py-4"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="mirror-toggle" className="cursor-pointer">Mirror Effect</Label>
                    <Switch
                      id="mirror-toggle"
                      checked={settings.mirrorEnabled}
                      onCheckedChange={handleMirrorToggle}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chakra-toggle" className="cursor-pointer">Chakra Alignment Mode</Label>
                    <Switch
                      id="chakra-toggle"
                      checked={settings.chakraAlignmentMode}
                      onCheckedChange={handleChakraAlignmentToggle}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SacredGridControls;
