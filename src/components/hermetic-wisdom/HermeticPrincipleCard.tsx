
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HermeticPrincipleProps {
  title: string;
  description: string;
  iconSrc?: string;
  color?: string;
}

const HermeticPrincipleCard: React.FC<HermeticPrincipleProps> = ({
  title,
  description,
  iconSrc,
  color = 'purple'
}) => {
  // Define allowed colors and their corresponding CSS classes
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 border-purple-300 text-purple-800',
    blue: 'bg-blue-100 border-blue-300 text-blue-800',
    green: 'bg-green-100 border-green-300 text-green-800',
    amber: 'bg-amber-100 border-amber-300 text-amber-800',
    teal: 'bg-teal-100 border-teal-300 text-teal-800',
    indigo: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    red: 'bg-red-100 border-red-300 text-red-800'
  };

  // Default to purple if an invalid color is provided
  const cardColorClass = colorClasses[color] || colorClasses.purple;

  return (
    <Card className={`${cardColorClass} border shadow-sm hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          {iconSrc && (
            <img 
              src={iconSrc} 
              alt={`${title} icon`} 
              className="w-8 h-8"
            />
          )}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm opacity-90">{description}</p>
      </CardContent>
    </Card>
  );
};

export default HermeticPrincipleCard;
