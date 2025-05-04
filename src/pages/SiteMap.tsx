
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navItems } from '@/config/navigation';
import { ChevronRight, ExternalLink, Map } from 'lucide-react';
import * as Icons from 'lucide-react';

// Group navigation items by category
const groupedNavItems = {
  "Home & Dashboard": navItems.filter(item => 
    ['home', 'dashboard', 'journeyScroll', 'heartDashboard', 'siteMap'].includes(item.key)),
  
  "Self Discovery": navItems.filter(item => 
    ['sacredBlueprint', 'emotionEngine', 'mirrorPortal', 'shiftPerception'].includes(item.key)),
  
  "Frequency Tools": navItems.filter(item => 
    ['frequencyLibrary', 'musicGenerator', 'frequencyShift', 'harmonicMap'].includes(item.key)),
  
  "Spiritual Practice": navItems.filter(item => 
    ['heartCenter', 'trinityGateway', 'energyCheck', 'focus'].includes(item.key)),
  
  "Wisdom & Knowledge": navItems.filter(item => 
    ['hermeticWisdom', 'hermeticPrinciples', 'soulScribe', 'timeline', 'astrology'].includes(item.key)),
  
  "Sacred Journeys": navItems.filter(item => 
    ['journeyTemplates', 'deityOracle', 'astralAttunement'].includes(item.key)),
  
  "Other": navItems.filter(item => 
    ['subscription', 'profile', 'aboutFounder', 'contact', 'alignment'].includes(item.key))
};

const SiteMap: React.FC = () => {
  return (
    <Layout 
      pageTitle="Site Map | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-300"
              style={{textShadow: '0 2px 10px rgba(45, 212, 191, 0.7)'}}>
            Sacred Shifter Site Map
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Navigate the entire Sacred Shifter journey with this comprehensive map of all available experiences and resources.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedNavItems).map(([category, items], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
            >
              <Card className="h-full bg-black/60 border-teal-500/30 backdrop-blur-md overflow-hidden">
                <div className="p-4 border-b border-teal-500/30">
                  <h2 className="text-xl font-semibold text-teal-200 flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    {category}
                  </h2>
                </div>
                
                <CardContent className="p-0">
                  <ul className="divide-y divide-teal-500/10">
                    {items.map((item, index) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className="flex items-center p-4 hover:bg-teal-500/10 transition-colors text-gray-200 hover:text-teal-200"
                        >
                          <div className="h-8 w-8 rounded-full bg-teal-500/10 flex items-center justify-center mr-3">
                            {/* @ts-ignore - we know these icon names exist in Lucide */}
                            {React.createElement(Icons[item.icon] || Icons.Layers, {
                              className: "h-4 w-4 text-teal-300"
                            })}
                          </div>
                          <div>
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 ml-auto text-teal-500/50" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="bg-black/60 border-teal-500/30 backdrop-blur-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-teal-200 flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              External Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Link to="#" className="p-3 rounded-md bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-colors">
                Sacred Shifter Blog
              </Link>
              <Link to="#" className="p-3 rounded-md bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-colors">
                YouTube Channel
              </Link>
              <Link to="#" className="p-3 rounded-md bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-colors">
                Community Forum
              </Link>
              <Link to="#" className="p-3 rounded-md bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-colors">
                Research Papers
              </Link>
              <Link to="#" className="p-3 rounded-md bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-colors">
                Mobile Apps
              </Link>
              <Link to="#" className="p-3 rounded-md bg-teal-500/10 text-teal-200 hover:bg-teal-500/20 transition-colors">
                Partner Resources
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SiteMap;
