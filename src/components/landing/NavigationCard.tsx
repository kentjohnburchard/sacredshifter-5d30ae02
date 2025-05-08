
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  index: number;
  color?: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ 
  icon, title, description, to, index, color = 'purple' 
}) => {
  // Define color classes based on the color prop
  const colorClasses = {
    purple: 'bg-purple-900/20 border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-500/50',
    blue: 'bg-blue-900/20 border-blue-500/30 hover:bg-blue-900/30 hover:border-blue-500/50',
    amber: 'bg-amber-900/20 border-amber-500/30 hover:bg-amber-900/30 hover:border-amber-500/50',
    green: 'bg-green-900/20 border-green-500/30 hover:bg-green-900/30 hover:border-green-500/50',
    pink: 'bg-pink-900/20 border-pink-500/30 hover:bg-pink-900/30 hover:border-pink-500/50',
    indigo: 'bg-indigo-900/20 border-indigo-500/30 hover:bg-indigo-900/30 hover:border-indigo-500/50',
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={to}
        className={`block p-4 rounded-lg backdrop-blur-sm border transition-all ${colorClasses}`}
      >
        <div className="flex items-center">
          <div className="mr-4">{icon}</div>
          <div>
            <h3 className="text-lg font-medium text-white">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NavigationCard;
