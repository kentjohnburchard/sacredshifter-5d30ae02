
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface VisualElementPreviewerProps {
  visualUrl?: string;
  title?: string;
}

const VisualElementPreviewer: React.FC<VisualElementPreviewerProps> = ({
  visualUrl,
  title
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // In a real implementation, this would initialize a Three.js scene
  // and load the model from the visualUrl
  useEffect(() => {
    if (!visualUrl || !containerRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    // Simulate loading a 3D model
    const timer = setTimeout(() => {
      // This is where you would normally initialize Three.js and load your model
      // Example: 
      // const scene = new THREE.Scene();
      // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      // const renderer = new THREE.WebGLRenderer({ antialias: true });
      // renderer.setSize(width, height);
      // containerRef.current.appendChild(renderer.domElement);
      // 
      // const loader = new GLTFLoader();
      // loader.load(visualUrl, (gltf) => {
      //   scene.add(gltf.scene);
      //   setIsLoading(false);
      // });
      
      setIsLoading(false);
      
      // For now, we'll just use this as a placeholder
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full">
            <div class="text-sm font-medium mb-2">Visual Element Preview</div>
            <div class="text-xs text-gray-500">${visualUrl}</div>
          </div>
        `;
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [visualUrl]);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2">{title || 'Visual Element Preview'}</h3>
        <div 
          ref={containerRef} 
          className="w-full h-[200px] bg-black/10 rounded-md flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <p className="mt-2 text-sm">Loading visual element...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p>Error loading visual element:</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : !visualUrl ? (
            <p className="text-gray-500">No visual element selected</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default VisualElementPreviewer;
