
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, Music } from "lucide-react";

interface FrequencyFiltersProps {
  chakras: string[];
  principles: string[];
  chakraFilter: string | null;
  principleFilter: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChakraFilterChange: (value: string | null) => void;
  onPrincipleFilterChange: (value: string | null) => void;
}

const FrequencyFilters: React.FC<FrequencyFiltersProps> = ({
  chakras,
  principles,
  chakraFilter,
  principleFilter,
  searchQuery,
  onSearchChange,
  onChakraFilterChange,
  onPrincipleFilterChange
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search frequencies, titles, or descriptions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Select 
            value={chakraFilter || "all-chakras"} 
            onValueChange={(value) => onChakraFilterChange(value === "all-chakras" ? null : value)}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by Chakra" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-chakras">All Chakras</SelectItem>
              {chakras.map(chakra => (
                <SelectItem key={chakra} value={chakra}>{chakra}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {principles.length > 0 && (
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Select 
              value={principleFilter || "all-principles"} 
              onValueChange={(value) => onPrincipleFilterChange(value === "all-principles" ? null : value)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Principle" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-principles">All Principles</SelectItem>
                {principles.map(principle => (
                  <SelectItem key={principle} value={principle}>{principle}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FrequencyFilters;
