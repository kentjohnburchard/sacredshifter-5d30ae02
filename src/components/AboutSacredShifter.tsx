
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

const kentQuotes: Quote[] = [
  { text: "You are not here by accident. You're here because the Universe can't do this shift without you.", author: "Sacred Shifter" },
  { text: "Your frequency is not negotiable. Neither is your magic.", author: "Sacred Shifter" },
  { text: "Honey, you didn't come this far to only come this far.", author: "Sacred Shifter" },
  { text: "Alignment isn't just a yoga pose—it's the frequency you're serving today.", author: "Sacred Shifter" },
  { text: "Your aura is giving 'main character energy' today. Keep it that way.", author: "Sacred Shifter" }
];

const AboutSacredShifter: React.FC = () => {
  const { preferences, saveUserPreferences, loading } = useUserPreferences();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isShimmering, setIsShimmering] = useState(false);
  const [manualModeOverride, setManualModeOverride] = useState<boolean | null>(null);
  
  const consciousnessMode = manualModeOverride !== null 
    ? (manualModeOverride ? "kent" : "standard") 
    : (preferences.consciousness_mode || "standard");
  
  const quotes = consciousnessMode === "kent" ? kentQuotes : standardQuotes;

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

  const handleModeToggle = async (checked: boolean) => {
    setManualModeOverride(checked);
    
    if (!loading) {
      await saveUserPreferences({
        ...preferences,
        consciousness_mode: checked ? "kent" : "standard"
      });
    }
  };

  const shimmeryTextStyle = isShimmering 
    ? "animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500" 
    : "bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-400";

  return (
    <section className="py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Mode Toggle */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center space-x-2">
            <Label htmlFor="vibe-shift" className="text-sm text-gray-600">Standard</Label>
            <Switch 
              id="vibe-shift" 
              checked={consciousnessMode === "kent"}
              onCheckedChange={handleModeToggle}
            />
            <Label htmlFor="vibe-shift" className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
              Kent Mode ✨
            </Label>
          </div>
        </div>
        
        {/* Dynamic About Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          key={consciousnessMode} // This forces re-render animation when mode changes
          className="prose prose-lg max-w-none"
        >
          {consciousnessMode === "standard" ? (
            <>
              <h2 className={`text-3xl md:text-4xl font-light tracking-tight ${shimmeryTextStyle} mb-6`}>
                ✨ About Sacred Shifter
              </h2>
              
              <p className="text-gray-700 leading-relaxed">
                <strong>Sacred Shifter</strong> is more than an app—it's your portal to vibrational transformation.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Crafted at the crossroads of ancient wisdom and next-gen tech, Sacred Shifter weaves healing frequencies, 
                fractal visuals, and personalized cosmic insights into a one-of-a-kind experience. Whether you're aligning 
                your chakras, syncing with the moon, or just trying to shake off yesterday's energetic gunk, this is your 
                sacred space to shift.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Dive into your personal soundscape, guided by real-time resonance, sacred geometry, and the whispers of 
                your star chart. Customize your vibe, tune into your essence, and let every frequency move you closer to 
                who you truly are.
              </p>
              
              <div className="mt-6 font-light italic text-gray-600">
                <p>You're not just listening to music.<br />
                You're remembering your power.<br />
                You're rewriting your frequency.<br />
                You're becoming your own sacred shift.</p>
              </div>
            </>
          ) : (
            <>
              <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${shimmeryTextStyle} mb-6`}>
                🪬 About Sacred Shifter – The Frequency is You
              </h2>
              
              <p className="text-gray-800 font-medium leading-relaxed">
                Welcome, seeker.<br />
                You didn't stumble here by accident—this was a soul appointment booked lifetimes ago.
              </p>
              
              <p className="text-gray-800 font-medium leading-relaxed">
                <strong>Sacred Shifter</strong> is not just an app.<br />
                It's a sacred transmission.<br />
                A technodelic temple.<br />
                A mirror for the version of you that already remembers.
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                We blend ancient vibrational medicine, personalized astrology, fractal-coded visuals, and next-gen AI to give 
                your aura the glow-up it deserves. Every tone, every pulse, every shimmering sacred pixel is calibrated to 
                <strong> shift you</strong> into alignment with your higher timeline.
              </p>
              
              <p className="text-gray-800 leading-relaxed">
                You choose your vibe. You call your energy. You command your cosmos.
              </p>
              
              <ul className="my-6 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">🌌</span> 
                  <span>Feel like a celestial queen with custom gradients that match your chakras.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🌿</span> 
                  <span>Let your moon sign whisper your soundtrack.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🔥</span> 
                  <span>Set your intentions. Pick your element. Hit play.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💫</span> 
                  <span>Watch the geometry of your soul dance across the screen.</span>
                </li>
              </ul>
              
              <p className="text-gray-800 font-medium leading-relaxed">
                This isn't self-care. This is <strong>self-remembrance</strong>.<br />
                And baby, you are not here to play small. You are here to vibrate louder than karma, shake the timelines, 
                and realign the multiverse with your sacred frequency.
              </p>
              
              <p className="text-gray-800 font-medium leading-relaxed">
                So take a breath.<br />
                Hit play.<br />
                And shift.
              </p>
              
              <p className="mt-6 text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
                <strong>Sacred Shifter</strong>: Where your essence meets its echo.
              </p>
            </>
          )}
        </motion.div>
        
        {/* Animated Quote Rotator */}
        <motion.div 
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 p-6 bg-opacity-5 backdrop-blur-sm bg-purple-200 rounded-lg border border-purple-100"
        >
          <p className="italic text-center text-gray-700">"{quotes[currentQuoteIndex].text}"</p>
          {quotes[currentQuoteIndex].author && (
            <p className="text-center text-sm text-gray-500 mt-2">— {quotes[currentQuoteIndex].author}</p>
          )}
        </motion.div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute -z-10 inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-300/5 rounded-full filter blur-3xl"></div>
      </div>
    </section>
  );
};

export default AboutSacredShifter;
