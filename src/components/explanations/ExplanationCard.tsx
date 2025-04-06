
import React from 'react';
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import SectionExplanation, { SectionKey } from './SectionExplanations';
import { useTheme } from '@/context/ThemeContext';
import { getExplanationTitle } from './SectionExplanations';
import { Sparkles } from 'lucide-react';

type ExplanationCardProps = {
  section: SectionKey;
  className?: string;
  showIcon?: boolean;
};

const ExplanationCard: React.FC<ExplanationCardProps> = ({ 
  section, 
  className = "", 
  showIcon = true 
}) => {
  const { kentMode } = useTheme();
  
  return (
    <Card className={`border-purple-100 hover:border-purple-200 transition-all shadow-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          {showIcon && (
            <Sparkles 
              className={`mr-2 h-4 w-4 ${kentMode ? 'text-pink-500' : 'text-purple-500'}`} 
            />
          )}
          <h3 className={`font-medium text-lg ${kentMode ? 'text-pink-700' : 'text-purple-700'}`}>
            {getExplanationTitle(section)}
          </h3>
        </div>
        
        <CardDescription className="text-base">
          <SectionExplanation section={section} />
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ExplanationCard;
