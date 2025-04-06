
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
    "top": "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "right": "absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2",
    "bottom": "absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    "left": "absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-left": "absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3",
    "top-right": "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3",
    "bottom-left": "absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
    "bottom-right": "absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3"
  };

  return (
    <motion.div
      className={`z-10 ${positionClasses[position]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Link to={link} className="block">
        <Card className={`w-56 p-4 shadow-lg backdrop-blur-md ${color} text-white border-white/20 overflow-hidden`}>
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              {icon}
            </div>
            <h3 className="font-medium text-sm">{title}</h3>
          </div>
          <p className="text-xs mt-2 opacity-80">{description}</p>
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
      description: "Explore curated sound experiences for specific healing purposes",
      icon: <Music className="h-5 w-5" />,
      link: "/journey-templates",
      position: "top-left",
      color: "bg-gradient-to-br from-purple-500/70 to-indigo-600/70"
    },
    {
      title: "Energy Check",
      description: "Assess your current energy state and align with healing frequencies",
      icon: <Activity className="h-5 w-5" />,
      link: "/energy-check",
      position: "top-right",
      color: "bg-gradient-to-br from-blue-500/70 to-teal-500/70"
    },
    {
      title: "Chakra Alignment",
      description: "Balance your energy centers with precision frequency healing",
      icon: <Sparkles className="h-5 w-5" />,
      link: "/alignment",
      position: "right",
      color: "bg-gradient-to-br from-cyan-500/70 to-blue-600/70"
    },
    {
      title: "Intentions",
      description: "Set powerful intentions that resonate with your highest vibration",
      icon: <Flame className="h-5 w-5" />,
      link: "/intentions",
      position: "bottom-right",
      color: "bg-gradient-to-br from-orange-500/70 to-amber-600/70"
    },
    {
      title: "Meditation",
      description: "Elevate consciousness through guided meditations with sacred frequencies",
      icon: <Heart className="h-5 w-5" />,
      link: "/meditation",
      position: "bottom-left",
      color: "bg-gradient-to-br from-rose-500/70 to-purple-600/70"
    },
    {
      title: "Focus",
      description: "Enhance concentration with sound frequencies for mental clarity",
      icon: <Brain className="h-5 w-5" />,
      link: "/focus",
      position: "left",
      color: "bg-gradient-to-br from-emerald-500/70 to-teal-600/70"
    },
    {
      title: "Astrology",
      description: "Explore cosmic connections and align with celestial energies",
      icon: <Moon className="h-5 w-5" />,
      link: "/astrology",
      position: "top",
      color: "bg-gradient-to-br from-violet-500/70 to-purple-600/70"
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[800px] py-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-purple-300/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full filter blur-3xl"></div>
      </div>
      
      {/* Border containing the healing features */}
      <div className="relative max-w-5xl mx-auto border border-purple-200/20 rounded-3xl p-16 bg-white/5 backdrop-blur-sm">
        {/* Healing features positioned around the border */}
        {features.map((feature, index) => (
          <HealingFeature key={index} {...feature} />
        ))}
        
        {/* Main content in the center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative z-5 max-w-2xl mx-auto"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default HealingFeaturesLayout;
