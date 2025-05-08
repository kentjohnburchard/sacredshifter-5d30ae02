import { isPrime } from './primeCalculations';

/**
 * Convert a frequency to a color on the spectrum
 * @param frequency - Audio frequency in Hz
 * @returns CSS color string (hex, rgb, or hsl)
 */
export function frequencyToColor(frequency: number): string {
  // Map frequency ranges to color hues
  // Lower frequencies: reds/oranges (0-60°)
  // Mid frequencies: yellows/greens (60-180°)
  // Higher frequencies: blues/purples (180-300°)
  
  let hue = 0;
  let saturation = 80;
  let lightness = 50;
  
  if (frequency < 60) { // Very low bass
    hue = 0; // Red
    lightness = 40;
  } else if (frequency < 250) { // Bass
    hue = 30; // Orange
    lightness = 45;
  } else if (frequency < 500) { // Low mid
    hue = 60; // Yellow
    lightness = 50;
  } else if (frequency < 2000) { // Mid
    hue = 120; // Green
    lightness = 45;
  } else if (frequency < 6000) { // High mid
    hue = 200; // Cyan/Blue
    lightness = 50;
  } else { // High/treble
    hue = 270; // Purple
    lightness = 55;
  }
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Map chakra frequency to color
 * @param frequency - Audio frequency in Hz
 * @returns CSS color string for the corresponding chakra
 */
export function chakraFrequencyToColor(frequency: number): string {
  if (frequency < 256) return '#FF0000'; // Root - Red (256 Hz)
  if (frequency < 288) return '#FF8000'; // Sacral - Orange (288 Hz)
  if (frequency < 320) return '#FFFF00'; // Solar Plexus - Yellow (320 Hz)
  if (frequency < 341) return '#00FF00'; // Heart - Green (341 Hz)
  if (frequency < 384) return '#00FFFF'; // Throat - Blue (384 Hz)
  if (frequency < 426) return '#0000FF'; // Third Eye - Indigo (426 Hz)
  return '#A020F0'; // Crown - Purple (480 Hz)
}

/**
 * Get points for a Flower of Life pattern
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param radius - Circle radius
 * @param iterations - Number of iterations/rings
 * @returns Array of circle positions {x, y, r}
 */
export function getFlowerOfLifePoints(
  centerX: number, 
  centerY: number, 
  radius: number, 
  iterations: number = 6
): Array<{x: number, y: number, r: number}> {
  const circles = [{x: centerX, y: centerY, r: radius}];
  const hexCorners = [];
  
  // Create first ring of 6 circles
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    circles.push({x, y, r: radius});
    hexCorners.push({x, y});
  }
  
  // Create additional iterations if requested
  if (iterations > 1) {
    for (let ring = 1; ring < iterations; ring++) {
      const currentCircles = [...circles];
      
      for (let i = 0; i < currentCircles.length; i++) {
        const circle = currentCircles[i];
        
        // For each existing circle, create 6 new circles around it
        for (let j = 0; j < 6; j++) {
          const angle = Math.PI / 3 * j;
          const x = circle.x + radius * Math.cos(angle);
          const y = circle.y + radius * Math.sin(angle);
          
          // Check if circle already exists
          const exists = circles.some(c => 
            Math.abs(c.x - x) < 0.001 && Math.abs(c.y - y) < 0.001
          );
          
          if (!exists) {
            circles.push({x, y, r: radius});
          }
        }
      }
    }
  }
  
  return circles;
}

/**
 * Get points for a Fibonacci spiral
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param scale - Scale factor
 * @param points - Number of points to generate
 * @returns Array of points {x: number, y: number}
 */
export function getFibonacciSpiralPoints(
  centerX: number, 
  centerY: number, 
  scale: number = 1, 
  points: number = 100
): Array<{x: number, y: number}> {
  const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const spiral = [];
  
  for (let i = 0; i < points; i++) {
    // Calculate polar coordinates
    const theta = i * 2 * Math.PI / PHI;
    const r = scale * Math.pow(PHI, 2 * i / points);
    
    // Convert to Cartesian coordinates
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);
    
    spiral.push({x, y});
  }
  
  return spiral;
}

/**
 * Get points for a prime number spiral
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param scale - Scale factor
 * @param points - Number of points to generate
 * @returns Array of points {x: number, y: number, isPrime: boolean}
 */
export function getPrimeSpiralPoints(
  centerX: number, 
  centerY: number, 
  scale: number = 1, 
  points: number = 200
): Array<{x: number, y: number, isPrime: boolean}> {
  const spiral = [];
  
  for (let i = 1; i <= points; i++) {
    const isPrimeNumber = isPrime(i);
    
    // Calculate polar coordinates for Ulam spiral
    const theta = Math.sqrt(i) * 2 * Math.PI;
    const r = scale * Math.sqrt(i);
    
    // Convert to Cartesian coordinates
    const x = centerX + r * Math.cos(theta);
    const y = centerY + r * Math.sin(theta);
    
    spiral.push({x, y, isPrime: isPrimeNumber});
  }
  
  return spiral;
}

/**
 * Get points for a Metatron's Cube
 * @param centerX - Center X coordinate
 * @param centerY - Center Y coordinate
 * @param radius - Outer radius
 * @returns Array of vertices and lines
 */
