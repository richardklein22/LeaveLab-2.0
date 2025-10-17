-- Create auth_logs table
CREATE TABLE public.auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  oauth_provider TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_auth_logs_user_id ON public.auth_logs(user_id);
CREATE INDEX idx_auth_logs_event ON public.auth_logs(event);
CREATE INDEX idx_auth_logs_user_event_time ON public.auth_logs(user_id, event, created_at DESC);
CREATE INDEX idx_auth_logs_created_at ON public.auth_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.auth_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own auth logs"
ON public.auth_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert auth logs"
ON public.auth_logs FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Cleanup function
CREATE OR REPLACE FUNCTION delete_old_auth_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM public.auth_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
