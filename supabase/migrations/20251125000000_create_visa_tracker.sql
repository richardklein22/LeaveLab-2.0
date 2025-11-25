-- Create visa_tracker_entries table for tracking user visa status in Thailand
CREATE TABLE IF NOT EXISTS public.visa_tracker_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country TEXT NOT NULL DEFAULT 'Thailand',
  visa_type TEXT NOT NULL CHECK (visa_type IN (
    'visa_exemption',
    'tourist_visa_single',
    'tourist_visa_multiple',
    'education_visa',
    'business_visa',
    'other'
  )),
  passport_country TEXT,
  entry_date TIMESTAMPTZ NOT NULL,
  exit_date TIMESTAMPTZ,
  initial_stay_days INTEGER NOT NULL,
  extension_days INTEGER DEFAULT 0,
  has_extended BOOLEAN DEFAULT FALSE,
  extension_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_visa_tracker_user_id ON public.visa_tracker_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_visa_tracker_entry_date ON public.visa_tracker_entries(entry_date DESC);

-- Enable Row Level Security
ALTER TABLE public.visa_tracker_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own visa tracker entries
CREATE POLICY "Users can view own visa tracker entries"
  ON public.visa_tracker_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visa tracker entries"
  ON public.visa_tracker_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visa tracker entries"
  ON public.visa_tracker_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own visa tracker entries"
  ON public.visa_tracker_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_visa_tracker_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER update_visa_tracker_timestamp
  BEFORE UPDATE ON public.visa_tracker_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_visa_tracker_updated_at();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visa_tracker_entries TO authenticated;
