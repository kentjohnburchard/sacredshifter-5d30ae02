
import React, { useEffect, useState } from 'react';
import { NebulaScene } from './NebulaScene';
import { FractalScene } from './FractalScene';
import { CymaticScene } from './CymaticScene';
import { GalaxyScene } from './GalaxyScene';
import { MandalaScene } from './MandalaScene';
import { MetatronScene } from './MetatronScene';
import { YinYangScene } from './YinYangScene';
import { MirrorverseScene } from './MirrorverseScene';
import { HologramScene } from './HologramScene';
import { LeylineScene } from './LeylineScene';
import { CosmicCollisionScene } from './CosmicCollisionScene';
import { CymaticTileScene } from './CymaticTileScene';
import { PrimeSymphonyScene } from './PrimeSymphonyScene';
import { FractalAudioVisualizer } from './FractalAudioVisualizer';

interface VisualizerSceneProps {
  scene: string;
  audioAnalyzer?: AnalyserNode | null;
  audioData?: Uint8Array;
  isPlaying?: boolean;
}

const VisualizerScene: React.FC<VisualizerSceneProps> = ({
  scene,
  audioAnalyzer = null,
  audioData,
  isPlaying = false,
}) => {
  const [currentScene, setCurrentScene] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    renderScene(scene);
  }, [scene, audioAnalyzer, isPlaying]);

  const renderScene = (sceneType: string) => {
    switch (sceneType) {
      case 'nebula':
        setCurrentScene(<NebulaScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'fractal':
        setCurrentScene(<FractalScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'cymatics':
        setCurrentScene(<CymaticScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'galaxy':
        setCurrentScene(<GalaxyScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'mandala':
        setCurrentScene(<MandalaScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'metatron':
        setCurrentScene(<MetatronScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'yinyang':
        setCurrentScene(<YinYangScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'mirrorverse':
        setCurrentScene(<MirrorverseScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'hologram':
        setCurrentScene(<HologramScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'leylines':
        setCurrentScene(<LeylineScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'cosmic-collision':
        setCurrentScene(<CosmicCollisionScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'cymatic-tiles':
        setCurrentScene(<CymaticTileScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'prime-symphony':
        setCurrentScene(<PrimeSymphonyScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      case 'fractal-audio':
        setCurrentScene(<FractalAudioVisualizer audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
        break;
      default:
        setCurrentScene(<NebulaScene audioAnalyzer={audioAnalyzer} isPlaying={isPlaying} />);
    }
  };

  return (
    <div className="visualizer-scene-container w-full h-full">
      {currentScene}
    </div>
  );
};

export default VisualizerScene;
