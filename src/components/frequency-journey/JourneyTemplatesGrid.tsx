
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
      className="flex flex-col gap-6"
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
