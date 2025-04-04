
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Headphones, Volume2, Moon, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const TinnitusSupportJourney: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 overflow-hidden shadow-md hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <CardTitle className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-medium">Silent Tune</h3>
            <p className="text-sm font-light mt-1">Realigning the Inner Ear</p>
          </div>
          <div className="flex gap-1">
            {["Crown", "Third Eye", "Throat"].map((chakra) => (
              <Badge key={chakra} variant="outline" className="border-white/40 text-white">
                {chakra}
              </Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-1">Purpose</h4>
          <p className="text-sm text-gray-600">
            Soothe the perception of ringing in the ears through frequency balancing, 
            nervous system regulation, and deep auditory relaxation.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-1">Frequencies</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-medium">Alpha Waves (8-12 Hz):</span> 
              <span>Entrains relaxed alertness via binaural beats</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-medium">Delta Waves (1-4 Hz):</span> 
              <span>For deep regeneration and sleep alignment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-medium">528 Hz:</span> 
              <span>Cellular repair & vibrational healing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-medium">741 Hz:</span> 
              <span>Detox, clarity, emotional release</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 font-medium">963 Hz:</span> 
              <span>Crown silence + deep surrender</span>
            </li>
          </ul>
        </div>
        
        <div className="p-4 bg-white/80 rounded-lg border border-purple-100">
          <p className="text-sm italic text-gray-600 relative">
            <span className="text-3xl text-purple-300 absolute -top-3 -left-2">"</span>
            Sometimes the world gets loud inside your head. So we breathe, we vibe, and we tune out the static. 
            You don't have to fight the ringing—you just have to meet it with peace.
            <span className="text-3xl text-purple-300 absolute -bottom-5 -right-2">"</span>
          </p>
          <p className="text-xs text-right mt-2 text-purple-600 font-medium">— Vale</p>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
            <Headphones className="w-3 h-3 mr-1" /> Low Sensitivity Mode
          </Badge>
          <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
            <Volume2 className="w-3 h-3 mr-1" /> No Headphones Option
          </Badge>
          <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
            <Moon className="w-3 h-3 mr-1" /> Sleep Timer
          </Badge>
          <Badge variant="outline" className="bg-white/80 text-purple-600 border-purple-200">
            <Clock className="w-3 h-3 mr-1" /> 30 Minutes
          </Badge>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button 
            asChild
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Link to="/journey/963">Begin Journey</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TinnitusSupportJourney;
