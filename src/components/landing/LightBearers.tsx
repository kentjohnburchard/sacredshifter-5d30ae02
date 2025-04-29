
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface BadgeProps {
  name: string;
  description: string;
  level: number;
  color: string;
}

const LightBearers: React.FC = () => {
  const badges: BadgeProps[] = [
    {
      name: "Meditation Guide",
      description: "Helped 10+ souls on their meditation journey",
      level: 3,
      color: "purple"
    },
    {
      name: "Frequency Master",
      description: "Explored and shared insights on sacred frequencies",
      level: 4,
      color: "indigo"
    },
    {
      name: "Sacred Geometer",
      description: "Created and shared sacred geometry insights",
      level: 2,
      color: "pink"
    },
    {
      name: "Cosmic Explorer",
      description: "Traveled deep into cosmic consciousness",
      level: 5,
      color: "blue"
    },
    {
      name: "Heart Healer",
      description: "Supported the emotional healing of the community",
      level: 3,
      color: "rose"
    },
    {
      name: "Light Bearer",
      description: "Consistently uplifted others with positive energy",
      level: 4,
      color: "amber"
    },
    {
      name: "Wisdom Keeper",
      description: "Shared profound spiritual insights",
      level: 5,
      color: "teal"
    },
    {
      name: "Harmonic Resonator",
      description: "Created harmonious energy in community interactions",
      level: 2,
      color: "violet"
    }
  ];

  const getBadgeStyle = (color: string, level: number) => {
    const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors focus:outline-none";
    
    const colorMap: Record<string, string> = {
      purple: `bg-gradient-to-r from-purple-700 to-purple-500 text-white`,
      indigo: `bg-gradient-to-r from-indigo-700 to-indigo-500 text-white`,
      pink: `bg-gradient-to-r from-pink-700 to-pink-500 text-white`,
      blue: `bg-gradient-to-r from-blue-700 to-blue-500 text-white`,
      rose: `bg-gradient-to-r from-rose-700 to-rose-500 text-white`,
      amber: `bg-gradient-to-r from-amber-700 to-amber-500 text-white`,
      teal: `bg-gradient-to-r from-teal-700 to-teal-500 text-white`,
      violet: `bg-gradient-to-r from-violet-700 to-violet-500 text-white`,
    };
    
    const levelIndicator = "✦".repeat(level);
    
    return `${baseClasses} ${colorMap[color]} ${levelIndicator}`;
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gentle Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-purple-950/5 to-black/50 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Light <span className="text-amber-300">Bearers</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Earn sacred badges as you grow, contribute, and illuminate the path for others
            on their conscious journey
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="h-full border-purple-500/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-300">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mb-4 text-xl font-bold">
                    {badge.level}
                  </div>
                  <Badge className={getBadgeStyle(badge.color, badge.level)}>
                    {badge.name}
                  </Badge>
                  <p className="mt-3 text-sm text-gray-300">{badge.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
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

export default LightBearers;
