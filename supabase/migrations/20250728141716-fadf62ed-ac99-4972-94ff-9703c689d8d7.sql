
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

-- Create policy for admin_users (allow admins to manage admin_users)
CREATE POLICY "Admins can manage admin_users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Insert admin user (this will be for admin@gmail.com when they sign up)
-- We'll handle this via the application logic instead of hardcoding

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
  ) OR EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = $1 AND email = 'admin@gmail.com'
  );
$$;

-- Update RLS policies for admin access on websites
DROP POLICY IF EXISTS "Admins can view all websites" ON public.websites;
CREATE POLICY "Admins can view all websites" ON public.websites
  FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin(auth.uid())
  );

-- Update RLS policies for admin access on analytics_events
DROP POLICY IF EXISTS "Admins can view all analytics" ON public.analytics_events;
CREATE POLICY "Admins can view all analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE id = analytics_events.website_id 
      AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    ) OR public.is_admin(auth.uid())
  );

-- Update RLS policies for admin access on bot_detections
DROP POLICY IF EXISTS "Admins can view all bot detections" ON public.bot_detections;
CREATE POLICY "Admins can view all bot detections" ON public.bot_detections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.websites 
      WHERE id = bot_detections.website_id 
      AND (user_id = auth.uid() OR public.is_admin(auth.uid()))
    ) OR public.is_admin(auth.uid())
  );

-- Allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR public.is_admin(auth.uid())
  );
