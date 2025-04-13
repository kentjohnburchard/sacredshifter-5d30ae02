
export interface PrimeHistoryEntry {
  number: number;
  isPrime: boolean;
  factors: number[];
  timestamp: string;
}

export interface PrimeNumberDisplayProps {
  primes: number[];
  sessionId?: string;
  journeyTitle?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}
