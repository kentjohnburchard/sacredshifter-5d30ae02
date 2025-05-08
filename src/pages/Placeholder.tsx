
import React from 'react';

interface PlaceholderProps {
  name: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ name }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-8 max-w-md bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-purple-400">{name} Page</h1>
        <p className="text-gray-300">This page is under construction but still sacred ✨</p>
      </div>
    </div>
  );
};

export default Placeholder;
