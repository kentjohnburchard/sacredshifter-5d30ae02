
import { FractalVisual } from "@/types/frequencies";

/**
 * Safely cast a database fractal record to our FractalVisual type
 */
export const castToFractalVisual = (data: any): FractalVisual => {
  return {
    ...data,
    // Ensure required properties are set
    id: data.id || "",
    visual_url: data.visual_url || "",
    frequency: Number(data.frequency) || 0
  };
};

/**
 * Cast an array of database fractal records to FractalVisual[] type
 */
export const castToFractalVisuals = (data: any[]): FractalVisual[] => {
  return data.map(item => castToFractalVisual(item));
};
