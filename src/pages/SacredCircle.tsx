import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { Sun, Moon, Undo2, Users, Search, MessageCircle, User } from 'lucide-react';

interface LightbearerProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  ascensionTitle: string;
  soulAlignment: 'Light' | 'Shadow' | 'Unity';
  level: number;
  badges: string[];
}

// Mock data for development purposes
const mockProfiles: LightbearerProfile[] = [
  {
    id: '1',
    name: 'Sophia Grace',
    ascensionTitle: 'Seeker of Truth',
    soulAlignment: 'Light',
    level: 3,
    badges: ['Frequency Adept', 'Sound Healer'],
    avatarUrl: ''
  },
  {
    id: '2',
    name: 'Marcus Aurelius',
    ascensionTitle: 'Shadow Walker',
    soulAlignment: 'Shadow',
    level: 5,
    badges: ['Dream Weaver', 'Cosmic Explorer', 'Sacred Geometer'],
    avatarUrl: ''
  },
  {
    id: '3',
    name: 'Luna Stellar',
    ascensionTitle: 'Architect of Balance',
    soulAlignment: 'Unity',
    level: 7,
    badges: ['Harmonic Guardian', 'Master Frequency'],
    avatarUrl: ''
  },
  {
    id: '4',
    name: 'Orion Light',
    ascensionTitle: 'Celestial Guide',
    soulAlignment: 'Light',
    level: 4,
    badges: ['Star Traveler'],
    avatarUrl: ''
  },
  {
    id: '5',
    name: 'Nova Darkwood',
    ascensionTitle: 'Void Dancer',
    soulAlignment: 'Shadow',
    level: 6,
    badges: ['Quantum Shifter', 'Frequency Master'],
    avatarUrl: ''
  },
  {
    id: '6',
    name: 'Harmony Celestia',
    ascensionTitle: 'Balance Keeper',
    soulAlignment: 'Unity',
    level: 5,
    badges: ['Dimensional Anchor', 'Cosmic Channel'],
    avatarUrl: ''
  },
];

const SacredCircle: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<LightbearerProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<LightbearerProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [alignmentFilter, setAlignmentFilter] = useState<string | null>(null);
  
  // Initialize with mock data for now
  useEffect(() => {
    // In the future, fetch actual data from Supabase
    // For now, use mock data
    setProfiles(mockProfiles);
    setFilteredProfiles(mockProfiles);
  }, []);
  
  // Filter profiles based on search and alignment
  useEffect(() => {
    let filtered = [...profiles];
    
    if (searchQuery) {
      filtered = filtered.filter(profile => 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        profile.ascensionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.badges.some(badge => badge.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (alignmentFilter) {
      filtered = filtered.filter(profile => profile.soulAlignment === alignmentFilter);
    }
    
    setFilteredProfiles(filtered);
  }, [searchQuery, alignmentFilter, profiles]);
  
  const getAlignmentIcon = (alignment: string) => {
    switch(alignment) {
      case 'Light': return <Sun className="h-4 w-4 text-yellow-400" />;
      case 'Shadow': return <Moon className="h-4 w-4 text-indigo-400" />;
      case 'Unity': return <Undo2 className="h-4 w-4 text-purple-400" />;
      default: return null;
    }
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <Layout 
      pageTitle="Sacred Circle | Sacred Shifter"
      showNavbar={true}
      showContextActions={true}
    >
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                Sacred Circle
              </h1>
              <p className="text-gray-400 max-w-3xl">
                Connect with fellow lightbearers on the path of spiritual evolution. 
                Share wisdom, support each other's journey, and grow together in consciousness.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
              >
                <Users className="mr-2 h-4 w-4" />
                Find Lightbearers
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                Join Discussions
              </Button>
            </div>
          </div>
          
          {/* Filters Section */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  placeholder="Search by name, title, or badge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800/50 border-gray-700/50"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={alignmentFilter === 'Light' ? "default" : "outline"}
                  size="sm"
                  className={alignmentFilter === 'Light' 
                    ? "bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30" 
                    : "border-gray-700/50 text-gray-300"}
                  onClick={() => setAlignmentFilter(alignmentFilter === 'Light' ? null : 'Light')}
                >
                  <Sun className="h-4 w-4 mr-1" />
                  Light
                </Button>
                <Button 
                  variant={alignmentFilter === 'Shadow' ? "default" : "outline"}
                  size="sm"
                  className={alignmentFilter === 'Shadow' 
                    ? "bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30" 
                    : "border-gray-700/50 text-gray-300"}
                  onClick={() => setAlignmentFilter(alignmentFilter === 'Shadow' ? null : 'Shadow')}
                >
                  <Moon className="h-4 w-4 mr-1" />
                  Shadow
                </Button>
                <Button 
                  variant={alignmentFilter === 'Unity' ? "default" : "outline"}
                  size="sm"
                  className={alignmentFilter === 'Unity' 
                    ? "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30" 
                    : "border-gray-700/50 text-gray-300"}
                  onClick={() => setAlignmentFilter(alignmentFilter === 'Unity' ? null : 'Unity')}
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  Unity
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border border-gray-800/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-sm hover:shadow-md hover:shadow-purple-500/5 transition-all overflow-hidden">
                <div className={`
                  h-2 w-full 
                  ${profile.soulAlignment === 'Light' ? 'bg-gradient-to-r from-yellow-500/70 to-orange-500/70' : 
                    profile.soulAlignment === 'Shadow' ? 'bg-gradient-to-r from-indigo-500/70 to-blue-500/70' : 
                    'bg-gradient-to-r from-purple-500/70 to-pink-500/70'}
                `}></div>
                <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-white/10">
                    <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 text-white">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-medium">{profile.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      {getAlignmentIcon(profile.soulAlignment)}
                      <span className="text-xs text-gray-400">{profile.soulAlignment} Path</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <div className="mb-3">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300 text-sm font-medium">
                      {profile.ascensionTitle}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Badge variant="outline" className="bg-purple-900/30 border-purple-500/30 text-xs">
                        Level {profile.level}
                      </Badge>
                      {profile.badges.length > 0 && (
                        <span className="text-xs text-gray-500">{profile.badges.length} badge{profile.badges.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                  
                  {profile.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {profile.badges.slice(0, 2).map((badge, idx) => (
                        <Badge 
                          key={idx} 
                          variant="outline"
                          className="bg-indigo-900/20 border-indigo-500/20 text-gray-300 text-xs"
                        >
                          {badge}
                        </Badge>
                      ))}
                      {profile.badges.length > 2 && (
                        <Badge variant="outline" className="bg-gray-800/50 border-gray-700/50 text-gray-400 text-xs">
                          +{profile.badges.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-2">
                    {user && user.id === profile.id ? (
                      <Button 
                        variant="outline" 
                        className="w-full border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
                        onClick={() => navigate("/timeline")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        View My Path
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full border-gray-700/50 text-gray-300">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
            
            {/* Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: filteredProfiles.length * 0.05 }}
            >
              <Card className="h-full border border-dashed border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-indigo-900/10 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-purple-200">Sacred Discussions</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Community discussions, wisdom sharing, and collaborative frequency work coming soon to the Sacred Circle.
                  </p>
                  <Badge variant="outline" className="bg-purple-900/20 border-purple-500/30 text-purple-200">
                    Coming Soon
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Add a prominent link to the Circle page */}
          <div className="mt-6 text-center">
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-3 px-8"
              onClick={() => navigate("/circle")}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Join Sacred Circle Chat
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SacredCircle;
