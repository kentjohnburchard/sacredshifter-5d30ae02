import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Music, 
  Heart, 
  BookOpen, 
  Brain, 
  Triangle, 
  Star, 
  Compass 
} from 'lucide-react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils";
import { useTheme } from '@/context/ThemeContext';
import { hermeticPrinciples } from '@/data/hermeticPrinciples';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import Logo from '@/components/navigation/SidebarLogo';

const SacredShifterHome = () => {
  const { liftTheVeil } = useTheme();
  const { user } = useAuth();
  const [activeHermeticPrinciple, setActiveHermeticPrinciple] = useState<string>("vibration");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const hermeticPrinciplesArray = Object.values(hermeticPrinciples);

  return (
    <AnimatedBackground theme={liftTheVeil ? 'temple' : 'cosmic'} intensity="medium" staticBackground={false}>
      <Layout 
        pageTitle="Sacred Shifter - Transform Your Consciousness" 
        showNavbar={true}
        hideHeader={true}
        showGlobalWatermark={true}
      >
        <div className="w-full relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-0"></div>
          
          <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
              <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor={liftTheVeil ? "#FF70E9" : "#8B5CF6"} stopOpacity="0.8"/>
                  <stop offset="100%" stopColor={liftTheVeil ? "#B967FF" : "#6366F1"} stopOpacity="0"/>
                </radialGradient>
              </defs>
              
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 2 }}
              >
                <motion.circle 
                  cx="50" cy="50" r="8" 
                  fill="none" 
                  stroke={liftTheVeil ? "url(#glow)" : "url(#glow)"} 
                  strokeWidth="0.2"
                  animate={{ 
                    r: [8, 8.5, 8],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                
                {Array.from({ length: 6 }).map((_, i) => {
                  const angle = (Math.PI * 2 * i) / 6;
                  const x = 50 + 16 * Math.cos(angle);
                  const y = 50 + 16 * Math.sin(angle);
                  
                  return (
                    <motion.circle 
                      key={`circle-1-${i}`}
                      cx={x} cy={y} r="8" 
                      fill="none" 
                      stroke={liftTheVeil ? "url(#glow)" : "url(#glow)"} 
                      strokeWidth="0.2"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{ 
                        duration: 4,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  );
                })}
                
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (Math.PI * 2 * i) / 12;
                  const x = 50 + 24 * Math.cos(angle);
                  const y = 50 + 24 * Math.sin(angle);
                  
                  return (
                    <motion.circle 
                      key={`circle-2-${i}`}
                      cx={x} cy={y} r="8" 
                      fill="none" 
                      stroke={liftTheVeil ? "url(#glow)" : "url(#glow)"} 
                      strokeWidth="0.1"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{ 
                        duration: 5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                  );
                })}
              </motion.g>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 z-10">
            <motion.div 
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div 
                className="mx-auto mb-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1.2 }}
              >
                <Logo />
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold font-playfair tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                  Transform Your Consciousness
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl max-w-3xl mx-auto text-purple-100/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Sacred sound frequencies, spiritual mathematics, and vibrational healing for your journey to higher consciousness.
              </motion.p>
              
              <motion.div 
                className="pt-8 flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 text-lg"
                >
                  <Link to="/sacred-blueprint">
                    Discover Your Sacred Blueprint <Sparkles className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-purple-400/50 hover:bg-purple-900/20 text-purple-100 rounded-full px-8 py-6 text-lg"
                >
                  <Link to="/frequency-library">
                    Explore Frequencies <Music className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                <ArrowRight size={24} className="rotate-90" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-100 mb-4">
                Sacred Frequencies & Spiritual Technology
              </h2>
              <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
                Sacred Shifter combines ancient wisdom with modern science to create powerful tools for transformation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="Sacred Blueprint™"
                description="Discover your unique energetic signature and spiritual path through vibrational analysis."
                icon={<Sparkles className="h-8 w-8 text-indigo-400" />}
                to="/sacred-blueprint"
                color={liftTheVeil ? "pink" : "indigo"}
              />
              
              <FeatureCard 
                title="Frequency Library"
                description="Access healing frequencies calibrated to balance chakras and elevate consciousness."
                icon={<Music className="h-8 w-8 text-blue-400" />}
                to="/frequency-library"
                color={liftTheVeil ? "pink" : "blue"}
              />
              
              <FeatureCard 
                title="Heart Center"
                description="Tools for heart coherence, emotional healing, and opening the heart chakra."
                icon={<Heart className="h-8 w-8 text-pink-400" />}
                to="/heart-center"
                color={liftTheVeil ? "pink" : "pink"}
              />
              
              <FeatureCard 
                title="Trinity Gateway™"
                description="Access the tripartite nature of consciousness through sacred geometry and sound."
                icon={<Triangle className="h-8 w-8 text-amber-400" />}
                to="/trinity-gateway"
                color={liftTheVeil ? "pink" : "amber"}
              />
              
              <FeatureCard 
                title="Shift Perception"
                description="Techniques to transform consciousness and shift into higher states of awareness."
                icon={<Brain className="h-8 w-8 text-purple-400" />}
                to="/shift-perception"
                color={liftTheVeil ? "pink" : "purple"}
              />
              
              <FeatureCard 
                title="Hermetic Wisdom"
                description="Ancient teachings of Hermes Trismegistus presented for modern spiritual seekers."
                icon={<BookOpen className="h-8 w-8 text-emerald-400" />}
                to="/hermetic-wisdom"
                color={liftTheVeil ? "pink" : "emerald"}
              />
            </div>
          </div>
        </section>
        
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-gray-900/40 z-0"></div>
          
          <div className="absolute inset-0 opacity-20">
            <div className="absolute w-full h-full">
              {Array.from({ length: 7 }).map((_, i) => {
                const size = 30 + i * 20;
                return (
                  <motion.div
                    key={`geo-circle-${i}`}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-300/30"
                    style={{ width: `${size}%`, height: `${size}%` }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 100 + i * 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-blue-100 mb-4">
                The Seven Hermetic Principles
              </h2>
              <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
                Ancient universal laws that govern the cosmos, consciousness, and all reality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-4">
                {hermeticPrinciplesArray.map((principle) => (
                  <motion.div
                    key={principle.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      activeHermeticPrinciple === principle.id 
                        ? `bg-${principle.color ? principle.color.substring(1) : 'purple'}-900/30 border border-${principle.color ? principle.color.substring(1) : 'purple'}-500/50` 
                        : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => setActiveHermeticPrinciple(principle.id)}
                    whileHover={{ x: 5 }}
                  >
                    <h3 className="font-medium text-white">
                      {principle.name}
                    </h3>
                  </motion.div>
                ))}
              </div>
              
              <div className="md:col-span-2">
                {hermeticPrinciplesArray.map((principle) => {
                  const isActive = activeHermeticPrinciple === principle.id;
                  
                  return (
                    <motion.div
                      key={`details-${principle.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: isActive ? 1 : 0,
                        x: isActive ? 0 : 20,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`absolute ${isActive ? 'relative' : 'hidden'}`}
                    >
                      <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl">
                        <div className="flex items-center mb-4">
                          <div className="mr-4">
                            <div 
                              className="w-16 h-16 flex items-center justify-center rounded-full"
                              style={{ backgroundColor: `${principle.color}30` }}
                            >
                              <span className="text-2xl">{principle.symbol}</span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-white">{principle.name}</h3>
                            {principle.chakra && (
                              <span 
                                className="text-sm px-3 py-1 rounded-full" 
                                style={{ backgroundColor: `${principle.color}30`, color: principle.color }}
                              >
                                {principle.chakra} Chakra
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <blockquote className="italic text-lg border-l-4 pl-4 my-4" style={{ borderColor: principle.color }}>
                          "{principle.principle}"
                        </blockquote>
                        
                        <p className="text-gray-300">{principle.description}</p>
                        
                        {principle.frequency && (
                          <div className="mt-4 flex items-center">
                            <span className="text-sm text-gray-400">Resonant Frequency:</span>
                            <span className="ml-2 text-white">{principle.frequency} Hz</span>
                          </div>
                        )}
                        
                        <div className="mt-6">
                          <Button 
                            asChild
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-800"
                          >
                            <Link to="/hermetic-wisdom">
                              Explore Hermetic Teachings
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 mb-4">
                Explore Sacred Shifter
              </h2>
              <p className="text-lg text-purple-100/80 max-w-2xl mx-auto">
                Navigate through our sacred spaces and tools for consciousness expansion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NavigationCard 
                title="Harmonic Map"
                description="Interactive map of frequencies and their relationships."
                icon={<Compass />}
                to="/harmonic-map"
              />
              
              <NavigationCard 
                title="Astrology"
                description="Discover how celestial bodies influence consciousness."
                icon={<Star />}
                to="/astrology"
              />
              
              <NavigationCard 
                title="Prime Frequency"
                description="Experience the power of prime number resonance."
                icon={<Music />}
                to="/prime-frequency"
              />
              
              <NavigationCard 
                title="Journey Templates"
                description="Pre-designed paths for specific transformational experiences."
                icon={<Compass />}
                to="/journey-templates"
              />
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <Link to="/site-map">
                  Explore Full Site Map <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {!user && (
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black/70 z-0"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto backdrop-blur-md bg-black/30 p-8 md:p-12 rounded-xl border border-purple-500/20 shadow-2xl">
                <div className="text-center mb-8">
                  <motion.h2 
                    className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    Join the Sacred Shift Today
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Create your free account to access personalized frequencies, save your favorite journeys, and track your spiritual progress.
                  </motion.p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full px-8"
                  >
                    <Link to="/auth?signup=true">
                      Create Free Account
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg" 
                    className="border-purple-400 text-purple-100 rounded-full px-8"
                  >
                    <Link to="/auth">
                      Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </Layout>
    </AnimatedBackground>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, to, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={to}>
        <Card className={`h-full border-${color}-500/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-300`}>
          <CardHeader>
            <div className={`w-12 h-12 rounded-lg bg-${color}-950/50 flex items-center justify-center mb-3`}>
              {icon}
            </div>
            <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-300">{description}</CardDescription>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ title, description, icon, to }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={to} className="block h-full">
        <div className="h-full flex flex-col justify-between p-6 backdrop-blur-sm bg-purple-900/10 border border-purple-500/20 rounded-xl shadow-lg hover:shadow-purple-500/5 hover:border-purple-500/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          <div className="mt-4 text-purple-400 flex items-center text-sm">
            Explore <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SacredShifterHome;
