
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Music, HeartPulse, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ExperienceProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  link: string;
  linkText: string;
  delay: number;
}

const ExperienceCard: React.FC<ExperienceProps> = ({ icon, title, description, color, link, linkText, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <Card className={`h-full border-${color}-500/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-500`}>
        <CardContent className="p-6 flex flex-col h-full">
          <div className={`w-12 h-12 rounded-full bg-${color}-900/30 flex items-center justify-center mb-4`}>
            {icon}
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-300 mb-auto">{description}</p>
          <div className="mt-6">
            <Button 
              asChild 
              variant="outline" 
              className={`border-${color}-400/50 hover:bg-${color}-900/20 text-${color}-100 w-full`}
            >
              <Link to={link}>
                {linkText}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturedExperiences: React.FC = () => {
  const experiences: ExperienceProps[] = [
    {
      icon: <Book className="h-6 w-6 text-purple-400" />,
      title: "Meditation Journeys",
      description: "Guided meditation experiences designed to expand consciousness and connect with higher realms of awareness.",
      color: "purple",
      link: "/meditation",
      linkText: "Begin Meditation",
      delay: 0.2
    },
    {
      icon: <Music className="h-6 w-6 text-indigo-400" />,
      title: "Frequency Healing",
      description: "Sacred sound frequencies calibrated to restore harmony and balance to your energetic fields.",
      color: "indigo",
      link: "/frequency-library",
      linkText: "Explore Frequencies",
      delay: 0.4
    },
    {
      icon: <Star className="h-6 w-6 text-pink-400" />,
      title: "Sacred Geometry",
      description: "Visual journeys through the divine blueprint patterns that form the foundation of all creation.",
      color: "pink",
      link: "/sacred-geometry",
      linkText: "Enter Sacred Geometry",
      delay: 0.6
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-blue-400" />,
      title: "Conscious Practices",
      description: "Daily rituals and practices to cultivate presence, intentionality, and spiritual connection.",
      color: "blue",
      link: "/practices",
      linkText: "Discover Practices",
      delay: 0.8
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gentle Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 via-black/80 to-indigo-950/10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sacred <span className="text-indigo-300">Experiences</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Embark on transformative journeys designed to elevate your consciousness and 
            connect with the divine blueprint within
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mt-12"
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-full px-8"
          >
            <Link to="/ascended-path">
              Explore Premium Sacred Journeys
            </Link>
          </Button>
        </motion.div>
      </div>
      
      {/* Accessibility Support */}
      <style jsx="false">{`
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

export default FeaturedExperiences;
