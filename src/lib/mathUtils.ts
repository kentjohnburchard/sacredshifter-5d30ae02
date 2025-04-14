
/**
 * Check if a number is a prime number
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  
  // Quick check for even numbers
  if (num % 2 === 0) return false;
  
  // Check for divisibility up to the square root of the number
  const sqrtNum = Math.sqrt(num);
  for (let i = 3; i <= sqrtNum; i += 2) {
    if (num % i === 0) return false;
  }
  
  return true;
}

/**
 * Get the first n prime numbers
 */
export function getNPrimes(n: number): number[] {
  const primes: number[] = [];
  let num = 2;
  
  while (primes.length < n) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  
  return primes;
}

/**
 * Find prime numbers in a specific frequency range
 */
export function getPrimesInRange(min: number, max: number): number[] {
  const primes: number[] = [];
  
  for (let i = Math.max(2, min); i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  
  return primes;
}

/**
 * Find sacred frequencies based on prime number patterns
 * Returns an array of frequency values that correspond to prime numbers
 * within the human hearing range
 */
export function getSacredFrequencies(count: number = 10): number[] {
  // Start with common sacred frequencies
  const knownSacred = [432, 528, 639, 741, 852, 963];
  
  // Add prime frequencies
  const primeFrequencies = getPrimesInRange(400, 1000);
  
  // Combine and take requested count 
  return [...new Set([...knownSacred, ...primeFrequencies])].slice(0, count);
}

/**
 * Map a frequency to a chakra
 */
export function frequencyToChakra(frequency: number): string | null {
  if (frequency < 200) return 'Root';
  if (frequency < 350) return 'Sacral';
  if (frequency < 450) return 'Solar Plexus';
  if (frequency < 550) return 'Heart';
  if (frequency < 650) return 'Throat';
  if (frequency < 750) return 'Third Eye';
  return 'Crown';
}

/**
 * Convert frequency to a color on the visible spectrum
 * Returns a CSS color string
 */
export function frequencyToColor(frequency: number): string {
  // Map audio frequency to visible light spectrum (roughly)
  // This is an approximate mapping, not scientifically accurate
  const normalizedFrequency = Math.min(Math.max(frequency, 20), 20000);
  const hue = Math.floor((normalizedFrequency - 20) / (20000 - 20) * 270);
  return `hsl(${hue}, 80%, 60%)`;
}

/**
 * Generate harmonics of a base frequency
 * Returns an array of harmonic frequencies
 */
export function generateHarmonics(baseFrequency: number, count: number = 5): number[] {
  const harmonics: number[] = [];
  
  for (let i = 1; i <= count; i++) {
    harmonics.push(baseFrequency * i);
  }
  
  return harmonics;
}
