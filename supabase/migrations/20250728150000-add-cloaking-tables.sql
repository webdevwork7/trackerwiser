-- Create cloaking_rules table
CREATE TABLE IF NOT EXISTS cloaking_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger TEXT NOT NULL CHECK (trigger IN ('user_agent', 'ip_reputation', 'connection_type', 'country', 'device_type')),
  condition TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('safe_page', 'money_page', 'warning_page', 'block')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  hits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cloaking_pages table
CREATE TABLE IF NOT EXISTS cloaking_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('safe', 'money', 'warning')),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(website_id, page_type)
);

-- Add cloaking_enabled column to websites table
ALTER TABLE websites ADD COLUMN IF NOT EXISTS cloaking_enabled BOOLEAN DEFAULT false;

-- Add cloaking_action column to analytics_events table
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS cloaking_action TEXT CHECK (cloaking_action IN ('safe_page', 'money_page', 'warning_page', 'block'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cloaking_rules_website_id ON cloaking_rules(website_id);
CREATE INDEX IF NOT EXISTS idx_cloaking_pages_website_id ON cloaking_pages(website_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_cloaking_action ON analytics_events(cloaking_action);

-- Enable RLS
ALTER TABLE cloaking_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloaking_pages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cloaking_rules
CREATE POLICY "Users can view their own cloaking rules" ON cloaking_rules
  FOR SELECT USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own cloaking rules" ON cloaking_rules
  FOR INSERT WITH CHECK (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cloaking rules" ON cloaking_rules
  FOR UPDATE USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cloaking rules" ON cloaking_rules
  FOR DELETE USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for cloaking_pages
CREATE POLICY "Users can view their own cloaking pages" ON cloaking_pages
  FOR SELECT USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own cloaking pages" ON cloaking_pages
  FOR INSERT WITH CHECK (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own cloaking pages" ON cloaking_pages
  FOR UPDATE USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own cloaking pages" ON cloaking_pages
  FOR DELETE USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  ); 