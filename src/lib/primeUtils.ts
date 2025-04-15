
export const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
};

/**
 * Analyzes a frequency to determine if it's prime and other properties
 * @param frequency The frequency to analyze
 * @param tolerance The margin of error for rounding
 * @returns Object with analysis results
 */
export const analyzeFrequency = (frequency: number, tolerance: number = 0): {
  isPrime: boolean;
  closestPrime?: number;
  distance?: number;
} => {
  // Round the frequency based on tolerance
  const roundedFreq = tolerance > 0
    ? Math.round(frequency / tolerance) * tolerance
    : frequency;
  
  // Check if the rounded frequency is prime
  const isExactPrime = isPrime(roundedFreq);
  
  if (isExactPrime) {
    return { isPrime: true, closestPrime: roundedFreq, distance: 0 };
  }
  
  // If not prime, find the closest prime within a reasonable range
  const range = Math.max(20, Math.floor(frequency * 0.1)); // 10% of frequency or at least 20Hz
  let closestPrime = null;
  let minDistance = Infinity;
  
  for (let i = Math.max(2, roundedFreq - range); i <= roundedFreq + range; i++) {
    if (isPrime(i)) {
      const distance = Math.abs(i - roundedFreq);
      if (distance < minDistance) {
        minDistance = distance;
        closestPrime = i;
      }
    }
  }
  
  return {
    isPrime: false,
    closestPrime: closestPrime || null,
    distance: closestPrime ? Math.abs(closestPrime - roundedFreq) : null
  };
};
