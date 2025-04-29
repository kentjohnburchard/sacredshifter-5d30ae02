
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, LayoutList } from "lucide-react";

interface ToggleViewProps {
  viewMode: 'vertical' | 'spiral';
  onViewChange: (view: 'vertical' | 'spiral') => void;
}

const ToggleView: React.FC<ToggleViewProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex justify-end mb-6">
      <Tabs value={viewMode} onValueChange={(value) => onViewChange(value as 'vertical' | 'spiral')}>
        <TabsList className="bg-gray-800/50 border border-gray-700/30">
          <TabsTrigger 
            value="vertical"
            className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-100"
          >
            <LayoutList className="h-4 w-4 mr-1" />
            List
          </TabsTrigger>
          <TabsTrigger 
            value="spiral"
            className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-100"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ToggleView;
