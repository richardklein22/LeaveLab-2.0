-- Create subscription_events table
-- Audit log for all subscription events (webhook processing, changes, etc.)

CREATE TABLE IF NOT EXISTS subscription_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Event Details
  event_type TEXT NOT NULL,
  /*
  Event types:
  - 'checkout.session.completed'
  - 'subscription.created'
  - 'subscription.updated'
  - 'subscription.deleted'
  - 'invoice.payment_succeeded'
  - 'invoice.payment_failed'
  - 'trial.started'
  - 'trial.ending'
  - 'trial.ended'
  - 'subscription.upgraded'
  - 'subscription.downgraded'
  - 'subscription.cancelled'
  - 'subscription.reactivated'
  */
  
  event_source TEXT NOT NULL DEFAULT 'stripe',
  -- Sources: 'stripe', 'system', 'user', 'n8n'
  
  -- Stripe Data
  stripe_event_id TEXT UNIQUE, -- Stripe Event ID for idempotency
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Event Metadata
  metadata JSONB,
  /*
  Example metadata:
  {
    "from_tier": "basic",
    "to_tier": "premium",
    "amount_gbp": 100.00,
    "billing_cycle": "annual",
    "trial_days": 7,
    "error_message": "...",
    "webhook_response": {...}
  }
  */
  
  -- Processing Status
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX idx_subscription_events_stripe_event_id ON subscription_events(stripe_event_id);
CREATE INDEX idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX idx_subscription_events_created_at ON subscription_events(created_at DESC);
CREATE INDEX idx_subscription_events_processed ON subscription_events(processed);
CREATE INDEX idx_subscription_events_event_source ON subscription_events(event_source);

-- Enable RLS
ALTER TABLE subscription_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own events"
  ON subscription_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all events"
  ON subscription_events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Function to clean up old events (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_subscription_events()
RETURNS void AS $$
BEGIN
  DELETE FROM subscription_events
  WHERE created_at < NOW() - INTERVAL '90 days'
    AND processed = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE subscription_events IS 'Audit log for all subscription-related events';
COMMENT ON COLUMN subscription_events.stripe_event_id IS 'Unique Stripe event ID for idempotency';
COMMENT ON COLUMN subscription_events.metadata IS 'JSONB object with event-specific data';
COMMENT ON COLUMN subscription_events.processed IS 'Whether the event has been processed';
