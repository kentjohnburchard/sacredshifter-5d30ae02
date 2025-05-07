
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
    qaStatus: 'pending',
    notes: 'Initial placeholder route'
  },
  
  ABOUT: {
    path: '/about',
    name: 'About the Founder',
    qaStatus: 'pending',
    notes: 'Information about Sacred Shifter founder'
  },
  
  JOURNEY: {
    path: '/journey/:slug',
    name: 'Journey',
    qaStatus: 'pending',
    notes: 'Individual journey experience page'
  },
  
  // Future routes will be added here after QA
};

export default APP_ROUTES;
