
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface JourneySearchBarProps {
  onSearch: (query: string) => void;
}

const JourneySearchBar: React.FC<JourneySearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full md:max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-gray-600/40 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:outline-none backdrop-blur-sm"
        placeholder="Search journeys by title or tag..."
        value={query}
        onChange={handleChange}
        aria-label="Search journeys"
      />
    </div>
  );
};

export default JourneySearchBar;
