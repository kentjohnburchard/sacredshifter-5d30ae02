
import React from 'react';
import AppShell from '@/components/layout/AppShell';

interface PlaceholderProps {
  name: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ name }) => {
  return (
    <AppShell pageTitle={name}>
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{name} Page</h1>
          <p className="text-xl text-gray-300">This page is under construction but still sacred ✨</p>
        </div>
      </div>
    </AppShell>
  );
};

export default Placeholder;
