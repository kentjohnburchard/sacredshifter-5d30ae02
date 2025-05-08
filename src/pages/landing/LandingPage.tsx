
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Heart, Music, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Import landing page sections from components
import {
  HeroSection,
  FeaturesSection,
  JoinSection
} from '@/components/landing';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If user is logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/30 to-black overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Sacred geometry background */}
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-full max-w-6xl">
          <circle cx="400" cy="400" r="150" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="250" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="400" cy="400" r="350" stroke="white" strokeWidth="1" fill="none" />
          <path d="M400 50 L400 750" stroke="white" strokeWidth="1" />
          <path d="M50 400 L750 400" stroke="white" strokeWidth="1" />
          <path d="M400 50 L750 400 L400 750 L50 400 Z" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      </div>
      
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 flex justify-between items-center bg-black/60 backdrop-blur-md">
        <div className="flex items-center">
          <img
            src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
            alt="Sacred Shifter Logo"
            className="h-10"
          />
          <span className="ml-2 text-xl font-semibold text-white">Sacred Shifter</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
          <a href="#community" className="text-white/80 hover:text-white transition-colors">Community</a>
          <a href="#support" className="text-white/80 hover:text-white transition-colors">Support</a>
          <Button variant="outline" className="border-purple-500 text-purple-400" onClick={() => navigate('/auth')}>
            Login / Register
          </Button>
        </div>
        <Button variant="ghost" className="md:hidden text-white">
          <motion.span className="sr-only">Menu</motion.span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </nav>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Mathematical formulas section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-light mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            The <span className="text-purple-400 font-medium">Sacred Mathematics</span> of Frequency
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl text-purple-300 mb-4">Solfeggio Frequencies</div>
              <div className="text-lg text-white/70 mb-2">f = 4.32 × 10<sup>n</sup> Hz</div>
              <div className="text-sm text-white/50">
                Where n = [1, 2, 3, 4, 5, 6, 7, 8, 9]
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl text-blue-300 mb-4">The Golden Ratio</div>
              <div className="text-lg text-white/70 mb-2">φ = (1 + √5) ÷ 2</div>
              <div className="text-sm text-white/50">
                The divine proportion found throughout nature
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl text-green-300 mb-4">Fibonacci Sequence</div>
              <div className="text-lg text-white/70 mb-2">F<sub>n</sub> = F<sub>n-1</sub> + F<sub>n-2</sub></div>
              <div className="text-sm text-white/50">
                The mathematical blueprint of life and growth
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Join Section */}
      <JoinSection />
      
      {/* Footer */}
      <footer className="relative z-10 bg-black/40 py-12 px-6 border-t border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Sacred Shifter</h3>
              <p className="text-gray-400 text-sm">
                Elevating consciousness through sacred frequencies, geometric harmony, and spiritual technology.
              </p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Frequency Library</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sacred Blueprint</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Journey Archive</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.234.585 1.8 1.15.565.566.902 1.132 1.152 1.8.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.8c-.566.565-1.132.902-1.8 1.152-.636.247-1.363.416-2.427.465-1.02.047-1.36.059-3.808.059s-2.784-.012-3.808-.059c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.8-1.153 4.902 4.902 0 01-1.152-1.8c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.8A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Sacred Shifter. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
