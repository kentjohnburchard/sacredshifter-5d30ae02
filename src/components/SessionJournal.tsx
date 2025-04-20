
import React, { useState, useEffect } from 'react';

interface JournalEntry {
  id: string;
  date: string;
  mode: string;
  primes: number[];
  mandalaSettings?: any;
  notes: string;
  favoriteFrequencies: number[];
}

interface SessionJournalProps {
  currentMode: string;
  activePrimes: number[];
  mandalaSettings: any | null;
  show: boolean;
  onClose: () => void;
  audioUrl: string | null;
}

const SessionJournal: React.FC<SessionJournalProps> = ({
  currentMode,
  activePrimes,
  mandalaSettings,
  show,
  onClose,
  audioUrl
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [notes, setNotes] = useState('');
  const [favoriteFrequencies, setFavoriteFrequencies] = useState<number[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('sacredShifterJournal');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error parsing saved journal entries:', error);
      }
    }
  }, []);
  
  // Save entries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('sacredShifterJournal', JSON.stringify(entries));
  }, [entries]);
  
  // Common frequencies to choose from
  const commonFrequencies = [
    { value: 432, label: '432 Hz - Harmonic Resonance' },
    { value: 528, label: '528 Hz - DNA Repair' },
    { value: 396, label: '396 Hz - Liberation from Fear' },
    { value: 639, label: '639 Hz - Heart Connection' },
    { value: 741, label: '741 Hz - Awakening Intuition' },
    { value: 963, label: '963 Hz - Divine Consciousness' },
  ];
  
  // Handle saving a new journal entry
  const saveEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mode: currentMode,
      primes: [...activePrimes],
      mandalaSettings: mandalaSettings ? { ...mandalaSettings } : null,
      notes,
      favoriteFrequencies: [...favoriteFrequencies]
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setNotes('');
    setFavoriteFrequencies([]);
    onClose();
  };
  
  // Toggle a frequency selection
  const toggleFrequency = (freq: number) => {
    if (favoriteFrequencies.includes(freq)) {
      setFavoriteFrequencies(prev => prev.filter(f => f !== freq));
    } else {
      setFavoriteFrequencies(prev => [...prev, freq]);
    }
  };
  
  // Load a saved entry
  const loadEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    // Additional loading logic would go here to restore state
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  // If not shown, return null
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg w-full max-w-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-white font-semibold">Sacred Session Journal</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* New Entry Form */}
          <div>
            <h3 className="text-lg text-white mb-3">Record Your Experience</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Current Mode:
              </label>
              <div className="bg-gray-800 text-white p-2 rounded">
                {currentMode}
              </div>
            </div>
            
            {activePrimes.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-300 text-sm mb-1">
                  Active Prime Frequencies:
                </label>
                <div className="bg-gray-800 text-white p-2 rounded">
                  {activePrimes.map(prime => `${prime * 100}Hz`).join(', ')}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Which frequencies moved you?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {commonFrequencies.map(freq => (
                  <button
                    key={freq.value}
                    onClick={() => toggleFrequency(freq.value)}
                    className={`text-left p-2 rounded text-sm ${
                      favoriteFrequencies.includes(freq.value)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-1">
                Notes and Insights:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-800 text-white p-2 rounded h-32"
                placeholder="How did this session make you feel? What insights came through?"
              />
            </div>
            
            <button
              onClick={saveEntry}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full"
            >
              Save Experience
            </button>
          </div>
          
          {/* Saved Entries */}
          <div>
            <h3 className="text-lg text-white mb-3">Saved Intentions</h3>
            
            {entries.length === 0 ? (
              <div className="bg-gray-800 p-4 rounded text-gray-400">
                No saved entries yet. Record your first experience!
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {entries.map(entry => (
                  <div 
                    key={entry.id}
                    className="bg-gray-800 p-3 rounded hover:bg-gray-700 cursor-pointer"
                    onClick={() => loadEntry(entry)}
                  >
                    <div className="text-sm text-gray-400">
                      {formatDate(entry.date)}
                    </div>
                    <div className="text-white font-medium mt-1">
                      Mode: {entry.mode}
                    </div>
                    {entry.primes.length > 0 && (
                      <div className="text-sm text-gray-300 mt-1">
                        Primes: {entry.primes.join(', ')}
                      </div>
                    )}
                    {entry.notes && (
                      <div className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Selected Entry Modal */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-white font-semibold">Saved Experience</h3>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              
              <div className="text-sm text-gray-400 mb-2">
                {formatDate(selectedEntry.date)}
              </div>
              
              <div className="bg-gray-800 p-3 rounded mb-3">
                <div className="text-white">Mode: {selectedEntry.mode}</div>
                
                {selectedEntry.primes.length > 0 && (
                  <div className="text-gray-300 mt-2">
                    <span className="font-medium">Active Primes:</span> {selectedEntry.primes.map(p => `${p*100}Hz`).join(', ')}
                  </div>
                )}
                
                {selectedEntry.favoriteFrequencies.length > 0 && (
                  <div className="text-gray-300 mt-2">
                    <span className="font-medium">Favorite Frequencies:</span> {selectedEntry.favoriteFrequencies.map(f => `${f}Hz`).join(', ')}
                  </div>
                )}
              </div>
              
              {selectedEntry.notes && (
                <div>
                  <div className="font-medium text-white mb-1">Notes:</div>
                  <div className="bg-gray-800 p-3 rounded text-gray-300 whitespace-pre-wrap">
                    {selectedEntry.notes}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  onClick={() => setSelectedEntry(null)}
                >
                  Back to Journal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionJournal;
