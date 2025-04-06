import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Heart, Send, Users, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SoulHug {
  id: string;
  message: string;
  sender_id: string;
  recipient_id?: string;
  is_anonymous: boolean;
  tag: string;
  created_at: string;
  sender_name?: string;
}

interface Profile {
  id: string;
  display_name?: string;
}

const SoulHug: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [deliveryType, setDeliveryType] = useState('anonymous');
  const [tag, setTag] = useState('self-love');
  const [recipientUsername, setRecipientUsername] = useState('');
  const [recipientType, setRecipientType] = useState('random');
  const [sendingHug, setSendingHug] = useState(false);
  const [receivedHugs, setReceivedHugs] = useState<SoulHug[]>([]);
  const [sentHugs, setSentHugs] = useState<SoulHug[]>([]);
  const [showReceivedHug, setShowReceivedHug] = useState<SoulHug | null>(null);
  const [hugStats, setHugStats] = useState({ sent: 0, received: 0 });
  
  // Tags for soul hugs
  const hugTags = [
    { id: 'self-love', label: 'Self-Love' },
    { id: 'forgiveness', label: 'Forgiveness' },
    { id: 'gratitude', label: 'Gratitude' },
    { id: 'hope', label: 'Hope' },
    { id: 'romance', label: 'Romance' },
    { id: 'cosmic-hug', label: 'Cosmic Hug' }
  ];

  // Fetch user's hugs on mount
  useEffect(() => {
    if (user) {
      fetchUserHugs();
    }
  }, [user]);

  // Fetch user's sent and received hugs
  const fetchUserHugs = async () => {
    if (!user) return;
    
    try {
      // Fetch received hugs - using any since the table isn't in generated types
      const { data: receivedData, error: receivedError } = await supabase
        .from('soul_hugs')
        .select('*, profiles(display_name)')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5) as any;
        
      if (receivedError) throw receivedError;
      
      // Fetch sent hugs
      const { data: sentData, error: sentError } = await supabase
        .from('soul_hugs')
        .select('*, profiles(display_name)')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5) as any;
        
      if (sentError) throw sentError;
      
      // Get stats - using any since the table isn't in generated types
      const { data: statsData, error: statsError } = await supabase
        .from('soul_hugs')
        .select('id')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`) as any;
        
      if (statsError) throw statsError;
      
      const sent = sentData?.length || 0;
      const received = receivedData?.length || 0;
      
      // Process the results
      if (receivedData) {
        const processedReceived: SoulHug[] = receivedData.map((hug: any) => ({
          ...hug,
          sender_name: hug.is_anonymous ? 'Anonymous' : (hug.profiles?.display_name || 'Someone')
        }));
        
        setReceivedHugs(processedReceived);
      }
      
      if (sentData) {
        setSentHugs(sentData as SoulHug[]);
      }
      
      setHugStats({
        sent: sentData?.length || 0,
        received: receivedData?.length || 0
      });
      
    } catch (error) {
      console.error("Error fetching hugs:", error);
      toast.error("Failed to load your hugs");
    }
  };

  // Send a soul hug
  const sendSoulHug = async () => {
    if (!user) {
      toast.error("Please log in to send a Soul Hug");
      return;
    }
    
    if (!message.trim()) {
      toast.error("Please enter a message for your Soul Hug");
      return;
    }
    
    try {
      setSendingHug(true);
      
      let recipientId: string | null = null;
      
      // Handle specific recipient
      if (recipientType === 'specific' && recipientUsername.trim()) {
        // Find user by username/display name - using any since the table isn't in generated types
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .ilike('display_name', recipientUsername.trim())
          .limit(1)
          .single() as any;
          
        if (userError || !userData) {
          toast.error("Recipient not found. Try another username.");
          setSendingHug(false);
          return;
        }
        
        recipientId = userData.id;
      } 
      // Handle random recipient
      else if (recipientType === 'random') {
        // Get a random user that isn't the sender - using any since the table isn't in generated types
        const { data: randomUser, error: randomError } = await supabase
          .from('profiles')
          .select('id')
          .neq('id', user.id)
          .limit(100) as any; // Get a pool of users
          
        if (randomError || !randomUser || randomUser.length === 0) {
          toast.error("No recipients available right now");
          setSendingHug(false);
          return;
        }
        
        // Pick a random user from the results
        const randomIndex = Math.floor(Math.random() * randomUser.length);
        recipientId = randomUser[randomIndex].id;
      }
      
      // Create the soul hug
      const newHug = {
        message: message.trim(),
        sender_id: user.id,
        recipient_id: recipientId, // Will be null for public hugs
        is_anonymous: deliveryType === 'anonymous',
        tag: tag
      };
      
      // Using any since the table isn't in generated types
      const { error } = await supabase
        .from('soul_hugs')
        .insert(newHug) as any;
        
      if (error) throw error;
      
      toast.success("Your Soul Hug has been sent with love ✨");
      
      // Reset the form
      setMessage('');
      
      // Refresh the hugs list
      fetchUserHugs();
      
    } catch (error) {
      console.error("Error sending soul hug:", error);
      toast.error("Failed to send your Soul Hug");
    } finally {
      setSendingHug(false);
    }
  };

  // Send love forward (reply to a hug)
  const sendLoveForward = async () => {
    if (!showReceivedHug) return;
    
    setShowReceivedHug(null);
    toast.success("You sent the love forward! ❤️");
    // In a real implementation, this would create a new hug or increment a counter
  };

  
  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-purple-900">Soul Hug</h2>
        <p className="text-purple-600 mt-1">Send love vibrations across the cosmic web</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Send a Soul Hug */}
        <Card className="bg-white/50 backdrop-blur-sm border-pink-200 shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              sendSoulHug();
            }} className="space-y-4">
              <div>
                <Label htmlFor="message" className="text-purple-900 font-medium">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write a heart-centered message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-pink-200 min-h-[100px]"
                />
              </div>
              
              <div>
                <Label className="text-purple-900 font-medium">How would you like to send this?</Label>
                <RadioGroup 
                  value={deliveryType} 
                  onValueChange={setDeliveryType}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="anonymous" id="anonymous" />
                    <Label htmlFor="anonymous" className="ml-2 cursor-pointer text-purple-800">Anonymous</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="named" id="named" />
                    <Label htmlFor="named" className="ml-2 cursor-pointer text-purple-800">With My Name</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-purple-900 font-medium">Choose a Tag</Label>
                <Select value={tag} onValueChange={setTag}>
                  <SelectTrigger className="border-pink-200 mt-1">
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    {hugTags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-purple-900 font-medium">Send To</Label>
                <RadioGroup 
                  value={recipientType} 
                  onValueChange={setRecipientType}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2"
                >
                  <div className="flex items-center">
                    <RadioGroupItem value="random" id="random" />
                    <Label htmlFor="random" className="ml-2 cursor-pointer text-purple-800">Random Recipient</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific" className="ml-2 cursor-pointer text-purple-800">Specific Person</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="ml-2 cursor-pointer text-purple-800">Public Blessing</Label>
                  </div>
                </RadioGroup>
                
                {recipientType === 'specific' && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter username"
                      value={recipientUsername}
                      onChange={(e) => setRecipientUsername(e.target.value)}
                      className="border-pink-200"
                    />
                    <p className="text-xs text-purple-600 mt-1">
                      Enter the username of the person you want to send to
                    </p>
                  </div>
                )}
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={sendingHug || !message.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Soul Hug
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Soul Hug Activity */}
        <div className="space-y-4">
          {/* Stats */}
          <Card className="bg-white/50 backdrop-blur-sm border-pink-200 shadow-md p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-purple-700">Hugs Sent</p>
                <p className="text-2xl font-bold text-pink-600">{hugStats.sent}</p>
              </div>
              <div>
                <p className="text-sm text-purple-700">Hugs Received</p>
                <p className="text-2xl font-bold text-purple-600">{hugStats.received}</p>
              </div>
            </div>
          </Card>
          
          {/* Received Hugs */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-purple-900 flex items-center">
              <Heart className="h-4 w-4 text-pink-600 mr-2" />
              Recent Soul Hugs Received
            </h3>
            
            {receivedHugs.length > 0 ? (
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {receivedHugs.map((hug) => (
                  <motion.div
                    key={hug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-white/70 rounded-lg border border-pink-100 cursor-pointer hover:bg-white/90 transition-colors"
                    onClick={() => setShowReceivedHug(hug)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-purple-900 line-clamp-2">{hug.message}</p>
                      <Badge variant="outline" className="ml-2 shrink-0 bg-pink-50 text-pink-700 border-pink-200">
                        {hugTags.find(t => t.id === hug.tag)?.label || hug.tag}
                      </Badge>
                    </div>
                    <div className="mt-1 flex justify-between items-center text-xs text-purple-700">
                      <span>From: {hug.sender_name}</span>
                      <span>{new Date(hug.created_at).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-purple-600 italic">No hugs received yet</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Soul Hug Dialog */}
      <Dialog open={!!showReceivedHug} onOpenChange={(open) => !open && setShowReceivedHug(null)}>
        <DialogContent className="bg-white/90 backdrop-blur-md border-pink-300 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-purple-900 flex items-center justify-center">
              <Heart className="h-5 w-5 mr-2 text-pink-600" />
              Soul Hug Received
            </DialogTitle>
          </DialogHeader>
          
          {showReceivedHug && (
            <div className="space-y-4 py-2">
              <div className="p-6 bg-gradient-to-r from-pink-100/80 to-purple-100/80 rounded-lg text-center">
                <motion.p 
                  className="text-lg text-purple-900 font-medium"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {showReceivedHug.message}
                </motion.p>
              </div>
              
              <div className="flex justify-between text-sm text-purple-700">
                <span>From: {showReceivedHug.sender_name}</span>
                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                  {hugTags.find(t => t.id === showReceivedHug.tag)?.label || showReceivedHug.tag}
                </Badge>
              </div>
              
              <div className="flex justify-center pt-2">
                <Button 
                  className="bg-gradient-to-r from-pink-500 to-purple-600"
                  onClick={sendLoveForward}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Send Love Forward
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SoulHug;
