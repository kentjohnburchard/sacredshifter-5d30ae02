
import React, { useState, useEffect, useRef } from 'react';

interface MandalaBuilderProps {
  setVisualMode: (mode: string) => void;
  onMandalaChange: (settings: MandalaSettings) => void;
}

export interface MandalaSettings {
  sides: number;
  spokes: number;
  layers: number;
  radius: number;
  mapSidesToPrime: boolean;
  mapSpokesToFrequency: boolean;
}

const MandalaBuilder: React.FC<MandalaBuilderProps> = ({ setVisualMode, onMandalaChange }) => {
  const [settings, setSettings] = useState<MandalaSettings>({
    sides: 6,
    spokes: 12,
    layers: 3,
    radius: 0.7,
    mapSidesToPrime: false,
    mapSpokesToFrequency: false
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Update parent component when settings change
  useEffect(() => {
    onMandalaChange(settings);
  }, [settings, onMandalaChange]);
  
  // Draw mandala preview when settings change
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center and max radius
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.9;
    
    // Draw background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set mandala drawing styles
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    // Draw layers
    for (let layer = 1; layer <= settings.layers; layer++) {
      const layerRadius = (layer / settings.layers) * maxRadius * settings.radius;
      
      // Draw the main polygon for this layer
      ctx.beginPath();
      for (let i = 0; i < settings.sides; i++) {
        const angle = (i / settings.sides) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * layerRadius;
        const y = centerY + Math.sin(angle) * layerRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
      
      // Draw spokes if we have any
      if (settings.spokes > 0) {
        ctx.beginPath();
        for (let i = 0; i < settings.spokes; i++) {
          const angle = (i / settings.spokes) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * layerRadius;
          const y = centerY + Math.sin(angle) * layerRadius;
          
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    
    // Draw connecting lines between layers if we have multiple
    if (settings.layers > 1) {
      ctx.beginPath();
      for (let i = 0; i < settings.sides; i++) {
        const angle = (i / settings.sides) * Math.PI * 2;
        
        // Draw line from inner to outer for each point
        for (let layer = 1; layer < settings.layers; layer++) {
          const innerRadius = (layer / settings.layers) * maxRadius * settings.radius;
          const outerRadius = ((layer + 1) / settings.layers) * maxRadius * settings.radius;
          
          const innerX = centerX + Math.cos(angle) * innerRadius;
          const innerY = centerY + Math.sin(angle) * innerRadius;
          
          const outerX = centerX + Math.cos(angle) * outerRadius;
          const outerY = centerY + Math.sin(angle) * outerRadius;
          
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(outerX, outerY);
        }
      }
      ctx.stroke();
    }
    
    // Add some color to illustrate the audio-reactive potential
    ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
  }, [settings]);
  
  // Handle settings change
  const handleSettingChange = (
    setting: keyof MandalaSettings,
    value: number | boolean
  ) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    
    // Switch to mandala visualization mode
    setVisualMode('mandala');
  };
  
  return (
    <div className="mandala-builder bg-black/70 backdrop-blur-md p-4 rounded-lg">
      <h3 className="text-lg text-white mb-3 font-semibold">Mandala Builder</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="sliders space-y-4">
          {/* Sides Slider */}
          <div>
            <label className="block text-white text-sm mb-1">
              Sides: {settings.sides}
            </label>
            <input
              type="range"
              min={3}
              max={12}
              step={1}
              value={settings.sides}
              onChange={(e) => handleSettingChange('sides', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* Spokes Slider */}
          <div>
            <label className="block text-white text-sm mb-1">
              Spokes: {settings.spokes}
            </label>
            <input
              type="range"
              min={0}
              max={36}
              step={1}
              value={settings.spokes}
              onChange={(e) => handleSettingChange('spokes', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* Layers Slider */}
          <div>
            <label className="block text-white text-sm mb-1">
              Layers: {settings.layers}
            </label>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={settings.layers}
              onChange={(e) => handleSettingChange('layers', parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* Radius Slider */}
          <div>
            <label className="block text-white text-sm mb-1">
              Radius: {settings.radius.toFixed(2)}
            </label>
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.01}
              value={settings.radius}
              onChange={(e) => handleSettingChange('radius', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          {/* Audio Mapping Options */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mapSidesToPrime"
                checked={settings.mapSidesToPrime}
                onChange={(e) => handleSettingChange('mapSidesToPrime', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="mapSidesToPrime" className="text-white text-sm">
                Map Sides → Prime Index
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="mapSpokesToFrequency"
                checked={settings.mapSpokesToFrequency}
                onChange={(e) => handleSettingChange('mapSpokesToFrequency', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="mapSpokesToFrequency" className="text-white text-sm">
                Map Spokes → Frequency Band
              </label>
            </div>
          </div>
        </div>
        
        {/* Canvas Preview */}
        <div>
          <canvas 
            ref={canvasRef} 
            width={200} 
            height={200} 
            className="w-full h-full border border-gray-700 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default MandalaBuilder;
