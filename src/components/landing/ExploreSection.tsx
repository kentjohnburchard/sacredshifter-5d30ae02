
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Music, Activity, Users, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface JourneyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  delay: number;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ title, description, icon, link, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="bg-black/30 backdrop-blur-md border-purple-500/20 hover:border-purple-500/50 transition-all h-full">
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-purple-900/50 flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 mb-4">{description}</p>
            <Link 
              to={link} 
              className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center"
            >
              Explore Journey
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ExploreSection: React.FC = () => {
  const journeyCards = [
    {
      title: "Heart Center",
      description: "Open and align your heart chakra with healing frequencies and guided meditations.",
      icon: <Heart className="h-8 w-8 text-pink-400" />,
      link: "/journey/heart-center",
      delay: 0
    },
    {
      title: "Lightbearer Path",
      description: "Activate your light body and enhance your spiritual growth journey.",
      icon: <Star className="h-8 w-8 text-amber-400" />,
      link: "/lightbearer",
      delay: 1
    },
    {
      title: "Sacred Circle",
      description: "Connect with your spiritual family in our vibration-aligned community.",
      icon: <Users className="h-8 w-8 text-blue-400" />,
      link: "/sacred-circle",
      delay: 2
    },
    {
      title: "Frequency Healing",
      description: "Experience powerful solfeggio frequencies for healing and transformation.",
      icon: <Music className="h-8 w-8 text-violet-400" />,
      link: "/frequency",
      delay: 3
    },
    {
      title: "Cosmic Blueprint",
      description: "Discover your unique soul signature and cosmic purpose.",
      icon: <Activity className="h-8 w-8 text-cyan-400" />,
      link: "/cosmic-blueprint",
      delay: 4
    },
    {
      title: "Sacred Knowledge",
      description: "Explore ancient wisdom and modern consciousness teachings.",
      icon: <BookOpen className="h-8 w-8 text-green-400" />,
      link: "/knowledge",
      delay: 5
    }
  ];

  return (
    <section className="py-24 px-6 relative" id="journeys">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-playfair font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Sacred Journeys
          </motion.h2>
          <motion.p
            className="text-xl text-white/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Choose your path of spiritual awakening through our curated frequency experiences
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journeyCards.map((card, index) => (
            <JourneyCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              link={card.link}
              delay={card.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
