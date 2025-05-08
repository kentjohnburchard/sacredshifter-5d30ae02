
/**
 * Utility functions for prime number calculations
 */

/**
 * Checks if a number is prime
 * @param num The number to check
 * @returns boolean True if the number is prime, false otherwise
 */
export function isPrime(num: number): boolean {
  // Handles special cases
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  // Checks using 6k +/- 1 optimization
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
}

/**
 * Finds the next prime number after a given number
 * @param num The starting number
 * @returns number The next prime number
 */
export function nextPrime(num: number): number {
  // Make sure we start with an integer
  let start = Math.ceil(num);
  
  // If even, start with next odd (except for 2)
  if (start <= 2) return 2;
  if (start % 2 === 0) start++;
  
  // Check odd numbers only
  while (!isPrime(start)) {
    start += 2;
  }
  
  return start;
}

/**
 * Finds the previous prime number before a given number
 * @param num The starting number
 * @returns number The previous prime number or -1 if none
 */
export function prevPrime(num: number): number {
  // No primes less than 2
  if (num <= 2) return -1;
  
  // Make sure we start with an integer
  let start = Math.floor(num) - 1;
  
  // If even, start with previous odd (except for 2)
  if (start === 2) return 2;
  if (start % 2 === 0) start--;
  
  // Check odd numbers only going backward
  while (start >= 2 && !isPrime(start)) {
    start -= 2;
    if (start === 1) return 2; // Special case for 2
  }
  
  return start >= 2 ? start : -1;
}

/**
 * Gets the nth prime number
 * @param n The position (1-indexed)
 * @returns number The prime number at position n
 */
export function nthPrime(n: number): number {
  if (n <= 0) return -1;
  if (n === 1) return 2;
  
  let count = 1; // 2 is already counted
  let num = 1;
  
  while (count < n) {
    num += 2; // Check odd numbers only
    if (isPrime(num)) {
      count++;
    }
  }
  
  return num;
}

/**
 * Checks if a number is a twin prime (p and p+2 are both prime)
 * @param num The number to check
 * @returns boolean True if number is part of twin prime pair
 */
export function isTwinPrime(num: number): boolean {
  return (isPrime(num) && (isPrime(num - 2) || isPrime(num + 2)));
}

/**
 * Gets the prime factors of a number
 * @param num The number to factorize
 * @returns number[] Array of prime factors
 */
export function primeFactors(num: number): number[] {
  const factors: number[] = [];
  
  // Handle special cases
  if (num <= 1) return factors;
  
  // Check divisibility by 2
  while (num % 2 === 0) {
    factors.push(2);
    num /= 2;
  }
  
  // Check odd divisors
  let divisor = 3;
  while (divisor * divisor <= num) {
    while (num % divisor === 0) {
      factors.push(divisor);
      num /= divisor;
    }
    divisor += 2;
  }
  
  // If num is a prime greater than 2
  if (num > 2) {
    factors.push(num);
  }
  
  return factors;
}

/**
 * Checks if a number is a fibonacci prime (both fibonacci and prime)
 * @param num The number to check
 * @returns boolean True if the number is a fibonacci prime
 */
export function isFibonacciPrime(num: number): boolean {
  // First check if prime
  if (!isPrime(num)) return false;
  
  // Check if fibonacci using formula
  // A number is fibonacci if 5n² + 4 or 5n² - 4 is a perfect square
  const test1 = 5 * num * num + 4;
  const test2 = 5 * num * num - 4;
  
  const sqrt1 = Math.sqrt(test1);
  const sqrt2 = Math.sqrt(test2);
  
  return (Math.floor(sqrt1) === sqrt1) || (Math.floor(sqrt2) === sqrt2);
}

/**
 * The prime numbers have significance in Sacred Geometry and frequency harmonics.
 * They represent indivisible units of creation energy and are the building blocks
 * of sacred ratios found throughout nature and cosmic design.
 */
