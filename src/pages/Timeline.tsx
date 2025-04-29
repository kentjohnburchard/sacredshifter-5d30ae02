
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import TimelineViewer from '@/components/timeline/TimelineViewer';
import SpiralView from '@/components/timeline/SpiralView';
import FiltersBar from '@/components/timeline/FiltersBar';
import ToggleView from '@/components/timeline/ToggleView';
import EditEntryDialog from '@/components/timeline/EditEntryDialog';

const Timeline: React.FC = () => {
  const [viewMode, setViewMode] = useState<'vertical' | 'spiral'>('vertical');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);

  const handleViewChange = (mode: 'vertical' | 'spiral') => {
    setViewMode(mode);
  };
  
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };
  
  const handleEditEntry = (entry: any) => {
    setCurrentEntry(entry);
    setShowEditDialog(true);
  };
  
  const handleCloseDialog = () => {
    setShowEditDialog(false);
    setCurrentEntry(null);
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <FiltersBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            <ToggleView viewMode={viewMode} onViewChange={handleViewChange} />
          </div>
          
          {viewMode === 'vertical' ? (
            <TimelineViewer filter={activeFilter} onEditEntry={handleEditEntry} />
          ) : (
            <SpiralView filter={activeFilter} onEditEntry={handleEditEntry} />
          )}
        </Card>
        
        {showEditDialog && currentEntry && (
          <EditEntryDialog
            entry={currentEntry}
            isOpen={showEditDialog}
            onClose={handleCloseDialog}
          />
        )}
      </div>
    </Layout>
  );
};

export default Timeline;
