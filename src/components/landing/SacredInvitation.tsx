import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const SacredInvitation: React.FC = () => {
  const features = [
    {
      title: "Sacred Circle Community",
      description: "Connect with like-minded souls on the path of conscious evolution",
      icon: <Users className="h-6 w-6 text-purple-400" />,
      delay: 0.2
    },
    {
      title: "Sacred Geometry Journeys",
      description: "Experience the divine blueprint through immersive visual meditations",
      icon: <Star className="h-6 w-6 text-indigo-400" />,
      delay: 0.4
    },
    {
      title: "Frequency Healing",
      description: "Align your energy with sacred frequencies and cosmic harmonics",
      icon: <Music className="h-6 w-6 text-pink-400" />,
      delay: 0.6
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Sacred Background Effect - Gentle and Accessible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-purple-950/10 to-black/50 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the <span className="text-purple-300">Sacred Circle</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            A conscious community dedicated to spiritual growth, energetic alignment, 
            and the expansion of human consciousness through sacred practices
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: feature.delay }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full border-purple-500/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-8 rounded-2xl backdrop-blur-sm border border-purple-500/30"
        >
          <h3 className="text-2xl font-bold text-center text-white mb-4">
            Begin Your Sacred Journey
          </h3>
          <p className="text-gray-200 text-center mb-6">
            Take the first step into a world of conscious expansion, frequency alignment,
            and sacred connection with like-minded souls
          </p>
          <div className="flex justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full px-8 py-6"
            >
              <Link to="/circle">
                Join the Sacred Circle <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Accessibility Support */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .motion-reduce {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default SacredInvitation;
