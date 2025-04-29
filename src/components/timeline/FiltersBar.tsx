
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Tag, Music } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';

interface FilterOption {
  value: string;
  label: string;
}

interface FiltersBarProps {
  tags: string[];
  frequencies: number[];
  onTagFilter: (tag: string | null) => void;
  onFrequencyFilter: (frequency: string) => void;
  onTypeFilter: (type: string | null) => void;
  activeTagFilter: string | null;
  activeFrequencyFilter: string;
  activeTypeFilter: string | null;
}

const typeOptions: FilterOption[] = [
  { value: 'all', label: 'All Types' },
  { value: 'journal', label: 'Journal' },
  { value: 'journey', label: 'Journey' },
  { value: 'music', label: 'Music' },
  { value: 'intention', label: 'Intention' }
];

const FiltersBar: React.FC<FiltersBarProps> = ({
  tags,
  frequencies,
  onTagFilter,
  onFrequencyFilter,
  onTypeFilter,
  activeTagFilter,
  activeFrequencyFilter,
  activeTypeFilter
}) => {
  const [showFrequencyFilter, setShowFrequencyFilter] = useState(frequencies.length > 0);
  const [showTagFilter, setShowTagFilter] = useState(tags.length > 0);
  const [showTypeFilter, setShowTypeFilter] = useState(true);
  
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Filter className="h-4 w-4 mr-2 text-purple-400" />
          Filters:
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {showTypeFilter && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              className="flex items-center gap-1 border-purple-500/30 text-purple-200 bg-purple-900/20"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Type</span>
            </Button>
          )}
          
          {frequencies.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFrequencyFilter(!showFrequencyFilter)}
              className="flex items-center gap-1 border-purple-500/30 text-purple-200 bg-purple-900/20"
            >
              <Music className="h-3.5 w-3.5" />
              <span>Frequency</span>
            </Button>
          )}
          
          {tags.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowTagFilter(!showTagFilter)}
              className="flex items-center gap-1 border-purple-500/30 text-purple-200 bg-purple-900/20"
            >
              <Tag className="h-3.5 w-3.5" />
              <span>Tags</span>
            </Button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showTypeFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-900/30 rounded-md">
              <span className="text-sm text-gray-300 mr-1">Entry Type:</span>
              {typeOptions.map(type => (
                <Badge 
                  key={type.value}
                  variant={activeTypeFilter === type.value || (type.value === 'all' && !activeTypeFilter) ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    activeTypeFilter === type.value || (type.value === 'all' && !activeTypeFilter)
                      ? 'bg-purple-500 hover:bg-purple-600' 
                      : 'hover:bg-purple-900/30 bg-transparent border-purple-500/30 text-purple-200'
                  }`}
                  onClick={() => onTypeFilter(type.value === 'all' ? null : type.value)}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
        
        {showFrequencyFilter && frequencies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 p-3 bg-gray-900/30 rounded-md">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-300">Frequency:</span>
              </div>
              <Select
                value={activeFrequencyFilter}
                onValueChange={onFrequencyFilter}
              >
                <SelectTrigger className="w-[180px] bg-purple-900/30 border-purple-500/30">
                  <SelectValue placeholder="All Frequencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  {frequencies.map(freq => (
                    <SelectItem key={freq} value={String(freq)}>
                      {freq}Hz
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
        
        {showTagFilter && tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 items-center p-3 bg-gray-900/30 rounded-md">
              <div className="flex items-center gap-2 mr-1">
                <Tag className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Tags:</span>
              </div>
              {tags.map(tag => (
                <Badge 
                  key={tag}
                  variant={activeTagFilter === tag ? 'default' : 'outline'}
                  className={`cursor-pointer ${
                    activeTagFilter === tag 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'hover:bg-blue-900/30 bg-transparent border-blue-500/30 text-blue-200'
                  }`}
                  onClick={() => onTagFilter(activeTagFilter === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {(activeTagFilter || activeFrequencyFilter !== 'all' || activeTypeFilter) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-wrap gap-2 items-center"
        >
          <span className="text-xs text-gray-400">Active filters:</span>
          
          {activeTypeFilter && (
            <Badge 
              className="bg-purple-500"
              onClick={() => onTypeFilter(null)}
            >
              Type: {activeTypeFilter}
              <span className="ml-1 cursor-pointer">×</span>
            </Badge>
          )}
          
          {activeTagFilter && (
            <Badge 
              className="bg-blue-500"
              onClick={() => onTagFilter(null)}
            >
              Tag: {activeTagFilter}
              <span className="ml-1 cursor-pointer">×</span>
            </Badge>
          )}
          
          {activeFrequencyFilter !== 'all' && (
            <Badge 
              className="bg-indigo-500"
              onClick={() => onFrequencyFilter('all')}
            >
              Frequency: {activeFrequencyFilter}Hz
              <span className="ml-1 cursor-pointer">×</span>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-gray-400 hover:text-gray-300"
            onClick={() => {
              onTagFilter(null);
              onFrequencyFilter('all');
              onTypeFilter(null);
            }}
          >
            Clear all filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default FiltersBar;
