
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface BirthChartProps {
  data: {
    sun_sign: string;
    moon_sign: string;
    rising_sign: string;
    birth_date: string;
  };
}

export const BirthChart: React.FC<BirthChartProps> = ({ data }) => {
  return (
    <Card className="border-indigo-100 dark:border-indigo-900/20">
      <CardHeader>
        <CardTitle>Birth Chart</CardTitle>
        <CardDescription>Your unique cosmic blueprint</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square rounded-full border-4 border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center">
          {/* This would typically be a visualization of the birth chart */}
          {/* For demo purposes, we're using a simpler representation */}
          <div className="absolute inset-0 rounded-full flex items-center justify-center">
            <div className="relative w-3/4 h-3/4 rounded-full border-2 border-purple-200 dark:border-purple-800">
              {/* Sun position */}
              <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 dark:bg-yellow-600 text-white p-2 rounded-full">
                ☉
              </div>
              {/* Moon position */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-400 dark:bg-blue-600 text-white p-2 rounded-full">
                ☽
              </div>
              {/* Ascendant position */}
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-400 dark:bg-red-600 text-white p-2 rounded-full">
                ASC
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg">
                  <div className="font-medium">{data.sun_sign}</div>
                  <div className="text-xs text-muted-foreground">Sun Sign</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Alert className="mt-4 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            This is a simplified representation of your birth chart. For a full astrological reading, 
            consult with a professional astrologer.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
