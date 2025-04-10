
import React, { useState, useEffect } from "react";
import LandingPrompt from "@/components/LandingPrompt";

const Welcome: React.FC = () => {
  // This will allow us to debug welcome page functionality
  useEffect(() => {
    console.log('Welcome page loaded');
    
    // Add global timeout handler to prevent freezes from resource failures
    const originalFetch = window.fetch;
    window.fetch = function(resource, options) {
      // Create a timeout promise that will reject after 5 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 5000);
      });
      
      // Race between the original fetch and the timeout
      return Promise.race([
        originalFetch.apply(this, [resource, options]),
        timeoutPromise
      ]).catch(error => {
        console.error(`Fetch error for ${resource}:`, error);
        // Return a valid but empty response to prevent UI freezes
        return new Response(JSON.stringify({ error: 'Failed to load resource' }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' } 
        });
      });
    };
    
    // Clean up the fetch override when component unmounts
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  return <LandingPrompt />;
};

export default Welcome;
