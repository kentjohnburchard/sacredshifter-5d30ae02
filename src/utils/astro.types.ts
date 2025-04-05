
export interface AztroResponse {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

// Adding new interfaces for our natal chart functionality
export interface NatalChartResponse {
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  elements: {
    water: number;
    fire: number;
    earth: number;
    air: number;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  dominant_planets: string[];
  chart_svg_url?: string;
}

export interface BirthData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  userId?: string;
}
