
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ChecklistItem {
  id: string;
  text: string;
}

const checklistItems: ChecklistItem[] = [
  { id: 'synchronicity', text: 'Noticing increased synchronicities in daily life' },
  { id: 'presence', text: 'Heightened present moment awareness' },
  { id: 'subtle-energy', text: 'Sensing subtle energies or auras' },
  { id: 'dreams', text: 'More vivid or prophetic dreams' },
  { id: 'intuition', text: 'Stronger intuitive insights' },
  { id: 'patterns', text: 'Recognizing recurring patterns or themes' },
  { id: 'time', text: 'Altered perception of time (speeding up/slowing down)' },
  { id: 'connection', text: 'Deeper sense of connection to all beings' },
  { id: 'thoughts', text: 'Awareness of the space between thoughts' },
  { id: 'purpose', text: 'Clearer sense of purpose or calling' }
];

const PerceptionChecklist: React.FC = () => {
  const { liftTheVeil } = useTheme();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  const toggleItem = (id: string) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };
  
  return (
    <div className="space-y-3">
      {checklistItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <label 
            htmlFor={item.id}
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
              checkedItems.includes(item.id)
                ? (liftTheVeil 
                    ? 'bg-pink-900/50 border-pink-500/70 shadow-[0_0_8px_rgba(236,72,153,0.3)]' 
                    : 'bg-purple-900/50 border-purple-500/70 shadow-[0_0_8px_rgba(139,92,246,0.3)]')
                : 'bg-black/50 border-white/20 hover:border-white/40'
            }`}
          >
            <div 
              className={`w-6 h-6 rounded mr-3 flex items-center justify-center ${
                checkedItems.includes(item.id)
                  ? (liftTheVeil 
                      ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]' 
                      : 'bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]')
                  : 'border border-gray-400'
              }`}
            >
              {checkedItems.includes(item.id) && <Check className="h-4 w-4 text-white" />}
            </div>
            <input
              type="checkbox"
              id={item.id}
              checked={checkedItems.includes(item.id)}
              onChange={() => toggleItem(item.id)}
              className="sr-only"
            />
            <span className="text-white text-enhanced">
              {item.text}
            </span>
          </label>
        </motion.div>
      ))}
      
      {checkedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-4 p-4 rounded-lg ${
            liftTheVeil 
              ? 'bg-pink-900/30 border border-pink-500/40 shadow-[0_0_10px_rgba(236,72,153,0.2)]' 
              : 'bg-purple-900/30 border border-purple-500/40 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
          }`}
        >
          <p className={`text-sm ${
            liftTheVeil 
              ? 'text-pink-100 text-enhanced' 
              : 'text-purple-100 text-enhanced'
          }`}>
            You've identified {checkedItems.length} signs of shifting perception.
            {checkedItems.length >= 5 && " Your awareness is expanding significantly."}
            {checkedItems.length >= 8 && " You're experiencing a profound shift in consciousness."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PerceptionChecklist;
