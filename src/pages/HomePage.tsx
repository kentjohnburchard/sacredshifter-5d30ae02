import React from 'react';
import AppShell from '@/components/layout/AppShell';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Search } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStartJourney = () => {
    navigate('/journey-index');
  };
  
  const handleExploreFeatures = () => {
    navigate('/features');
  };
  
  return (
    <AppShell 
      pageTitle="Sacred Shifter"
      showNavbar={true}
      showGlobalWatermark={true}
    >
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <JourneyAwareSpiralVisualizer 
          showControls={false} 
          containerId="homeSpiral"
        />
        
        <motion.div 
          className="text-center z-10 relative max-w-6xl w-full mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80 mb-4 sacred-heading">
            Welcome to Sacred Shifter
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 sacred-text-glow max-w-3xl mx-auto">
            Embark on a journey of spiritual transformation
          </p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Button 
              variant="gradient"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg shadow-lg shadow-purple-700/20"
              onClick={handleStartJourney}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start My Journey
            </Button>
            
            <Button 
              variant="outline" 
              className="border-purple-500/30 text-white hover:bg-purple-800/30 px-8 py-6 text-lg shadow-lg"
              onClick={handleExploreFeatures}
            >
              <Search className="h-5 w-5 mr-2" />
              Explore Features
            </Button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-6xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div 
              className="bg-black/40 backdrop-blur-lg p-6 rounded-lg border border-purple-500/30 shadow-lg transition-all duration-300 hover:border-purple-500/50 hover:shadow-purple-600/20"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(139, 92, 246, 0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-2 sacred-heading">Sacred Journeys</h2>
              <p className="text-purple-200">Explore guided experiences for spiritual growth</p>
            </motion.div>
            
            <motion.div 
              className="bg-black/40 backdrop-blur-lg p-6 rounded-lg border border-purple-500/30 shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-600/20"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(96, 165, 250, 0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-2 sacred-heading">Sacred Spectrum</h2>
              <p className="text-purple-200">Discover the frequencies that resonate with your soul</p>
            </motion.div>
            
            <motion.div 
              className="bg-black/40 backdrop-blur-lg p-6 rounded-lg border border-purple-500/30 shadow-lg transition-all duration-300 hover:border-green-500/50 hover:shadow-green-600/20"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(74, 222, 128, 0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-2 sacred-heading">Sacred Circle</h2>
              <p className="text-purple-200">Connect with others on the path of enlightenment</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default HomePage;
