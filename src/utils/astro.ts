
import { AztroResponse } from "./astro.types";

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
