
import React from 'react';

export interface TimelineViewerProps {
  activeTagFilter: string;
  onEdit: (entry: any) => void;
}

const TimelineViewer: React.FC<TimelineViewerProps> = ({ activeTagFilter, onEdit }) => {
  const mockEntries = [
    { id: 1, title: 'First Spiritual Awakening', date: '2023-01-15', tag: 'spiritual' },
    { id: 2, title: 'Deep Meditation Session', date: '2023-02-10', tag: 'meditation' },
    { id: 3, title: 'Energy Healing Workshop', date: '2023-03-05', tag: 'healing' },
  ];

  const filteredEntries = activeTagFilter === 'all' 
    ? mockEntries 
    : mockEntries.filter(entry => entry.tag === activeTagFilter);

  return (
    <div className="timeline-viewer">
      <h3 className="text-xl font-semibold mb-4">Timeline Entries</h3>
      <div className="space-y-4">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="bg-gray-800/60 p-4 rounded-lg">
            <h4 className="text-lg font-medium">{entry.title}</h4>
            <p className="text-sm text-gray-400">{entry.date}</p>
            <button 
              className="text-purple-400 text-sm mt-2"
              onClick={() => onEdit(entry)}
            >
              Edit Entry
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineViewer;
