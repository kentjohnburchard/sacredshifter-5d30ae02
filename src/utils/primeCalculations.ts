
/**
 * Calculate the prime factors of a given number
 * @param num The number to calculate prime factors for
 * @returns Array of prime factors
 */
export const calculatePrimeFactors = (num: number): number[] => {
  if (num <= 1) return [num];
  
  // Check if the number itself is prime
  if (isPrime(num)) return [num];
  
  const factors: number[] = [];
  let tempNum = num;
  
  // Check division by 2
  while (tempNum % 2 === 0) {
    factors.push(2);
    tempNum /= 2;
  }
  
  // Check for odd prime factors
  for (let i = 3; i <= Math.sqrt(tempNum); i += 2) {
    while (tempNum % i === 0) {
      factors.push(i);
      tempNum /= i;
    }
  }
  
  // If tempNum is a prime number greater than 2
  if (tempNum > 2) {
    factors.push(tempNum);
  }
  
  return factors;
};

/**
 * Check if a number is prime
 * @param num The number to check
 * @returns Boolean indicating if the number is prime
 */
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
 * Generate a sequence of prime numbers
 * @param count Number of prime numbers to generate
 * @returns Array of prime numbers
 */
export const generatePrimeSequence = (count: number): number[] => {
  const primes: number[] = [];
  let num = 2;
  
  while (primes.length < count) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  
  return primes;
};

/**
 * Get the first n prime numbers
 * @param n Number of prime numbers to get
 * @returns Array of the first n prime numbers
 */
export const getFirstNPrimes = (n: number): number[] => {
  return generatePrimeSequence(n);
};

/**
 * Generate Fibonacci numbers
 * @param count Number of Fibonacci numbers to generate
 * @returns Array of Fibonacci numbers
 */
export const generateFibonacciSequence = (count: number): number[] => {
  if (count <= 0) return [];
  if (count === 1) return [0];
  
  const sequence = [0, 1];
  
  for (let i = 2; i < count; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  
  return sequence;
};

/**
 * Check if a sequence of numbers contains patterns (like arithmetic or geometric progressions)
 * @param numbers Array of numbers to check for patterns
 * @returns Object with pattern information
 */
export const detectSequencePatterns = (numbers: number[]): {
  hasArithmeticProgression: boolean;
  hasGeometricProgression: boolean;
  commonDifference?: number;
  commonRatio?: number;
} => {
  if (numbers.length < 3) {
    return {
      hasArithmeticProgression: false,
      hasGeometricProgression: false
    };
  }

  // Check for arithmetic progression
  const differences = [];
  for (let i = 1; i < numbers.length; i++) {
    differences.push(numbers[i] - numbers[i - 1]);
  }
  
  const hasArithmeticProgression = differences.every(diff => diff === differences[0]);
  
  // Check for geometric progression
  const ratios = [];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i - 1] !== 0) {
      ratios.push(numbers[i] / numbers[i - 1]);
    }
  }
  
  const hasGeometricProgression = ratios.length > 0 && ratios.every(ratio => Math.abs(ratio - ratios[0]) < 0.0001);
  
  return {
    hasArithmeticProgression,
    hasGeometricProgression,
    commonDifference: hasArithmeticProgression ? differences[0] : undefined,
    commonRatio: hasGeometricProgression ? ratios[0] : undefined
  };
};
