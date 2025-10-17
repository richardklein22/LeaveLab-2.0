-- ============================================================================
-- PLACEHOLDER RLS POLICIES: Accommodation Information Access Control
-- ============================================================================
-- 
-- PURPOSE:
-- This migration creates placeholder RLS policies for a future 'accommodation_info' 
-- table that will contain accommodation-related information for digital nomads.
-- 
-- SUBSCRIPTION TIER ACCESS:
-- ┌──────────┬────────────┬──────────────────────────────────────────────┐
-- │ Tier     │ Access     │ Description                                  │
-- ├──────────┼────────────┼──────────────────────────────────────────────┤
-- │ Free     │ None       │ No access to any accommodation information   │
-- │ Basic    │ Short-term │ Access to short-term accommodation info only │
-- │ Premium  │ All        │ Access to all accommodation information      │
-- └──────────┴────────────┴──────────────────────────────────────────────┘
-- 
-- IMPLEMENTATION NOTES:
-- - Uses existing can_access_content() function with 'accommodation_info' content type
-- - Content level 'short_term': Hotels, hostels, short-term rentals (<3 months)
-- - Content level 'all': Long-term rentals, buying property, co-living spaces
-- - The accommodation_info table MUST include a 'stay_duration_type' column that 
--   stores either 'short_term' or 'long_term' to enable proper row-level filtering
-- 
-- FUTURE TABLE SCHEMA (for reference when implementing):
-- 
-- CREATE TABLE accommodation_info (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   country TEXT NOT NULL,
--   city TEXT NOT NULL,
--   stay_duration_type TEXT NOT NULL CHECK (stay_duration_type IN ('short_term', 'long_term')),
--   accommodation_type TEXT NOT NULL, -- e.g., 'hotel', 'apartment', 'hostel', 'coliving'
--   average_monthly_cost_usd INTEGER,
--   minimum_stay_days INTEGER,
--   typical_amenities TEXT[],
--   booking_platforms TEXT[],
--   neighborhood_recommendations TEXT,
--   safety_rating INTEGER CHECK (safety_rating BETWEEN 1 AND 5),
--   nomad_friendly_score INTEGER CHECK (nomad_friendly_score BETWEEN 1 AND 10),
--   notes TEXT,
--   last_updated TIMESTAMPTZ DEFAULT NOW(),
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- 
-- CREATE INDEX idx_accommodation_info_country ON accommodation_info(country);
-- CREATE INDEX idx_accommodation_info_city ON accommodation_info(city);
-- CREATE INDEX idx_accommodation_info_duration_type ON accommodation_info(stay_duration_type);
-- CREATE INDEX idx_accommodation_info_type ON accommodation_info(accommodation_type);
-- 
-- ============================================================================

-- Enable RLS on the accommodation_info table (when it exists)
-- Uncomment when table is created:
-- ALTER TABLE accommodation_info ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow all authenticated users to read accommodation information 
-- they have access to based on their subscription tier
-- 
-- This policy filters rows based on:
-- 1. User must be authenticated
-- 2. User's subscription tier determines access level:
--    - Free tier: No access (policy returns false)
--    - Basic tier: Can see short_term accommodation info only
--    - Premium tier: Can see all accommodation info (short_term + long_term)
--
-- Uncomment when table is created:
/*
CREATE POLICY "Users can read accommodation info based on subscription tier"
ON accommodation_info
FOR SELECT
TO authenticated
USING (
  -- Check if user can access this specific row based on their tier
  CASE 
    -- For short-term accommodation info: Basic and Premium tiers can access
    WHEN stay_duration_type = 'short_term' THEN
      can_access_content(auth.uid(), 'accommodation_info', 'short_term')
    
    -- For long-term accommodation info: Only Premium tier can access
    WHEN stay_duration_type = 'long_term' THEN
      can_access_content(auth.uid(), 'accommodation_info', 'all')
    
    -- Default: deny access
    ELSE false
  END
);
*/

-- Policy 2: Prevent all INSERT operations (content is admin-managed)
-- Uncomment when table is created:
/*
CREATE POLICY "Prevent user inserts on accommodation info"
ON accommodation_info
FOR INSERT
TO authenticated
WITH CHECK (false);
*/

-- Policy 3: Prevent all UPDATE operations (content is admin-managed)
-- Uncomment when table is created:
/*
CREATE POLICY "Prevent user updates on accommodation info"
ON accommodation_info
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);
*/

-- Policy 4: Prevent all DELETE operations (content is admin-managed)
-- Uncomment when table is created:
/*
CREATE POLICY "Prevent user deletes on accommodation info"
ON accommodation_info
FOR DELETE
TO authenticated
USING (false);
*/

-- ============================================================================
-- TESTING CHECKLIST (when implementing):
-- ============================================================================
-- 
-- □ Test Free tier user:
--   - Should NOT see any accommodation information
--   - SELECT should return 0 rows
-- 
-- □ Test Basic tier user:
--   - Should see ONLY short-term accommodation information
--   - Verify can_access_content(auth.uid(), 'accommodation_info', 'short_term') = true
--   - Verify can_access_content(auth.uid(), 'accommodation_info', 'all') = false
-- 
-- □ Test Premium tier user:
--   - Should see ALL accommodation information (short-term + long-term)
--   - Verify can_access_content(auth.uid(), 'accommodation_info', 'all') = true
-- 
-- □ Test write operations:
--   - All users should be unable to INSERT, UPDATE, or DELETE
--   - Operations should fail with RLS policy violation
-- 
-- □ Test unauthenticated access:
--   - Anonymous users should see nothing
-- 
-- □ Test tier transitions:
--   - User upgrades from Basic to Premium: should now see long-term content
--   - User downgrades from Premium to Basic: should lose access to long-term content
-- 
-- ============================================================================

-- Verification query (uncomment when table exists):
/*
-- Run as different tier users to verify access
SELECT 
  id,
  country,
  city,
  stay_duration_type,
  accommodation_type,
  average_monthly_cost_usd,
  nomad_friendly_score
FROM accommodation_info
ORDER BY country, city, stay_duration_type;
*/

-- Additional query to test access counts by tier:
/*
-- This should show different counts for Basic vs Premium users
SELECT 
  stay_duration_type,
  COUNT(*) as accessible_count
FROM accommodation_info
GROUP BY stay_duration_type;
*/

-- Comments for documentation
COMMENT ON MIGRATION IS 'Placeholder RLS policies for accommodation_info table - implements tiered access control for accommodation information based on subscription levels';

