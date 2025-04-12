
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Frequencies: React.FC = () => {
  const frequencyData = [
    { frequency: 432, name: "Miracle Tone", description: "Known for creating a sense of peace and well-being", chakra: "Heart" },
    { frequency: 528, name: "Love Frequency", description: "Associated with DNA repair and transformation", chakra: "Heart" },
    { frequency: 639, name: "Connecting Frequency", description: "Helps with interpersonal relationships", chakra: "Heart" },
    { frequency: 741, name: "Awakening Intuition", description: "Cleansing frequency that helps problem solving", chakra: "Third Eye" },
    { frequency: 852, name: "Spiritual Return", description: "Awakens spiritual intuition", chakra: "Crown" },
    { frequency: 963, name: "Divine Connection", description: "Connects to the spiritual light", chakra: "Crown" },
    { frequency: 396, name: "Liberation Frequency", description: "Liberates you from fear and guilt", chakra: "Root" },
    { frequency: 417, name: "Change Facilitator", description: "Facilitates change and clearing of past traumas", chakra: "Sacral" },
  ];

  const getChakraColor = (chakra: string): string => {
    switch (chakra.toLowerCase()) {
      case 'root': return 'bg-red-500/50 border-red-400';
      case 'sacral': return 'bg-orange-500/50 border-orange-400';
      case 'solar plexus': return 'bg-yellow-500/50 border-yellow-400';
      case 'heart': return 'bg-green-500/50 border-green-400';
      case 'throat': return 'bg-blue-500/50 border-blue-400';
      case 'third eye': return 'bg-indigo-500/50 border-indigo-400';
      case 'crown': return 'bg-purple-500/50 border-purple-400';
      default: return 'bg-purple-500/50 border-purple-400';
    }
  };

  return (
    <Layout pageTitle="Frequency Library" theme="cosmic">
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold text-white mb-6">Frequency Library</h1>
        <div className="bg-black/30 backdrop-blur-sm text-white p-6 rounded-lg">
          <p className="mb-6 text-lg">
            Explore our collection of healing frequencies and sound therapies designed to 
            restore harmony and balance to your energy centers. Each frequency is associated
            with specific chakras and healing intentions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {frequencyData.map((item) => (
              <div key={item.frequency} className={`p-5 rounded-lg text-center border ${getChakraColor(item.chakra)}`}>
                <h3 className="text-2xl font-semibold text-white">{item.frequency} Hz</h3>
                <p className="text-lg mt-1 font-medium text-white">{item.name}</p>
                <p className="text-sm mt-2 text-white/80">{item.description}</p>
                <p className="text-sm mt-2 font-medium">{item.chakra} Chakra</p>
                <Button 
                  className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <Music className="mr-2 h-4 w-4" /> 
                  Play {item.frequency}Hz
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="mb-4 text-white">Want to explore more detailed information about frequencies?</p>
            <Link to="/frequency-library">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Music className="mr-2 h-4 w-4" />
                Advanced Frequency Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Frequencies;
