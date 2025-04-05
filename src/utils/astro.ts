
import { AztroResponse, NatalChartResponse, BirthData } from "./astro.types";
import { supabase } from "@/integrations/supabase/client";

export async function fetchDailyHoroscope(sign: string): Promise<AztroResponse> {
  try {
    console.log(`Fetching horoscope for sign: ${sign}`);
    
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add CORS headers if needed
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      console.error(`Response: ${await response.text()}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Horoscope data received:', data);
    return data;
  } catch (error) {
    console.error("Detailed error fetching daily horoscope:", error);
    // Provide a fallback response to prevent UI breaking
    return {
      date_range: 'Unknown',
      current_date: new Date().toLocaleDateString(),
      description: 'Cosmic insights are temporarily unavailable. Check back later.',
      compatibility: 'N/A',
      mood: 'Mysterious',
      color: 'Indigo',
      lucky_number: '7',
      lucky_time: 'Anytime'
    };
  }
}

export async function getNatalChart(data: BirthData): Promise<NatalChartResponse> {
  try {
    console.log("Requesting natal chart with data:", data);
    
    const { data: natalChartData, error } = await supabase.functions.invoke('astro-chart', {
      body: JSON.stringify(data)
    });
    
    if (error) {
      console.error("Error fetching natal chart:", error);
      throw error;
    }
    
    console.log("Received natal chart data:", natalChartData);
    return natalChartData as NatalChartResponse;
  } catch (error) {
    console.error("Error getting natal chart:", error);
    
    // Return fallback data in case of error
    return {
      sun_sign: "Unknown",
      moon_sign: "Unknown",
      rising_sign: "Unknown",
      elements: { water: 0, fire: 0, earth: 0, air: 0 },
      modalities: { cardinal: 0, fixed: 0, mutable: 0 },
      dominant_planets: []
    };
  }
}

export async function saveNatalProfile(data: BirthData & NatalChartResponse): Promise<void> {
  if (!data.userId) {
    console.error("Cannot save natal profile: No user ID provided");
    return;
  }
  
  try {
    // Instead of trying to write to the natal_profiles table that doesn't exist,
    // we'll store the data in the user's astrology data table which does exist
    const { error } = await supabase
      .from('user_astrology_data')
      .upsert({
        user_id: data.userId,
        birth_date: data.birthDate,
        birth_time: data.birthTime,
        birth_place: data.birthLocation,
        sun_sign: data.sun_sign,
        moon_sign: data.moon_sign,
        rising_sign: data.rising_sign,
        dominant_element: Object.entries(data.elements).reduce(
          (max, [element, value]) => (value > max.value ? { element, value } : max),
          { element: '', value: 0 }
        ).element,
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      throw error;
    }
    
    console.log("Natal profile saved successfully");
  } catch (error) {
    console.error("Error saving natal profile:", error);
  }
}
