-- First, let's delete the existing demo user if it exists
DELETE FROM auth.users WHERE email = 'demo@hotel.com';

-- Create a new demo user with proper password
-- Note: We'll need to create this user through the auth API instead
-- Let's just ensure our database structure is ready for when the user signs up

-- Ensure the user_hotels table exists and has proper data
INSERT INTO user_hotels (user_id, hotel_id, role) 
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid as user_id,
  id as hotel_id,
  'admin' as role
FROM hotels
ON CONFLICT (user_id, hotel_id) DO NOTHING;