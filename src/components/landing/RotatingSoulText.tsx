
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const soulPhrases = [
  "Remember Your Soul",
  "Awaken & Remember",
  "Remember Who You Are", 
  "Awakening the Soul Within",
  "Remember, Awaken, Evolve",
  "Ignite Your Inner Light",
  "Reclaim Your Inner Light",
  "Rediscover Your True Self",
  "Awaken Your Inner Truth",
  "Remember the Infinite",
  "Rekindle Your Soul Flame",
  "Awaken the Wisdom Within",
  "Remind Yourself You're Infinite", 
  "Remember, Radiate, Rise",
  "Your Soul's Journey Awaits",
  "Remember Your Sacred Spark",
  "Awaken to Your Essence",
  "Remember, Feel, Become",
  "The Art of Remembering You",
  "Ignite Your Soul's Song",
  "Remember the Light Within", 
  "Awaken Your Cosmic Self",
  "Remember Your Heart's Call",
  "Your Soul, Remembered",
  "Awaken the Divine Within", 
  "Remember the Truth of You",
  "Spark Your Soul Memory",
  "Remember, Shine, Transcend",
  "The Soul's Awakening Path", 
  "Remember Beyond the Mind",
  "Awaken to Soul Purpose", 
  "Remember Your Eternal Voice",
  "Ignite Your Inner Guide", 
  "Remember the Soul's Call",
  "Awaken the Heart's Fire", 
  "Remember the Infinite Within",
  "Rekindle Your Inner Radiance", 
  "Awaken Your Soul's Vision",
  "Remember Your Cosmic Heart", 
  "Remember, Awaken, Align", 
  "Awaken the Memory of You",
  "Remember Your Sacred Self", 
  "Ignite the Soul's Journey", 
  "Remember, Emerge, Transcend", 
  "Awaken Your Hidden Light", 
  "Remember the Soul's Fire", 
  "Awaken, Remember, Transform", 
  "Remember Your Inner Whisper", 
  "Awaken Your True Light", 
  "Remember, Awaken, Be"
];

const RotatingSoulText = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % soulPhrases.length);
    }, 8000); // Change text every 8 seconds (slowed down)

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
          transition={{ duration: 0.8 }} // Slower transition
          className="absolute text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-playfair tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
              {soulPhrases[currentIndex]}
            </span>
          </h1>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingSoulText;
