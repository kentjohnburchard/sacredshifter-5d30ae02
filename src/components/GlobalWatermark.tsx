
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const GlobalWatermark = () => {
  const { liftTheVeil } = useTheme();
  
  return (
    <div className="fixed bottom-20 left-0 w-full text-center pointer-events-none z-10 opacity-30">
      <div className={`text-sm ${liftTheVeil ? 'text-pink-300' : 'text-purple-300'}`}>
        ✧ Sacred Shifter ✧
      </div>
    </div>
  );
};

export default GlobalWatermark;
