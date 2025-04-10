
/**
 * A safer fetch implementation with timeouts and error handling
 */
export async function safeFetch<T = any>(
  resource: RequestInfo | URL,
  options: RequestInit = {}
): Promise<{ data: T | null; error: Error | null; response: Response | null }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return { data, error: null, response };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`safeFetch failed for ${resource}:`, error);
    
    // Return a formatted error but don't throw
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)),
      response: null
    };
  }
}

/**
 * A version of safeFetch that returns a Response object directly
 * for compatibility with code expecting the original fetch API
 */
export async function safeFetchLegacy(
  resource: RequestInfo | URL,
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`safeFetchLegacy failed for ${resource}:`, error);
    
    // Return a valid but empty response to prevent UI freezes
    return new Response(JSON.stringify({ 
      error: 'Request failed or timed out',
      errorDetails: String(error)
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
