-- Create heatmap_events table
CREATE TABLE IF NOT EXISTS heatmap_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'scroll', 'hover', 'form_focus', 'form_submit')),
  page_url TEXT NOT NULL,
  x_position INTEGER,
  y_position INTEGER,
  element_selector TEXT,
  element_text TEXT,
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add heatmap and session recording columns to websites table
ALTER TABLE websites ADD COLUMN IF NOT EXISTS heatmap_enabled BOOLEAN DEFAULT false;
ALTER TABLE websites ADD COLUMN IF NOT EXISTS session_recording_enabled BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_heatmap_events_website_id ON heatmap_events(website_id);
CREATE INDEX IF NOT EXISTS idx_heatmap_events_event_type ON heatmap_events(event_type);
CREATE INDEX IF NOT EXISTS idx_heatmap_events_created_at ON heatmap_events(created_at);
CREATE INDEX IF NOT EXISTS idx_heatmap_events_session_id ON heatmap_events(session_id);

-- Enable RLS
ALTER TABLE heatmap_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for heatmap_events
CREATE POLICY "Users can view their own heatmap events" ON heatmap_events
  FOR SELECT USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own heatmap events" ON heatmap_events
  FOR INSERT WITH CHECK (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own heatmap events" ON heatmap_events
  FOR UPDATE USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own heatmap events" ON heatmap_events
  FOR DELETE USING (
    website_id IN (
      SELECT id FROM websites WHERE user_id = auth.uid()
    )
  ); 