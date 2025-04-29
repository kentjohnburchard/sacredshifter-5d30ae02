import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "@/utils/profiles";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { OnboardingData, convertOnboardingDataToProfile } from "@/types/supabaseCustomTypes";

const moods = [
  { value: "peaceful", label: "Peaceful", color: "bg-blue-100 border-blue-300" },
  { value: "joyful", label: "Joyful", color: "bg-yellow-100 border-yellow-300" },
  { value: "anxious", label: "Anxious", color: "bg-orange-100 border-orange-300" },
  { value: "stressed", label: "Stressed", color: "bg-red-100 border-red-300" },
  { value: "tired", label: "Tired", color: "bg-gray-100 border-gray-300" },
  { value: "curious", label: "Curious", color: "bg-purple-100 border-purple-300" },
  { value: "grateful", label: "Grateful", color: "bg-green-100 border-green-300" },
  { value: "inspired", label: "Inspired", color: "bg-indigo-100 border-indigo-300" },
];

const intentions = [
  "Healing", "Relaxation", "Manifestation", "Creativity", 
  "Focus", "Sleep", "Meditation", "Energy", "Stress Relief"
];

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const [intention, setIntention] = useState("");
  const [customIntention, setCustomIntention] = useState("");
  const [energyLevel, setEnergyLevel] = useState([50]);
  const [interests, setInterests] = useState<string[]>([]);
  
  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error("Please enter your name to continue");
      return;
    }
    
    if (step === 2 && !mood) {
      toast.error("Please select your current mood to continue");
      return;
    }
    
    if (step === 3 && !intention && !customIntention.trim()) {
      toast.error("Please select or enter an intention to continue");
      return;
    }
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = async () => {
    if (!user) {
      toast.error("You must be logged in to complete onboarding");
      navigate("/auth");
      return;
    }
    
    setLoading(true);
    
    try {
      const onboardingData: OnboardingData = {
        displayName: name,
        pathChoices: interests,
        sacredBio: customIntention || intention,
        onboardingComplete: true
      };
      
      const profileUpdates = convertOnboardingDataToProfile(user.id, onboardingData);
      
      await updateProfile(user.id, {
        display_name: name,
        initial_mood: mood,
        primary_intention: intention || customIntention,
        energy_level: energyLevel[0],
        interests: interests,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
      
      const { error: journalError } = await supabase
        .from('timeline_snapshots')
        .insert([
          {
            user_id: user.id,
            title: "My Sacred Shifter Journey Begins",
            notes: `Today I began my journey with Sacred Shifter. I was feeling ${mood} and set an intention for ${intention || customIntention}.`,
            tag: "Onboarding",
          }
        ]);
      
      if (journalError) throw journalError;
      
      toast.success("Welcome to Sacred Shifter! Your journey begins now.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error completing onboarding:", error.message);
      toast.error("There was an error saving your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleInterestToggle = (value: string) => {
    setInterests(
      interests.includes(value)
        ? interests.filter((interest) => interest !== value)
        : [...interests, value]
    );
  };
  
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to complete the onboarding process
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => navigate("/auth")}
              className="w-full"
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-purple-950">
      <Card className="w-full max-w-lg shadow-xl border border-purple-100 dark:border-purple-900/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome to Sacred Shifter
          </CardTitle>
          <CardDescription>
            Let's personalize your spiritual journey (Step {step} of 5)
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <motion.div
              key="step1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Hello, Soul Traveler!</h3>
                <p className="text-sm text-muted-foreground">
                  We're excited to join you on your spiritual journey.
                  Let's start with your name.
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-center text-lg"
                />
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">How are you feeling today, {name}?</h3>
                <p className="text-sm text-muted-foreground">
                  Your current emotional state helps us tailor your experience.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {moods.map((item) => (
                  <div
                    key={item.value}
                    className={`
                      border rounded-lg p-3 text-center cursor-pointer transition-all
                      ${mood === item.value ? 
                        `${item.color} ring-2 ring-offset-2 ring-purple-500` : 
                        'bg-white/50 hover:bg-white/80 dark:bg-gray-800/50 dark:hover:bg-gray-800/80'}
                    `}
                    onClick={() => setMood(item.value)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Set Your Intention</h3>
                <p className="text-sm text-muted-foreground">
                  What would you like to focus on during your sound journey?
                </p>
              </div>
              
              <RadioGroup 
                value={intention} 
                onValueChange={setIntention}
                className="grid grid-cols-3 gap-3"
              >
                {intentions.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <RadioGroupItem value={item} id={item} className="peer sr-only" />
                    <Label
                      htmlFor={item}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white/50 dark:bg-gray-800/50 p-3 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-purple-200 dark:hover:border-purple-900 [&:has([data-state=checked])]:border-purple-500 [&:has([data-state=checked])]:bg-purple-50 dark:[&:has([data-state=checked])]:bg-purple-900/20"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="space-y-3 pt-3">
                <Label htmlFor="custom-intention">Or enter your own intention:</Label>
                <Input
                  id="custom-intention"
                  placeholder="Custom intention..."
                  value={customIntention}
                  onChange={(e) => {
                    setCustomIntention(e.target.value);
                    if (e.target.value) setIntention("");
                  }}
                />
              </div>
            </motion.div>
          )}
          
          {step === 4 && (
            <motion.div
              key="step4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Your Energy Level</h3>
                <p className="text-sm text-muted-foreground">
                  How would you rate your current energy?
                </p>
              </div>
              
              <div className="space-y-6 py-4">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Energy</span>
                  <span>High Energy</span>
                </div>
                <Slider
                  value={energyLevel}
                  onValueChange={setEnergyLevel}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="text-center text-lg font-medium">
                  {energyLevel[0]}%
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 5 && (
            <motion.div
              key="step5"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium">Your Interests</h3>
                <p className="text-sm text-muted-foreground">
                  Select areas that interest you for personalized recommendations.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Meditation", "Sound Healing", "Chakra Balancing", 
                  "Energy Work", "Manifestation", "Astrology",
                  "Mindfulness", "Spiritual Growth", "Lucid Dreaming",
                  "Breathwork"
                ].map((interest) => (
                  <div key={interest} className="flex items-start space-x-2">
                    <Checkbox
                      id={`interest-${interest}`}
                      checked={interests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label htmlFor={`interest-${interest}`} className="cursor-pointer">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <p className="text-sm text-center text-muted-foreground">
                  This information helps us create a more personalized experience for you.
                  You can always update your preferences later.
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={step === 1 || loading}
          >
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            {loading ? "Processing..." : step === 5 ? "Complete" : "Continue"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Onboarding;
