
import React from 'react';

const LogoWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-5">
      <img
        src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
        alt=""
        className="w-1/2 max-w-3xl"
        style={{ filter: 'grayscale(0.5) contrast(0.8)' }}
      />
    </div>
  );
};

export default LogoWatermark;
