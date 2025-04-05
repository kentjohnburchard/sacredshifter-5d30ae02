
import { AztroResponse } from "./astro.types";

export async function fetchDailyHoroscope(sign: string): Promise<AztroResponse> {
  try {
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily horoscope:", error);
    throw error;
  }
}
