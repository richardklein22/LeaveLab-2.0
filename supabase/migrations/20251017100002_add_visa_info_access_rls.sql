-- ============================================================================
-- PLACEHOLDER RLS POLICIES: Visa Information Access Control
-- ============================================================================
-- 
-- PURPOSE:
-- This migration creates placeholder RLS policies for a future 'visa_info' 
-- table that will contain visa-related information for digital nomads.
-- 
-- SUBSCRIPTION TIER ACCESS:
-- ┌──────────┬────────────┬──────────────────────────────────────────────┐
-- │ Tier     │ Access     │ Description                                  │
-- ├──────────┼────────────┼──────────────────────────────────────────────┤
-- │ Free     │ None       │ No access to any visa information            │
-- │ Basic    │ Short-term │ Access to short-term visa information only   │
-- │ Premium  │ All        │ Access to all visa information (short + long)│
-- └──────────┴────────────┴──────────────────────────────────────────────┘
-- 
-- IMPLEMENTATION NOTES:
-- - Uses existing can_access_content() function with 'visa_info' content type
-- - Content level 'short_term': Tourist visas, visa-free travel, <90 day stays
-- - Content level 'all': Long-term visas, work permits, residency permits
-- - The visa_info table MUST include a 'visa_duration_type' column that stores
--   either 'short_term' or 'long_term' to enable proper row-level filtering
-- 
-- FUTURE TABLE SCHEMA (for reference when implementing):
-- 
-- CREATE TABLE visa_info (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   country TEXT NOT NULL,
--   visa_duration_type TEXT NOT NULL CHECK (visa_duration_type IN ('short_term', 'long_term')),
--   visa_type TEXT NOT NULL,
--   max_stay_days INTEGER,
--   cost_usd INTEGER,
--   processing_time_days INTEGER,
--   requirements TEXT,
--   application_process TEXT,
--   renewal_possible BOOLEAN DEFAULT false,
--   notes TEXT,
--   last_updated TIMESTAMPTZ DEFAULT NOW(),
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- 
-- CREATE INDEX idx_visa_info_country ON visa_info(country);
-- CREATE INDEX idx_visa_info_duration_type ON visa_info(visa_duration_type);
-- 
-- ============================================================================

-- Enable RLS on the visa_info table (when it exists)
-- Uncomment when table is created:
-- ALTER TABLE visa_info ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow all authenticated users to read visa information 
-- they have access to based on their subscription tier
-- 
-- This policy filters rows based on:
-- 1. User must be authenticated
-- 2. User's subscription tier determines access level:
--    - Free tier: No access (policy returns false)
--    - Basic tier: Can see short_term visa info only
--    - Premium tier: Can see all visa info (short_term + long_term)
--
-- Uncomment when table is created:
/*
CREATE POLICY "Users can read visa info based on subscription tier"
ON visa_info
FOR SELECT
TO authenticated
USING (
  -- Check if user can access this specific row based on their tier
  CASE 
    -- For short-term visa info: Basic and Premium tiers can access
    WHEN visa_duration_type = 'short_term' THEN
      can_access_content(auth.uid(), 'visa_info', 'short_term')
    
    -- For long-term visa info: Only Premium tier can access
    WHEN visa_duration_type = 'long_term' THEN
      can_access_content(auth.uid(), 'visa_info', 'all')
    
    -- Default: deny access
    ELSE false
  END
);
*/

-- Policy 2: Prevent all INSERT operations (content is admin-managed)
-- Uncomment when table is created:
/*
CREATE POLICY "Prevent user inserts on visa info"
ON visa_info
FOR INSERT
TO authenticated
WITH CHECK (false);
*/

-- Policy 3: Prevent all UPDATE operations (content is admin-managed)
-- Uncomment when table is created:
/*
CREATE POLICY "Prevent user updates on visa info"
ON visa_info
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);
*/

-- Policy 4: Prevent all DELETE operations (content is admin-managed)
-- Uncomment when table is created:
/*
CREATE POLICY "Prevent user deletes on visa info"
ON visa_info
FOR DELETE
TO authenticated
USING (false);
*/

-- ============================================================================
-- TESTING CHECKLIST (when implementing):
-- ============================================================================
-- 
-- □ Test Free tier user:
--   - Should NOT see any visa information
--   - SELECT should return 0 rows
-- 
-- □ Test Basic tier user:
--   - Should see ONLY short-term visa information
--   - Verify can_access_content(auth.uid(), 'visa_info', 'short_term') = true
--   - Verify can_access_content(auth.uid(), 'visa_info', 'all') = false
-- 
-- □ Test Premium tier user:
--   - Should see ALL visa information (short-term + long-term)
--   - Verify can_access_content(auth.uid(), 'visa_info', 'all') = true
-- 
-- □ Test write operations:
--   - All users should be unable to INSERT, UPDATE, or DELETE
--   - Operations should fail with RLS policy violation
-- 
-- □ Test unauthenticated access:
--   - Anonymous users should see nothing
-- 
-- ============================================================================

-- Verification query (uncomment when table exists):
/*
-- Run as different tier users to verify access
SELECT 
  id,
  country,
  visa_duration_type,
  visa_type,
  max_stay_days
FROM visa_info
ORDER BY country, visa_duration_type;
*/

-- Comments for documentation
COMMENT ON MIGRATION IS 'Placeholder RLS policies for visa_info table - implements tiered access control for visa information based on subscription levels';

