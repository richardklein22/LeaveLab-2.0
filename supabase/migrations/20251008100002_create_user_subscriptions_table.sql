-- Create user_subscriptions table
-- Tracks user subscriptions and Stripe data

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  
  -- Stripe Integration
  stripe_customer_id TEXT, -- Stripe Customer ID
  stripe_subscription_id TEXT, -- Stripe Subscription ID (NULL for free tier)
  stripe_price_id TEXT, -- Current Stripe Price ID
  
  -- Subscription Status
  -- Possible values: 'active', 'trialing', 'past_due', 'cancelled', 'incomplete', 'incomplete_expired', 'unpaid'
  status TEXT NOT NULL DEFAULT 'active',
  
  -- Billing
  billing_cycle TEXT, -- 'monthly' | 'annual' | NULL (for free)
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  cancelled_at TIMESTAMPTZ,
  
  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id), -- One subscription per user
  UNIQUE(stripe_subscription_id) -- One subscription ID per record
);

-- Indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Trigger for updated_at
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create free tier subscription for new users
CREATE OR REPLACE FUNCTION create_free_subscription_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_tier_id UUID;
BEGIN
  -- Get the free tier ID
  SELECT id INTO free_tier_id
  FROM subscription_tiers
  WHERE name = 'free'
  LIMIT 1;
  
  -- Create a free subscription for the new user
  IF free_tier_id IS NOT NULL THEN
    INSERT INTO user_subscriptions (user_id, tier_id, status)
    VALUES (NEW.id, free_tier_id, 'active')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create free subscription when new profile is created
CREATE TRIGGER create_free_subscription_on_profile_creation
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_free_subscription_for_new_user();

-- Comments
COMMENT ON TABLE user_subscriptions IS 'User subscription records with Stripe integration';
COMMENT ON COLUMN user_subscriptions.status IS 'Subscription status matching Stripe statuses';
COMMENT ON COLUMN user_subscriptions.billing_cycle IS 'Monthly or annual billing cycle';
COMMENT ON COLUMN user_subscriptions.cancel_at_period_end IS 'If true, subscription ends at period end';
