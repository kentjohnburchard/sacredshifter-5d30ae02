
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { JourneyTemplate } from "@/data/journeyTemplates";

interface JourneyTemplateCardProps {
  template: JourneyTemplate;
}

const JourneyTemplateCard: React.FC<JourneyTemplateCardProps> = ({ template }) => {
  // Extract the first frequency value to use in the link
  const firstFrequencyValue = template.frequencies[0]?.value.split(' ')[0] || '';
  
  return (
    <Card 
      className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 overflow-hidden shadow-md hover:shadow-lg transition-all"
      style={{ borderTopColor: template.color || '#6b46c1' }}
    >
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium">
              {template.emoji && `${template.emoji} `}{template.title}
            </h3>
            <p className="text-sm font-light mt-1">{template.subtitle}</p>
          </div>
          <div className="flex gap-1">
            {template.chakras?.map((chakra) => (
              <Badge key={chakra} variant="outline" className="border-white/40 text-white">
                {chakra}
              </Badge>
            ))}
            {template.vibe && (
              <Badge variant="outline" className="border-white/40 text-white">
                {template.vibe}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-1">Purpose</h4>
          <p className="text-sm text-gray-600">
            {template.purpose}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-1">Frequencies</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {template.frequencies.map((freq, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500 font-medium">{freq.name} ({freq.value}):</span> 
                <span>{freq.description}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 bg-white/80 rounded-lg border border-purple-100">
          <p className="text-sm italic text-gray-600 relative">
            <span className="text-3xl text-purple-300 absolute -top-3 -left-2">"</span>
            {template.valeQuote.replace("Vale", "Kent")}
            <span className="text-3xl text-purple-300 absolute -bottom-5 -right-2">"</span>
          </p>
          <p className="text-xs text-right mt-2 text-purple-600 font-medium">— Kent</p>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            asChild
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Link to={`/journey/${firstFrequencyValue}`}>
              Begin Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyTemplateCard;
