
import React from "react";
import { motion } from "framer-motion";
import { Logo, AnimatedText, CallToAction } from "@/components/landing";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Heart, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Layout pageTitle="Welcome" useBlueWaveBackground={true}>
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Logo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-6 mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-4">
              Welcome to Sacred Shifter
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Experience the healing power of sacred frequencies and sound vibrations
            </p>
          </motion.div>

          <div className="space-y-6 mb-12">
            <AnimatedText text="Expand Your Consciousness" className="delay-300" />
            <AnimatedText text="Elevate Your Frequency" className="delay-500" />
            <AnimatedText text="Transform Your Energy" className="delay-700" />
          </div>

          <CallToAction to="/dashboard">
            Begin Your Journey
          </CallToAction>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-12">
          {[
            { 
              title: 'Sound Healing', 
              description: 'Frequency-based sound healing journeys', 
              path: '/journey-templates', 
              icon: <Music className="h-6 w-6" />,
              color: 'border-purple-500/20' 
            },
            { 
              title: 'Heart Center', 
              description: 'Open and balance your heart chakra', 
              path: '/heart-center', 
              icon: <Heart className="h-6 w-6" />,
              color: 'border-pink-500/20'  
            },
            { 
              title: 'Sacred Blueprint', 
              description: 'Discover your unique energetic signature', 
              path: '/sacred-blueprint', 
              icon: <Sparkles className="h-6 w-6" />,
              color: 'border-indigo-500/20'  
            },
            { 
              title: 'Hermetic Wisdom', 
              description: 'Ancient wisdom for modern consciousness', 
              path: '/hermetic-wisdom', 
              icon: <BookOpen className="h-6 w-6" />,
              color: 'border-blue-500/20'  
            },
          ].map(({ title, description, path, icon, color }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className={`bg-black/30 backdrop-blur-sm border ${color} hover:bg-black/40 transition-all h-full`}
              >
                <CardContent className="pt-6">
                  <div className="p-3 mb-3 rounded-full bg-black/40 w-fit border border-purple-500/20">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-300 mb-4">{description}</p>
                  <Link to={path} className="text-purple-300 hover:text-purple-100 inline-flex items-center">
                    Explore <span className="ml-1">→</span>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
