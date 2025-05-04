
import { useCommunity as useContextCommunity } from '@/contexts/CommunityContext';

// Re-export the context hook
export const useCommunity = useContextCommunity;

// This file exists to add additional community-related hooks in the future,
// such as API calls, additional state management, or custom logic.

/**
 * Future expansion:
 * - Add hooks for API integration with community endpoints
 * - Add local storage interactions for community preferences
 * - Add analytics for community engagement
 */
