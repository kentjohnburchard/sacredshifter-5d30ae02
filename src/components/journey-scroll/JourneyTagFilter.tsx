
import React from 'react';
import { Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface JourneyTagFilterProps {
  tags: string[];
  activeTag: string;
  onSelectTag: (tag: string) => void;
}

const JourneyTagFilter: React.FC<JourneyTagFilterProps> = ({ 
  tags, 
  activeTag, 
  onSelectTag 
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Tag size={18} className="text-gray-300" />
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <motion.button
            key={tag}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              activeTag === tag 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80'
            }`}
            aria-pressed={activeTag === tag}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default JourneyTagFilter;
