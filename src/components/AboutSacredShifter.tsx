
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type Quote = {
  text: string;
  author?: string;
};

const standardQuotes: Quote[] = [
  { text: "The universe is not outside of you. Look inside yourself; everything that you want, you already are.", author: "Rumi" },
  { text: "We are all just walking each other home.", author: "Ram Dass" },
  { text: "Healing happens when you align with the frequency of your true nature.", author: "Sacred Shifter" },
  { text: "Your vibration today creates your reality tomorrow.", author: "Sacred Shifter" },
  { text: "The most beautiful thing we can experience is the mysterious.", author: "Albert Einstein" }
];

const veilLiftedQuotes: Quote[] = [
  { text: "You are not here by accident. You're here because the Universe can't do this shift without you.", author: "Sacred Shifter" },
  { text: "Your frequency is not negotiable. Neither is your magic.", author: "Sacred Shifter" },
  { text: "Honey, you didn't come this far to only come this far.", author: "Sacred Shifter" },
  { text: "Alignment isn't just a yoga pose it's the frequency you're serving today.", author: "Sacred Shifter" },
  { text: "Your aura is giving 'main character energy' today. Keep it that way.", author: "Sacred Shifter" }
];

// Default bio content
const standardBio = `I worked at the Flying Doctors for the last 11 years and thought my path was in Information Governance, Knowledge Management, Cybersecurity, and Privacy. But after surviving trauma from domestic violence, the passing of my mum, and losing my home and everything I owned — I had to reset. I didn't even know who I was anymore.

That's when Sacred Shifter was born. It was like I was downloaded with the knowing: look for yourself in frequency. The app began as a space to collect everything that resonated with my soul. But now, it *is* my soul. Sacred Shifter is the path that found me. It exists to help you remember who you are, why you're here, and how we are all connected in light, love, and truth.`;

// Lift the Veil bio content
const veilLiftedBio = `This world is not what it seems. We are living inside a matrix of perception, frequency, and forgetfulness. Sacred Shifter exists because I remembered — not just who I am — but what *we* are.

This app is not just a sound tool. It's a remembrance engine. A reality tuner. A soul mirror. We are here to wake up. To rise out of illusion. To reconnect with the divine grid of consciousness.

When you tune your frequency, you tune your reality. You remember your light. And when we remember together, we shift the entire cosmos.

Sacred Shifter isn't just an app — it's a blueprint for the awakened ones to come home.`;

