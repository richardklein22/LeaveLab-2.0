-- Seed subscription tiers with pricing and features
-- Note: Stripe product/price IDs will be updated after creating products in Stripe Dashboard

INSERT INTO subscription_tiers (
  name,
  display_name,
  description,
  stripe_product_id,
  stripe_price_id_monthly,
  stripe_price_id_annual,
  price_monthly_pence,
  price_annual_pence,
  features,
  sort_order,
  is_active
) VALUES
(
  'free',
  'Free',
  'Get started with digital nomad basics',
  NULL, -- No Stripe product for free tier
  NULL,
  NULL,
  0, -- £0.00
  0, -- £0.00
  '{
    "max_courses": 0,
    "first_lesson_only": true,
    "community_access": false,
    "email_support": false,
    "one_on_one_support": false,
    "visa_info": "none",
    "accommodation_info": "none",
    "has_trial": false,
    "trial_days": null
  }'::jsonb,
  1,
  true
),
(
  'basic',
  'Basic',
  'Start your digital nomad journey',
  'prod_placeholder_basic', -- Will be updated with real Stripe product ID
  'price_placeholder_basic_monthly', -- Will be updated with real Stripe price ID
  'price_placeholder_basic_annual', -- Will be updated with real Stripe price ID
  7000, -- £70.00
  67200, -- £672.00 (£56/month effective rate, 20% savings)
  '{
    "max_courses": 1,
    "first_lesson_only": false,
    "community_access": true,
    "email_support": true,
    "one_on_one_support": false,
    "visa_info": "short_term",
    "accommodation_info": "short_term",
    "has_trial": false,
    "trial_days": null
  }'::jsonb,
  2,
  true
),
(
  'premium',
  'Premium',
  'Full access to everything you need',
  'prod_placeholder_premium', -- Will be updated with real Stripe product ID
  'price_placeholder_premium_monthly', -- Will be updated with real Stripe price ID
  'price_placeholder_premium_annual', -- Will be updated with real Stripe price ID
  10000, -- £100.00
  96000, -- £960.00 (£80/month effective rate, 20% savings)
  '{
    "max_courses": null,
    "first_lesson_only": false,
    "community_access": true,
    "email_support": true,
    "one_on_one_support": true,
    "visa_info": "all",
    "accommodation_info": "all",
    "has_trial": true,
    "trial_days": 7
  }'::jsonb,
  3,
  true
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly_pence = EXCLUDED.price_monthly_pence,
  price_annual_pence = EXCLUDED.price_annual_pence,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the seed data
DO $$
DECLARE
  tier_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tier_count FROM subscription_tiers;
  
  IF tier_count < 3 THEN
    RAISE EXCEPTION 'Failed to seed subscription tiers. Expected 3 tiers, found %', tier_count;
  END IF;
  
  RAISE NOTICE 'Successfully seeded % subscription tiers', tier_count;
END $$;
