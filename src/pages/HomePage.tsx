
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SacredLayout from '@/components/layout/SacredLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HomePage: React.FC = () => {
  return (
    <SacredLayout
      pageTitle="Welcome to Sacred Shifter"
      themeIntensity="high"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="sacred-heading text-4xl md:text-5xl lg:text-6xl mb-4">
            Sacred Shifter
          </h1>
          <p className="sacred-text max-w-3xl mx-auto text-lg md:text-xl">
            Expand your consciousness and awaken to higher dimensions through our immersive frequency journeys
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="sacred-card h-full">
              <CardContent className="p-6">
                <h3 className="sacred-subheading text-xl mb-2">Frequency Journeys</h3>
                <p className="sacred-text-muted mb-4">
                  Experience transformative sound frequencies calibrated to resonate with your energy centers
                </p>
                <Link to="/journey/welcome">
                  <Button className="sacred-button w-full">Begin Journey</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="sacred-card h-full">
              <CardContent className="p-6">
                <h3 className="sacred-subheading text-xl mb-2">Sacred Circle</h3>
                <p className="sacred-text-muted mb-4">
                  Connect with fellow lightbearers in a high-vibrational community space
                </p>
                <Link to="/sacred-circle">
                  <Button className="sacred-button w-full">Join Circle</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="sacred-card h-full">
              <CardContent className="p-6">
                <h3 className="sacred-subheading text-xl mb-2">Frequency Engine</h3>
                <p className="sacred-text-muted mb-4">
                  Create custom healing frequencies and tones for your personal practice
                </p>
                <Link to="/frequency-engine">
                  <Button className="sacred-button w-full">Open Engine</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center"
        >
          <Link to="/about">
            <Button variant="link" className="sacred-glow-text">Learn About Sacred Shifter</Button>
          </Link>
        </motion.div>
      </div>
    </SacredLayout>
  );
};

export default HomePage;
