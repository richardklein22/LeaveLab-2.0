/**
 * Database Query Optimizer
 * 
 * Best practices and utilities for optimizing Supabase/PostgreSQL queries
 */

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Query optimization patterns
 */
export const QueryPatterns = {
  /**
   * Use specific column selection instead of SELECT *
   * 
   * @example
   * // Bad
   * .select('*')
   * 
   * // Good
   * .select('id, name, email, created_at')
   */
  selectSpecificColumns: (columns: string[]) => columns.join(', '),

  /**
   * Use inner joins for better performance when you know data exists
   * 
   * @example
   * .select('*, tier:subscription_tiers!inner(name, price)')
   */
  useInnerJoins: true,

  /**
   * Add indexed columns to WHERE clauses
   * 
   * @example
   * .eq('user_id', userId)  // user_id has an index
   * .eq('status', 'active') // status has an index
   */
  filterByIndexedColumns: true,

  /**
   * Use single() when expecting one result to avoid array overhead
   * 
   * @example
   * .single()
   */
  useSingle: true,

  /**
   * Limit results for pagination
   * 
   * @example
   * .range(0, 9)  // First 10 items
   * .limit(10)
   */
  usePagination: true,
} as const;

/**
 * Common optimized query patterns
 */
export class OptimizedQueries {
  /**
   * Get user subscription with tier (optimized)
   */
  static async getUserSubscription(
    supabase: SupabaseClient,
    userId: string
  ) {
    return supabase
      .from('user_subscriptions')
      .select(`
        id,
        user_id,
        tier_id,
        status,
        billing_cycle,
        current_period_start,
        current_period_end,
        cancel_at_period_end,
        trial_start,
        trial_end,
        tier:subscription_tiers!inner(
          id,
          name,
          display_name,
          price_monthly_pence,
          price_annual_pence
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
  }

  /**
   * Get user profile (optimized)
   */
  static async getUserProfile(
    supabase: SupabaseClient,
    userId: string
  ) {
    return supabase
      .from('profiles')
      .select('id, display_name, avatar_url, bio, timezone, language, created_at, updated_at')
      .eq('id', userId)
      .is('deleted_at', null)
      .single();
  }

  /**
   * Get active subscription tiers (optimized)
   */
  static async getActiveTiers(supabase: SupabaseClient) {
    return supabase
      .from('subscription_tiers')
      .select('id, name, display_name, description, stripe_price_id_monthly, stripe_price_id_annual, price_monthly_pence, price_annual_pence, features, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
  }

  /**
   * Get recent auth logs (optimized with pagination)
   */
  static async getRecentAuthLogs(
    supabase: SupabaseClient,
    userId: string,
    limit = 50
  ) {
    return supabase
      .from('auth_logs')
      .select('id, event, ip_address, user_agent, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
  }

  /**
   * Check if subscription exists (optimized - count only)
   */
  static async hasActiveSubscription(
    supabase: SupabaseClient,
    userId: string
  ) {
    const { count, error } = await supabase
      .from('user_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'active');

    return !error && (count ?? 0) > 0;
  }

  /**
   * Get unprocessed subscription events (optimized for webhook processing)
   */
  static async getUnprocessedEvents(
    supabase: SupabaseClient,
    limit = 100
  ) {
    return supabase
      .from('subscription_events')
      .select('id, user_id, event_type, stripe_event_id, metadata, created_at')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(limit);
  }
}

/**
 * Query performance analyzer
 */
export class QueryAnalyzer {
  /**
   * Analyze query performance and suggest optimizations
   */
  static analyzeQuery(query: string, executionTime: number): {
    performance: 'excellent' | 'good' | 'acceptable' | 'poor';
    suggestions: string[];
  } {
    const suggestions: string[] = [];

    // Check for SELECT *
    if (query.includes('SELECT *') || query.includes('select(\'*\')')) {
      suggestions.push('Avoid SELECT * - specify only needed columns');
    }

    // Check for missing indexes (common patterns)
    if (query.includes('.eq(') && !query.includes('user_id') && !query.includes('status')) {
      suggestions.push('Consider adding an index on the filtered column');
    }

    // Check for missing LIMIT
    if (!query.includes('.limit(') && !query.includes('.range(') && !query.includes('.single()')) {
      suggestions.push('Add pagination (.limit() or .range()) to prevent large result sets');
    }

    // Check for N+1 query pattern
    if (query.includes('for') || query.includes('map')) {
      suggestions.push('Watch for N+1 queries - consider using joins or batch operations');
    }

    // Determine performance rating
    let performance: 'excellent' | 'good' | 'acceptable' | 'poor';
    if (executionTime < 50) {
      performance = 'excellent';
    } else if (executionTime < 200) {
      performance = 'good';
    } else if (executionTime < 500) {
      performance = 'acceptable';
    } else {
      performance = 'poor';
      suggestions.push(`Query took ${executionTime}ms - consider optimization`);
    }

    return { performance, suggestions };
  }

  /**
   * Generate EXPLAIN ANALYZE query for PostgreSQL
   */
  static generateExplainQuery(tableName: string, conditions: Record<string, any>): string {
    const whereClause = Object.entries(conditions)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(' AND ');

    return `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) 
SELECT * FROM ${tableName} 
WHERE ${whereClause};`;
  }
}

/**
 * Database optimization recommendations
 */
export const OptimizationTips = {
  indexing: [
    'Create indexes on frequently queried columns (user_id, status, created_at)',
    'Use composite indexes for multi-column filters',
    'Use partial indexes for frequently filtered subsets',
    'Use GIN indexes for JSONB columns and full-text search',
  ],
  
  queries: [
    'Select only needed columns, not SELECT *',
    'Use .single() when expecting one result',
    'Use inner joins (!inner) when relationship is guaranteed',
    'Add .limit() for all list queries',
    'Filter by indexed columns in WHERE clauses',
    'Use .count() with head: true for existence checks',
  ],
  
  caching: [
    'Cache frequently accessed, rarely changed data (subscription tiers)',
    'Use short TTL for user-specific data (5-15 minutes)',
    'Implement stale-while-revalidate for better UX',
    'Invalidate cache on data updates',
    'Use ETag/Last-Modified for conditional requests',
  ],
  
  architecture: [
    'Batch database operations when possible',
    'Use database transactions for related operations',
    'Implement connection pooling',
    'Monitor slow query log',
    'Use prepared statements',
    'Avoid N+1 query patterns',
  ],
  
  monitoring: [
    'Track query execution times',
    'Monitor cache hit/miss rates',
    'Log slow queries (>500ms)',
    'Monitor database connection pool',
    'Track API endpoint latencies',
    'Use APM tools in production',
  ],
} as const;

/**
 * Query builder with optimization hints
 */
export class OptimizedQueryBuilder {
  private supabase: SupabaseClient;
  private startTime: number = 0;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Start timing a query
   */
  startTimer(): void {
    this.startTime = Date.now();
  }

  /**
   * End timing and log if slow
   */
  endTimer(queryName: string): number {
    const duration = Date.now() - this.startTime;
    
    if (duration > 500) {
      console.warn(`[QueryPerformance] Slow query detected: ${queryName} took ${duration}ms`);
    } else if (duration > 200) {
      console.log(`[QueryPerformance] ${queryName} took ${duration}ms`);
    }
    
    return duration;
  }

  /**
   * Execute query with timing
   */
  async execute<T>(
    queryName: string,
    queryFn: () => Promise<T>
  ): Promise<{ data: T; duration: number }> {
    this.startTimer();
    
    try {
      const data = await queryFn();
      const duration = this.endTimer(queryName);
      
      return { data, duration };
    } catch (error) {
      this.endTimer(queryName);
      throw error;
    }
  }
}

/**
 * Common query anti-patterns to avoid
 */
export const QueryAntiPatterns = {
  /**
   * ❌ N+1 Query Problem
   * 
   * Bad:
   * const users = await supabase.from('users').select('*');
   * for (const user of users.data) {
   *   const profile = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
   * }
   * 
   * Good:
   * const users = await supabase
   *   .from('users')
   *   .select('*, profile:profiles!inner(*)');
   */
  nPlusOne: 'Use joins instead of multiple queries in a loop',

  /**
   * ❌ Selecting unnecessary data
   * 
   * Bad:
   * const user = await supabase.from('users').select('*');
   * 
   * Good:
   * const user = await supabase.from('users').select('id, email, name');
   */
  selectAll: 'Specify only needed columns',

  /**
   * ❌ Missing pagination
   * 
   * Bad:
   * const posts = await supabase.from('posts').select('*');
   * 
   * Good:
   * const posts = await supabase.from('posts').select('*').range(0, 19);
   */
  noPagination: 'Always limit result sets',

  /**
   * ❌ Filtering on non-indexed columns
   * 
   * Bad:
   * .eq('random_field', value)
   * 
   * Good:
   * .eq('user_id', value)  // user_id is indexed
   */
  unindexedFilters: 'Filter by indexed columns',

  /**
   * ❌ Multiple queries instead of join
   * 
   * Bad:
   * const subscription = await supabase.from('user_subscriptions').select('tier_id').eq('user_id', userId).single();
   * const tier = await supabase.from('subscription_tiers').select('*').eq('id', subscription.tier_id).single();
   * 
   * Good:
   * const subscription = await supabase
   *   .from('user_subscriptions')
   *   .select('*, tier:subscription_tiers!inner(*)')
   *   .eq('user_id', userId)
   *   .single();
   */
  multipleQueries: 'Use joins to fetch related data in one query',
} as const;

