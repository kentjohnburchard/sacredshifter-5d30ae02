
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Info } from "lucide-react";
import { HermeticWisdomDrop } from "@/components/hermetic-wisdom";

interface HermeticPrincipleCardProps {
  id: string;
  title: string;
  quote: string;
  description: string;
  affirmation: string;
  frequency: number;
  frequencyName: string;
  animation: string;
  color: string;
  tag: string;
  icon: React.ElementType;
  onClick: () => void;
}

const HermeticPrincipleCard: React.FC<HermeticPrincipleCardProps> = ({
  id,
  title,
  quote,
  description,
  affirmation,
  frequency,
  frequencyName,
  animation,
  color,
  tag,
  icon: Icon,
  onClick
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card className="h-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className={`h-3 bg-gradient-to-r ${color}`}></div>
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-r ${color} bg-opacity-10`}>
                <Icon className="h-6 w-6 text-gray-700" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-gray-800">{title}</h3>
            </div>
            <HermeticWisdomDrop 
              principle={title} 
              variant="dialog"
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-full"
              >
                <Info className="h-4 w-4" />
                <span className="sr-only">Kent's Wisdom</span>
              </Button>
            </HermeticWisdomDrop>
          </div>
          
          <p className="font-playfair italic text-gray-600 mb-3">"{quote}"</p>
          <p className="text-gray-700 mb-3">{description}</p>
          
          <div className="mt-auto space-y-3">
            <div className="text-sm text-gray-600">
              <Badge variant="outline" className="mb-1 mr-2">
                {frequencyName} ({frequency}Hz)
              </Badge>
              <span className="font-medium">Affirmation:</span> {affirmation}
            </div>
            
            <Button
              onClick={onClick}
              className={`w-full bg-gradient-to-r ${color} text-white hover:opacity-90`}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Explore {title}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HermeticPrincipleCard;