const AboutSacredShifter: React.FC = () => {
  const { liftTheVeil, setLiftTheVeil } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isShimmering, setIsShimmering] = useState(false);
  const [showVeilToggle, setShowVeilToggle] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const quotes = liftTheVeil ? veilLiftedQuotes : standardQuotes;
  const currentBio = liftTheVeil ? veilLiftedBio : standardBio;

  // Rotate quotes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Toggle shimmering effect every 5-8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 1000);
    }, 5000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Show the toggle after the user has scrolled down a bit
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowVeilToggle(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Play tone when veil is lifted
  useEffect(() => {
    if (liftTheVeil) {
      playTruthResonanceTone();
    }
  }, [liftTheVeil]);

  const playTruthResonanceTone = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Use 963Hz (pineal gland activation frequency)
      oscillator.frequency.value = 963;
      oscillator.type = 'sine';
      
      // Set a gentle volume
      gainNode.gain.value = 0.1;
      
      // Create a fade out effect
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
      
      // Connect and start
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.start();
      
      // Stop after 2 seconds
      setTimeout(() => {
        oscillator.stop();
      }, 2000);
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  };

  const handleToggleVeil = () => {
    setIsTransitioning(true);
    
    // Visual feedback first
    toast(liftTheVeil ? "Returning to standard perspective" : "Lifting the veil of perception", {
      icon: <Sparkles className={liftTheVeil ? "text-purple-500" : "text-pink-500"} />,
      duration: 3000,
    });
    
    // Then toggle the mode with a slight delay for visual effect
    setTimeout(() => {
      setLiftTheVeil(!liftTheVeil);
      setIsTransitioning(false);
    }, 300);
  };

  const shimmeryTextStyle = isShimmering 
    ? "animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500" 
    : "bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400";

  const formatBioWithEmphasis = (text: string) => {
    // Split by paragraphs
    return text.split('\n\n').map((paragraph, index) => {
      // Replace *text* with emphasized text
      const formattedParagraph = paragraph.replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>');
      return (
        <p 
          key={index} 
          className={`text-white leading-relaxed ${index > 0 ? 'mt-4' : ''}`} 
          dangerouslySetInnerHTML={{ __html: formattedParagraph }} 
        />
      );
    });
  };

  return (
    <section className="py-10 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Lift the Veil Toggle - Appears after scrolling */}
        <AnimatePresence>
          {showVeilToggle && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`fixed bottom-20 right-6 z-50 flex items-center gap-2 p-3 rounded-full 
                ${liftTheVeil 
                  ? 'bg-pink-900/80 border border-pink-500/50' 
                  : 'bg-purple-900/80 border border-purple-500/50'} 
                backdrop-blur-md shadow-lg`}
            >
              <span className={`text-sm font-medium ${liftTheVeil ? 'text-pink-200' : 'text-purple-200'}`}>
                Lift the Veil
              </span>
              <Switch 
                checked={liftTheVeil}
                onCheckedChange={handleToggleVeil}
                className={liftTheVeil ? 'data-[state=checked]:bg-pink-600' : 'data-[state=checked]:bg-purple-600'}
              />
              <Sparkles 
                className={`h-4 w-4 ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic About Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          key={liftTheVeil ? "veil-lifted" : "standard"} // This forces re-render animation when mode changes
          className="prose prose-lg max-w-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={liftTheVeil ? "veil-lifted-bio" : "standard-bio"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`relative ${isTransitioning ? 'animate-pulse' : ''}`}
            >
              {/* Bio content with emphasis */}
              <div className="relative">
                {formatBioWithEmphasis(currentBio)}
                
                {/* Subtle glow effect on text when in lifted veil mode */}
                {liftTheVeil && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-lg blur-xl pointer-events-none"
                    style={{ 
                      animation: 'pulse 3s infinite alternate',
                      mixBlendMode: 'overlay'
                    }}
                  />
                )}
              </div>

              <div className={`mt-6 font-light italic text-white ${liftTheVeil ? 'text-pink-100' : 'text-purple-100'}`}>
                <p>Sacred Shifter: {liftTheVeil ? 'Remembering Truth' : 'Finding Your Frequency'}</p>
              </div>
              
              <p className={`mt-6 text-right text-sm ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`}>
                Sacred Shifter Founder
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Animated Quote Rotator - Made more prominent */}
        <motion.div 
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mt-10 p-8 bg-opacity-10 backdrop-blur-sm 
            ${liftTheVeil 
              ? 'bg-pink-900/30 border border-pink-500/30' 
              : 'bg-purple-900/30 border border-purple-500/30'} 
            rounded-lg shadow-md`}
        >
          <p className="italic text-center text-white text-xl md:text-2xl font-light">
            "{quotes[currentQuoteIndex].text}"
          </p>
          {quotes[currentQuoteIndex].author && (
            <p className={`text-center text-sm mt-4 ${liftTheVeil ? 'text-pink-200' : 'text-purple-200'}`}>
              — {quotes[currentQuoteIndex].author}
            </p>
          )}
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {liftTheVeil ? (
            <motion.div
              key="veil-lifted-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl"></div>
              <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-indigo-500/5 rounded-full filter blur-2xl"></div>
            </motion.div>
          ) : (
            <motion.div
              key="standard-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl"></div>
              <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AboutSacredShifter;
