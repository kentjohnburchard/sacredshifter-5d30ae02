
import React from 'react';
import { Journey } from '@/types/journey';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Eye, FileText } from 'lucide-react';

interface JourneyCardProps {
  journey: Journey;
  onEdit: (journey: Journey) => void;
  onView: (slug: string) => void;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ journey, onEdit, onView }) => {
  const { title, filename, tags, veil_locked, source, isEditable } = journey;
  
  const isCoreJourney = source === 'core';
  const isDatabaseJourney = source === 'database';
  
  // Define border styles based on source
  const borderStyle = isCoreJourney 
    ? 'border-blue-300 hover:border-blue-400' 
    : 'border-green-300 hover:border-green-400';
  
  // Function to safely handle tags that could be string or string[]
  const getTagsArray = (): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags.split(',').map(tag => tag.trim());
  };
  
  return (
    <Card className={`mb-4 border-2 ${borderStyle} transition-all duration-200`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-lg">{title}</h3>
              {source && (
                <Badge variant={isCoreJourney ? "outline" : "default"} className={isCoreJourney ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}>
                  {isCoreJourney ? (
                    <><FileText className="h-3 w-3 mr-1" /> Core</>
                  ) : (
                    <>Database</>
                  )}
                </Badge>
              )}
              {isCoreJourney && <Badge variant="outline" className="bg-gray-50 text-gray-700">Read-only</Badge>}
              {isDatabaseJourney && <Badge variant="outline" className="bg-green-50 text-green-700">Editable</Badge>}
            </div>
            <div className="text-sm text-gray-600 mb-2">Filename: {filename}</div>
            {tags && (
              <div className="flex flex-wrap gap-1 mb-2">
                {getTagsArray().map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-sm mt-1">
              {veil_locked ? 'Veil Locked: Yes' : 'Veil Locked: No'}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-0 pb-4">
        {isEditable && (
          <Button 
            size="sm" 
            variant="default" 
            onClick={() => onEdit(journey)}
            className="bg-purple-600 hover:bg-purple-700 shadow-md"
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onView(filename)}
          className="border-purple-300 hover:bg-purple-100"
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JourneyCard;
