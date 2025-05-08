
import React from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Star, Heart, Users, Activity } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Music className="h-12 w-12 text-purple-400" />,
      title: "Frequency Engine",
      description: "Immerse yourself in healing frequencies precisely tuned to Solfeggio and sacred mathematics."
    },
    {
      icon: <Sparkles className="h-12 w-12 text-blue-400" />,
      title: "Sacred Journeys",
      description: "Follow guided spiritual paths designed to elevate consciousness and awaken inner wisdom."
    },
    {
      icon: <Star className="h-12 w-12 text-amber-400" />,
      title: "Lightbearer System",
      description: "Track your spiritual growth and unlock new levels of enlightenment as you progress."
    },
    {
      icon: <Heart className="h-12 w-12 text-red-400" />,
      title: "Chakra Alignment",
      description: "Balance and energize your energy centers with personalized practices and visualizations."
    },
    {
      icon: <Users className="h-12 w-12 text-green-400" />,
      title: "Sacred Circle",
      description: "Connect with like-minded seekers and lightworkers on the path of spiritual growth."
    },
    {
      icon: <Activity className="h-12 w-12 text-indigo-400" />,
      title: "Reality Optimizer",
      description: "Manifest your desires with powerful visualization tools and frequency calibration."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
            What Sacred Shifter Is
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Sacred Shifter is a digital portal for frequency healing, spiritual guidance, and vibrational transformation.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-lg p-6 hover:bg-black/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70 text-center">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
