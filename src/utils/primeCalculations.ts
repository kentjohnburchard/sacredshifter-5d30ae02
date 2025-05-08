
/**
 * Check if a number is prime
 * @param num Number to check
 * @returns boolean indicating if the number is prime
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
 * Find the nearest prime number to a given number
 * @param num Number to find nearest prime to
 * @param direction 'up' to find next prime, 'down' to find previous prime, 'nearest' for closest
 * @returns The nearest prime number
 */
export const findNearestPrime = (
  num: number, 
  direction: 'up' | 'down' | 'nearest' = 'nearest'
): number => {
  if (isPrime(num)) return num;
  
  let upPrime = num;
  let downPrime = num;
  
  // Find next prime up
  if (direction === 'up' || direction === 'nearest') {
    upPrime = num + 1;
    while (!isPrime(upPrime)) {
      upPrime++;
    }
  }
  
  // Find next prime down
  if (direction === 'down' || direction === 'nearest') {
    downPrime = num - 1;
    while (downPrime > 1 && !isPrime(downPrime)) {
      downPrime--;
    }
    if (downPrime < 2) downPrime = 2; // Smallest prime is 2
  }
  
  // Return based on direction
  if (direction === 'up') return upPrime;
  if (direction === 'down') return downPrime;
  
  // For 'nearest', return the closest prime
  return (num - downPrime < upPrime - num) ? downPrime : upPrime;
};

/**
 * Get a list of prime numbers within a range
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of prime numbers in the range
 */
export const getPrimesInRange = (min: number, max: number): number[] => {
  const primes: number[] = [];
  for (let i = Math.max(2, min); i <= max; i++) {
    if (isPrime(i)) {
      primes.push(i);
    }
  }
  return primes;
};

/**
 * Get the nth prime number
 * @param n Position in prime sequence (1-based)
 * @returns The nth prime number
 */
export const getNthPrime = (n: number): number => {
  if (n <= 0) return 0;
  if (n === 1) return 2;
  
  let count = 1;
  let num = 1;
  
  while (count < n) {
    num += 2; // Check only odd numbers after 2
    if (isPrime(num)) {
      count++;
    }
  }
  
  return num;
};
