
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CallToActionProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void; // Added onClick as an optional prop
}

const CallToAction: React.FC<CallToActionProps> = ({ to, children, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="mt-8"
    >
      <Link to={to}>
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg"
          onClick={onClick}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          {children}
        </Button>
      </Link>
    </motion.div>
  );
};

export default CallToAction;
