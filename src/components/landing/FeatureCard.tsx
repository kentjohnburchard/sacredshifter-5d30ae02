
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, to, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Link to={to}>
        <Card className={`h-full border-${color}-500/20 bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-all duration-300`}>
          <CardHeader>
            <div className={`w-12 h-12 rounded-lg bg-${color}-950/50 flex items-center justify-center mb-3`}>
              {icon}
            </div>
            <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-300">{description}</CardDescription>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default FeatureCard;
