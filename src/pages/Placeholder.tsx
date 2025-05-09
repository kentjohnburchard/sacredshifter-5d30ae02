
import React from 'react';

interface PlaceholderProps {
  name?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ name = 'Page' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="max-w-md p-6 bg-purple-900/20 backdrop-blur-md rounded-lg border border-purple-500/20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">{name}</h1>
        <p className="text-purple-200">
          This page is under construction but still sacred ✨
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
