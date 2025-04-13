
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
