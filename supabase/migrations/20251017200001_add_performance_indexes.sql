-- ============================================================================
-- Performance Optimization Migration
-- ============================================================================
-- This migration adds various performance indexes to optimize common query
-- patterns across the application. These indexes are designed to improve:
-- - Subscription status lookups
-- - User profile queries
-- - Authentication logs
-- - Event processing
-- - JSONB field searches
-- ============================================================================

-- ============================================================================
-- COMPOSITE INDEXES for common query patterns
-- ============================================================================

-- Composite index for active subscriptions by user and status
-- Optimizes: SELECT * FROM user_subscriptions WHERE user_id = ? AND status = 'active'
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status 
  ON user_subscriptions(user_id, status) 
  WHERE status = 'active';

-- Composite index for subscription tier lookups with joins
-- Optimizes: Joins between user_subscriptions and subscription_tiers
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_status 
  ON user_subscriptions(tier_id, status);

-- Composite index for profile lookups (not deleted)
-- Optimizes: SELECT * FROM profiles WHERE deleted_at IS NULL
CREATE INDEX IF NOT EXISTS idx_profiles_active 
  ON profiles(id) 
  WHERE deleted_at IS NULL;

-- Composite index for auth logs with time-based queries
-- Optimizes: SELECT * FROM auth_logs WHERE user_id = ? AND created_at > ?
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_time 
  ON auth_logs(user_id, created_at DESC) 
  WHERE created_at > NOW() - INTERVAL '30 days';

-- Composite index for failed login tracking
-- Optimizes: Security monitoring queries for failed login attempts
CREATE INDEX IF NOT EXISTS idx_auth_logs_failed_logins 
  ON auth_logs(ip_address, created_at DESC) 
  WHERE event = 'failed_login';

-- ============================================================================
-- PARTIAL INDEXES for filtered queries
-- ============================================================================

-- Partial index for active paid subscriptions
-- Optimizes: Queries that need to find all paying customers
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_paid_active 
  ON user_subscriptions(user_id, tier_id) 
  WHERE status = 'active' AND stripe_subscription_id IS NOT NULL;

-- Partial index for trialing subscriptions
-- Optimizes: Finding users currently in trial period
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_trialing 
  ON user_subscriptions(user_id, trial_end) 
  WHERE status = 'trialing' AND trial_end > NOW();

-- Partial index for cancelled subscriptions pending end
-- Optimizes: Finding subscriptions that will cancel at period end
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_pending_cancel 
  ON user_subscriptions(user_id, current_period_end) 
  WHERE cancel_at_period_end = true AND status = 'active';

-- Partial index for unprocessed subscription events
-- Optimizes: Webhook event processing queue
CREATE INDEX IF NOT EXISTS idx_subscription_events_unprocessed 
  ON subscription_events(created_at DESC) 
  WHERE processed = false;

-- Partial index for recent stripe events
-- Optimizes: Duplicate event detection in webhooks
CREATE INDEX IF NOT EXISTS idx_subscription_events_recent_stripe 
  ON subscription_events(stripe_event_id, created_at DESC) 
  WHERE stripe_event_id IS NOT NULL AND created_at > NOW() - INTERVAL '7 days';

-- ============================================================================
-- JSONB INDEXES for feature queries
-- ============================================================================

-- GIN index on subscription_tiers features for flexible querying
-- Optimizes: SELECT * FROM subscription_tiers WHERE features @> '{"max_courses": 1}'
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_features_gin 
  ON subscription_tiers USING GIN (features);

-- Specific JSONB path indexes for commonly queried features
-- Optimizes: Queries filtering by trial availability
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_has_trial 
  ON subscription_tiers((features->>'has_trial')) 
  WHERE (features->>'has_trial')::boolean = true;

-- GIN index on subscription_events metadata for debugging
-- Optimizes: SELECT * FROM subscription_events WHERE metadata @> '{"error": true}'
CREATE INDEX IF NOT EXISTS idx_subscription_events_metadata_gin 
  ON subscription_events USING GIN (metadata);

-- GIN index on auth_logs metadata for security analysis
-- Optimizes: Queries filtering by metadata fields
CREATE INDEX IF NOT EXISTS idx_auth_logs_metadata_gin 
  ON auth_logs USING GIN (metadata);

