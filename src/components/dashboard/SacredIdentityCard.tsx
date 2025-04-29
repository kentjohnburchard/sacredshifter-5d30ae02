
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfile, ProfileType } from "@/utils/profiles";
import { motion } from "framer-motion";
import { CircleUser } from "lucide-react";

const SacredIdentityCard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userProfile = await fetchProfile(user.id);
        setProfile(userProfile);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);
  
  if (loading) {
    return (
      <Card className="h-full border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardContent className="p-6 flex justify-center items-center h-[200px]">
          <div className="text-muted-foreground">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }
  
  if (!profile) {
    return null;
  }
  
  return (
    <Card className="h-full overflow-hidden border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
      <div className="h-1 bg-gradient-to-r from-indigo-500/60 to-purple-500/60" />
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 font-playfair">
          <CircleUser className="h-5 w-5 text-indigo-400" />
          Sacred Identity
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 pt-0">
        <div className="relative">
          {/* Background sacred geometry pattern (subtle) */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[url('/path/to/sacred-geometry.png')] bg-no-repeat bg-center bg-contain" />
          </div>
          
          {/* Profile content */}
          <div className="relative z-10">
            {/* Display name with glow effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-3"
            >
              <h3 className="text-2xl font-playfair font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                {profile.display_name || "Sacred Explorer"}
              </h3>
              
              {/* Real name (if available) */}
              {profile.full_name && (
                <p className="text-sm text-gray-400 mt-1">
                  {profile.full_name}
                </p>
              )}
            </motion.div>
            
            {/* Sacred Bio */}
            {profile.bio && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-4"
              >
                <div className="italic text-sm text-gray-300 border-l-2 border-purple-400/30 pl-3 py-1">
                  &ldquo;{profile.bio}&rdquo;
                </div>
              </motion.div>
            )}
            
            {/* Interests/Paths */}
            {profile.interests && profile.interests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-4"
              >
                <p className="text-xs text-gray-400 mb-2">Sacred Paths:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Primary intention */}
            {profile.primary_intention && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-4"
              >
                <p className="text-xs text-gray-400">Current Intention:</p>
                <p className="text-sm text-indigo-200">{profile.primary_intention}</p>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SacredIdentityCard;
