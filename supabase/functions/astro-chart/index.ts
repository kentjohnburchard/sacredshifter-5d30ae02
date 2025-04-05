
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BirthData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  userId?: string;
}

interface NatalChartResponse {
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  elements: Record<string, number>;
  modalities: Record<string, number>;
  dominant_planets: string[];
  chart_svg_url?: string;
}

// Mock function to determine sun sign based on date
function getSunSign(dateStr: string): string {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is zero-indexed
  
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
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  
  return "Unknown";
}

// Mock function to determine moon sign based on date and time
// In a real implementation, this would use lunar calculations
function getMoonSign(dateStr: string, timeStr: string): string {
  // This is a simplified mock function
  // In reality, moon signs change every 2-3 days and require ephemeris data
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  // Using the hour as a simple shifting mechanism for demo purposes
  const hour = parseInt(timeStr.split(":")[0], 10) || 0;
  const moonShift = (hour % 12);
  
  const signIndex = ((month + day + moonShift) % 12);
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  return signs[signIndex];
}

// Mock function to determine rising sign based on time and location
// In a real implementation, this would use precise astronomical calculations
function getRisingSign(timeStr: string, location: string): string {
  // This is a simplified mock function
  // In reality, rising signs change approximately every 2 hours based on location
  const hour = parseInt(timeStr.split(":")[0], 10) || 0;
  const locationHash = location.length;
  
  const signIndex = ((hour * 2 + locationHash) % 12);
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer", 
    "Leo", "Virgo", "Libra", "Scorpio", 
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  return signs[signIndex];
}

// Calculate mock elements and modalities distribution
function calculateElementsAndModalities(
  sunSign: string,
  moonSign: string,
  risingSign: string
): { elements: Record<string, number>, modalities: Record<string, number> } {
  const elementMap: Record<string, string> = {
    "Aries": "fire",
    "Leo": "fire",
    "Sagittarius": "fire",
    "Taurus": "earth",
    "Virgo": "earth",
    "Capricorn": "earth",
    "Gemini": "air",
    "Libra": "air",
    "Aquarius": "air",
    "Cancer": "water",
    "Scorpio": "water",
    "Pisces": "water",
  };
  
  const modalityMap: Record<string, string> = {
    "Aries": "cardinal",
    "Cancer": "cardinal",
    "Libra": "cardinal",
    "Capricorn": "cardinal",
    "Taurus": "fixed",
    "Leo": "fixed",
    "Scorpio": "fixed",
    "Aquarius": "fixed",
    "Gemini": "mutable",
    "Virgo": "mutable",
    "Sagittarius": "mutable",
    "Pisces": "mutable",
  };
  
  // Base distribution
  const elements: Record<string, number> = {
    "fire": 1,
    "earth": 1,
    "air": 1,
    "water": 1
  };
  
  const modalities: Record<string, number> = {
    "cardinal": 1,
    "fixed": 1,
    "mutable": 1
  };
  
  // Add points based on sun, moon and rising
  [sunSign, moonSign, risingSign].forEach((sign) => {
    if (sign !== "Unknown" && elementMap[sign]) {
      elements[elementMap[sign]] += 2;
    }
    
    if (sign !== "Unknown" && modalityMap[sign]) {
      modalities[modalityMap[sign]] += 2;
    }
  });
  
  // Add some random distribution to other elements & modalities
  const randomElement = Math.floor(Math.random() * 4);
  const elementKeys = Object.keys(elements);
  elements[elementKeys[randomElement]] += 1;
  
  const randomModality = Math.floor(Math.random() * 3);
  const modalityKeys = Object.keys(modalities);
  modalities[modalityKeys[randomModality]] += 1;
  
  return { elements, modalities };
}

// Get dominant planets based on signs
function getDominantPlanets(
  sunSign: string,
  moonSign: string,
  risingSign: string
): string[] {
  const rulerMap: Record<string, string[]> = {
    "Aries": ["Mars"],
    "Taurus": ["Venus"],
    "Gemini": ["Mercury"],
    "Cancer": ["Moon"],
    "Leo": ["Sun"],
    "Virgo": ["Mercury"],
    "Libra": ["Venus"],
    "Scorpio": ["Pluto", "Mars"],
    "Sagittarius": ["Jupiter"],
    "Capricorn": ["Saturn"],
    "Aquarius": ["Uranus", "Saturn"],
    "Pisces": ["Neptune", "Jupiter"],
  };
  
  const planets = new Set<string>();
  
  // Add ruling planets for each sign
  [sunSign, moonSign, risingSign].forEach((sign) => {
    if (sign !== "Unknown" && rulerMap[sign]) {
      rulerMap[sign].forEach(planet => planets.add(planet));
    }
  });
  
  // Add Sun and Moon by default as they're always important
  planets.add("Sun");
  planets.add("Moon");
  
  return Array.from(planets).slice(0, 5);
}

