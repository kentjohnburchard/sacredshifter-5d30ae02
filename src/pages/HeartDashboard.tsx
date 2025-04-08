
import React from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { motion } from "framer-motion";
import Header from "@/components/navigation/Header";
import GlobalWatermark from "@/components/GlobalWatermark";
import { LoveDashboard } from "@/components/heart-center/LoveDashboard";

const HeartDashboard: React.FC = () => {
  const { preferences } = useUserPreferences();

  // Update gradient logic
  const bgGradient = preferences.consciousness_mode === "lift-the-veil" 
    ? "bg-gradient-to-b from-rose-400 via-fuchsia-500 to-indigo-500"
    : "bg-gradient-to-b from-rose-100 via-pink-100 to-purple-100";

  return (
    <div className={`min-h-screen ${bgGradient}`}>
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Love Dashboard
            </motion.h1>
            
            <motion.p
              className="mt-3 text-lg text-purple-800 dark:text-purple-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Track your heart-centered journey and impact
            </motion.p>
          </div>
          
          <LoveDashboard />
        </motion.div>
      </main>
      
      <GlobalWatermark />
    </div>
  );
};

export default HeartDashboard;
