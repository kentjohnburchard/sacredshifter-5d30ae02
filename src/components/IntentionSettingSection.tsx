
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Suggested intentions for quick selection
const suggestedIntentions = [
  "I am aligned with my highest purpose today",
  "I release what no longer serves me",
  "My energy flows freely and harmoniously",
  "I am open to receive abundance and joy",
  "I trust my intuition and inner guidance",
  "I am connected to the universal frequency of love"
];

interface Intention {
  id: string;
  intention: string;
  title: string;
  created_at: string;
}

const IntentionSettingSection: React.FC = () => {
  const [intention, setIntention] = useState("");
  const [savedIntentions, setSavedIntentions] = useState<Intention[]>([]);
  const [intentionTitle, setIntentionTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  
  // Fetch saved intentions when component mounts
  useEffect(() => {
    if (user) {
      fetchSavedIntentions();
    }
  }, [user]);
  
  const fetchSavedIntentions = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_intentions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching intentions:", error);
        toast.error("Failed to load your intentions");
        return;
      }
      
      if (data) {
        setSavedIntentions(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveIntention = async () => {
    if (!intention.trim()) {
      toast.error("Please enter an intention");
      return;
    }
    
    if (!intentionTitle.trim()) {
      toast.error("Please give your intention a title");
      return;
    }
    
    if (!user) {
      toast.error("You need to be signed in to save intentions");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newIntention = {
        user_id: user.id,
        intention: intention.trim(),
        title: intentionTitle.trim(),
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('user_intentions')
        .insert([newIntention])
        .select();
      
      if (error) {
        console.error("Error saving intention:", error);
        toast.error("Failed to save your intention");
        return;
      }
      
      if (data && data.length > 0) {
        setSavedIntentions([data[0], ...savedIntentions]);
        toast.success("Your intention has been set");
        
        // Reset form
        setIntention("");
        setIntentionTitle("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion: string) => {
    setIntention(suggestion);
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight">
            <span className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
              Set Your Intentions
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Your thoughts create vibrations. Set clear intentions to align your energy with your desires and elevate your frequency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Create Your Intention</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="intention-title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input
                    id="intention-title"
                    placeholder="Name your intention"
                    value={intentionTitle}
                    onChange={(e) => setIntentionTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="intention" className="block text-sm font-medium text-gray-700 mb-1">
                    Intention
                  </label>
                  <Textarea
                    id="intention"
                    placeholder="Write your intention here..."
                    className="h-32"
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                  />
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Or choose from suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedIntentions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="text-xs py-1 px-3 bg-teal-50 text-teal-700 rounded-full hover:bg-teal-100 transition-colors"
                      >
                        {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveIntention}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  {isLoading ? "Saving..." : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Save Intention
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Your Intentions</h3>
            
            {isLoading && savedIntentions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading intentions...</p>
              </div>
            ) : savedIntentions.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-3 max-h-[500px] overflow-y-auto pr-2"
              >
                {savedIntentions.map((savedIntention, index) => (
                  <motion.div
                    key={savedIntention.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-lg border border-teal-100 flex items-start"
                  >
                    <div className="bg-white rounded-full p-1 mr-3 mt-1">
                      <Check className="h-4 w-4 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-teal-800">{savedIntention.title}</h4>
                      <p className="text-gray-700 mt-1">{savedIntention.intention}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Set on {new Date(savedIntention.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No intentions set yet</p>
                <p className="text-sm text-gray-400 mt-1">Your intentions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntentionSettingSection;