// Generate a placeholder SVG chart URL
// In a real implementation, this would create an actual chart
function generateChartUrl(
  sunSign: string,
  moonSign: string,
  risingSign: string
): string {
  // Real implementation would generate a SVG/PNG of the chart
  // For now, we return a placeholder chart image
  return "https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/natal-chart-placeholder.svg";
}

// Calculate natal chart from birth data
function calculateNatalChart(data: BirthData): NatalChartResponse {
  console.log("Calculating natal chart for:", data);
  
  // Get sun, moon and rising signs
  const sunSign = getSunSign(data.birthDate);
  const moonSign = getMoonSign(data.birthDate, data.birthTime);
  const risingSign = getRisingSign(data.birthTime, data.birthLocation);
  
  // Calculate elements and modalities
  const { elements, modalities } = calculateElementsAndModalities(sunSign, moonSign, risingSign);
  
  // Get dominant planets
  const dominantPlanets = getDominantPlanets(sunSign, moonSign, risingSign);
  
  // Generate chart URL
  const chartSvgUrl = generateChartUrl(sunSign, moonSign, risingSign);
  
  return {
    sun_sign: sunSign,
    moon_sign: moonSign,
    rising_sign: risingSign,
    elements,
    modalities,
    dominant_planets: dominantPlanets,
    chart_svg_url: chartSvgUrl
  };
}

// Save natal profile to database
async function saveNatalProfile(
  supabaseClient: any,
  data: BirthData,
  chartData: NatalChartResponse
): Promise<void> {
  if (!data.userId) return;
  
  try {
    const { error } = await supabaseClient
      .from('natal_profiles')
      .upsert({
        user_id: data.userId,
        name: data.name,
        birth_date: data.birthDate,
        birth_time: data.birthTime,
        birth_location: data.birthLocation,
        sun_sign: chartData.sun_sign,
        moon_sign: chartData.moon_sign,
        rising_sign: chartData.rising_sign,
        elements: chartData.elements,
        modalities: chartData.modalities,
        dominant_planets: chartData.dominant_planets,
        chart_svg_url: chartData.chart_svg_url,
      });
      
    if (error) {
      console.error("Error saving natal profile:", error);
    } else {
      console.log("Successfully saved natal profile");
      
      // Also update user_astrology_data table for compatibility
      await supabaseClient
        .from('user_astrology_data')
        .upsert({
          user_id: data.userId,
          birth_date: data.birthDate,
          birth_time: data.birthTime,
          birth_place: data.birthLocation,
          sun_sign: chartData.sun_sign,
          moon_sign: chartData.moon_sign,
          rising_sign: chartData.rising_sign,
          dominant_element: Object.entries(chartData.elements).reduce(
            (max, [element, value]) => value > max.value ? { element, value } : max,
            { element: '', value: 0 }
          ).element
        });
    }
  } catch (error) {
    console.error("Error in saveNatalProfile:", error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const requestData: BirthData = await req.json();
    console.log("Received request data:", requestData);
    
    if (!requestData.birthDate || !requestData.birthTime || !requestData.birthLocation) {
      return new Response(
        JSON.stringify({ error: "Missing required birth data" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Calculate natal chart
    const chartData = calculateNatalChart(requestData);
    console.log("Generated chart data:", chartData);
    
    // Save to database if userId is provided
    if (requestData.userId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://mikltjgbvxrxndtszorb.supabase.co';
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pa2x0amdidnhyeG5kdHN6b3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NDI3MDksImV4cCI6MjA1OTIxODcwOX0.f4QfhZzSZJ92AjCfbkEMrrmzJrWI617H-FyjJKJ8_70';
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      
      await saveNatalProfile(supabase, requestData, chartData);
    }
    
    // Return chart data
    return new Response(
      JSON.stringify(chartData),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to generate natal chart" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
