-- Fix security issues and enhance admin capabilities

-- Create function with proper search path
CREATE OR REPLACE FUNCTION public.admin_assign_user_to_hotel(
  target_user_id UUID,
  target_hotel_id UUID,
  user_role TEXT DEFAULT 'viewer'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if current user is super admin
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin role required.';
  END IF;

  -- Validate role
  IF user_role NOT IN ('super_admin', 'admin', 'manager', 'viewer') THEN
    RAISE EXCEPTION 'Invalid role. Must be super_admin, admin, manager, or viewer.';
  END IF;

  -- Insert or update user hotel assignment
  INSERT INTO public.user_hotels (user_id, hotel_id, role)
  VALUES (target_user_id, target_hotel_id, user_role)
  ON CONFLICT (user_id, hotel_id) 
  DO UPDATE SET role = EXCLUDED.role, created_at = now();
END;
$function$;

-- Create function to remove user from hotel
CREATE OR REPLACE FUNCTION public.admin_remove_user_from_hotel(
  target_user_id UUID,
  target_hotel_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if current user is super admin
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin role required.';
  END IF;

  -- Remove user hotel assignment
  DELETE FROM public.user_hotels 
  WHERE user_id = target_user_id AND hotel_id = target_hotel_id;
END;
$function$;

-- Create user profiles table for better user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  position TEXT,
  department TEXT,
  hire_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view all profiles if they are super admin"
ON public.profiles FOR SELECT
USING (public.is_super_admin());

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Super admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.is_super_admin());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Allow users to manage user_hotels assignments (for super admins)
CREATE POLICY "Super admins can manage user hotel assignments"
ON public.user_hotels FOR ALL
USING (public.is_super_admin());

-- Insert sample profiles for testing
INSERT INTO public.profiles (user_id, full_name, email, position, status) VALUES
(gen_random_uuid(), 'System Admin', 'admin@hotel.com', 'System Administrator', 'active'),
(gen_random_uuid(), 'Hotel Manager', 'manager@hotel.com', 'General Manager', 'active')
ON CONFLICT (user_id) DO NOTHING;