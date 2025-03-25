import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Play, PauseCircle, Clock, BookOpen } from "lucide-react";
import { JourneyTemplate, getTemplateByFrequency } from "@/data/journeyTemplates";
import { HealingFrequency, healingFrequencies } from "@/data/frequencies";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import JournalEntryForm from "@/components/frequency-shift/JournalEntryForm";
import { toast } from "sonner";

const JourneyPlayer = () => {
  const { frequencyId } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<JourneyTemplate | null>(null);
  const [frequency, setFrequency] = useState<HealingFrequency | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [sessionDuration, setSessionDuration] = useState<number>(5); // minutes
  const [elapsedTime, setElapsedTime] = useState<number>(0); // seconds
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Find matching template and frequency data
  useEffect(() => {
    if (frequencyId) {
      // Try to parse as number first (for direct frequency value)
      const freqValue = parseInt(frequencyId);
      
      if (!isNaN(freqValue)) {
        const matchedTemplate = getTemplateByFrequency(freqValue);
        const matchedFrequency = healingFrequencies.find(f => f.frequency === freqValue);
        
        if (matchedTemplate) setTemplate(matchedTemplate);
        if (matchedFrequency) setFrequency(matchedFrequency);
      } 
      // Otherwise look for ID-based match
      else {
        const matchedFrequency = healingFrequencies.find(f => f.id === frequencyId);
        if (matchedFrequency) {
          setFrequency(matchedFrequency);
          const matchedTemplate = getTemplateByFrequency(matchedFrequency.frequency);
          if (matchedTemplate) setTemplate(matchedTemplate);
        }
      }
    }
  }, [frequencyId]);

  // Handle Play/Pause
  const togglePlayPause = () => {
    if (isPlaying) {
      // Pause the session
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setIsPlaying(false);
    } else {
      // Start the session
      const interval = setInterval(() => {
        setElapsedTime(prev => {
          // Check if session time is up
          if (prev >= sessionDuration * 60 - 1) {
            clearInterval(interval);
            setIsPlaying(false);
            setShowJournal(true);
            toast.success("Your frequency journey is complete");
            return sessionDuration * 60;
          }
          return prev + 1;
        });
      }, 1000) as unknown as number;
      
      setTimerInterval(interval);
      setIsPlaying(true);
      toast.success(`Beginning your ${frequency?.frequency}Hz journey`);
    }
  };

  // Format time display
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Calculate progress percentage
  const progressPercentage = () => {
    if (sessionDuration <= 0) return 0;
    return (elapsedTime / (sessionDuration * 60)) * 100;
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const handleJournalSaved = () => {
    setShowJournal(false);
    toast.success("Your reflection has been saved to your timeline");
  };

  const handleSetDuration = (minutes: number) => {
    setSessionDuration(minutes);
    toast.success(`Session duration set to ${minutes} minutes`);
  };

  if (!template || !frequency) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-medium mb-4">Frequency not found</h2>
              <p className="text-gray-600 mb-4">Sorry, we couldn't find the frequency journey you're looking for.</p>
              <Button onClick={() => navigate("/journey-templates")}>
                Browse Journey Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant={sessionDuration === 5 ? "default" : "outline"}
              size="sm"
              onClick={() => handleSetDuration(5)}
              className={sessionDuration === 5 ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              5 min
            </Button>
            <Button 
              variant={sessionDuration === 10 ? "default" : "outline"}
              size="sm"
              onClick={() => handleSetDuration(10)}
              className={sessionDuration === 10 ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              10 min
            </Button>
            <Button 
              variant={sessionDuration === 15 ? "default" : "outline"}
              size="sm"
              onClick={() => handleSetDuration(15)}
              className={sessionDuration === 15 ? "bg-purple-500 hover:bg-purple-600" : ""}
            >
              15 min
            </Button>
          </div>
        </div>
        
        <Card className="mb-6 overflow-hidden border border-gray-200">
          <div className={`h-3 bg-gradient-to-r ${template.color}`}></div>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{template.emoji}</span>
                  <h1 className="text-3xl font-light">
                    <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                      {template.name}
                    </span>
                  </h1>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{frequency.frequency}Hz · {template.chakra} Chakra</h3>
                    <p className="text-gray-600">{template.vibe}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2">Today's Affirmation</h3>
                    <p className="text-gray-700 italic text-lg">"{template.affirmation}"</p>
                  </div>
                  
                  {!isPlaying && !showJournal && (
                    <div className="mt-4">
                      <Button 
                        onClick={togglePlayPause} 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 w-full py-6 text-lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Begin {sessionDuration}-Minute Journey
                      </Button>
                    </div>
                  )}
                  
                  {isPlaying && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span className="text-purple-700 font-medium">
                            {formatTime(elapsedTime)} / {sessionDuration}:00
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={togglePlayPause}
                        >
                          <PauseCircle className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${progressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <FrequencyPlayer frequency={frequency} autoPlay={isPlaying} />
                
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-purple-800">Session Guidance</h3>
                      <p className="text-purple-700 mt-1">{template.sessionType}</p>
                      <p className="text-purple-700 mt-2">Visual: {template.visualTheme}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {showJournal && (
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <JournalEntryForm 
                frequency={frequency.frequency}
                chakra={template.chakra}
                visualType={template.visualTheme}
                intention={template.affirmation}
                onSaved={handleJournalSaved}
                onCancel={() => setShowJournal(false)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default JourneyPlayer;
