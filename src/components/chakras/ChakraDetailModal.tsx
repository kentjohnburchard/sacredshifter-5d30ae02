
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChakraData } from '@/types/chakras';
import { Badge } from '@/components/ui/badge';
import ChakraTonePlayer from '@/components/chakras/ChakraTonePlayer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatChakraName } from '@/utils/formatters';

interface ChakraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  chakra: ChakraData | null;
}

const ChakraDetailModal: React.FC<ChakraDetailModalProps> = ({
  isOpen,
  onClose,
  chakra
}) => {
  const navigate = useNavigate();
  
  if (!chakra) return null;

  const getChakraColor = () => {
    switch (chakra.name.toLowerCase()) {
      case 'root': return 'bg-red-500';
      case 'sacral': return 'bg-orange-500';
      case 'solar plexus': return 'bg-yellow-500';
      case 'heart': return 'bg-green-500';
      case 'throat': return 'bg-blue-500';
      case 'third eye': return 'bg-indigo-500';
      case 'crown': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getTextColor = () => {
    switch (chakra.name.toLowerCase()) {
      case 'root': return 'text-red-500';
      case 'sacral': return 'text-orange-500';
      case 'solar plexus': return 'text-yellow-500';
      case 'heart': return 'text-green-500';
      case 'throat': return 'text-blue-500';
      case 'third eye': return 'text-indigo-500';
      case 'crown': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getBgColor = () => {
    switch (chakra.name.toLowerCase()) {
      case 'root': return 'bg-red-50';
      case 'sacral': return 'bg-orange-50';
      case 'solar plexus': return 'bg-yellow-50';
      case 'heart': return 'bg-green-50';
      case 'throat': return 'bg-blue-50';
      case 'third eye': return 'bg-indigo-50';
      case 'crown': return 'bg-purple-50';
      default: return 'bg-gray-50';
    }
  };

  const handleJourneyClick = () => {
    navigate(`/journey/${chakra.name.toLowerCase()}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center">
            <div className={`h-4 w-4 rounded-full ${getChakraColor()} mr-2`}></div>
            <DialogTitle className="text-xl">{formatChakraName(chakra.name)}</DialogTitle>
          </div>
          <DialogDescription className={`${getTextColor()} font-medium`}>
            {chakra.sanskritName} - {chakra.frequency}Hz
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div>
            <h3 className="font-medium mb-1 text-gray-700">Description</h3>
            <p className="text-sm text-gray-600">{chakra.description}</p>
          </div>
          
          <div className={`p-4 rounded-lg ${getBgColor()}`}>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className={getTextColor()}>
                Element: {chakra.element}
              </Badge>
              <Badge variant="outline" className={getTextColor()}>
                Location: {chakra.location}
              </Badge>
            </div>
            
            {chakra.associations && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Associations:</span> {chakra.associations}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2 text-gray-700">Experience the Sound</h3>
            <ChakraTonePlayer 
              baseFrequency={chakra.frequency} 
              chakra={chakra.name} 
              chakraColor={chakra.color || '#6E59A5'}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500 italic">
              "Sound is the medicine of the future." - Edgar Cayce
            </p>
            <Button 
              onClick={handleJourneyClick}
              className={`${getChakraColor()} hover:opacity-90`}
            >
              Start Journey <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChakraDetailModal;