export function getMetatronsCubePoints(
  centerX: number, 
  centerY: number, 
  radius: number
): {vertices: Array<{x: number, y: number}>, lines: Array<[number, number]>} {
  const vertices = [];
  const lines = [];
  
  // Create center point
  vertices.push({x: centerX, y: centerY});
  
  // Create outer 12 vertices
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    vertices.push({x, y});
  }
  
  // Connect center to all vertices
  for (let i = 1; i <= 12; i++) {
    lines.push([0, i]);
  }
  
  // Connect outer vertices
  for (let i = 1; i <= 12; i++) {
    for (let j = i + 1; j <= 12; j++) {
      // Don't connect all points to keep the authentic pattern
      // This is a simplified connection pattern
      if ((j - i) <= 6) {
        lines.push([i, j]);
      }
    }
  }
  
  return { vertices, lines };
}

/**
 * Extract BPM (beats per minute) from audio data
 * @param audioData - Array of audio samples
 * @param sampleRate - Audio sample rate
 * @returns Estimated BPM or null if can't determine
 */
export function extractBPM(audioData: Float32Array, sampleRate: number): number | null {
  // This is a very simplified BPM detection
  // Real BPM detection would use more sophisticated algorithms
  
  const threshold = 0.2;
  const peaks = [];
  
  // Find peaks in the audio data
  for (let i = 1; i < audioData.length - 1; i++) {
    if (audioData[i] > threshold && 
        audioData[i] > audioData[i-1] && 
        audioData[i] > audioData[i+1]) {
      peaks.push(i);
    }
  }
  
  // Calculate average distance between peaks
  if (peaks.length <= 1) return null;
  
  let totalDistance = 0;
  for (let i = 1; i < peaks.length; i++) {
    totalDistance += peaks[i] - peaks[i-1];
  }
  
  const averageDistance = totalDistance / (peaks.length - 1);
  const beatsPerSecond = sampleRate / averageDistance;
  
  // Convert to BPM
  const bpm = beatsPerSecond * 60;
  
  // Most music is between 60-180 BPM
  if (bpm < 60 || bpm > 180) return null;
  
  return Math.round(bpm);
}

/**
 * Get colorful cosmic-themed gradient
 * @param ctx - Canvas rendering context
 * @param width - Canvas width
 * @param height - Canvas height
 * @param theme - Color theme
 * @returns CanvasGradient object
 */
export function getCosmicGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: string = 'cosmic-violet'
): CanvasGradient {
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.max(width, height) / 1.5
  );
  
  switch (theme) {
    case 'cosmic-violet':
      gradient.addColorStop(0, 'rgba(103, 58, 183, 0.8)'); // Core purple
      gradient.addColorStop(0.3, 'rgba(63, 81, 181, 0.6)'); // Mid blue
      gradient.addColorStop(0.7, 'rgba(76, 39, 139, 0.4)'); // Outer indigo
      gradient.addColorStop(1, 'rgba(33, 33, 33, 0.1)'); // Fade to dark
      break;
      
    case 'chakra-rainbow':
      gradient.addColorStop(0, 'rgba(148, 0, 211, 0.8)'); // Crown - violet
      gradient.addColorStop(0.14, 'rgba(75, 0, 130, 0.7)'); // Third eye - indigo
      gradient.addColorStop(0.28, 'rgba(0, 0, 255, 0.6)'); // Throat - blue
      gradient.addColorStop(0.42, 'rgba(0, 255, 0, 0.6)'); // Heart - green
      gradient.addColorStop(0.56, 'rgba(255, 255, 0, 0.6)'); // Solar plexus - yellow
      gradient.addColorStop(0.7, 'rgba(255, 127, 0, 0.6)'); // Sacral - orange
      gradient.addColorStop(0.84, 'rgba(255, 0, 0, 0.7)'); // Root - red
      gradient.addColorStop(1, 'rgba(33, 33, 33, 0.1)'); // Fade to dark
      break;
      
    case 'earth-tones':
      gradient.addColorStop(0, 'rgba(139, 69, 19, 0.7)'); // Brown
      gradient.addColorStop(0.3, 'rgba(76, 175, 80, 0.6)'); // Green
      gradient.addColorStop(0.6, 'rgba(205, 133, 63, 0.5)'); // Peru
      gradient.addColorStop(1, 'rgba(33, 33, 33, 0.1)'); // Fade to dark
      break;
      
    case 'ocean-depths':
      gradient.addColorStop(0, 'rgba(0, 188, 212, 0.8)'); // Teal
      gradient.addColorStop(0.3, 'rgba(0, 150, 136, 0.6)'); // Green-blue
      gradient.addColorStop(0.6, 'rgba(33, 150, 243, 0.5)'); // Blue
      gradient.addColorStop(1, 'rgba(1, 87, 155, 0.3)'); // Deep blue
      break;
      
    case 'fire-essence':
      gradient.addColorStop(0, 'rgba(255, 235, 59, 0.8)'); // Yellow
      gradient.addColorStop(0.3, 'rgba(255, 152, 0, 0.7)'); // Orange
      gradient.addColorStop(0.6, 'rgba(244, 67, 54, 0.6)'); // Red
      gradient.addColorStop(1, 'rgba(121, 85, 72, 0.3)'); // Brown
      break;
      
    case 'ethereal-mist':
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); // White
      gradient.addColorStop(0.3, 'rgba(200, 223, 255, 0.6)'); // Pale blue
      gradient.addColorStop(0.6, 'rgba(224, 224, 224, 0.4)'); // Light gray
      gradient.addColorStop(1, 'rgba(158, 158, 158, 0.1)'); // Silver
      break;
      
    default:
      gradient.addColorStop(0, 'rgba(103, 58, 183, 0.8)');
      gradient.addColorStop(0.5, 'rgba(63, 81, 181, 0.6)');
      gradient.addColorStop(1, 'rgba(33, 33, 33, 0.1)');
  }
  
  return gradient;
}
