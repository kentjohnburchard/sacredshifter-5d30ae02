
import React from 'react';

type VisualizationMode = 
  'sacred' | 
  'chakra' | 
  'leyline' | 
  'cymatic' | 
  'mirrorverse' | 
  'yinyang' | 
  'metatron' | 
  'prime' | 
  'nebula' | 
  'fractal' | 
  'galaxy' | 
  'cymatictile' | 
  'hologram' | 
  'collision' |
  'mandala' |
  'phibreath';

interface VisualizerSelectorProps {
  mode: VisualizationMode;
  onModeChange: (mode: VisualizationMode) => void;
}

const VisualizerSelector: React.FC<VisualizerSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <select 
      className="mode-selector" 
      value={mode}
      onChange={(e) => onModeChange(e.target.value as VisualizationMode)}
    >
      <option value="sacred">Sacred Geometry</option>
      <option value="chakra">Chakra Alignment</option>
      <option value="leyline">Ley Lines</option>
      <option value="cymatic">Cymatics</option>
      <option value="mirrorverse">Mirrorverse</option>
      <option value="yinyang">Yin Yang</option>
      <option value="metatron">Metatron's Cube</option>
      <option value="prime">Prime Symphony</option>
      <option value="nebula">Cosmic Nebula</option>
      <option value="fractal">Fractal Patterns</option>
      <option value="galaxy">Galaxy</option>
      <option value="cymatictile">Cymatic Tiles</option>
      <option value="hologram">Hologram</option>
      <option value="collision">Cosmic Collision</option>
      <option value="mandala">Sacred Mandala</option>
      <option value="phibreath">Phi Breath Mode</option>
    </select>
  );
};

export default VisualizerSelector;
