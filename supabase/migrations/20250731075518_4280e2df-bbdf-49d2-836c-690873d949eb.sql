-- Create admin functions for hotel management
CREATE OR REPLACE FUNCTION public.admin_create_hotel(
  hotel_name TEXT,
  hotel_location TEXT,
  hotel_description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_hotel_id UUID;
BEGIN
  -- Check if user is super admin
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin role required.';
  END IF;

  -- Insert new hotel
  INSERT INTO public.hotels (name, location, description)
  VALUES (hotel_name, hotel_location, hotel_description)
  RETURNING id INTO new_hotel_id;

  RETURN new_hotel_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_hotel(hotel_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is super admin
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Access denied. Super admin role required.';
  END IF;

  -- Delete hotel (cascade will handle related records)
  DELETE FROM public.hotels WHERE id = hotel_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Hotel not found.';
  END IF;
END;
$$;

-- Update RLS policies to allow super admins to manage hotels
DROP POLICY IF EXISTS "Users can view hotels they have access to" ON public.hotels;

CREATE POLICY "Users can view hotels they have access to" 
ON public.hotels 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = hotels.id
  ) OR public.is_super_admin()
);

CREATE POLICY "Super admins can manage hotels" 
ON public.hotels 
FOR ALL 
USING (public.is_super_admin());