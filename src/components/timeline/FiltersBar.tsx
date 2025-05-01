
import React from 'react';

export interface FiltersBarProps {
  activeTagFilter: string;
  onFilterChange: (filter: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ activeTagFilter, onFilterChange }) => {
  return (
    <div className="filters-bar">
      <button
        className={`px-3 py-1 rounded-full mr-2 ${activeTagFilter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={`px-3 py-1 rounded-full mr-2 ${activeTagFilter === 'spiritual' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        onClick={() => onFilterChange('spiritual')}
      >
        Spiritual
      </button>
      <button
        className={`px-3 py-1 rounded-full mr-2 ${activeTagFilter === 'meditation' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        onClick={() => onFilterChange('meditation')}
      >
        Meditation
      </button>
    </div>
  );
};

export default FiltersBar;
