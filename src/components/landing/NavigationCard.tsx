
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ title, description, icon, to }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={to} className="block h-full">
        <div className="h-full flex flex-col justify-between p-6 backdrop-blur-sm bg-purple-900/10 border border-purple-500/20 rounded-xl shadow-lg hover:shadow-purple-500/5 hover:border-purple-500/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          <div className="mt-4 text-purple-400 flex items-center text-sm">
            Explore <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NavigationCard;
