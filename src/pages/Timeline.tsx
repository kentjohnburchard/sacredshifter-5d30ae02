
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import TimelineViewer from '@/components/timeline/TimelineViewer';
import SpiralView from '@/components/timeline/SpiralView';
import FiltersBar from '@/components/timeline/FiltersBar';
import ToggleView from '@/components/timeline/ToggleView';
import EditEntryDialog from '@/components/timeline/EditEntryDialog';
import { ChakraTag } from '@/types/chakras';

const Timeline: React.FC = () => {
  const [viewMode, setViewMode] = useState<'vertical' | 'spiral'>('vertical');
  const [activeTagFilter, setActiveTagFilter] = useState<string>('all');
  const [chakraFilter, setChakraFilter] = useState<ChakraTag[]>([]);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);

  const handleViewChange = (mode: 'vertical' | 'spiral') => {
    setViewMode(mode);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveTagFilter(filter);
  };
  
  const handleChakraFilterChange = (chakras: ChakraTag[]) => {
    setChakraFilter(chakras);
  };
  
  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry);
    setShowEditDialog(true);
  };
  
  const handleDialogChange = (open: boolean) => {
    setShowEditDialog(open);
    if (!open) {
      setCurrentEntry(null);
    }
  };
  
  return (
    <Layout pageTitle="Timeline | Sacred Shifter">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300"
            style={{textShadow: '0 2px 10px rgba(139, 92, 246, 0.7)'}}>
          Sacred Timeline
        </h1>
        <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
           style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
          Track your spiritual journey through time
        </p>
        
        <Card className="p-6 bg-black/60 border-purple-500/30 mb-8">
          <div className="flex flex-col mb-6">
            <FiltersBar 
              activeTagFilter={activeTagFilter} 
              chakraFilter={chakraFilter}
              onFilterChange={handleFilterChange}
              onChakraFilterChange={handleChakraFilterChange}
            />
            <div className="flex justify-end mt-4">
              <ToggleView viewMode={viewMode} onViewChange={handleViewChange} />
            </div>
          </div>
          
          {viewMode === 'vertical' ? (
            <TimelineViewer 
              activeTagFilter={activeTagFilter}
              chakraFilter={chakraFilter}
              onEdit={handleEditEntry} 
            />
          ) : (
            <SpiralView 
              activeTagFilter={activeTagFilter}
              chakraFilter={chakraFilter}
              onEdit={handleEditEntry} 
            />
          )}
        </Card>
        
        {showEditDialog && currentEntry && (
          <EditEntryDialog
            entry={currentEntry}
            open={showEditDialog}
            onOpenChange={handleDialogChange}
          />
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
