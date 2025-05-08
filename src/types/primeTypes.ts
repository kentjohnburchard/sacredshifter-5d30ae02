
export interface PrimeNumberDisplayProps {
  primes: number[];
  sessionId?: string;
  journeyTitle?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}
