-- Update Stripe price IDs with TEST MODE values
-- Replace these with your actual test mode price IDs from Stripe Dashboard

-- INSTRUCTIONS:
-- 1. Go to Stripe Dashboard in TEST MODE: https://dashboard.stripe.com/test/products
-- 2. Create products for Basic and Premium with monthly and annual prices
-- 3. Copy the price IDs (they start with price_test_...)
-- 4. Replace the placeholder values below with your actual test price IDs
-- 5. Run: supabase db push

-- Basic Tier (£70/month, £672/year with 20% discount)
UPDATE public.subscription_tiers
SET 
  stripe_price_id_monthly = 'price_YOUR_BASIC_MONTHLY_TEST_PRICE_ID_HERE',
  stripe_price_id_annual = 'price_YOUR_BASIC_ANNUAL_TEST_PRICE_ID_HERE',
  stripe_product_id = 'prod_YOUR_BASIC_PRODUCT_ID_HERE'
WHERE name = 'basic';

-- Premium Tier (£100/month, £960/year with 20% discount)
UPDATE public.subscription_tiers
SET 
  stripe_price_id_monthly = 'price_YOUR_PREMIUM_MONTHLY_TEST_PRICE_ID_HERE',
  stripe_price_id_annual = 'price_YOUR_PREMIUM_ANNUAL_TEST_PRICE_ID_HERE',
  stripe_product_id = 'prod_YOUR_PREMIUM_PRODUCT_ID_HERE'
WHERE name = 'premium';

-- Verify the update
DO $$
BEGIN
  RAISE NOTICE 'Updated Stripe price IDs for Basic and Premium tiers';
  RAISE NOTICE 'Make sure you replaced the placeholder values with actual Stripe test price IDs!';
END $$;

