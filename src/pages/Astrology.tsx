
import React from 'react';
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { AstrologyDashboard, UserBirthDataForm, ZodiacSignCard, DailyHoroscope, CosmicProfile } from '@/components/astrology';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import AnimatedBackground from "@/components/AnimatedBackground";

const Astrology: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("cosmic-profile");

  return (
    <Layout pageTitle="The Sacred Signature">
      {/* Animated Background */}
      <AnimatedBackground colorScheme="cosmic" />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <p className="text-center text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover how the celestial bodies influence your energy and receive daily cosmic guidance 
            personalized to your unique astrological profile.
          </p>
        </motion.div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 mb-8 mx-auto max-w-2xl">
            <TabsTrigger value="cosmic-profile">Daily Insights</TabsTrigger>
            <TabsTrigger value="astro-profile">Astro Profile</TabsTrigger>
            <TabsTrigger value="horoscope">Your Horoscope</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cosmic-profile" className="mt-0">
            <CosmicProfile />
          </TabsContent>
          
          <TabsContent value="astro-profile" className="mt-0">
            <AstrologyDashboard />
          </TabsContent>
          
          <TabsContent value="horoscope" className="mt-0">
            <DailyHoroscope />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Astrology;
