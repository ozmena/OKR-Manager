-- Migration: Add Actions table
-- Run this in Supabase SQL Editor to add actions tracking

-- Actions table (action items for OKRs)
CREATE TABLE IF NOT EXISTS actions (
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

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_actions_okr_id ON actions(okr_id);
