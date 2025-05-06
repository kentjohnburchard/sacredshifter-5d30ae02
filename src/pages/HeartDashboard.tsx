
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { getUserChakraProgress } from '@/services/chakraService';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import ChakraIcon from '@/components/chakra/ChakraIcon';
import { Progress } from '@/components/ui/progress';

const HeartDashboard: React.FC = () => {
  const { user } = useAuth();
  const [chakraProgress, setChakraProgress] = useState<{ chakra: ChakraTag; count: number; percentage: number; }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchChakraProgress = async () => {
      if (!user) {
        console.warn("No user found, cannot fetch chakra progress");
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const progress = await getUserChakraProgress(user.id);
        setChakraProgress(progress);
      } catch (err: any) {
        console.error('Error fetching chakra progress:', err);
        setError(err.message || 'Failed to load chakra progress');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChakraProgress();
  }, [user]);
  
  if (loading) {
    return (
      <Layout pageTitle="Heart Dashboard | Sacred Shifter">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-500 rounded-full mr-3"></div>
          <div className="text-purple-700">Loading your chakra progress...</div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout pageTitle="Heart Dashboard | Sacred Shifter">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      pageTitle="Heart Dashboard | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
      showGlobalWatermark={true}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-red-300"
              style={{textShadow: '0 2px 10px rgba(236, 72, 153, 0.7)'}}>
            Chakra Activation Dashboard
          </h1>
          <p className="text-lg text-center text-white mb-12 max-w-3xl mx-auto"
             style={{textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)'}}>
            Track your chakra activations and balance your energy centers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chakraProgress.map((item) => (
              <ChakraCard key={item.chakra} chakra={item.chakra} count={item.count} percentage={item.percentage} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ChakraCard = ({ chakra, count, percentage }: { chakra: ChakraTag, count: number, percentage: number }) => {
  const color = getChakraColor(chakra);
  
  return (
    <div className="bg-black/60 border-purple-500/30 border rounded-lg p-6 hover:scale-105 transition-transform duration-300">
      <div className="flex items-center mb-4">
        <ChakraIcon chakra={chakra} size={40} className="mr-4" />
        <h2 className="text-xl font-semibold text-white">{chakra} Chakra</h2>
      </div>
      <p className="text-gray-300 mb-2">
        <span className="font-bold text-gray-100">{count}</span> Activations
      </p>
      <ChakraProgressBar chakra={chakra} value={percentage} />
    </div>
  );
};

const ChakraProgressBar = ({ chakra, value }: { chakra: ChakraTag, value: number }) => {
  const color = getChakraColor(chakra);
  
  return (
    <div className="my-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm">{chakra}</span>
        <span className="text-sm">{value}%</span>
      </div>
      <Progress 
        value={value}
        className="h-2"
        style={{
          backgroundColor: "rgba(30, 30, 30, 0.5)",
          border: `1px solid ${color}30`,
        }}
      />
    </div>
  );
};

export default HeartDashboard;
