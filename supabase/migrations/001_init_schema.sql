-- =====================================================
-- Creative Templates App - Initial Database Schema
-- =====================================================
--
-- HOW TO APPLY THIS MIGRATION:
--
-- Option 1: Using Supabase Dashboard (Recommended for initial setup)
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to "SQL Editor" in the left sidebar
-- 3. Click "New query"
-- 4. Copy and paste this entire file
-- 5. Click "Run" to execute
--
-- Option 2: Using Supabase CLI
-- 1. Install Supabase CLI: npm install -g supabase
-- 2. Link your project: supabase link --project-ref <your-project-ref>
-- 3. Apply migration: supabase db push
--
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TEMPLATES TABLE
-- =====================================================
-- Stores template definitions for different social media channels
-- Templates are reusable designs that can be used to create multiple designs

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('facebook', 'instagram', 'linkedin', 'display')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  canvas JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on channel for faster filtering
CREATE INDEX IF NOT EXISTS idx_templates_channel ON templates(channel);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_templates_status ON templates(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- =====================================================
-- DESIGNS TABLE
-- =====================================================
-- Stores individual designs created from templates or from scratch
-- Each design can optionally reference a template it was created from

CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('facebook', 'instagram', 'linkedin', 'display')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  canvas JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on template_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_designs_template_id ON designs(template_id);

-- Create index on channel for faster filtering
CREATE INDEX IF NOT EXISTS idx_designs_channel ON designs(channel);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_designs_status ON designs(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC updated_at MANAGEMENT
-- =====================================================

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for templates table
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for designs table
DROP TRIGGER IF EXISTS update_designs_updated_at ON designs;
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE templates IS 'Reusable template definitions for different social media channels';
COMMENT ON TABLE designs IS 'Individual designs created from templates or from scratch';

COMMENT ON COLUMN templates.channel IS 'Social media channel: facebook, instagram, linkedin, or display';
COMMENT ON COLUMN templates.status IS 'Template status: draft, active, or archived';
COMMENT ON COLUMN templates.canvas IS 'Full canvas state stored as JSON';

COMMENT ON COLUMN designs.template_id IS 'Optional reference to the template this design was created from';
COMMENT ON COLUMN designs.channel IS 'Social media channel: facebook, instagram, linkedin, or display';
COMMENT ON COLUMN designs.status IS 'Design status: draft, active, or archived';
COMMENT ON COLUMN designs.canvas IS 'Full canvas state stored as JSON';

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Uncomment the following to insert sample data for testing

-- INSERT INTO templates (name, channel, status, canvas) VALUES
--   ('Facebook Post Template', 'facebook', 'active', '{"layers": [], "background": "#ffffff"}'),
--   ('Instagram Story Template', 'instagram', 'active', '{"layers": [], "background": "#000000"}'),
--   ('LinkedIn Banner Template', 'linkedin', 'draft', '{"layers": [], "background": "#0077b5"}');

-- INSERT INTO designs (name, channel, status, template_id, canvas) VALUES
--   ('Summer Sale Facebook Post', 'facebook', 'draft', (SELECT id FROM templates WHERE name = 'Facebook Post Template' LIMIT 1), '{"layers": [], "background": "#ffffff"}'),
--   ('Product Launch Story', 'instagram', 'active', (SELECT id FROM templates WHERE name = 'Instagram Story Template' LIMIT 1), '{"layers": [], "background": "#000000"}');