-- ============================================================================
-- COVERING INDEXES for index-only scans
-- ============================================================================

-- Covering index for subscription status checks
-- Optimizes: Quick status lookups without touching the main table
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status_covering 
  ON user_subscriptions(user_id, status, tier_id, current_period_end);

-- Covering index for profile display data
-- Optimizes: Quick profile info retrieval without full table scan
CREATE INDEX IF NOT EXISTS idx_profiles_display_covering 
  ON profiles(id, display_name, avatar_url, membership_tier) 
  WHERE deleted_at IS NULL;

-- ============================================================================
-- TEXT SEARCH INDEXES for full-text search
-- ============================================================================

-- GIN index for profile display name search
-- Optimizes: Search queries on user display names
CREATE INDEX IF NOT EXISTS idx_profiles_display_name_trgm 
  ON profiles USING GIN (display_name gin_trgm_ops);

-- Enable pg_trgm extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- INDEXES for sorting and pagination
-- ============================================================================

-- Index for profiles sorted by creation date
CREATE INDEX IF NOT EXISTS idx_profiles_created_at_desc 
  ON profiles(created_at DESC) 
  WHERE deleted_at IS NULL;

-- Index for subscription events sorted by creation date (descending)
-- Already exists but ensuring DESC order for optimal performance
-- CREATE INDEX IF EXISTS idx_subscription_events_created_at_desc...

-- Index for user subscription period end (for renewal processing)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period_end 
  ON user_subscriptions(current_period_end ASC) 
  WHERE current_period_end IS NOT NULL 
    AND status = 'active' 
    AND cancel_at_period_end = false;

-- ============================================================================
-- STATISTICS UPDATE
-- ============================================================================

-- Update statistics to help query planner make better decisions
ANALYZE profiles;
ANALYZE user_subscriptions;
ANALYZE subscription_tiers;
ANALYZE subscription_events;
ANALYZE auth_logs;

-- ============================================================================
-- DATABASE CONFIGURATION RECOMMENDATIONS
-- ============================================================================

-- These settings should be applied via Supabase dashboard or config.toml:
--
-- shared_buffers = '256MB'           -- Cache frequently accessed data
-- effective_cache_size = '1GB'      -- Estimate of OS cache
-- work_mem = '16MB'                 -- Memory for sorting/hashing operations
-- maintenance_work_mem = '128MB'    -- Memory for maintenance operations
-- random_page_cost = 1.1            -- SSD optimization (lower than HDD default)
-- effective_io_concurrency = 200    -- SSD optimization
-- max_worker_processes = 4          -- Parallel query workers
-- max_parallel_workers_per_gather = 2
-- max_parallel_workers = 4

-- ============================================================================
-- QUERY OPTIMIZATION TIPS
-- ============================================================================

-- 1. Always use indexed columns in WHERE clauses
-- 2. Use EXPLAIN ANALYZE to check query plans
-- 3. Avoid SELECT * - specify only needed columns
-- 4. Use LIMIT for pagination queries
-- 5. Use prepared statements to cache query plans
-- 6. Batch INSERT/UPDATE operations when possible
-- 7. Use transactions for related operations
-- 8. Monitor slow query log regularly

-- ============================================================================
-- MONITORING QUERIES
-- ============================================================================

-- Check index usage:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan ASC;

-- Find missing indexes:
-- SELECT schemaname, tablename, attname, n_distinct, correlation
-- FROM pg_stats
-- WHERE schemaname = 'public'
-- AND n_distinct > 100
-- ORDER BY n_distinct DESC;

-- Check table bloat:
-- SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- MAINTENANCE
-- ============================================================================

-- Schedule regular VACUUM operations (Supabase handles this automatically)
-- Consider REINDEX periodically for heavily updated tables
-- Monitor and clean up old auth_logs and subscription_events

COMMENT ON INDEX idx_user_subscriptions_user_status IS 'Composite index for active subscription lookups';
COMMENT ON INDEX idx_user_subscriptions_tier_status IS 'Composite index for tier join optimization';
COMMENT ON INDEX idx_subscription_tiers_features_gin IS 'GIN index for JSONB feature queries';
COMMENT ON INDEX idx_subscription_events_unprocessed IS 'Partial index for webhook event processing queue';

-- Success message
SELECT 'Performance indexes created successfully' AS message;

