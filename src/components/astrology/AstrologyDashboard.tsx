import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BirthChart } from "./BirthChart";
import { ElementalProfile } from "./ElementalProfile";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal } from "lucide-react";
import { UserBirthDataForm } from "./UserBirthDataForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatAstroData } from "@/utils/formatters";

interface UserAstrologyData {
  birth_date: string;
  birth_time: string;
  birth_place: string;
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  dominant_element: string;
}

export const AstrologyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [astrologyData, setAstrologyData] = useState<UserAstrologyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editFormOpen, setEditFormOpen] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchUserAstrologyData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_astrology_data')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          // If we have birth data but no astrological data, calculate it
          if (!data.sun_sign) {
            const calculatedData = {
              ...data,
              sun_sign: calculateSunSign(data.birth_date),
              moon_sign: calculateMoonSign(data.birth_date, data.birth_time),
              rising_sign: calculateRisingSign(data.birth_date, data.birth_time, data.birth_place),
              dominant_element: calculateDominantElement(data.birth_date, data.birth_time)
            };
            
            // Update with calculated data
            try {
              await supabase
                .from('user_astrology_data')
                .update({
                  sun_sign: calculatedData.sun_sign,
                  moon_sign: calculatedData.moon_sign,
                  rising_sign: calculatedData.rising_sign,
                  dominant_element: calculatedData.dominant_element
                })
                .eq('user_id', user.id);
                
              setAstrologyData(calculatedData);
            } catch (updateError) {
              console.error("Error updating astrology data:", updateError);
              toast.error("Failed to update your astrology data");
            }
          } else {
            setAstrologyData(data as UserAstrologyData);
          }
        }
      } catch (error) {
        console.error("Error fetching astrology data:", error);
        toast.error("Failed to load your astrology data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAstrologyData();
  }, [user]);
  
  const handleBirthDataUpdated = () => {
    setEditFormOpen(false);
    // Refetch the data
    if (user) {
      setLoading(true);
      supabase
        .from('user_astrology_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error refetching astrology data:", error);
            toast.error("Failed to reload your astrology data");
          } else if (data) {
            setAstrologyData(data as UserAstrologyData);
          }
          setLoading(false);
        });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!astrologyData) {
    return (
      <Card className="border-purple-100 dark:border-purple-900/20">
        <CardHeader>
          <CardTitle>Astrology Profile</CardTitle>
          <CardDescription>We couldn't find your birth data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Please add your birth details to see your astrological profile.</p>
          <UserBirthDataForm onSubmitSuccess={handleBirthDataUpdated} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Your Cosmic Profile
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setEditFormOpen(true)}
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Birth Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-indigo-100 dark:border-indigo-900/20">
          <CardHeader>
            <CardTitle>Birth Information</CardTitle>
            <CardDescription>Your cosmic origin point</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Birth Date</h4>
                <p>{formatAstroData(astrologyData.birth_date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Birth Time</h4>
                <p>{astrologyData.birth_time || "Not specified"}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground">Birth Place</h4>
                <p>{astrologyData.birth_place}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-100 dark:border-purple-900/20">
          <CardHeader>
            <CardTitle>Your Signs</CardTitle>
            <CardDescription>The cosmic influences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Sun Sign</h4>
                <span className="text-sm font-medium">{astrologyData.sun_sign}</span>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Moon Sign</h4>
                <span className="text-sm font-medium">{astrologyData.moon_sign}</span>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Rising Sign</h4>
                <span className="text-sm font-medium">{astrologyData.rising_sign}</span>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Dominant Element</h4>
                <span className="text-sm font-medium">{astrologyData.dominant_element}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BirthChart data={astrologyData} />
        <ElementalProfile dominantElement={astrologyData.dominant_element} />
      </div>
      
      <Dialog open={editFormOpen} onOpenChange={setEditFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Your Birth Information</DialogTitle>
          </DialogHeader>
          <UserBirthDataForm onSubmitSuccess={handleBirthDataUpdated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

function calculateSunSign(birthDate: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

function calculateMoonSign(birthDate: string, birthTime?: string): string {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const moonSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const moonIndex = Math.floor((dayOfYear % 30) / 2.5) % 12;
  
  return moonSigns[moonIndex];
}

function calculateRisingSign(birthDate: string, birthTime?: string, birthPlace?: string): string {
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
                "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  
  if (!birthTime) {
    const date = new Date(birthDate);
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    return signs[(dayOfYear % 12)];
  }
  
  const [hour, minute] = birthTime.split(':').map(Number);
  return signs[hour % 12];
}

function calculateDominantElement(birthDate: string, birthTime?: string): string {
  const date = new Date(birthDate);
  const sunSign = calculateSunSign(birthDate);
  const moonSign = calculateMoonSign(birthDate, birthTime);
  
  const elementMap: {[key: string]: string} = {
    "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
    "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
    "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
    "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
  };
  
  const sunElement = elementMap[sunSign];
  const moonElement = elementMap[moonSign];
  
  if (sunElement === moonElement) {
    return sunElement;
  }
  
  return sunElement;
}
