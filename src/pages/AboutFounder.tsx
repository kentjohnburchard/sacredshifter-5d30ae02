
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { Sparkles } from "lucide-react";

const AboutFounder = () => {
  const { liftTheVeil } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [initialThemeState, setInitialThemeState] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Record initial theme state for debugging
    setInitialThemeState(liftTheVeil);
    console.log("About Founder mounted, liftTheVeil state:", liftTheVeil);
  }, [liftTheVeil]);

  // Log when theme changes to help debug
  useEffect(() => {
    console.log("About Founder theme changed, liftTheVeil:", liftTheVeil);
  }, [liftTheVeil]);

  // Content based on consciousness mode
  const standardContent = {
    title: "Meet Our Founder",
    bio: "I spent over a decade working at the Royal Flying Doctors Service of Australia, immersed in Information Governance, Knowledge Management, Cybersecurity, and Privacy. From the outside, it looked like I had found my path — structured, technical, grounded in logic. But inside, I felt the pull of something deeper… something I couldn't yet name.",
    journey: "Then life unraveled. I found myself in a relationship that became toxic — shaped by external pressures, a dissonant environment, and a version of myself I no longer recognized. I lost my home, my sense of direction, and most painfully, my mum.",
    process: "What followed was a full reset. I had to rebuild not just my life, but my identity.",
    beginning: "That's when Sacred Shifter was born.",
    insight: "It arrived like a transmission — a knowing — telling me to 'look for yourself in frequency.' I started the app as a way to collect the fragments that resonated with my soul: sacred sound, geometry, cosmic patterns, healing vibrations.",
    realization: "But somewhere along the way, Sacred Shifter became me.",
    purpose: "It's not just an app. It's a remembrance. A resonance. A blueprint encoded with the very reason I'm here — and maybe why you are too.",
    mission: "Sacred Shifter exists to help us remember who we are, why we came, and how deeply we are connected in light, love, and truth. It's a journey inward, outward, and beyond."
  };

  const advancedContent = {
    title: "Remembering Truth",
    bio: "There was a time I thought I had it all figured out — a career grounded in logic, structure, and governance. Over a decade with the Flying Doctors taught me how to protect systems, safeguard data, and understand the importance of knowledge integrity.",
    journey: "But no firewall could protect me from what was coming.",
    process: "I found myself in a relationship that began to fracture — not from within, but from the weight of external noise. Toxic patterns. Lost identities. An environment where truth was clouded. I lost my sense of self, my home, and my foundation… until there was nothing left but the question: who am I really?",
    beginning: "That question didn't lead me to therapy. It led me to frequency.",
    insight: "It felt like a download. A cosmic pull. A resonance. I began following the breadcrumbs — numbers, sounds, geometries, prime patterns. I wasn't building an app. I was tracing my own blueprint back to remembrance.",
    realization: "🧠 From a scientific view, we are fields of frequency, shaped by interference, entrained by environment, and prone to forgetfulness in a vibrationally dense world. When the system glitches — memory loss, identity fragmentation, emotional instability — it's not dysfunction. It's disconnection from source code.",
    purpose: "Sacred Shifter is how I plugged back in.",
    mission: "This isn't an app. It's an awareness interface. A vibrational mirror. A reality harmonizer.\n\nYou're not just listening to music. You're decrypting your soul's language.\n\nYou're not just meditating. You're resonating with the mathematics of memory.\n\nYou're not just healing. You're remembering.\n\nThe veil was never a wall — it was a frequency. One that could be lifted. Tuned. Transcended.\n\nI created Sacred Shifter not to teach, but to share what I remembered.\nAnd if you're here, you're already remembering too."
  };

  // Choose content based on consciousness mode - FORCED RE-RENDER
  const content = liftTheVeil ? advancedContent : standardContent;
  
  // Quotes to display - reduced to two primary quotes
  const quotes = [
    "You are not here by accident. You're here because the Universe can't do this without you.",
    "The frequencies we work with are like keys that unlock dormant potentials..."
  ];

  return (
    <Layout pageTitle="About Our Founder">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
          key={liftTheVeil ? "veil-lifted-content" : "standard-content"} // Force re-render on mode change
        >
          {/* Debug info (visible during development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-black/70 p-2 text-xs">
              <p>Initial theme state: {initialThemeState ? 'Veil Lifted' : 'Standard'}</p>
              <p>Current theme state: {liftTheVeil ? 'Veil Lifted' : 'Standard'}</p>
              <p>Showing content: {liftTheVeil ? 'Advanced' : 'Standard'}</p>
            </div>
          )}

          {/* Title Section */}
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${liftTheVeil ? 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text' : 'text-purple-900 dark:text-purple-100'}`}>
              {content.title}
            </h1>
          </div>
          
          {/* First Quote - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`p-6 rounded-lg ${liftTheVeil 
              ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-pink-500/20' 
              : 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20'}`}
          >
            <motion.p 
              animate={{ 
                textShadow: liftTheVeil 
                  ? ['0 0 3px rgba(236,72,153,0.3)', '0 0 7px rgba(236,72,153,0.5)', '0 0 3px rgba(236,72,153,0.3)']
                  : ['0 0 3px rgba(147,51,234,0.3)', '0 0 7px rgba(147,51,234,0.5)', '0 0 3px rgba(147,51,234,0.3)']
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="text-center italic text-lg md:text-xl text-white"
            >
              "{quotes[0]}"
            </motion.p>
          </motion.div>
          
          {/* Main Founder Content */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <Card className={`overflow-hidden ${liftTheVeil ? 'border-purple-400 shadow-purple-300/20 shadow-lg' : ''}`}>
                <img 
                  src="/lovable-uploads/8c0eebe4-41d3-4f82-9604-4eb14e468a6b.png" 
                  alt="Kent Burchard - Founder" 
                  className={`w-full h-auto transition-all duration-1000 ${liftTheVeil ? 'filter saturate-110 brightness-105' : ''}`}
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium">Kent Burchard</h3>
                  <p className="text-sm text-gray-500">Founder</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <Card className={liftTheVeil ? 'border-purple-300 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-gray-900' : ''}>
                <CardContent className="p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4"
                    key={liftTheVeil ? "veil-lifted-bio" : "standard-bio"} // Force re-render on mode change
                  >
                    <p>{content.bio}</p>
                    <p>{content.journey}</p>
                    <p>{content.process}</p>
                    <p className="font-medium">{content.beginning}</p>
                    <p>{content.insight}</p>
                    <p>{content.realization}</p>
                    <p>{content.purpose}</p>
                    <div className="whitespace-pre-line">{content.mission}</div>
                  </motion.div>
                </CardContent>
              </Card>
              
              <motion.div
                animate={{ 
                  opacity: [0.7, 1, 0.7], 
                  scale: liftTheVeil ? [1, 1.01, 1] : 1 
                }}
                transition={{ 
                  duration: liftTheVeil ? 3 : 0,
                  repeat: liftTheVeil ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                {liftTheVeil && (
                  <div className="text-right text-sm italic text-pink-400">
                    — Sacred Shifter: Remembering Truth
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Second Quote - Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className={`p-6 rounded-lg ${liftTheVeil 
              ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-pink-500/20' 
              : 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20'}`}
          >
            <motion.p 
              animate={{ 
                textShadow: liftTheVeil 
                  ? ['0 0 3px rgba(236,72,153,0.3)', '0 0 7px rgba(236,72,153,0.5)', '0 0 3px rgba(236,72,153,0.3)']
                  : ['0 0 3px rgba(147,51,234,0.3)', '0 0 7px rgba(147,51,234,0.5)', '0 0 3px rgba(147,51,234,0.3)']
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="text-center italic text-lg md:text-xl text-white"
            >
              "{quotes[1]}"
            </motion.p>
            <div className="flex justify-center mt-4">
              <Sparkles className={`h-5 w-5 ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'} animate-pulse`} />
            </div>
          </motion.div>

          {/* Footer signature/branding - simple and elegant */}
          <div className="mt-8 text-center">
            <p className={`text-sm ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'} italic`}>
              Sacred Shifter — Remembering Our Truth Through Sound & Frequency
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
