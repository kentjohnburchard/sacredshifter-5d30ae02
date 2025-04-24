
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const soulPhrases = [
  {
    title: "Remember Your Soul",
    description: "A direct call to rediscover your deepest essence."
  },
  {
    title: "Awaken & Remember",
    description: "Pairs the twin pillars of spiritual awakening and soul‐memory."
  },
  {
    title: "Remember Who You Are",
    description: "Personal, intimate, and soul-centric."
  },
  {
    title: "Awakening the Soul Within",
    description: "Descriptive yet succinct—promises an inner journey."
  },
  {
    title: "Remember, Awaken, Evolve",
    description: "A three-step roadmap: remembrance, awakening, evolution."
  },
  {
    title: "Ignite Your Inner Light",
    description: "Action-oriented invitation to spark your soul's brilliance."
  },
  {
    title: "Reclaim Your Inner Light",
    description: "Emphasizes rediscovery of innate spiritual radiance."
  }
];

const RotatingSoulText = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % soulPhrases.length);
    }, 5000); // Change text every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-32 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-playfair tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              {soulPhrases[currentIndex].title}
            </span>
          </h1>
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto text-purple-100/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {soulPhrases[currentIndex].description}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingSoulText;
