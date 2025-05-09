
/**
 * @fileoverview Central route definitions with QA status tracking
 * 
 * QA Status Values:
 * - 'pending': Route defined but not yet QA'd
 * - 'testing': Route is currently under QA
 * - 'verified': Route has passed QA
 * - 'issues': Route has known issues to resolve
 * - 'deprecated': Route should be removed in future
 */

export type RouteQAStatus = 'pending' | 'testing' | 'verified' | 'issues' | 'deprecated';

export interface RouteDefinition {
  path: string;
  name: string;
  qaStatus: RouteQAStatus;
  notes?: string;
}

/**
 * Central registry of all application routes
 * DO NOT MODIFY without following the QA process
 */
export const APP_ROUTES: Record<string, RouteDefinition> = {
  // Core routes
  HOME: {
    path: '/',
    name: 'Home',
    qaStatus: 'verified',
    notes: 'Main landing page'
  },
  
  ABOUT: {
    path: '/about',
    name: 'About the Founder',
    qaStatus: 'verified',
    notes: 'Information about Sacred Shifter founder'
  },
  
  // Journey routes
  JOURNEY_INDEX: {
    path: '/journey-index',
    name: 'Journey Index',
    qaStatus: 'verified',
    notes: 'Main portal for accessing all sacred journeys'
  },
  
  JOURNEYS: {
    path: '/journeys',
    name: 'Sacred Journeys',
    qaStatus: 'verified',
    notes: 'Alternative journey listing page'
  },
  
  JOURNEY_DETAIL: {
    path: '/journey/:slug',
    name: 'Journey Detail',
    qaStatus: 'verified',
    notes: 'Individual journey detail page'
  },
  
  JOURNEY_EXPERIENCE: {
    path: '/journey/:slug/experience',
    name: 'Journey Experience',
    qaStatus: 'verified', 
    notes: 'Interactive journey experience page'
  },
  
  // Trinity Gateway routes
  TRINITY_GATEWAY: {
    path: '/trinity-gateway',
    name: 'Trinity Gateway',
    qaStatus: 'verified',
    notes: '3-6-9 sacred frequency experience'
  },
  
  // Future routes will be added here after QA
};

export default APP_ROUTES;
