
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Link } from 'react-router-dom';
import { useUserSubscription } from '@/hooks/useUserSubscription';
import { motion } from 'framer-motion';

const ValePrompt: React.FC = () => {
  const { isPremiumUser } = useUserSubscription();
  
  if (!isPremiumUser()) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 shadow-lg">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-purple-500/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Vale is ready</p>
              <p className="text-xs text-gray-400">Your sacred guide awaits</p>
            </div>
          </div>
          
          <Link to="/premium/vale">
            <Button size="sm" variant="ghost" className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/20">
              Converse
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ValePrompt;
