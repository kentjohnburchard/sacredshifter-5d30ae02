
import React from "react";
import { Button } from "@/components/ui/button";
import { Music, Heart, Sparkles, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Header from "@/components/navigation/Header";
import Layout from "@/components/Layout";
import { TrademarkedName } from "@/components/ip-protection";
import SacredAudioPlayer from "@/components/audio/SacredAudioPlayer";
import ConsciousnessToggle from "@/components/ConsciousnessToggle";

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 mb-4">
            Welcome to Sacred Shifter
          </h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto">
            Experience the healing power of sacred frequencies and sound vibrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[
            { 
              title: 'Sound Healing', 
              description: 'Frequency-based sound healing journeys', 
              path: '/journey-templates', 
              icon: <Music className="h-6 w-6" />,
              color: 'border-purple-500/20' 
            },
            { 
              title: 'Heart Center', 
              description: 'Open and balance your heart chakra', 
              path: '/heart-center', 
              icon: <Heart className="h-6 w-6" />,
              color: 'border-pink-500/20'  
            },
            { 
              title: 'Sacred Blueprint', 
              description: 'Discover your unique energetic signature', 
              path: '/sacred-blueprint', 
              icon: <Sparkles className="h-6 w-6" />,
              color: 'border-indigo-500/20'  
            },
            { 
              title: 'Hermetic Wisdom', 
              description: 'Ancient wisdom for modern consciousness', 
              path: '/hermetic-wisdom', 
              icon: <BookOpen className="h-6 w-6" />,
              color: 'border-blue-500/20'  
            },
          ].map(({ title, description, path, icon, color }) => (
            <Card 
              key={title} 
              className={`bg-black/30 backdrop-blur-sm border ${color} hover:bg-black/40 transition-all`}
            >
              <CardHeader>
                <div className="p-3 mb-3 rounded-full bg-black/40 w-fit border border-purple-500/20">
                  {icon}
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="text-gray-300">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={path}>
                  <Button className="w-full bg-purple-900/60 hover:bg-purple-800/80">
                    Explore
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-500/20 bg-black/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                <TrademarkedName>Sacred Blueprint</TrademarkedName>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Discover your unique vibrational fingerprint that reveals your energetic signature,
                spiritual identity, and soul purpose.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-200">
                  Every frequency carries intention. The frequencies you're drawn to are often 
                  the ones your energy body is seeking for balance.
                </p>
                <Link to="/sacred-blueprint">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Reveal Your Blueprint
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <SacredAudioPlayer />
      <ConsciousnessToggle />
    </Layout>
  );
};

export default Home;
