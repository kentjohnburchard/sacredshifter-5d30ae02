
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Heart } from 'lucide-react';
import { getEarthRealmResonance } from '@/services/cosmicBlueprintService';
import EarthResonanceReflectionModal from './EarthResonanceReflectionModal';

interface EarthRealmResonancePanelProps {
  alignmentScore: number;
  className?: string;
}

const EarthRealmResonancePanel: React.FC<EarthRealmResonancePanelProps> = ({
  alignmentScore,
  className = ''
}) => {
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const resonanceText = getEarthRealmResonance();
  
  // Determine if the panel should be displayed more prominently
  const isLowAlignment = alignmentScore < 40;
  
  return (
    <>
      <Card 
        className={`border-pink-500/30 bg-black/50 backdrop-blur-md overflow-hidden transition-all duration-700 ${className} ${
          isLowAlignment ? 'border-pink-400/50 shadow-lg shadow-pink-500/20' : ''
        }`}
      >
        <div className="relative">
          {/* Background gradient */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-amber-500/30 opacity-60"
            style={{
              animation: isLowAlignment ? 'pulse 3s infinite alternate' : 'pulse 6s infinite alternate'
            }}
          />

          <CardContent className="p-5 relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-white/90">Earth Realm Resonance</h3>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-white/70 hover:text-white/90 transition-colors">
                      <Info size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px] bg-black/80 border-pink-500/30">
                    <p>A sacred reminder of your true nature and Earth's highest vibration.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-white/80 italic font-light leading-relaxed mb-4" 
               style={{
                 animation: 'textShimmer 3s infinite alternate',
                 textShadow: '0 0 10px rgba(255,255,255,0.3)'
               }}>
              {resonanceText}
            </p>
            
            {isLowAlignment && (
              <p className="text-white/70 text-sm mb-3">
                You are always held in love and light. This is a moment to realign.
              </p>
            )}
            
            <button
              onClick={() => setShowReflectionModal(true)}
              className="flex items-center gap-2 text-white/70 hover:text-pink-300 transition-all duration-300 text-sm group"
            >
              <Heart size={16} className="group-hover:text-pink-400 transition-colors" />
              <span className="group-hover:underline">Reflect</span>
            </button>
          </CardContent>
        </div>
      </Card>
      
      <EarthResonanceReflectionModal 
        open={showReflectionModal}
        onOpenChange={setShowReflectionModal}
      />
      
      {/* Add global styles for animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.5; }
            100% { opacity: 0.8; }
          }
          
          @keyframes textShimmer {
            0% { opacity: 0.8; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default EarthRealmResonancePanel;
