
import React from "react";
import { HealingFrequency } from "@/data/frequencies";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CircleIcon, Sparkles, Clock, Music, Heart } from "lucide-react";
import FrequencyInfo from "@/components/FrequencyInfo";
import FrequencyMatchDisplay from "./FrequencyMatchDisplay";

interface InfoDialogContentProps {
  matchedFrequency: HealingFrequency | null;
  onBeginJourney: () => void;
  onClose: () => void;
}

const InfoDialogContent: React.FC<InfoDialogContentProps> = ({
  matchedFrequency,
  onBeginJourney,
  onClose
}) => {
  return (
    <Tabs defaultValue="guide" className="mt-4">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="guide">Frequency Guide</TabsTrigger>
        <TabsTrigger value="selected">Your Frequency</TabsTrigger>
        <TabsTrigger value="usage">How to Listen</TabsTrigger>
      </TabsList>
      
      <TabsContent value="guide" className="space-y-4">
        <p className="text-gray-700">
          Each frequency in this app is selected for its resonance with the body, mind, and subtle energy systems.
        </p>
        
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm">396 Hz</div>
            <div>
              <h4 className="font-medium">Liberation Tone</h4>
              <p className="text-sm text-gray-600">Releases fear, grounds the body (Root Chakra)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">417 Hz</div>
            <div>
              <h4 className="font-medium">Transformation Tone</h4>
              <p className="text-sm text-gray-600">Clears negativity, unlocks flow (Sacral Chakra)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 font-bold text-sm">528 Hz</div>
            <div>
              <h4 className="font-medium">Love Frequency</h4>
              <p className="text-sm text-gray-600">Transformation, DNA repair, love (Solar Plexus Chakra)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-bold text-sm">639 Hz</div>
            <div>
              <h4 className="font-medium">Connection Frequency</h4>
              <p className="text-sm text-gray-600">Heart healing, relationship energy (Heart Chakra)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm">741 Hz</div>
            <div>
              <h4 className="font-medium">Expression Frequency</h4>
              <p className="text-sm text-gray-600">Detox, inner truth (Throat Chakra)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">852 Hz</div>
            <div>
              <h4 className="font-medium">Spiritual Doorway</h4>
              <p className="text-sm text-gray-600">Awakens intuition (Third Eye Chakra)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 rounded-lg bg-white shadow-sm">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-sm">963 Hz</div>
            <div>
              <h4 className="font-medium">Divine Frequency</h4>
              <p className="text-sm text-gray-600">Divine connection, unity (Crown Chakra)</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-700 mt-4">
          You'll be guided to the best frequency for your state, but you're always welcome to explore freely.
        </p>
      </TabsContent>
      
      <TabsContent value="selected" className="space-y-4">
        {matchedFrequency ? (
          <div className="space-y-4">
            <FrequencyMatchDisplay frequency={matchedFrequency} />
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700">{matchedFrequency.description}</p>
            </div>
            
            {matchedFrequency.benefits && matchedFrequency.benefits.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium mb-2 text-gray-800">Benefits</h4>
                <ul className="space-y-1">
                  {matchedFrequency.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <Sparkles className="h-4 w-4 mr-2 text-purple-500 mt-1" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CircleIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Complete the journey to see your recommended frequency.</p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="usage" className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2 text-gray-800 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-500" />
            Recommended Listening Duration
          </h4>
          <p className="text-gray-700">
            For optimal benefits, we recommend listening to frequency tones for 5-15 minutes daily. For deep healing sessions, 20-30 minutes can be more effective.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2 text-gray-800 flex items-center">
            <Music className="h-4 w-4 mr-2 text-purple-500" />
            Creating the Perfect Environment
          </h4>
          <p className="text-gray-700">
            Find a quiet space where you won't be disturbed. Use headphones for the best experience, as they allow the frequencies to resonate fully with your energy field.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="font-medium mb-2 text-gray-800 flex items-center">
            <Heart className="h-4 w-4 mr-2 text-purple-500" />
            Setting Intentions
          </h4>
          <p className="text-gray-700">
            Before each session, take a moment to set an intention. This creates a resonant field between your consciousness and the frequency, amplifying its effects.
          </p>
        </div>
        
        <div className="text-center mt-4">
          <Button 
            onClick={() => {
              onClose();
              onBeginJourney();
            }}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            Begin My Journey
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InfoDialogContent;
