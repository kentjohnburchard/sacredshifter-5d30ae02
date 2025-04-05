
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FrequencyFiltersProps {
  chakras: string[];
  principles: string[];
  chakraFilter: string | null;
  principleFilter: string | null;
  onChakraFilterChange: (value: string | null) => void;
  onPrincipleFilterChange: (value: string | null) => void;
}

const FrequencyFilters: React.FC<FrequencyFiltersProps> = ({
  chakras,
  principles,
  chakraFilter,
  principleFilter,
  onChakraFilterChange,
  onPrincipleFilterChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="w-full md:w-1/3 lg:w-1/4">
        <Select 
          value={chakraFilter || ""} 
          onValueChange={(value) => onChakraFilterChange(value || null)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by Chakra" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Chakras</SelectItem>
            {chakras.map(chakra => (
              <SelectItem key={chakra} value={chakra}>{chakra}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {principles.length > 0 && (
        <div className="w-full md:w-1/3 lg:w-1/4">
          <Select 
            value={principleFilter || ""} 
            onValueChange={(value) => onPrincipleFilterChange(value || null)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Principle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Principles</SelectItem>
              {principles.map(principle => (
                <SelectItem key={principle} value={principle}>{principle}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default FrequencyFilters;
