
import React, { useEffect } from 'react';
import { useGuidance } from '@/context/GuidanceContext';

interface GuidanceEngineProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

/**
 * Core analysis engine for the Adaptive Guidance system.
 * This component handles data processing and recommendations generation.
 */
const GuidanceEngine: React.FC<GuidanceEngineProps> = ({
  autoRefresh = true,
  refreshInterval = 300000 // 5 minutes default
}) => {
  const { refreshRecommendations, userState } = useGuidance();

  // Initial load of recommendations
  useEffect(() => {
    refreshRecommendations();
  }, []);

  // Set up auto-refresh if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      refreshRecommendations();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval]);

  // This component doesn't render anything visible
  return null;
};

export default GuidanceEngine;
