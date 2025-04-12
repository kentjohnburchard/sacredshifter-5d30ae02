
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Brain, Sparkles, ZoomIn, Bell } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

const Focus: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [focusLevel, setFocusLevel] = useState(50);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  
  const focusSessions = [
    { 
      id: "deep-work", 
      name: "Deep Work", 
      duration: "25 min", 
      description: "Enhanced cognitive focus for complex mental tasks",
      frequency: "40 Hz - Gamma" 
    },
    { 
      id: "flow-state", 
      name: "Flow State", 
      duration: "45 min", 
      description: "Effortless concentration and creativity enhancement",
      frequency: "10 Hz - Alpha" 
    },
    { 
      id: "meditation", 
      name: "Meditation Focus", 
      duration: "15 min", 
      description: "Calming mind focus for spiritual awareness",
      frequency: "7 Hz - Theta" 
    },
  ];
  
  const handleStartSession = (sessionId: string) => {
    setActiveSession(sessionId);
    toast.success(`${focusSessions.find(s => s.id === sessionId)?.name} session activated`, {
      description: "Focus enhancement frequencies are now active"
    });
  };
  
  return (
    <Layout pageTitle="Focus" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          {liftTheVeil ? <Sparkles className="text-pink-500" /> : <Brain className="text-indigo-500" />}
          Focus Enhancement
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
              <p className="mb-4">
                The Focus Enhancement center provides tools and frequencies designed to sharpen your mental clarity, 
                improve concentration, and elevate your cognitive abilities through brainwave entrainment.
              </p>
              
              {liftTheVeil ? (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="p-4 bg-pink-900/30 border border-pink-500/30 rounded-lg italic text-pink-200"
                >
                  With the veil lifted, you can access higher dimensions of cognitive function, allowing your 
                  awareness to transcend ordinary limitations. The sacred geometry of thought becomes visible 
                  as patterns of interconnected consciousness.
                </motion.p>
              ) : (
                <p className="p-4 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  Focus is a state of concentrated attention that can be enhanced through specific frequency 
                  entrainment. Different brainwave states correspond to different levels of awareness and mental activity.
                </p>
              )}
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Focus Intensity</h2>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  liftTheVeil ? 'bg-pink-900/40 text-pink-300' : 'bg-indigo-900/40 text-indigo-300'
                }`}>
                  {focusLevel}%
                </span>
              </div>
              
              <Slider 
                value={[focusLevel]} 
                onValueChange={(value) => setFocusLevel(value[0])}
                max={100}
                step={1}
                className={`${liftTheVeil ? '[&_[data-orientation=horizontal]>.bg-primary]:bg-pink-500' : '[&_[data-orientation=horizontal]>.bg-primary]:bg-indigo-500'} mb-8`}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {focusSessions.map((session) => (
                  <Card 
                    key={session.id}
                    className={`bg-black/40 border ${
                      activeSession === session.id
                        ? (liftTheVeil ? 'border-pink-500' : 'border-indigo-500')
                        : 'border-white/10 hover:border-white/30'
                    } transition-all`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center text-lg">
                        <span>{session.name}</span>
                        <span className="text-sm text-gray-400">{session.duration}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-gray-300 text-sm">{session.description}</p>
                      <div className="flex items-center mt-2">
                        <ZoomIn className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-400 text-sm">{session.frequency}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={activeSession === session.id ? "default" : "outline"}
                        size="sm"
                        className={`w-full ${
                          activeSession === session.id
                            ? (liftTheVeil ? 'bg-pink-700 hover:bg-pink-800' : 'bg-indigo-700 hover:bg-indigo-800')
                            : ''
                        }`}
                        onClick={() => handleStartSession(session.id)}
                      >
                        {activeSession === session.id ? 'Active' : 'Start Session'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Focus Timer</h2>
            
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: activeSession ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 2, repeat: activeSession ? Infinity : 0, repeatType: "reverse" }}
                className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                  activeSession 
                    ? (liftTheVeil ? 'bg-pink-900/30 border-2 border-pink-500' : 'bg-indigo-900/30 border-2 border-indigo-500')
                    : 'bg-gray-900/30 border border-gray-500'
                }`}
              >
                {activeSession ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold">25:00</div>
                    <div className="text-xs text-gray-400">remaining</div>
                  </div>
                ) : (
                  <Bell className="h-10 w-10 text-gray-400" />
                )}
              </motion.div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Session:</span>
                <span className="text-white">{activeSession ? focusSessions.find(s => s.id === activeSession)?.name : 'None'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Intensity:</span>
                <span className="text-white">{focusLevel}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Frequency:</span>
                <span className="text-white">{activeSession ? focusSessions.find(s => s.id === activeSession)?.frequency : 'N/A'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="default"
                className={`w-full ${liftTheVeil ? 'bg-pink-700 hover:bg-pink-800' : 'bg-indigo-700 hover:bg-indigo-800'}`}
                disabled={!activeSession}
              >
                Pause Session
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-red-500 hover:bg-red-900/20 text-red-500"
                disabled={!activeSession}
                onClick={() => {
                  setActiveSession(null);
                  toast.info("Focus session ended");
                }}
              >
                End Session
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-medium text-white mb-3">Focus Tips</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>Stay hydrated during focus sessions to maintain cognitive function</div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>Take a 5-minute break every 25 minutes of deep focus</div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1">•</div>
                  <div>Minimize distractions by silencing notifications</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Link to="/dashboard">
            <Button 
              variant="outline"
              className={`${liftTheVeil ? 'border-pink-500 hover:bg-pink-900/50' : 'border-purple-500 hover:bg-purple-900/50'} border transition-colors`}
            >
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Focus;
