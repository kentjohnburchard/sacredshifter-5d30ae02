
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const emotions = [
  { id: "calm", label: "Calm", color: "bg-blue-100 text-blue-700", icon: "😌" },
  { id: "joy", label: "Joy", color: "bg-yellow-100 text-yellow-700", icon: "😊" },
  { id: "peace", label: "Peace", color: "bg-green-100 text-green-700", icon: "😇" },
  { id: "love", label: "Love", color: "bg-pink-100 text-pink-700", icon: "❤️" },
  { id: "anxiety", label: "Anxiety", color: "bg-orange-100 text-orange-700", icon: "😰" },
  { id: "stress", label: "Stress", color: "bg-red-100 text-red-700", icon: "😣" },
  { id: "fatigue", label: "Fatigue", color: "bg-gray-100 text-gray-700", icon: "😪" },
  { id: "confusion", label: "Confusion", color: "bg-purple-100 text-purple-700", icon: "🤔" },
  { id: "creative", label: "Creative", color: "bg-indigo-100 text-indigo-700", icon: "✨" }
];

const energyLevels = [
  { id: "very-low", label: "Very Low", value: 1 },
  { id: "low", label: "Low", value: 2 },
  { id: "moderate", label: "Moderate", value: 3 },
  { id: "high", label: "High", value: 4 },
  { id: "very-high", label: "Very High", value: 5 }
];

const MoodCheckSection: React.FC = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number | null>(null);

  const toggleEmotion = (emotionId: string) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId));
    } else {
      if (selectedEmotions.length < 3) {
        setSelectedEmotions([...selectedEmotions, emotionId]);
      } else {
        toast.info("You can select up to 3 emotions");
      }
    }
  };

  const handleSubmit = () => {
    if (selectedEmotions.length === 0 || energyLevel === null) {
      toast.error("Please select at least one emotion and your energy level");
      return;
    }
    
    toast.success("Your energy check has been recorded");
    // Here we would save the data or recommend frequencies
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
              Energy Check-In
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Check in with your current energetic state. 
            We'll recommend the perfect sound frequencies to harmonize your energy.
          </p>
        </div>
        
        <Card className="border border-gray-200 shadow-sm overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">How are you feeling right now?</h3>
                <p className="text-sm text-gray-500 mb-4">Select up to 3 emotions that describe your current state</p>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleEmotion(emotion.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                        selectedEmotions.includes(emotion.id)
                          ? `${emotion.color} border-current`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{emotion.icon}</span>
                      <span className="text-xs font-medium">{emotion.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">What is your energy level?</h3>
                <div className="flex flex-wrap justify-between items-center gap-2">
                  {energyLevels.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEnergyLevel(level.value)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        energyLevel === level.value
                          ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 text-center">
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                  size="lg"
                >
                  Get Recommendations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MoodCheckSection;
