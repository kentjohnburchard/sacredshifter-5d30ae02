
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Music,
  BookOpen,
  Circle,
  Calendar,
  Tag,
  X
} from 'lucide-react';

interface FiltersBarProps {
  tags: string[];
  frequencies: number[];
  onTagFilter: (tag: string | null) => void;
  onFrequencyFilter: (freq: string) => void;
  onTypeFilter: (type: string | null) => void;
  activeTagFilter: string | null;
  activeFrequencyFilter: string;
  activeTypeFilter: string | null;
}

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
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'journal': return <BookOpen className="h-4 w-4" />;
      case 'journey': return <Calendar className="h-4 w-4" />;
      case 'music': return <Music className="h-4 w-4" />;
      case 'intention': return <Circle className="h-4 w-4" />;
      default: return null;
    }
  };
  
  return (
    <div className="flex flex-wrap items-center gap-3 bg-gray-900/40 p-4 rounded-lg border border-gray-800/30 mb-6">
      <div className="flex items-center">
        <Filter className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm font-medium text-gray-300">Filters:</span>
      </div>
      
      {/* Tag Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700/50 text-gray-300 flex items-center gap-1.5"
          >
            <Tag className="h-3.5 w-3.5" />
            {activeTagFilter || "All Tags"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900/90 backdrop-blur-md border-gray-700/50">
          <DropdownMenuItem 
            onClick={() => onTagFilter(null)}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            All Tags
          </DropdownMenuItem>
          {tags.map(tag => (
            <DropdownMenuItem 
              key={tag} 
              onClick={() => onTagFilter(tag)}
              className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
            >
              {tag}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Frequency Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700/50 text-gray-300 flex items-center gap-1.5"
          >
            <Music className="h-3.5 w-3.5" />
            {activeFrequencyFilter === "all" ? "All Frequencies" : `${activeFrequencyFilter}Hz`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900/90 backdrop-blur-md border-gray-700/50">
          <DropdownMenuItem 
            onClick={() => onFrequencyFilter("all")}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            All Frequencies
          </DropdownMenuItem>
          {frequencies.map(freq => (
            <DropdownMenuItem 
              key={freq} 
              onClick={() => onFrequencyFilter(String(freq))}
              className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
            >
              {freq}Hz
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Entry Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-700/50 text-gray-300 flex items-center gap-1.5"
          >
            {activeTypeFilter ? getTypeIcon(activeTypeFilter) : <BookOpen className="h-3.5 w-3.5" />}
            {activeTypeFilter ? 
              (activeTypeFilter.charAt(0).toUpperCase() + activeTypeFilter.slice(1)) : 
              "All Types"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900/90 backdrop-blur-md border-gray-700/50">
          <DropdownMenuItem 
            onClick={() => onTypeFilter(null)}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            All Types
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onTypeFilter('journal')}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            Journal
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onTypeFilter('journey')}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Journey
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onTypeFilter('music')}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            <Music className="h-3.5 w-3.5 mr-1.5" />
            Music
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onTypeFilter('intention')}
            className="text-gray-300 focus:bg-gray-800/50 focus:text-white"
          >
            <Circle className="h-3.5 w-3.5 mr-1.5" />
            Intention
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Active Filters Display */}
      <div className="ml-auto flex items-center gap-2">
        {(activeTagFilter || activeFrequencyFilter !== "all" || activeTypeFilter) && (
          <div className="flex items-center gap-1.5">
            {activeTagFilter && (
              <Badge 
                variant="outline" 
                className="bg-blue-500/20 text-blue-200 border-blue-400/30 flex items-center gap-1"
              >
                Tag: {activeTagFilter}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onTagFilter(null)}
                />
              </Badge>
            )}
            
            {activeFrequencyFilter !== "all" && (
              <Badge 
                variant="outline" 
                className="bg-purple-500/20 text-purple-200 border-purple-400/30 flex items-center gap-1"
              >
                Freq: {activeFrequencyFilter}Hz
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onFrequencyFilter("all")}
                />
              </Badge>
            )}
            
            {activeTypeFilter && (
              <Badge 
                variant="outline" 
                className="bg-green-500/20 text-green-200 border-green-400/30 flex items-center gap-1"
              >
                Type: {activeTypeFilter.charAt(0).toUpperCase() + activeTypeFilter.slice(1)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => onTypeFilter(null)}
                />
              </Badge>
            )}
          </div>
        )}
        
        {(activeTagFilter || activeFrequencyFilter !== "all" || activeTypeFilter) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              onTagFilter(null);
              onFrequencyFilter("all");
              onTypeFilter(null);
            }}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default FiltersBar;
