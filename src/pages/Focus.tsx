
import React from 'react';

const Focus: React.FC = () => {
  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Focus Session</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Frequency Selection</h2>
          <p className="text-gray-600 mb-4">Select a frequency that helps you focus and concentrate on your tasks.</p>
          <div className="space-y-3">
            <div className="flex items-center">
              <input id="beta" type="radio" name="frequency" className="h-4 w-4 text-purple-600" />
              <label htmlFor="beta" className="ml-2 text-sm font-medium text-gray-700">Beta (14-30 Hz) - Active concentration</label>
            </div>
            <div className="flex items-center">
              <input id="alpha" type="radio" name="frequency" className="h-4 w-4 text-purple-600" />
              <label htmlFor="alpha" className="ml-2 text-sm font-medium text-gray-700">Alpha (8-13.9 Hz) - Relaxed focus</label>
            </div>
            <div className="flex items-center">
              <input id="theta" type="radio" name="frequency" className="h-4 w-4 text-purple-600" />
              <label htmlFor="theta" className="ml-2 text-sm font-medium text-gray-700">Theta (4-7.9 Hz) - Deep meditation</label>
            </div>
          </div>
          <button className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Start Focus Session
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-purple-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Session Timer</h2>
          <p className="text-gray-600 mb-4">Set a timer for your focus session to maintain productivity.</p>
          <div className="flex space-x-4 mb-6">
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors">
              25 min
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors">
              45 min
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors">
              60 min
            </button>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-800 mb-4">25:00</div>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                Start
              </button>
              <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Focus;
