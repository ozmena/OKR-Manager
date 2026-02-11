-- Supabase Schema for OKR App
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- OKRs table
CREATE TABLE okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id TEXT,
  objective TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  parent_id UUID REFERENCES okrs(id) ON DELETE CASCADE,
  area TEXT,
  owner TEXT,
  challenges TEXT,
  needs TEXT,
  comments TEXT,
  status TEXT
);

-- Key Results table (one-to-many with OKRs)
CREATE TABLE key_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES okrs(id) ON DELETE CASCADE NOT NULL,
  metric_name TEXT NOT NULL,
  from_value NUMERIC NOT NULL,
  to_value NUMERIC NOT NULL,
  unit TEXT DEFAULT 'percentage',
  current_value NUMERIC,
  status TEXT,
  function TEXT,
  sort_order INTEGER DEFAULT 0
);

-- Quality checklist items
CREATE TABLE quality_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES okrs(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  checked BOOLEAN DEFAULT FALSE
);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE okrs;
ALTER PUBLICATION supabase_realtime ADD TABLE key_results;

-- Actions table (action items for OKRs)
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  okr_id UUID REFERENCES okrs(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time for actions
ALTER PUBLICATION supabase_realtime ADD TABLE actions;

-- Indexes for performance
CREATE INDEX idx_okrs_parent_id ON okrs(parent_id);
CREATE INDEX idx_key_results_okr_id ON key_results(okr_id);
CREATE INDEX idx_actions_okr_id ON actions(okr_id);
