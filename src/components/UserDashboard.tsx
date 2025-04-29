import React from 'react';
import LightbearerStatsCard from '@/components/dashboard/LightbearerStatsCard';
import SacredIdentityCard from '@/components/dashboard/SacredIdentityCard';
import SoulProgressCard from '@/components/dashboard/SoulProgressCard';
import ValePrompt from '@/components/dashboard/ValePrompt';
import { useUserSubscription } from '@/hooks/useUserSubscription';

const UserDashboard: React.FC = () => {
  const { isPremiumUser } = useUserSubscription();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400 max-w-2xl">
            Continue your journey with Sacred Shifter and explore the depths of consciousness.
          </p>
        </div>
      </div>
      
      {/* Vale Prompt for Premium Users */}
      {isPremiumUser() && (
        <div className="mb-6">
          <ValePrompt />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First row */}
        <div className="md:col-span-2">
          <LightbearerStatsCard />
        </div>
        <div>
          <SacredIdentityCard />
        </div>
        
        {/* Second row */}
        <div>
          <SoulProgressCard />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
