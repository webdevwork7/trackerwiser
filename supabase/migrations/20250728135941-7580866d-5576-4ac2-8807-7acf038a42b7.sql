
-- Create admin role and assign it to the admin user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data, aud, role)
VALUES (
  'admin-user-id-12345',
  'admin@gmail.com',
  crypt('admin@123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Admin User"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
INSERT INTO public.profiles (id, email, full_name)
VALUES ('admin-user-id-12345', 'admin@gmail.com', 'Admin User')
ON CONFLICT (id) DO NOTHING;

-- Create admin_users table to track admin access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_users
CREATE POLICY "Admins can manage admin_users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Insert admin user
INSERT INTO public.admin_users (user_id, email)
VALUES ('admin-user-id-12345', 'admin@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = $1
  );
$$;

-- Update RLS policies for admin access
DROP POLICY IF EXISTS "Admins can view all websites" ON public.websites;
CREATE POLICY "Admins can view all websites" ON public.websites
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics_events;
CREATE POLICY "Admins can view all analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE id = analytics_events.website_id 
      AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Admins can view all bot detections" ON public.bot_detections;
CREATE POLICY "Admins can view all bot detections" ON public.bot_detections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE id = bot_detections.website_id 
      AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    )
  );
