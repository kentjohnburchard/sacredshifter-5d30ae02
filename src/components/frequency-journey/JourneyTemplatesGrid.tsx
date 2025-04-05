
import React from "react";
import journeyTemplates from "@/data/journeyTemplates";
import JourneyTemplateCard from "./JourneyTemplateCard";
import { motion } from "framer-motion";

const JourneyTemplatesGrid: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {journeyTemplates.map((template) => (
        <JourneyTemplateCard key={template.id} template={template} />
      ))}
    </motion.div>
  );
};

export default JourneyTemplatesGrid;
