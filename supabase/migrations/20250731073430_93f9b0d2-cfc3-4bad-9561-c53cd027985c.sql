-- First, let's see what roles currently exist
-- Update any invalid roles to 'admin' before adding the constraint
UPDATE public.user_hotels SET role = 'admin' WHERE role NOT IN ('viewer', 'admin', 'super_admin');

-- Now add the constraint
ALTER TABLE public.user_hotels ADD CONSTRAINT user_hotels_role_check CHECK (role IN ('viewer', 'admin', 'super_admin'));

-- Create admin profiles table for additional admin data
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  position TEXT,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_profiles
CREATE POLICY "Super admins can manage admin profiles" 
ON public.admin_profiles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_hotels 
  WHERE user_id = auth.uid() AND role = 'super_admin'
));

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_hotels.user_id = $1 AND role = 'super_admin'
  );
$$;

-- Create trigger for admin_profiles updated_at
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();