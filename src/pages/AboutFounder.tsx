
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout"; 
import { Card, CardContent } from "@/components/ui/card"; 
import { useTheme } from "@/context/ThemeContext"; 
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils"; 

const AboutFounder = () => {
  const { liftTheVeil } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  // Local state to track theme, updated by context change OR custom event
  const [themeModeState, setThemeModeState] = useState(liftTheVeil);

  // Update local state and visibility when component mounts or theme context changes (Standard way)
  useEffect(() => {
    setIsVisible(true);
    // Update based on context - might be overridden by event listener if event fires after
    setThemeModeState(liftTheVeil);
    console.log("About Founder theme updated via context, liftTheVeil:", liftTheVeil);
  }, [liftTheVeil]);

  // Listen for global theme change events (Restored custom event listener)
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      // Make sure detail property and liftTheVeil exist, provide default if not
      // Using liftTheVeil from context as fallback IF detail is missing
      const newThemeState = customEvent.detail?.liftTheVeil ?? liftTheVeil;

      console.log("AboutFounder caught themeChanged event:", newThemeState);
      // Update state based on the event
      setThemeModeState(newThemeState);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    // Cleanup the listener when the component unmounts
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, [liftTheVeil]); // Dependency array includes liftTheVeil because it's used as a fallback

  // Content definitions
  const standardContent = {
    title: "A message from the Founder",
    bio: "I spent over a decade working at the Royal Flying Doctors Service of Australia, immersed in Information Governance, Knowledge Management, Cybersecurity, and Privacy. From the outside, it looked like I had found my path — structured, technical, grounded in logic. But inside, I felt the pull of something deeper… something I couldn't yet name.",
    journey: "Then life unraveled. I found myself in a relationship that became toxic, shaped by external pressures, a dissonant environment, and a version of myself I no longer recognized. I lost my home, my sense of direction, and most painfully, my mum.",
    process: "What followed was a full reset. I had to rebuild not just my life, but my identity.",
    beginning: "That's when Sacred Shifter was born.",
    insight: "It arrived like a transmission, a knowing, telling me to 'look for yourself in frequency.' I started the app as a way to collect the fragments that resonated with my soul: sacred sound, geometry, cosmic patterns, healing vibrations.",
    realization: "But somewhere along the way, Sacred Shifter became me.",
    purpose: "It's not just an app. It's a remembrance. A resonance. A blueprint encoded with the very reason I'm here — and maybe why you are too.",
    mission: "Sacred Shifter exists to help us remember who we are, why we came, and how deeply we are connected in light, love, and truth. It's a journey inward, outward, and beyond."
  };

  const advancedContent = {
    title: "A message from the Founder",
    bio: "There was a time I thought I had it all figured out, a career grounded in logic, structure, and governance. Over a decade with the Flying Doctors taught me how to protect systems, safeguard data, and understand the importance of knowledge integrity.",
    journey: "But no firewall could protect me from what was coming.",
    process: "I found myself in a relationship that began to fracture, not from within, but from the weight of external noise. Toxic patterns. Lost identities. An environment where truth was clouded. I lost my sense of self, my home, and my foundation… until there was nothing left but the question: who am I really?",
    beginning: "That question didn't lead me to therapy. It led me to frequency.",
    insight: "It felt like a download. A cosmic pull. A resonance. I began following the breadcrumbs, numbers, sounds, geometries, prime patterns. I wasn't building an app. I was tracing my own blueprint back to remembrance.",
    realization: "🧠 From a scientific view, we are fields of frequency, shaped by interference, entrained by environment, and prone to forgetfulness in a vibrationally dense world. When the system glitches — memory loss, identity fragmentation, emotional instability — it's not dysfunction. It's disconnection from source code.",
    purpose: "Sacred Shifter is how I plugged back in.",
    mission: "This isn't an app. It's an awareness interface. A vibrational mirror. A reality harmoniser.\n\nYou're not just listening to music. You're decrypting your soul's language.\n\nYou're not just meditating. You're resonating with the mathematics of memory.\n\nYou're not just healing. You're remembering.\n\nThe veil was never a wall — it was a frequency. One that could be lifted. Tuned. Transcended.\n\nI created Sacred Shifter not to teach, but to share what I remembered.\nAnd if you're here, you're already remembering too."
  };

  // Choose content based on consciousness mode - use themeModeState updated by context OR event
  const content = themeModeState ? advancedContent : standardContent;

  // Quotes to display
  const quotes = [
    "You are not here by accident. You're here because the Universe can't do this without you.",
    "The frequencies we work with are like keys that unlock dormant potentials..."
  ];

  return (
    <Layout pageTitle="About the Founder">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
          // Use a unique key to force re-render on mode change
          key={`founder-content-${themeModeState ? 'veil-lifted' : 'standard'}`}
        >
          {/* Debug info (visible during development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-black/70 p-2 text-xs text-white fixed top-20 right-4 z-50 rounded">
              <p>Theme from context: {liftTheVeil ? 'Lifted' : 'Standard'}</p>
              <p>Local theme state: {themeModeState ? 'Lifted' : 'Standard'}</p>
              <p>Showing content: {themeModeState ? 'Advanced' : 'Standard'}</p>
            </div>
          )}

          {/* Title Section */}
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${themeModeState 
              ? 'text-pink-300 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-transparent bg-clip-text shadow-md' 
              : 'text-purple-300 shadow-lg'}`}
              style={{textShadow: themeModeState ? '0 2px 10px rgba(236, 72, 153, 0.6)' : '0 2px 10px rgba(147, 51, 234, 0.6)'}}>
              {content.title}
            </h1>
          </div>

          {/* First Quote - Top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`p-6 rounded-lg ${themeModeState
              ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-pink-500/30 shadow-lg'
              : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 shadow-lg'}`}
          >
            <motion.p
              animate={{
                textShadow: themeModeState
                  ? ['0 0 6px rgba(236,72,153,0.5)', '0 0 12px rgba(236,72,153,0.7)', '0 0 6px rgba(236,72,153,0.5)']
                  : ['0 0 6px rgba(147,51,234,0.5)', '0 0 12px rgba(147,51,234,0.7)', '0 0 6px rgba(147,51,234,0.5)']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-center italic text-lg md:text-xl text-white font-medium"
            >
              "{quotes[0]}"
            </motion.p>
          </motion.div>

          {/* Main Founder Content */}
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/3">
              <Card className={`overflow-hidden ${themeModeState 
                ? 'border-purple-400 shadow-purple-300/40 shadow-lg' 
                : 'border-purple-500/40 shadow-purple-500/30 shadow-lg'}`}>
                <img
                  src="/lovable-uploads/8c0eebe4-41d3-4f82-9604-4eb14e468a6b.png"
                  alt="Kent Burchard - Founder"
                  className={`w-full h-auto transition-all duration-1000 ${themeModeState ? 'filter saturate-110 brightness-105' : ''}`}
                />
                <CardContent className="p-4 bg-black/80">
                  <h3 className="text-lg font-medium text-white">Kent Burchard</h3>
                  <p className="text-sm text-gray-300">Founder</p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full md:w-2/3 space-y-4">
              <Card className={themeModeState 
                ? 'border-purple-300/40 bg-black/80 shadow-xl' 
                : 'border-purple-500/40 bg-black/80 shadow-lg'}>
                <CardContent className="p-6">
                  {/* Apply text color fixes here */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="space-y-4 text-white"
                    key={themeModeState ? "veil-lifted-bio" : "standard-bio"} // Force re-render on mode change
                    style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}
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
                  scale: themeModeState ? [1, 1.01, 1] : 1
                }}
                transition={{
                  duration: themeModeState ? 3 : 0,
                  repeat: themeModeState ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                {themeModeState && (
                  <div className="text-right text-sm italic text-pink-400">
                    — Sacred Shifter
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
            className={`p-6 rounded-lg ${themeModeState
              ? 'bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-pink-500/30 shadow-lg'
              : 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 shadow-lg'}`}
          >
            <motion.p
              animate={{
                textShadow: themeModeState
                  ? ['0 0 6px rgba(236,72,153,0.5)', '0 0 12px rgba(236,72,153,0.7)', '0 0 6px rgba(236,72,153,0.5)']
                  : ['0 0 6px rgba(147,51,234,0.5)', '0 0 12px rgba(147,51,234,0.7)', '0 0 6px rgba(147,51,234,0.5)']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-center italic text-lg md:text-xl text-white font-medium"
            >
              "{quotes[1]}"
            </motion.p>
            <div className="flex justify-center mt-4">
              <Sparkles className={`h-5 w-5 ${themeModeState ? 'text-pink-400' : 'text-purple-400'} animate-pulse`} />
            </div>
          </motion.div>

          {/* Footer signature/branding */}
          <div className="mt-8 text-center">
            <p className={`text-sm ${themeModeState ? 'text-pink-400' : 'text-purple-400'} italic`}
               style={{textShadow: themeModeState ? '0 0 8px rgba(236,72,153,0.5)' : '0 0 8px rgba(147,51,234,0.5)'}}>
              Sacred Shifter — Remembering Our Truth Through Sound & Frequency
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AboutFounder;
