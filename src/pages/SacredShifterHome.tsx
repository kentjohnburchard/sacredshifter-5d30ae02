
import React from 'react';
import AppShell from '@/components/layout/AppShell';
import HomeDashboard from '@/components/dashboard/HomeDashboard';

const SacredShifterHome: React.FC = () => {
  return (
    <AppShell pageTitle="Sacred Dashboard">
      <HomeDashboard />
    </AppShell>
  );
};

export default SacredShifterHome;
