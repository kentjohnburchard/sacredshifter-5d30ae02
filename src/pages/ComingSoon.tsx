
import React from 'react';

const ComingSoon: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 text-center bg-slate-900 text-white">
      {/* Animated Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900"></div>
        
        {/* Animated Stars */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute h-2 w-2 bg-white rounded-full top-1/4 left-1/4 animate-pulse"></div>
          <div className="absolute h-1 w-1 bg-white rounded-full top-1/3 left-2/3 animate-pulse-subtle"></div>
          <div className="absolute h-1.5 w-1.5 bg-white rounded-full top-2/3 left-1/3 animate-pulse"></div>
          <div className="absolute h-1 w-1 bg-white rounded-full top-1/2 left-1/2 animate-pulse-subtle"></div>
          <div className="absolute h-2 w-2 bg-white rounded-full top-3/4 left-3/4 animate-pulse"></div>
        </div>
        
        {/* Sacred Geometry Circle */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-[500px] h-[500px] border border-purple-400 rounded-full animate-pulse-subtle"></div>
          <div className="absolute w-[400px] h-[400px] border border-indigo-400 rounded-full animate-pulse"></div>
          <div className="absolute w-[300px] h-[300px] border border-purple-300 rounded-full animate-pulse-subtle"></div>
          <div className="absolute w-[200px] h-[200px] border border-indigo-300 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Content Container with Glass Effect */}
      <div className="relative z-10 max-w-lg mx-auto p-6 md:p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-xl animate-fade-in">
        {/* Sacred Shifter Logo */}
        <div className="mb-6">
          <img
            src="/lovable-uploads/6dafef18-8a06-46e1-bc1b-2325f13a67f7.png"
            alt="Sacred Shifter Logo"
            className="h-24 mx-auto animate-pulse-subtle"
          />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-wider mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-indigo-200">
          Sacred Shifter
        </h1>
        
        {/* Subheading */}
        <p className="text-base sm:text-lg md:text-xl text-purple-200/90 mb-8 max-w-md mx-auto">
          We're tuning the frequencies behind the scenes
        </p>
        
        {/* Sacred Symbol */}
        <div className="my-8 relative flex justify-center">
          <svg 
            className="h-24 w-24 text-purple-300/80 animate-spin-slow"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path 
              d="M50 5 L50 95 M5 50 L95 50 M19.1 19.1 L80.9 80.9 M19.1 80.9 L80.9 19.1" 
              stroke="currentColor" 
              strokeWidth="0.5" 
            />
          </svg>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 text-center">
        <p className="text-xs sm:text-sm text-purple-300/60">
          Made with love & light 🌟 — SacredShifter.com
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
