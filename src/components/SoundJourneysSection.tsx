
import React from 'react';
import { Link } from 'react-router-dom';

const SoundJourneysSection = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8 text-indigo-900">Sound Journeys & Sacred Meditation</h2>
        <p className="text-xl text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Experience powerful sound frequencies designed to shift your consciousness, 
          restore balance, and facilitate deep healing.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
          <Link 
            to="/journey-templates"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100 flex-1 max-w-md mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-4 text-purple-800">Sound Journeys</h3>
            <p className="text-gray-600 mb-6">
              Guided audio experiences that combine sacred frequencies with intentional journeys for transformation.
            </p>
            <span className="text-purple-600 font-medium flex items-center">
              Explore Journeys →
            </span>
          </Link>
          
          <Link 
            to="/meditation"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-purple-100 flex-1 max-w-md mx-auto"
          >
            <h3 className="text-2xl font-semibold mb-4 text-purple-800">Sacred Meditation</h3>
            <p className="text-gray-600 mb-6">
              Meditative audio experiences with specific frequencies that target different aspects of wellbeing.
            </p>
            <span className="text-purple-600 font-medium flex items-center">
              Discover Meditations →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SoundJourneysSection;
