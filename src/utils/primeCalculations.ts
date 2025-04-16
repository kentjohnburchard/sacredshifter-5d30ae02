
// Prime number calculation utilities
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

export const calculatePrimeFactors = (num: number): number[] => {
  const factors: number[] = [];
  let n = Math.floor(num);
  
  // Handle edge cases
  if (n <= 1) return factors;
  
  // Extract all 2s
  while (n % 2 === 0) {
    factors.push(2);
    n /= 2;
  }
  
  // Extract other prime factors
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  
  // If n is a prime number greater than 2
  if (n > 2) {
    factors.push(n);
  }
  
  return factors;
};

export const generatePrimeSequence = (count: number, start: number = 2): number[] => {
  const primes: number[] = [];
  let num = start;
  
  while (primes.length < count) {
    if (isPrime(num)) {
      primes.push(num);
    }
    num++;
  }
  
  return primes;
};

export const findNearestPrime = (num: number): number => {
  if (isPrime(num)) return num;
  
  let lowerNum = num - 1;
  let higherNum = num + 1;
  
  while (true) {
    if (isPrime(lowerNum)) return lowerNum;
    if (isPrime(higherNum)) return higherNum;
    
    lowerNum--;
    higherNum++;
  }
};

export const resonantPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
