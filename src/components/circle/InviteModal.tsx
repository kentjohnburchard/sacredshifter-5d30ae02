
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CHAKRA_COLORS } from '@/types/chakras';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}

const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = async () => {
    if (!email.includes('@')) return;
    
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      onInvite(email);
      setIsSending(false);
      setIsSuccess(true);
      
      // Reset after success animation
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        onClose();
      }, 2000);
    }, 1500);
  };
  
  // Get random chakra colors for the animations
  const getRandomChakraColor = () => {
    const chakras: Array<keyof typeof CHAKRA_COLORS> = [
      'Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'
    ];
    const randomChakra = chakras[Math.floor(Math.random() * chakras.length)];
    return CHAKRA_COLORS[randomChakra];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-black/70 border-purple-500/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Invite to Sacred Circle
          </DialogTitle>
          <DialogDescription className="text-center">
            Share the resonance with someone who would elevate the circle's vibration
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 relative">
          {isSending && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center">
                <div className="relative h-24 w-24">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full"
                      style={{ border: `2px solid ${getRandomChakraColor()}` }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-white/70">Sending invitation...</p>
              </div>
            </motion.div>
          )}
          
          {isSuccess && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-col items-center">
                <motion.div 
                  className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                >
                  <motion.svg 
                    viewBox="0 0 24 24" 
                    className="h-12 w-12 text-green-500"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.svg>
                </motion.div>
                <motion.p 
                  className="mt-4 text-green-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Invitation sent successfully!
                </motion.p>
              </div>
            </motion.div>
          )}

          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <AnimatePresence>
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ backgroundColor: getRandomChakraColor() }}
                    className="h-3 w-3 rounded-full mx-0.5"
                  />
                ))}
              </AnimatePresence>
            </div>
            <p className="text-sm text-white/70">
              By inviting friends, you're expanding the vibrational community
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                Email Address
              </label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                className="bg-black/30 border-white/20"
                disabled={isSending}
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                id="message"
                rows={3}
                className="w-full rounded-md bg-black/30 border-white/20 p-2 text-sm focus:ring-purple-500 focus:border-purple-500"
                placeholder="I think you would resonate with this spiritual space..."
                disabled={isSending}
              ></textarea>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSending}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!email.includes('@') || isSending}
          >
            Send Sacred Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
