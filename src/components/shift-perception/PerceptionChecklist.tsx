
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ChecklistItem {
  id: number;
  text: string;
  checked: boolean;
}

const PerceptionChecklist: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 1, text: "You feel like there's something more to life than what you can see.", checked: false },
    { id: 2, text: "Synchronicities and 'coincidences' are increasing in your life.", checked: false },
    { id: 3, text: "You're feeling disillusioned with the 'normal' world and societal expectations.", checked: false },
    { id: 4, text: "You've started to hear your inner voice louder than ever before.", checked: false },
    { id: 5, text: "You're drawn to spiritual concepts even if you've never been 'spiritual' before.", checked: false },
    { id: 6, text: "Your dreams have become more vivid or meaningful.", checked: false },
    { id: 7, text: "You feel a strange nostalgia for places you've never been.", checked: false },
  ]);

  const [showMessage, setShowMessage] = useState(false);

  const handleItemClick = (id: number) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    
    // If at least one item is checked, show the message
    if (updatedItems.some(item => item.checked) && !showMessage) {
      setShowMessage(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {items.map((item) => (
          <motion.div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
              item.checked 
                ? "border-purple-300 bg-purple-50" 
                : "border-gray-100 hover:border-purple-100"
            }`}
          >
            <div className={`flex-shrink-0 h-5 w-5 rounded border flex items-center justify-center transition-all ${
              item.checked 
                ? "bg-purple-600 border-purple-600" 
                : "border-gray-300"
            }`}>
              {item.checked && (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
            <span className={`text-sm ${item.checked ? "text-purple-800" : "text-gray-700"}`}>
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatedMessage visible={showMessage} checkCount={items.filter(i => i.checked).length} />
    </div>
  );
};

interface AnimatedMessageProps {
  visible: boolean;
  checkCount: number;
}

const AnimatedMessage: React.FC<AnimatedMessageProps> = ({ visible, checkCount }) => {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg text-center"
    >
      <p className="text-purple-800 font-medium">
        {checkCount > 2 
          ? "You're experiencing a significant perception shift. You're awakening." 
          : "You're beginning to shift. This is just the start of your journey."}
      </p>
      <p className="text-sm text-purple-700 mt-2">
        If you nodded yes to any of these… you're shifting. And you're not alone.
      </p>
    </motion.div>
  );
};

export default PerceptionChecklist;
