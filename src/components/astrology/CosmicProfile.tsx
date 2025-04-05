
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getNatalChart, fetchDailyHoroscope } from "@/utils/astro";
import { AztroResponse, NatalChartResponse } from "@/utils/astro.types";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NatalChartForm } from "./NatalChartForm";
import { NatalChartDisplay } from "./NatalChartDisplay";
import { ZodiacSignCard } from "./ZodiacSignCard";
import { toast } from "sonner";
import { BirthData } from "@/utils/astro.types";

export const CosmicProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("natal-chart");
  const [chartData, setChartData] = useState<NatalChartResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [horoscope, setHoroscope] = useState<AztroResponse | null>(null);

  const handleNatalChartSubmit = async (data: BirthData) => {
    setIsSubmitting(true);
    try {
      // Add the user ID if available
      if (user?.id) {
        data.userId = user.id;
      }
      
      const chartData = await getNatalChart(data);
      setChartData(chartData);
      toast.success("Your cosmic blueprint has been revealed!");
      setActiveTab("view-chart");
    } catch (error) {
      console.error("Error generating natal chart:", error);
      toast.error("There was an issue generating your cosmic blueprint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-indigo-200 dark:border-indigo-900/20 overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-black/40">
          <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30">
            <CardTitle className="text-2xl text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Your Cosmic Profile
            </CardTitle>
            <CardDescription className="text-center">
              Discover your unique astrological signature and cosmic influences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8 mx-auto max-w-md">
                <TabsTrigger value="natal-chart">Generate Chart</TabsTrigger>
                <TabsTrigger value="view-chart" disabled={!chartData}>View Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="natal-chart">
                <NatalChartForm onSubmit={handleNatalChartSubmit} isSubmitting={isSubmitting} />
              </TabsContent>
              
              <TabsContent value="view-chart">
                {chartData && (
                  <NatalChartDisplay chartData={chartData} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
