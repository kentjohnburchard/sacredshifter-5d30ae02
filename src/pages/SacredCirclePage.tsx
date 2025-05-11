
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Sparkles } from 'lucide-react';

const SacredCirclePage: React.FC = () => {
  return (
    <AppShell 
      pageTitle="Sacred Circle" 
      showSidebar={true}
      chakraColor="#8B5CF6"
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Sacred Circle</h1>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Connect with fellow light workers in a space of shared consciousness and spiritual growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="mr-2 h-5 w-5 text-purple-400" />
                Community Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Join a vibrant community of spiritual seekers sharing their journey toward higher consciousness.
              </p>
              <Button variant="outline" className="w-full border-purple-500/50 text-purple-200">
                Explore Community
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <MessageCircle className="mr-2 h-5 w-5 text-purple-400" />
                Sacred Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Engage in meaningful conversations about spiritual practices, experiences, and insights.
              </p>
              <Button variant="outline" className="w-full border-purple-500/50 text-purple-200">
                Join Discussions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
                Collective Journeys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Participate in collective meditation sessions, frequency shifts, and synchronized ceremonies.
              </p>
              <Button variant="outline" className="w-full border-purple-500/50 text-purple-200">
                Upcoming Events
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-purple-200 mb-6">
            Ready to connect with your spiritual tribe?
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800">
            Join Sacred Circle
          </Button>
        </motion.div>
      </div>
    </AppShell>
  );
};

export default SacredCirclePage;
