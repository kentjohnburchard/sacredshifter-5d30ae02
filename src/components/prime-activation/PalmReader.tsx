
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Circle } from 'lucide-react';

interface PalmReaderProps {
  onComplete: (profile: any) => void;
}

const PalmReader: React.FC<PalmReaderProps> = ({ onComplete }) => {
  const [leftPalmImage, setLeftPalmImage] = useState<string | null>(null);
  const [rightPalmImage, setRightPalmImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [hasM, setHasM] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });
  
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);

  const handleLeftPalmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLeftPalmImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRightPalmUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRightPalmImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeHands = () => {
    setAnalyzing(true);
    
    // Simulate analysis with timeout
    setTimeout(() => {
      // In a real app, this would use image processing to detect palm lines
      // For demo purposes, we're simulating the detection
      setHasM({ left: true, right: false });
      
      const mockProfile = {
        leftPalmReading: {
          soulBlueprint: "The Visionary Guide",
          dominantLines: ["Heart", "Head", "Life"],
          primeNumbers: [17, 13],
          energeticFrequencies: [272, 528],
          chakraAlignment: "Third Eye & Heart"
        },
        rightPalmReading: {
          currentPath: "The Transformative Creator",
          dominantLines: ["Life", "Fate", "Sun"],
          primeNumbers: [19, 7],
          energeticFrequencies: [304, 639],
          chakraAlignment: "Solar Plexus & Throat" 
        },
        transition: {
          status: "Shifting",
          from: "Observer state to Leader state",
          recommendedFrequency: 304,
          affirmation: "I claim my path. I lead with truth."
        }
      };
      
      setAnalyzing(false);
      onComplete(mockProfile);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-playfair mb-2 text-amber-200">Palm Reading Analysis</h2>
        <p className="text-purple-100">Upload images of your left and right palms to begin your vibrational analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Palm Upload */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg mb-2 text-blue-300">Left Palm <span className="text-xs">(Soul Blueprint)</span></h3>
          
          {leftPalmImage ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={leftPalmImage} 
                alt="Left palm" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with palm lines */}
              <svg 
                className="absolute top-0 left-0 w-full h-full" 
                viewBox="0 0 300 400"
              >
                {/* Simplified palm line SVG paths */}
                <path d="M100,100 Q150,160 150,300" stroke="#7dd3fc" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M80,100 Q130,140 180,280" stroke="#a5f3fc" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M150,100 Q170,150 190,300" stroke="#e0f2fe" strokeWidth="2" fill="none" opacity="0.7" />
                
                {/* M shape highlight if detected */}
                {hasM.left && (
                  <path 
                    d="M120,150 L140,120 L160,150 L180,120" 
                    stroke="#fcd34d" 
                    strokeWidth="3" 
                    fill="none" 
                    opacity="0.8"
                    strokeDasharray="5,5"
                  />
                )}
              </svg>
            </div>
          ) : (
            <div 
              className="w-full h-64 rounded-lg border-2 border-dashed border-purple-400 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors"
              onClick={() => leftInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="h-10 w-10 mx-auto text-purple-300" />
                <p className="mt-2 text-sm text-purple-200">Click to upload left palm</p>
              </div>
              <input
                ref={leftInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLeftPalmUpload}
              />
            </div>
          )}
          
          {leftPalmImage && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => leftInputRef.current?.click()}
            >
              Change Image
            </Button>
          )}
        </div>
        
        {/* Right Palm Upload */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg mb-2 text-indigo-300">Right Palm <span className="text-xs">(Current Path)</span></h3>
          
          {rightPalmImage ? (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <img 
                src={rightPalmImage} 
                alt="Right palm" 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with palm lines */}
              <svg 
                className="absolute top-0 left-0 w-full h-full" 
                viewBox="0 0 300 400"
              >
                {/* Simplified palm line SVG paths */}
                <path d="M100,100 Q150,160 150,300" stroke="#c4b5fd" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M80,100 Q130,140 180,280" stroke="#ddd6fe" strokeWidth="2" fill="none" opacity="0.7" />
                <path d="M150,100 Q170,150 190,300" stroke="#ede9fe" strokeWidth="2" fill="none" opacity="0.7" />
                
                {/* M shape highlight if detected */}
                {hasM.right && (
                  <path 
                    d="M120,150 L140,120 L160,150 L180,120" 
                    stroke="#fcd34d" 
                    strokeWidth="3" 
                    fill="none" 
                    opacity="0.8"
                    strokeDasharray="5,5"
                  />
                )}
              </svg>
            </div>
          ) : (
            <div 
              className="w-full h-64 rounded-lg border-2 border-dashed border-purple-400 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors"
              onClick={() => rightInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="h-10 w-10 mx-auto text-purple-300" />
                <p className="mt-2 text-sm text-purple-200">Click to upload right palm</p>
              </div>
              <input
                ref={rightInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleRightPalmUpload}
              />
            </div>
          )}
          
          {rightPalmImage && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => rightInputRef.current?.click()}
            >
              Change Image
            </Button>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={analyzeHands}
          disabled={!leftPalmImage || !rightPalmImage || analyzing}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-2 rounded-full"
        >
          {analyzing ? (
            <>
              <Circle className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Palm Lines...
            </>
          ) : (
            'Analyze & Detect Vibrational Pattern'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PalmReader;
