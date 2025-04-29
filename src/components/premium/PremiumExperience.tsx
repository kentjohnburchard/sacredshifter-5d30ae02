
import React, { useState } from 'react';
import { usePremium } from '@/hooks/usePremium';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Heart } from 'lucide-react';

interface ExperienceProps {
  experienceId: string;
}

const PremiumExperience: React.FC<ExperienceProps> = ({ experienceId }) => {
  const { getExperienceById } = usePremium();
  const [isPlaying, setIsPlaying] = useState(false);
  const experience = getExperienceById(experienceId);
  
  if (!experience) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-glow-pink mb-4">Sacred Experience Not Found</h2>
        <p className="text-gray-300">This experience may be in another dimension.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-glow-pink mb-2">{experience.title}</h1>
        <p className="text-white/80">{experience.description}</p>
      </div>
      
      <Card className="mb-8 overflow-hidden veil-mode ethereal-card">
        <div className="relative">
          <div 
            className="h-64 w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${experience.imageUrl})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-16 h-16 rounded-full bg-pink-600/80 flex items-center justify-center"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 text-white" />
              ) : (
                <Play className="h-8 w-8 text-white ml-1" />
              )}
            </button>
          </div>
          <div className="absolute bottom-4 right-4">
            <button className="p-2 rounded-full bg-black/50 hover:bg-pink-900/50 transition">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-glow-pink mb-2">Sacred Journey Guide</h3>
              <p className="text-sm">{experience.guide}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-glow-pink mb-2">Ritual Preparation</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {experience.preparation.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-glow-pink mb-2">Energy Frequencies</h3>
              <div className="flex flex-wrap gap-2">
                {experience.frequencies.map((freq, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 rounded-full bg-pink-900/30 text-sm border border-pink-500/20"
                  >
                    {freq} Hz
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumExperience;
