
import React from "react";
import { motion } from "framer-motion";
import { Star, Heart, Music, Sparkles, Users, Brain } from "lucide-react";

const features = [
  {
    title: "Sacred Journeys",
    description: "Embark on guided spiritual experiences designed to elevate your consciousness and align your chakras.",
    icon: Star,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30"
  },
  {
    title: "Frequency Engine",
    description: "Experience the healing power of Solfeggio frequencies and sacred sound healing through our advanced audio engine.",
    icon: Music,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  {
    title: "Sacred Circle",
    description: "Connect with like-minded individuals on the path of spiritual growth and share your experiences.",
    icon: Users,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30"
  },
  {
    title: "Spiral Visualizer",
    description: "See the sacred geometry underlying reality through our interactive spiral visualizer.",
    icon: Sparkles,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30"
  },
  {
    title: "Heart Center",
    description: "Activate and balance your heart chakra through guided meditations and frequency treatments.",
    icon: Heart,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30"
  },
  {
    title: "Lightbearer Levels",
    description: "Track your spiritual growth and unlock new insights as you progress on your journey.",
    icon: Brain,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative z-10 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-white">
            Explore Sacred <span className="text-purple-400 font-medium">Features</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Discover the tools and experiences designed to elevate your consciousness
            and connect you with your highest self.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`p-6 rounded-lg backdrop-blur-sm border ${feature.borderColor} ${feature.bgColor}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.bgColor} ${feature.borderColor} border`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
