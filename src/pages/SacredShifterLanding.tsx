import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SacredFlowerOfLife from '@/components/sacred-geometry/shapes/SacredFlowerOfLife';
import MetatronsCube from '@/components/sacred-geometry/shapes/MetatronsCube';
import Merkaba from '@/components/sacred-geometry/shapes/Merkaba';
import Torus from '@/components/sacred-geometry/shapes/Torus';
import TreeOfLife from '@/components/sacred-geometry/shapes/TreeOfLife';
import SriYantra from '@/components/sacred-geometry/shapes/SriYantra';
import VesicaPiscis from '@/components/sacred-geometry/shapes/VesicaPiscis';
import StarfieldBackground from '@/components/sacred-geometry/StarfieldBackground';
import { Music, Heart, Sparkles, BookOpen, Brain, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import FixedFooter from '@/components/navigation/FixedFooter';
import Sidebar from '@/components/Sidebar';
import ConsciousnessToggle from '@/components/ConsciousnessToggle';
import Watermark from '@/components/Watermark';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const geometryComponents = {
  'Flower of Life': <SacredFlowerOfLife />,
  "Metatron's Cube": <MetatronsCube />,
  'Merkaba': <Merkaba />,
  'Torus': <Torus />,
  'Tree of Life': <TreeOfLife />,
  'Sri Yantra': <SriYantra />,
  'Vesica Piscis': <VesicaPiscis />,
};

const SacredShifterLanding = () => {
  const [selectedShape, setSelectedShape] = useState("Flower of Life");
  const { liftTheVeil } = useTheme();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-black via-[#0a0118] to-black text-white font-sans overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <StarfieldBackground density="medium" opacity={0.8} isStatic={false} />
      </div>

      <Sidebar />
      <Watermark />

      <div className="ml-20">
        <div className="fixed inset-0 z-1 pointer-events-none flex items-center justify-center">
          <div className="w-[180vw] h-[180vh] max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.9, scale: 1 }} 
              transition={{ duration: 1.5 }}
            >
              {geometryComponents[selectedShape]}
            </motion.div>
          </div>
        </div>

        <div className="fixed right-4 top-4 z-20">
          <nav className={cn(
            "backdrop-blur-sm p-3 rounded-xl border opacity-90",
            liftTheVeil ? "bg-pink-950/30" : "bg-black/30",
            liftTheVeil ? "border-pink-900/30" : "border-purple-900/30"
          )}>
            <div className="flex flex-col space-y-2">
              {Object.keys(geometryComponents).map((shape) => (
                <button
                  key={shape}
                  onClick={() => setSelectedShape(shape)}
                  className={cn(
                    "text-sm whitespace-nowrap text-white hover:text-purple-300 transition-all duration-300 flex items-center gap-2",
                    selectedShape === shape ? (liftTheVeil ? "text-pink-300" : "text-purple-300") : ""
                  )}
                >
                  <span className={cn(
                    "h-2 w-2 rounded-full opacity-90",
                    selectedShape === shape 
                      ? (liftTheVeil ? "bg-pink-500" : "bg-purple-500") 
                      : (liftTheVeil ? "bg-pink-900" : "bg-purple-900")
                  )}></span>
                  {shape}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <header id="home" className="text-center pt-32 pb-16 relative z-10">
            <div className="flex justify-center items-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="w-full flex justify-center"
              >
                <img 
                  src="/lovable-uploads/55c4de0c-9d48-42df-a6a2-1bb6520acb46.png" 
                  alt="Sacred Shifter Logo" 
                  className="mx-auto w-64 md:w-80 drop-shadow-xl" 
                />
              </motion.div>
            </div>
            <h1 className="sr-only">Sacred Shifter</h1>
            <motion.p 
              className={cn(
                "text-xl max-w-2xl mx-auto font-light tracking-wide",
                liftTheVeil ? "text-pink-100/80" : "text-purple-100/80"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.6, duration: 1.5 }}
            >
              Explore frequency-based healing, sacred geometry, and consciousness expansion in this interdimensional portal
            </motion.p>
          </header>

          <motion.div 
            className="mt-12 max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <div className={cn(
              "backdrop-blur-sm p-8 rounded-xl border",
              liftTheVeil 
                ? "bg-pink-950/30 border-pink-900/30" 
                : "bg-black/30 border-purple-900/30"
            )}>
              <h2 className={cn(
                "text-2xl font-medium mb-6", 
                liftTheVeil ? "text-pink-200" : "text-purple-200"
              )}>
                About Sacred Shifter
              </h2>
              <div className="text-gray-300 space-y-4">
                {liftTheVeil ? (
                  <>
                    <p>
                      <strong>Sacred Shifter</strong> is a gateway to cosmic transformation and dimensional expansion.
                    </p>
                    <p>
                      Birthed in the etheric realms between quantum consciousness and ancient stardust, Sacred Shifter 
                      weaves celestial frequencies, multidimensional visuals, and your unique cosmic blueprint into a 
                      journey beyond the veil. This portal activates dormant DNA codes and crystalline structures within 
                      your energy field, facilitating remembrance of your stellar origins.
                    </p>
                    <p>
                      Immerse in your personalized frequency matrix, guided by stellar alignments, sacred mathematics, 
                      and the whispers of your higher self. Customize your interdimensional voyage, attune to your 
                      galactic signature, and allow each frequency to recalibrate your field to its original divine template.
                    </p>
                    <div className="mt-6 font-light italic">
                      <p>You're not just experiencing sound.<br />
                      You're remembering your multidimensional essence.<br />
                      You're activating your crystalline DNA.<br />
                      You're becoming the cosmic shifter you always were.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Sacred Shifter</strong> is more than an app—it's your portal to vibrational transformation.
                    </p>
                    <p>
                      Crafted at the crossroads of ancient wisdom and next-gen tech, Sacred Shifter weaves healing frequencies, 
                      fractal visuals, and personalised cosmic insights into a one-of-a-kind experience. Whether you're aligning 
                      your chakras, syncing with the moon, or just trying to shake off yesterday's energetic gunk, this is your 
                      sacred space to shift.
                    </p>
                    <p>
                      Dive into your personal soundscape, guided by real-time resonance, sacred geometry, and the whispers of 
                      your star chart. Customise your vibe, tune into your essence, and let every frequency move you closer to 
                      who you truly are.
                    </p>
                    <div className="mt-6 font-light italic">
                      <p>You're not just listening to music.<br />
                      You're remembering your power.<br />
                      You're rewriting your frequency.<br />
                      You're becoming your own sacred shift.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.section 
            id="experiences" 
            className="mt-20 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto z-10 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {[
              { 
                title: 'Sound Healing', 
                description: 'Frequency-based sound healing journeys', 
                path: '/journey-templates', 
                icon: <Music className="h-6 w-6" />,
                color: 'from-purple-800/5 to-indigo-900/5 border-purple-500/10' 
              },
              { 
                title: 'Meditation', 
                description: 'Guided meditations with sacred frequencies', 
                path: '/meditation', 
                icon: <BookOpen className="h-6 w-6" />,
                color: 'from-blue-800/5 to-cyan-900/5 border-blue-500/10'  
              },
              { 
                title: 'Heart Center', 
                description: 'Open and balance your heart chakra', 
                path: '/heart-center', 
                icon: <Heart className="h-6 w-6" />,
                color: 'from-pink-800/5 to-red-900/5 border-pink-500/10'  
              },
              { 
                title: 'Manifestation', 
                description: 'Focus your energy to manifest intentions', 
                path: '/focus', 
                icon: <Brain className="h-6 w-6" />,
                color: 'from-emerald-800/5 to-green-900/5 border-emerald-500/10'  
              },
              { 
                title: 'Astrology', 
                description: 'Discover your cosmic blueprint', 
                path: '/astrology', 
                icon: <Star className="h-6 w-6" />,
                color: 'from-amber-800/5 to-orange-900/5 border-amber-500/10'  
              },
              { 
                title: 'Hermetic Wisdom', 
                description: 'Ancient wisdom for modern consciousness', 
                path: '/hermetic-wisdom', 
                icon: <Sparkles className="h-6 w-6" />,
                color: 'from-violet-800/5 to-fuchsia-900/5 border-violet-500/10'  
              },
            ].map(({ title, description, path, icon, color }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white border backdrop-blur-md bg-opacity-5 shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex flex-col items-center md:items-start">
                  <div className="p-3 mb-3 rounded-full bg-black/5 backdrop-blur-sm border border-purple-500/10">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                </div>
                <p className="text-sm text-gray-200/90">{description}</p>
                <Link to={path} className="mt-4 inline-flex items-center gap-1 text-purple-300 hover:text-purple-200 transition-colors font-medium">
                  Explore <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            ))}
          </motion.section>

          <motion.section 
            id="frequencies" 
            className="mt-24 py-16 px-6 max-w-5xl mx-auto z-10 relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <h2 className={cn(
              "text-2xl font-semibold text-center mb-8",
              liftTheVeil ? "text-pink-200" : "text-white"
            )}>
              Sacred Frequencies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { freq: "432 Hz", desc: "Earth Frequency", color: liftTheVeil ? "bg-pink-500/20" : "bg-emerald-500/20" },
                { freq: "528 Hz", desc: "Heart Frequency", color: liftTheVeil ? "bg-rose-500/20" : "bg-green-500/20" },
                { freq: "639 Hz", desc: "Connection", color: liftTheVeil ? "bg-fuchsia-500/20" : "bg-sky-500/20" },
                { freq: "741 Hz", desc: "Expression", color: liftTheVeil ? "bg-purple-500/20" : "bg-indigo-500/20" },
              ].map(item => (
                <div 
                  key={item.freq} 
                  className={cn(
                    "p-4 rounded-xl backdrop-blur-md border text-center",
                    item.color, 
                    liftTheVeil ? "border-pink-300/10" : "border-white/10"
                  )}
                >
                  <h3 className="text-xl font-bold">{item.freq}</h3>
                  <p className="text-sm opacity-80">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.div
            className={cn(
              "mt-16 mb-10 max-w-2xl mx-auto backdrop-blur-sm rounded-lg p-6 border",
              liftTheVeil 
                ? "bg-pink-950/30 border-pink-500/20" 
                : "bg-black/30 border-purple-500/20"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
          >
            <blockquote className={cn(
              "italic text-center font-light",
              liftTheVeil ? "text-pink-100/90" : "text-purple-100/90"
            )}>
              {liftTheVeil 
                ? "\"The universe is not outside of you. Look inside yourself; everything that you seek is already there.\""
                : "\"The universe is not outside of you. Look inside yourself; everything that you want, you already are.\""
              }
              <footer className={cn(
                "mt-2 text-sm",
                liftTheVeil ? "text-pink-300/70" : "text-purple-300/70"
              )}>
                — Rumi
              </footer>
            </blockquote>
          </motion.div>

          <motion.footer 
            className="mt-24 pb-24 text-center z-10 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <div className={cn(
              "backdrop-blur-md rounded-full py-3 px-6 inline-flex items-center gap-3 border",
              liftTheVeil 
                ? "bg-pink-950/20 border-pink-500/10" 
                : "bg-black/20 border-purple-500/10"
            )}>
              <div className={cn(
                "h-2 w-2 rounded-full animate-pulse",
                liftTheVeil ? "bg-pink-500" : "bg-purple-500"
              )}></div>
              <audio className="mx-auto">
                <source src="/audio/528hz-heart.mp3" type="audio/mpeg" />
              </audio>
              <p className={cn(
                "text-sm font-medium",
                liftTheVeil ? "text-pink-300" : "text-purple-300"
              )}>
                528Hz - Heart Chakra
              </p>
            </div>
            <div className="mt-4 text-xs text-gray-500/60">
              © {new Date().getFullYear()} Sacred Shifter. All rights reserved.
            </div>
          </motion.footer>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10">
        <FixedFooter />
      </div>
      
      <ConsciousnessToggle />
    </div>
  );
};

export default SacredShifterLanding;
