-- Create demo users for testing
-- First, let's create the demo users
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES 
  (
    'ab925166-b4a5-469b-bf5b-437e327e5324'::uuid,
    'demo@hotel.com',
    crypt('demo123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"email": "demo@hotel.com"}',
    false,
    'authenticated'
  ),
  (
    'b631bbb1-a2bd-4483-92cf-24550ffeece5'::uuid,
    'admin@hotel.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"email": "admin@hotel.com"}',
    false,
    'authenticated'
  )
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = now();

-- Create a demo hotel
INSERT INTO public.hotels (id, name, location, description, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Grand Plaza Hotel', 'New York, NY', 'Luxury hotel in the heart of Manhattan', now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  location = EXCLUDED.location,
  description = EXCLUDED.description;

-- Set up user roles: admin user as super_admin, demo user as admin for the hotel
INSERT INTO public.user_hotels (user_id, hotel_id, role, created_at) VALUES
  ('b631bbb1-a2bd-4483-92cf-24550ffeece5'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'super_admin', now()),
  ('ab925166-b4a5-469b-bf5b-437e327e5324'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'admin', now())
ON CONFLICT (user_id, hotel_id) DO UPDATE SET
  role = EXCLUDED.role;

-- Add sample data for charts and analytics
INSERT INTO public.hotel_metrics (hotel_id, month, revenue, expenses, profit, occupancy, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'January 2024', 125000, 75000, 50000, 85, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'February 2024', 135000, 78000, 57000, 88, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'March 2024', 145000, 82000, 63000, 92, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'April 2024', 155000, 85000, 70000, 89, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'May 2024', 165000, 88000, 77000, 94, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'June 2024', 175000, 92000, 83000, 96, now())
ON CONFLICT (hotel_id, month) DO UPDATE SET
  revenue = EXCLUDED.revenue,
  expenses = EXCLUDED.expenses,
  profit = EXCLUDED.profit,
  occupancy = EXCLUDED.occupancy;

-- Add sales channel data
INSERT INTO public.sales_channels (hotel_id, channel_name, percentage, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Direct Booking', 45, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Booking.com', 25, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Expedia', 15, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Travel Agents', 10, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Other OTAs', 5, now())
ON CONFLICT (hotel_id, channel_name) DO UPDATE SET
  percentage = EXCLUDED.percentage;

-- Add room types
INSERT INTO public.room_types (hotel_id, name, description, base_rate, max_occupancy, amenities, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Standard Room', 'Comfortable standard accommodation', 200.00, 2, ARRAY['WiFi', 'TV', 'Air Conditioning'], now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Deluxe Room', 'Spacious room with city view', 350.00, 3, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'City View'], now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Suite', 'Luxury suite with separate living area', 600.00, 4, ARRAY['WiFi', 'TV', 'Air Conditioning', 'Mini Bar', 'City View', 'Living Area', 'Kitchen'], now())
ON CONFLICT (hotel_id, name) DO NOTHING;

-- Add some sample bookings
INSERT INTO public.bookings (hotel_id, guest_id, check_in_date, check_out_date, adults, children, total_amount, status, booking_source, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, NULL, '2024-08-01', '2024-08-05', 2, 0, 800.00, 'confirmed', 'direct', now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, NULL, '2024-08-10', '2024-08-12', 2, 1, 700.00, 'confirmed', 'booking_com', now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, NULL, '2024-08-15', '2024-08-20', 4, 2, 1500.00, 'confirmed', 'expedia', now())
ON CONFLICT DO NOTHING;