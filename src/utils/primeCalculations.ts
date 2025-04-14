
/**
 * Checks if a number is a prime number
 * @param num The number to check
 * @returns True if the number is prime, false otherwise
 */
export const isPrime = (num: number): boolean => {
  // Check edge cases
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  // Check using 6k +/- 1 optimization
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

/**
 * Calculates all prime factors of a number
 * @param num The number to factorize
 * @returns Array of prime factors
 */
export const calculatePrimeFactors = (num: number): number[] => {
  const factors: number[] = [];
  
  // Handle edge cases
  if (num <= 1) return factors;
  
  // Extract all factors of 2
  while (num % 2 === 0) {
    factors.push(2);
    num /= 2;
  }
  
  // Extract all odd factors
  for (let i = 3; i * i <= num; i += 2) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  
  // If num is a prime number > 2
  if (num > 2) {
    factors.push(num);
  }
  
  return factors;
};

/**
 * Gets the first N prime numbers
 * @param count Number of primes to get
 * @returns Array containing the first N prime numbers
 */
export const getFirstNPrimes = (count: number): number[] => {
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
 * Gets all prime numbers up to a maximum value
 * @param max The maximum number to check
 * @returns Array of prime numbers up to max
 */
export const getPrimesUpTo = (max: number): number[] => {
  const primes: number[] = [];
  
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  
  return primes;
};

/**
 * Checks if a number is a perfect number (sum of its proper divisors equals the number)
 * @param num Number to check
 * @returns True if perfect, false otherwise
 */
export const isPerfectNumber = (num: number): boolean => {
  if (num <= 1) return false;
  
  let sum = 1; // 1 is always a proper divisor
  
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) {
        sum += num / i;
      }
    }
  }
  
  return sum === num;
};

/**
 * Generates a sequence of prime numbers for visualization or other uses
 * @param length The length of the sequence to generate
 * @returns Array of prime numbers
 */
export const generatePrimeSequence = (length: number): number[] => {
  return getFirstNPrimes(length);
};
