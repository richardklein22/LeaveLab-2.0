-- Create subscription_tiers table
-- Defines available subscription tiers and their features

CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE, -- 'free', 'basic', 'premium'
  display_name TEXT NOT NULL,
  description TEXT,
  
  -- Stripe Integration
  stripe_product_id TEXT UNIQUE, -- NULL for free tier
  stripe_price_id_monthly TEXT,
  stripe_price_id_annual TEXT,
  
  -- Pricing (in pence for precision - £70.00 = 7000 pence)
  price_monthly_pence INTEGER NOT NULL DEFAULT 0,
  price_annual_pence INTEGER NOT NULL DEFAULT 0,
  
  -- Features (JSONB for flexibility)
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  /*
  Example features structure:
  {
    "max_courses": 1 | null (unlimited),
    "first_lesson_only": true | false,
    "community_access": true | false,
    "email_support": true | false,
    "one_on_one_support": true | false,
    "visa_info": "none" | "short_term" | "all",
    "accommodation_info": "none" | "short_term" | "all",
    "has_trial": true | false,
    "trial_days": 7 | null
  }
  */
  
  -- Display Order
  sort_order INTEGER NOT NULL DEFAULT 0,
  
  -- Active/Inactive
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_tiers_name ON subscription_tiers(name);
CREATE INDEX idx_subscription_tiers_active ON subscription_tiers(is_active);
CREATE INDEX idx_subscription_tiers_sort_order ON subscription_tiers(sort_order);

-- Enable RLS
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Read-only for all, write for service role only)
CREATE POLICY "Anyone can view active tiers"
  ON subscription_tiers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage tiers"
  ON subscription_tiers
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE subscription_tiers IS 'Available subscription tiers with pricing and features';
COMMENT ON COLUMN subscription_tiers.features IS 'JSONB object containing tier features and limits';
COMMENT ON COLUMN subscription_tiers.price_monthly_pence IS 'Monthly price in pence (£70.00 = 7000)';
COMMENT ON COLUMN subscription_tiers.price_annual_pence IS 'Annual price in pence (£672.00 = 67200)';
