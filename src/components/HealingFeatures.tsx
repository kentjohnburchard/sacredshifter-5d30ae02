
import React from "react";
import { Link } from "react-router-dom";
import { 
  Music, 
  Activity, 
  Sparkles, 
  Heart, 
  Brain, 
  Moon, 
  Flame,
  HeartPulse
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface HealingFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

const HealingFeature: React.FC<HealingFeatureProps> = ({ 
  title, 
  description, 
  icon,
  link,
  color
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Link to={link} className="block h-full">
        <Card className={`h-full p-3 shadow-md backdrop-blur-md ${color} text-white border-white/20`}>
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              {icon}
            </div>
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <p className="text-xs mt-1 opacity-80">{description}</p>
        </Card>
      </Link>
    </motion.div>
  );
};

const HealingFeatures: React.FC = () => {
  const features: HealingFeatureProps[] = [
    {
      title: "Heart Center",
      description: "Cultivate & radiate love energy",
      icon: <HeartPulse className="h-4 w-4" />,
      link: "/heart-center",
      color: "bg-gradient-to-br from-pink-500/70 to-pink-600/70"
    },
    {
      title: "Healing Journeys",
      description: "Curated sound experiences for healing",
      icon: <Music className="h-4 w-4" />,
      link: "/journey-templates",
      color: "bg-gradient-to-br from-purple-500/70 to-indigo-600/70"
    },
    {
      title: "Energy Check",
      description: "Align with healing frequencies",
      icon: <Activity className="h-4 w-4" />,
      link: "/energy-check",
      color: "bg-gradient-to-br from-blue-500/70 to-teal-500/70"
    },
    {
      title: "Chakra Alignment",
      description: "Balance your energy centers",
      icon: <Sparkles className="h-4 w-4" />,
      link: "/alignment",
      color: "bg-gradient-to-br from-cyan-500/70 to-blue-600/70"
    },
    {
      title: "Intentions",
      description: "Set powerful intentions",
      icon: <Flame className="h-4 w-4" />,
      link: "/intentions",
      color: "bg-gradient-to-br from-orange-500/70 to-amber-600/70"
    },
    {
      title: "Meditation",
      description: "Guided frequencies meditation",
      icon: <Heart className="h-4 w-4" />,
      link: "/meditation",
      color: "bg-gradient-to-br from-rose-500/70 to-purple-600/70"
    },
    {
      title: "Focus",
      description: "Enhance mental clarity",
      icon: <Brain className="h-4 w-4" />,
      link: "/focus",
      color: "bg-gradient-to-br from-emerald-500/70 to-teal-600/70"
    },
    {
      title: "Astrology",
      description: "Align with celestial energies",
      icon: <Moon className="h-4 w-4" />,
      link: "/astrology",
      color: "bg-gradient-to-br from-violet-500/70 to-purple-600/70"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
      {features.map((feature, index) => (
        <HealingFeature key={index} {...feature} />
      ))}
    </div>
  );
};

export default HealingFeatures;
