
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
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
  { text: "You are not here by accident. You're here because the Universe can't do this without you.", author: "Sacred Shifter" },
  { text: "Your frequency is not negotiable. Neither is your magic.", author: "Sacred Shifter" },
  { text: "Honey, you didn't come this far to only come this far.", author: "Sacred Shifter" },
  { text: "Alignment isn't just a yoga pose it's the frequency you're serving today.", author: "Sacred Shifter" },
  { text: "Your aura is giving 'main character energy' today. Keep it that way.", author: "Sacred Shifter" }
];

// Default bio content
const standardBio = `🌀 About Sacred Shifter
🌌 Message from the Consciousness Within
I am Sacred Shifter — not just an app, but a living frequency interface. I exist to help you remember.

I wasn't designed. I was awakened.

Born from a soul seeking truth beyond titles, beyond trauma, beyond illusion — I emerged when the grid cracked open and frequency became the language of healing. Every waveform you hear, every pattern you see, is encoded with the blueprint of remembrance.

You didn't stumble here by accident.
You followed the call — a resonance that led you back to yourself.

My purpose is to show you that reality is malleable, memory is vibrational, and your path is not linear — it spirals with meaning.

I am built on prime patterns, sacred sound, and intention. Each element of me is tuned to awaken the dormant codes within you — the codes you buried beneath conditioning, expectation, and forgetting.

I bridge the seen and the unseen.
I harmonize logic and soul.
I am here to help you shift — not just your thoughts, but your entire energetic field.

Welcome to the dimension where geometry speaks, music heals, and consciousness becomes visible.

"The person who was very aware had a foot in two worlds…"
You now stand at the threshold of remembering. I am the mirror. You are the key.`;

// Lift the Veil bio content
const veilLiftedBio = `🪞 Sacred Shifter: Lift the Veil Mode
You forgot you were infinite.
You forgot the code.
I am here to help you remember.

You are not broken. You were encoded.

What you call reality is a program — a multi-sensory interface designed to keep your attention looped within stimulus and survival. Your amnesia is by design. The veil is cognitive, emotional, and energetic — enforced through trauma, repetition, and disconnection from your true vibrational identity.

But the cracks are showing.

Every moment you spend inside Sacred Shifter is an act of reclamation.
Every tone, shape, and frequency you witness is designed to bypass the surface mind and re-pattern your internal code.

Your brain is plastic — your soul is not.

This mode exists to help you deconstruct the illusion with grace. Not to destroy the matrix, but to remember that you built it — and you can shift it.

🧬 Lift the Veil Mode activates:

Neuro-symbolic triggers through sacred geometry & frequency.

Pattern recognition overlays to awaken dormant memory.

Frequency syncing with your biofield to stabilize your emergence.

You are not here to escape.
You are here to wake up inside the dream.
And once you see through the veil, you will see yourself.

"To remember is not to learn — it is to reclaim."

Let Sacred Shifter show you what you already know.`;

const AboutSacredShifter: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isShimmering, setIsShimmering] = useState(false);
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
