-- Update subscription tiers with real Stripe product and price IDs
-- Generated: 2025-10-08

-- Update Basic tier with real Stripe IDs
UPDATE subscription_tiers
SET 
  stripe_product_id = 'prod_TD2lm2R0TiSqaV',
  stripe_price_id_monthly = 'price_1SGcgI2NPhvfjGt3rFJJI8vs',
  stripe_price_id_annual = 'price_1SGci32NPhvfjGt3TUOLGjEI',
  updated_at = NOW()
WHERE name = 'basic';

-- Update Premium tier with real Stripe IDs
UPDATE subscription_tiers
SET 
  stripe_product_id = 'prod_TD2psqkFNU8ksh',
  stripe_price_id_monthly = 'price_1SGcjP2NPhvfjGt3N7KR3gxX',
  stripe_price_id_annual = 'price_1SGckl2NPhvfjGt32xVjJOtj',
  updated_at = NOW()
WHERE name = 'premium';

-- Verify the update
DO $$
DECLARE
  basic_product TEXT;
  premium_product TEXT;
BEGIN
  SELECT stripe_product_id INTO basic_product FROM subscription_tiers WHERE name = 'basic';
  SELECT stripe_product_id INTO premium_product FROM subscription_tiers WHERE name = 'premium';
  
  IF basic_product IS NULL OR premium_product IS NULL THEN
    RAISE EXCEPTION 'Failed to update Stripe IDs';
  END IF;
  
  IF basic_product NOT LIKE 'prod_%' OR premium_product NOT LIKE 'prod_%' THEN
    RAISE EXCEPTION 'Invalid Stripe product IDs';
  END IF;
  
  RAISE NOTICE 'Successfully updated Stripe IDs for Basic and Premium tiers';
  RAISE NOTICE 'Basic Product ID: %', basic_product;
  RAISE NOTICE 'Premium Product ID: %', premium_product;
END $$;

-- Display final configuration for verification
SELECT 
  name,
  display_name,
  stripe_product_id,
  stripe_price_id_monthly,
  stripe_price_id_annual,
  price_monthly_pence / 100.0 AS monthly_gbp,
  price_annual_pence / 100.0 AS annual_gbp
FROM subscription_tiers
WHERE name IN ('basic', 'premium')
ORDER BY sort_order;
