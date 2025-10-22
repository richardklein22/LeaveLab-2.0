// Fallback utilities for missing environment variables

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// Safe environment variable getter
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && !fallback) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value || fallback || '';
}

// Check if required services are configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Safe API response for missing services
export function createServiceUnavailableResponse(service: string) {
  return {
    error: `${service} is not configured`,
    message: `Please contact support to enable ${service} functionality`,
    configured: false
  };
}
