
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-purple-500 animate-spin"></div>
        <div className="h-24 w-24 rounded-full border-r-4 border-indigo-500 animate-spin absolute top-0 left-0" style={{ animationDuration: '1.5s' }}></div>
      </div>
      <h2 className="mt-8 text-2xl font-bold text-purple-300">Loading Sacred Shifter...</h2>
      <p className="mt-2 text-gray-400">Connecting to the higher realms</p>
    </div>
  );
};

export default LoadingScreen;
