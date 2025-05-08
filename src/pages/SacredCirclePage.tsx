
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SacredCirclePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <AppShell 
      pageTitle="Sacred Circle" 
      chakraColor="#EC4899" // Pink color for sacred circle
    >
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Sacred Circle
          </h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Card */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-black/40 border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white">Welcome to the Sacred Circle</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">
                  Connect with fellow lightbearers on the path of spiritual evolution. 
                  Share wisdom, support each other's journey, and grow together in consciousness.
                </p>
                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={() => navigate("/circle")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Community Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-purple-500/30"
                    onClick={() => navigate("/circle-info")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Featured Member Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/40 border-purple-500/30 h-full">
              <CardHeader>
                <CardTitle className="text-lg text-white">Featured Lightbearers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Meet fellow seekers and connect with other spiritual travelers on the path.
                </p>
                <div className="mt-4 space-y-2">
                  {['Harmony Celestia', 'Luna Stellar', 'Orion Light'].map((name, i) => (
                    <div key={i} className="flex items-center p-2 hover:bg-white/5 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-purple-700/30 flex items-center justify-center mr-3">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{name}</p>
                        <p className="text-xs text-gray-400">Active Now</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="ghost" size="sm" className="w-full text-sm text-purple-300">
                    View All Members
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Coming Soon Features */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/30 border-indigo-500/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2 text-white">Coming Soon</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Sacred Discussions', desc: 'Thread-based wisdom sharing' },
                  { title: 'Frequency Circles', desc: 'Group healing sessions' },
                  { title: 'Lightbearer Events', desc: 'Virtual gathering ceremonies' }
                ].map((feature, i) => (
                  <div key={i} className="p-3 bg-black/20 border border-indigo-500/10 rounded-lg">
                    <h4 className="font-medium text-indigo-300">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default SacredCirclePage;
