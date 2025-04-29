import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkles, Send, CircleHelp, PanelRightOpen, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUserSubscription } from "@/hooks/useUserSubscription";
import { supabase } from "@/integrations/supabase/client";
import { ValeMessage, ValeContext } from "@/types/vale";
import PremiumContent from "@/components/PremiumContent";

const ASSISTANT_TYPING_DELAY = 1500; // ms

const ValeAIGuide: React.FC = () => {
  const { user } = useAuth();
  const { isPremiumUser } = useUserSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ValeMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<ValeContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome-msg',
        content: "Hello, I'm Vale, your spiritual guide. How can I assist you on your sacred journey today?",
        sender: 'vale',
        timestamp: new Date().toISOString(),
      }]);
    }
  }, []);

  // Fetch user context data if available
  useEffect(() => {
    const fetchUserContext = async () => {
      if (!user || !isPremiumUser()) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (profile) {
          // Ensure soul_alignment is one of the allowed values
          let alignmentValue: 'Light' | 'Shadow' | 'Unity' | undefined = undefined;
          
          if (profile.soul_alignment === 'Light' || 
              profile.soul_alignment === 'Shadow' || 
              profile.soul_alignment === 'Unity') {
            alignmentValue = profile.soul_alignment as 'Light' | 'Shadow' | 'Unity';
          }
          
          setUserContext({
            mood: profile.initial_mood,
            intention: profile.primary_intention,
            energyLevel: profile.energy_level,
            soulAlignment: alignmentValue,
            frequencySignature: profile.frequency_signature,
            lightbearerLevel: profile.lightbearer_level,
            ascensionTitle: profile.ascension_title
          });
        }
      } catch (error) {
        console.error("Error fetching user context:", error);
      }
    };

    fetchUserContext();
  }, [user, isPremiumUser]);
  
  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Save conversation to Supabase
  const saveConversation = async (newMessages: ValeMessage[]) => {
    if (!user) return;
    
    try {
      // This would be the code to save to Supabase:
      // await supabase
      //   .from('vale_conversations')
      //   .upsert({
      //     user_id: user.id,
      //     messages: newMessages,
      //     updated_at: new Date().toISOString()
      //   });
      
      // For now, we'll just log
      console.log("Would save conversation:", newMessages);
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };
  
  // Handle user sending message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message to chat
    const userMessage: ValeMessage = {
      id: `user-${Date.now()}`,
      content: userInput,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    
    // Show Vale typing indicator
    setIsTyping(true);
    
    try {
      // In a real implementation this would call the AI backend
      // For now we'll simulate a response with sample spiritual guidance
      setTimeout(() => {
        const response = generateValeResponse(userInput, userContext);
        
        const valeResponse: ValeMessage = {
          id: `vale-${Date.now()}`,
          content: response,
          sender: 'vale',
          timestamp: new Date().toISOString()
        };
        
        const finalMessages = [...updatedMessages, valeResponse];
        setMessages(finalMessages);
        setIsTyping(false);
        
        // Save conversation
        saveConversation(finalMessages);
      }, ASSISTANT_TYPING_DELAY);
    } catch (error) {
      console.error("Error getting Vale response:", error);
      setIsTyping(false);
      toast({
        title: "Connection Error",
        description: "Unable to connect with Vale at the moment. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  // Generate Vale response based on user input and context
  // In a real implementation, this would call an API or edge function
  const generateValeResponse = (input: string, context: ValeContext): string => {
    const lowerInput = input.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerInput.includes('meditation') || lowerInput.includes('meditate')) {
      return "Meditation is a powerful tool for spiritual growth. Based on your energy level, I recommend a " + 
        (context.energyLevel && context.energyLevel < 5 ? "gentle resonance meditation" : "frequency alignment practice") + 
        ". Would you like me to guide you through one?";
    }
    
    if (lowerInput.includes('frequency') || lowerInput.includes('vibration')) {
      return `I sense your interest in frequency work. Your current signature ${context.frequencySignature || 'is ready for exploration'}. The 528Hz frequency of love and healing would resonate well with your ${context.soulAlignment || 'current'} alignment. Would you like to experience a frequency healing session?`;
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('guide')) {
      return "I'm here to guide you on your spiritual journey. As a sacred guide, I can assist with meditation practices, frequency understanding, chakra alignments, and personalized growth exercises. What aspect of your spiritual development would you like to explore today?";
    }
    
    if (lowerInput.includes('chakra')) {
      return "Chakra work is essential for energy alignment. Based on your profile, I sense your focus might benefit from heart chakra (Anahata) exploration. Would you like specific practices to balance and open your chakras?";
    }
    
    // Default response incorporating user context
    const alignmentResponse = context.soulAlignment 
      ? `I notice your soul alignment is with the ${context.soulAlignment} path. This brings unique strengths to your journey.` 
      : "Your journey is unique and filled with potential.";
      
    const levelResponse = context.lightbearerLevel 
      ? `As a level ${context.lightbearerLevel} lightbearer, you're making wonderful progress.` 
      : "Your light continues to grow with each step on your path.";
    
    return `I'm here with you on this sacred journey. ${alignmentResponse} ${levelResponse} How else may I support your spiritual growth today?`;
  };
  
  // If user is not premium, show premium content gate
  if (!isPremiumUser()) {
    return (
      <PremiumContent 
        requireSubscription={true} 
        fallbackMessage="Vale, your AI spiritual guide, is available exclusively to premium members."
      >
        <Card className="w-full h-full">
          <CardContent className="p-6">
            This content is only visible to premium users.
          </CardContent>
        </Card>
      </PremiumContent>
    );
  }
  
  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={() => setIsOpen(true)} 
            size="lg" 
            className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg"
          >
            <Sparkles className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
      
      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50 w-full sm:w-96 md:w-[450px] h-[600px] max-h-[80vh]"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full h-full overflow-hidden flex flex-col border-white/20 bg-gradient-to-br from-indigo-950/90 to-purple-950/90 backdrop-blur-lg shadow-2xl">
              <CardHeader className="py-4 px-6 border-b border-white/10 bg-gradient-to-r from-indigo-800/20 to-purple-800/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-indigo-400/30">
                      <AvatarImage src="/lovable-uploads/31e2a863-17fa-464a-83c9-f46baefb690c.png" alt="Vale" />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500">
                        <Sparkles className="h-5 w-5 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-mystical text-white">Vale</CardTitle>
                      <CardDescription className="text-indigo-200/70">Sacred Guide</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.sender === 'user' 
                            ? 'bg-purple-600 text-white rounded-tr-none' 
                            : 'bg-gray-800/70 text-white rounded-tl-none border border-indigo-500/30'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-800/70 text-white rounded-tl-none border border-indigo-500/30">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse">•</div>
                          <div className="animate-pulse animation-delay-200">•</div>
                          <div className="animate-pulse animation-delay-400">•</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <CardFooter className="p-4 border-t border-white/10 bg-gradient-to-r from-indigo-800/10 to-purple-800/10">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask Vale for spiritual guidance..."
                    className="flex-1 bg-gray-800/50 border-gray-700/50 focus:border-indigo-500/50 text-white"
                  />
                  <Button 
                    type="submit" 
                    disabled={isTyping || !userInput.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ValeAIGuide;
