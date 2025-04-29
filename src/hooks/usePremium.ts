
import { usePremium as useContextPremium } from '@/contexts/PremiumContext';

// Re-export the context hook
export const usePremium = useContextPremium;

// This file exists to add additional premium-related hooks in the future,
// such as API calls, additional state management, or custom logic.

/**
 * Future expansion:
 * - Add hooks for API integration with premium content endpoints
 * - Add subscription validation logic
 * - Add progress tracking and synchronization
 * - Add offline access capabilities for premium content
 */
