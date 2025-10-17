/**
 * Cache Utilities
 * 
 * Provides caching strategies and utilities for API responses,
 * database queries, and static content.
 */

/**
 * Cache duration constants (in seconds)
 */
export const CACHE_DURATION = {
  // Static content that rarely changes
  STATIC_LONG: 31536000, // 1 year
  STATIC_MEDIUM: 604800,  // 1 week
  STATIC_SHORT: 86400,    // 1 day
  
  // Dynamic content
  DYNAMIC_LONG: 3600,     // 1 hour
  DYNAMIC_MEDIUM: 900,    // 15 minutes
  DYNAMIC_SHORT: 300,     // 5 minutes
  DYNAMIC_INSTANT: 60,    // 1 minute
  
  // User-specific content
  USER_DATA: 300,         // 5 minutes
  USER_PROFILE: 900,      // 15 minutes
  
  // Subscription data
  SUBSCRIPTION_STATUS: 300,  // 5 minutes
  SUBSCRIPTION_TIERS: 3600,  // 1 hour (rarely changes)
  
  // No cache
  NO_CACHE: 0,
} as const;

/**
 * Cache control directives
 */
export const CACHE_CONTROL = {
  // Public cacheable (CDN + browser)
  PUBLIC_LONG: `public, max-age=${CACHE_DURATION.STATIC_LONG}, immutable`,
  PUBLIC_MEDIUM: `public, max-age=${CACHE_DURATION.STATIC_MEDIUM}, must-revalidate`,
  PUBLIC_SHORT: `public, max-age=${CACHE_DURATION.STATIC_SHORT}, must-revalidate`,
  
  // Private cacheable (browser only, not CDN)
  PRIVATE_LONG: `private, max-age=${CACHE_DURATION.DYNAMIC_LONG}, must-revalidate`,
  PRIVATE_MEDIUM: `private, max-age=${CACHE_DURATION.DYNAMIC_MEDIUM}, must-revalidate`,
  PRIVATE_SHORT: `private, max-age=${CACHE_DURATION.DYNAMIC_SHORT}, must-revalidate`,
  
  // User-specific (never cache in CDN, short browser cache)
  USER: `private, max-age=${CACHE_DURATION.USER_DATA}, must-revalidate`,
  
  // Sensitive data (no cache at all)
  NO_CACHE: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  
  // Stale-while-revalidate patterns
  SWR_SHORT: `public, max-age=${CACHE_DURATION.DYNAMIC_SHORT}, stale-while-revalidate=${CACHE_DURATION.DYNAMIC_MEDIUM}`,
  SWR_MEDIUM: `public, max-age=${CACHE_DURATION.DYNAMIC_MEDIUM}, stale-while-revalidate=${CACHE_DURATION.DYNAMIC_LONG}`,
} as const;

/**
 * Generate Cache-Control header for a given strategy
 */
export function getCacheControl(strategy: keyof typeof CACHE_CONTROL): string {
  return CACHE_CONTROL[strategy];
}

/**
 * Generate custom Cache-Control header
 */
export function customCacheControl(options: {
  visibility: 'public' | 'private';
  maxAge: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
  immutable?: boolean;
  mustRevalidate?: boolean;
}): string {
  const parts: string[] = [options.visibility];
  
  parts.push(`max-age=${options.maxAge}`);
  
  if (options.sMaxAge !== undefined) {
    parts.push(`s-maxage=${options.sMaxAge}`);
  }
  
  if (options.staleWhileRevalidate !== undefined) {
    parts.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }
  
  if (options.staleIfError !== undefined) {
    parts.push(`stale-if-error=${options.staleIfError}`);
  }
  
  if (options.immutable) {
    parts.push('immutable');
  }
  
  if (options.mustRevalidate) {
    parts.push('must-revalidate');
  }
  
  return parts.join(', ');
}

/**
 * Get optimal cache headers for different content types
 */
export function getCacheHeaders(type: 'subscription-tiers' | 'user-profile' | 'subscription-status' | 'public-content' | 'sensitive'): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  switch (type) {
    case 'subscription-tiers':
      // Public, long cache - tiers rarely change
      headers['Cache-Control'] = CACHE_CONTROL.SWR_MEDIUM;
      headers['Vary'] = 'Accept-Encoding';
      break;
      
    case 'user-profile':
      // Private, medium cache - user-specific data
      headers['Cache-Control'] = CACHE_CONTROL.PRIVATE_MEDIUM;
      headers['Vary'] = 'Cookie, Accept-Encoding';
      break;
      
    case 'subscription-status':
      // Private, short cache - can change frequently
      headers['Cache-Control'] = CACHE_CONTROL.PRIVATE_SHORT;
      headers['Vary'] = 'Cookie, Accept-Encoding';
      break;
      
    case 'public-content':
      // Public, long cache - static content
      headers['Cache-Control'] = CACHE_CONTROL.PUBLIC_LONG;
      headers['Vary'] = 'Accept-Encoding';
      break;
      
    case 'sensitive':
      // No cache - sensitive data
      headers['Cache-Control'] = CACHE_CONTROL.NO_CACHE;
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
      break;
  }

  return headers;
}

/**
 * Add security headers to response
 */
export function getSecurityHeaders(): HeadersInit {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}

/**
 * Add compression hints
 */
export function getCompressionHeaders(): HeadersInit {
  return {
    'Content-Encoding': 'gzip',
    'Vary': 'Accept-Encoding',
  };
}

/**
 * Generate ETag for content
 */
export function generateETag(content: string): string {
  // Simple hash-based ETag generation
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Check if content is fresh based on ETag/Last-Modified
 */
export function isContentFresh(
  request: Request,
  etag?: string,
  lastModified?: string
): boolean {
  if (etag) {
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return true;
    }
  }
  
  if (lastModified) {
    const ifModifiedSince = request.headers.get('if-modified-since');
    if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(lastModified)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Create optimized response with caching headers
 */
export function createCachedResponse(
  data: any,
  options: {
    cacheType: 'subscription-tiers' | 'user-profile' | 'subscription-status' | 'public-content' | 'sensitive';
    status?: number;
    etag?: string;
    lastModified?: string;
  }
): Response {
  const { cacheType, status = 200, etag, lastModified } = options;
  
  const body = JSON.stringify(data);
  const headers = new Headers(getCacheHeaders(cacheType));
  
  // Add security headers
  Object.entries(getSecurityHeaders()).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Add ETag if generated
  if (etag) {
    headers.set('ETag', etag);
  } else {
    // Auto-generate ETag
    headers.set('ETag', generateETag(body));
  }
  
  // Add Last-Modified if provided
  if (lastModified) {
    headers.set('Last-Modified', lastModified);
  }
  
  return new Response(body, { status, headers });
}

/**
 * In-memory cache for server-side caching (simple implementation)
 * Note: For production, consider using Redis or similar
 */
class SimpleCache {
  private cache: Map<string, { data: any; expires: number }> = new Map();
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  set(key: string, data: any, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + (ttlSeconds * 1000),
    });
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const serverCache = new SimpleCache();

/**
 * Cache key generators for consistent naming
 */
export const cacheKeys = {
  subscriptionTiers: () => 'subscription_tiers:all',
  subscriptionTierById: (id: string) => `subscription_tier:${id}`,
  userSubscription: (userId: string) => `user_subscription:${userId}`,
  userProfile: (userId: string) => `user_profile:${userId}`,
  subscriptionStatus: (userId: string) => `subscription_status:${userId}`,
} as const;

