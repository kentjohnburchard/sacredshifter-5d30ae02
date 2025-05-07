
import React from 'react';
import { ExplanationCard } from './ExplanationCard';
import { sectionExplanations, SectionKey } from './SectionExplanations';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/context/ThemeContext';
import { Sparkles } from 'lucide-react';

export const ExplanationShowcase = () => {
  const { liftTheVeil, toggleVeil } = useTheme();
  
  // Get all section keys
  const sections = Object.keys(sectionExplanations) as SectionKey[];
  
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Section Explanations
        </h2>
        
        <Button 
          onClick={() => toggleVeil()}
          variant="outline" 
          size="sm"
          className={`flex items-center gap-2 ${liftTheVeil ? 'border-pink-200 text-pink-700' : 'border-purple-200 text-purple-700'}`}
        >
          <Sparkles className={`h-4 w-4 ${liftTheVeil ? 'text-pink-500' : 'text-purple-500'}`} />
          {liftTheVeil ? 'Switch to Standard Mode' : 'Switch to Lift The Veil Mode'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => (
          <ExplanationCard key={section} section={section} />
        ))}
      </div>
    </div>
  );
};

export default ExplanationShowcase;
