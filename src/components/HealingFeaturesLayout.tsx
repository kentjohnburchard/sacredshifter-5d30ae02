
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Music, 
  Activity, 
  Sparkles, 
  Heart, 
  Brain, 
  Moon, 
  Flame
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface HealingFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  position: "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  color: string;
}

const HealingFeature: React.FC<HealingFeatureProps> = ({ 
  title, 
  description, 
  icon, 
  link,
  position,
  color
}) => {
  // Define position classes based on the position prop
  const positionClasses = {
    "top": "bottom-full left-1/2 -translate-x-1/2 -translate-y-2",
    "right": "top-1/2 left-full -translate-y-1/2 translate-x-2",
    "bottom": "top-full left-1/2 -translate-x-1/2 translate-y-2",
    "left": "top-1/2 right-full -translate-y-1/2 -translate-x-2",
    "top-left": "bottom-full right-full -translate-x-2 -translate-y-2",
    "top-right": "bottom-full left-full translate-x-2 -translate-y-2",
    "bottom-left": "top-full right-full -translate-x-2 translate-y-2",
    "bottom-right": "top-full left-full translate-x-2 translate-y-2"
  };

  return (
    <motion.div
      className={`z-10 absolute ${positionClasses[position]}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: position === "top" ? 0 : 0.1 * ["top", "right", "bottom", "left", "top-left", "top-right", "bottom-left", "bottom-right"].indexOf(position) }}
      whileHover={{ scale: 1.05 }}
    >
      <Link to={link} className="block">
        <Card className={`w-44 p-3 shadow-lg backdrop-blur-md ${color} text-white border-white/20 overflow-hidden`}>
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-full">
              {icon}
            </div>
            <h3 className="font-medium text-xs">{title}</h3>
          </div>
          <p className="text-xs mt-1 opacity-80 line-clamp-1">{description}</p>
        </Card>
      </Link>
    </motion.div>
  );
};

interface HealingFeaturesLayoutProps {
  children: ReactNode;
}

const HealingFeaturesLayout: React.FC<HealingFeaturesLayoutProps> = ({ children }) => {
  const features: HealingFeatureProps[] = [
    {
      title: "Healing Journeys",
      description: "Curated sound experiences for healing",
      icon: <Music className="h-4 w-4" />,
      link: "/journey-templates",
      position: "bottom-left",
      color: "bg-gradient-to-br from-purple-500/70 to-indigo-600/70"
    },
    {
      title: "Energy Check",
      description: "Align with healing frequencies",
      icon: <Activity className="h-4 w-4" />,
      link: "/energy-check",
      position: "bottom-right",
      color: "bg-gradient-to-br from-blue-500/70 to-teal-500/70"
    },
    {
      title: "Chakra Alignment",
      description: "Balance your energy centers",
      icon: <Sparkles className="h-4 w-4" />,
      link: "/alignment",
      position: "bottom",
      color: "bg-gradient-to-br from-cyan-500/70 to-blue-600/70"
    },
    {
      title: "Intentions",
      description: "Set powerful intentions",
      icon: <Flame className="h-4 w-4" />,
      link: "/intentions",
      position: "right",
      color: "bg-gradient-to-br from-orange-500/70 to-amber-600/70"
    },
    {
      title: "Meditation",
      description: "Guided frequencies meditation",
      icon: <Heart className="h-4 w-4" />,
      link: "/meditation",
      position: "top-right",
      color: "bg-gradient-to-br from-rose-500/70 to-purple-600/70"
    },
    {
      title: "Focus",
      description: "Enhance mental clarity",
      icon: <Brain className="h-4 w-4" />,
      link: "/focus",
      position: "top-left",
      color: "bg-gradient-to-br from-emerald-500/70 to-teal-600/70"
    },
    {
      title: "Astrology",
      description: "Align with celestial energies",
      icon: <Moon className="h-4 w-4" />,
      link: "/astrology",
      position: "left",
      color: "bg-gradient-to-br from-violet-500/70 to-purple-600/70"
    },
  ];

  return (
    <div className="relative w-full mx-auto flex justify-center items-center min-h-[80vh]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-purple-300/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Create a visible decorative border */}
      <div className="relative max-w-3xl mx-auto border border-purple-200 rounded-2xl p-8 bg-white/5 backdrop-blur-sm shadow-sm">
        {/* Main content in the center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-5 max-w-xl mx-auto"
        >
          {children}
        </motion.div>
        
        {/* Healing features positioned around the border */}
        <div className="relative">
          {features.map((feature, index) => (
            <HealingFeature key={index} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealingFeaturesLayout;
