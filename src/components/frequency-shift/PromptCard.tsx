
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface PromptCardProps {
  children: ReactNode;
}

const PromptCard = ({ children }: PromptCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Card className="border border-purple-100/80 shadow-md overflow-hidden rounded-lg bg-white/95 
                     hover:shadow-mystic transition-all duration-500">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-purple-100/20 to-transparent 
                   pointer-events-none opacity-50"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <CardContent className="p-6 sm:p-8 relative z-10">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PromptCard;
