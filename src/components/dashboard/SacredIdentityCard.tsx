
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { fetchProfile, ProfileType } from "@/utils/profiles";
import { motion } from "framer-motion";
import { CircleUser } from "lucide-react";

const SacredIdentityCard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        console.log("SacredIdentityCard: No user found");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("SacredIdentityCard: Fetching profile for user:", user.id);
        const userProfile = await fetchProfile(user.id);
        console.log("SacredIdentityCard: Fetched profile:", userProfile);
        setProfile(userProfile);
      } catch (error) {
        console.error("SacredIdentityCard: Error loading profile:", error);
        setError("Failed to load your sacred identity");
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user]);

  console.log("SacredIdentityCard rendering with profile:", profile, "loading:", loading, "error:", error);

  // Enhanced placeholder while loading
  if (loading) {
    return (
      <Card className="h-full border-white/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 font-playfair">
            <CircleUser className="h-5 w-5 text-indigo-400" />
            Sacred Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[200px] flex flex-col justify-center items-center">
            <div className="w-32 h-6 bg-indigo-200/20 rounded mb-3 animate-pulse"></div>
            <div className="w-24 h-4 bg-indigo-200/10 rounded mb-6 animate-pulse"></div>
            <div className="w-full h-16 bg-indigo-200/10 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full border-white/20 bg-gradient-to-br from-red-500/5 to-pink-500/5">
        <CardHeader className="p-6">
          <CardTitle className="flex items-center gap-2 font-playfair">
            <CircleUser className="h-5 w-5 text-red-400" />
            Sacred Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[200px] flex flex-col justify-center items-center text-center">
            <p className="text-red-300">{error}</p>
            <p className="text-gray-400 text-sm mt-2">Don't worry, you can continue your journey</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Default display if no profile
  const displayName = profile?.display_name || "Sacred Explorer";
  const fullName = profile?.full_name;
  const bio = profile?.bio;
  const interests = profile?.interests || [];
  const primaryIntention = profile?.primary_intention;
  const ascensionTitle = profile?.ascension_title || "Seeker";
  const soulAlignment = profile?.soul_alignment || "Light";
  const lightbearerLevel = profile?.lightbearer_level || 1;
  const frequencySignature = profile?.frequency_signature || "";
  const badges = profile?.badges || [];
  
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
            <div className="w-full h-full bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5" />
          </div>
          
          {/* Profile content */}
          <div className="relative z-10">
            {/* Display name with glow effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-1"
            >
              <h3 className="text-2xl font-playfair font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                {displayName}
              </h3>
              
              {/* Ascension Title (new) */}
              <p className="text-xs text-indigo-400/80 mt-1">
                {ascensionTitle} • Level {lightbearerLevel}
              </p>
              
              {/* Real name (if available) */}
              {fullName && (
                <p className="text-sm text-gray-400 mt-1">
                  {fullName}
                </p>
              )}
            </motion.div>
            
            {/* Soul Alignment Badge (new) */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-3"
            >
              <Badge variant="outline" className={`
                px-2 py-0.5 text-xs 
                ${soulAlignment === 'Light' ? 'border-indigo-400/30 text-indigo-300' : 
                  soulAlignment === 'Shadow' ? 'border-purple-400/30 text-purple-300' : 
                  'border-teal-400/30 text-teal-300'}
              `}>
                {soulAlignment} Path
              </Badge>
              
              {/* Frequency Signature (new) */}
              {frequencySignature && (
                <span className="ml-2 text-xs text-gray-400">
                  {frequencySignature}
                </span>
              )}
            </motion.div>
            
            {/* Sacred Bio */}
            {bio ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-3"
              >
                <div className="italic text-sm text-gray-300 border-l-2 border-purple-400/30 pl-3 py-1">
                  &ldquo;{bio}&rdquo;
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-3"
              >
                <div className="italic text-sm text-gray-400 border-l-2 border-purple-400/30 pl-3 py-1">
                  &ldquo;Begin your sacred journey by setting your intentions&rdquo;
                </div>
              </motion.div>
            )}
            
            {/* Badges (new) */}
            {badges && badges.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="mt-3 mb-2"
              >
                <p className="text-xs text-gray-400 mb-1">Soul Achievements:</p>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ) : null}
            
            {/* Interests/Paths */}
            {interests && interests.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-3"
              >
                <p className="text-xs text-gray-400 mb-2">Sacred Paths:</p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-3"
              >
                <p className="text-xs text-gray-400 mb-2">Suggested Paths:</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-200/70">
                    Meditation
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-200/70">
                    Frequency Healing
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-200/70">
                    Sacred Sound
                  </Badge>
                </div>
              </motion.div>
            )}
            
            {/* Primary intention */}
            {primaryIntention ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-3"
              >
                <p className="text-xs text-gray-400">Current Intention:</p>
                <p className="text-sm text-indigo-200">{primaryIntention}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-3"
              >
                <p className="text-xs text-gray-400">Intention:</p>
                <p className="text-sm text-indigo-200/60">Set an intention in the Energy Check section</p>
              </motion.div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SacredIdentityCard;
