
/**
 * Checks if a number is prime
 */
export function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  
  return true;
}

/**
 * Calculate prime factors of a number
 */
export function calculatePrimeFactors(num: number): number[] {
  const factors: number[] = [];
  
  // Handle 2 separately
  while (num % 2 === 0) {
    factors.push(2);
    num /= 2;
  }
  
  // Check odd numbers starting from 3
  for (let i = 3; i * i <= num; i += 2) {
    while (num % i === 0) {
      factors.push(i);
      num /= i;
    }
  }
  
  // If num is a prime number greater than 2
  if (num > 2) {
    factors.push(num);
  }
  
  return factors;
}
