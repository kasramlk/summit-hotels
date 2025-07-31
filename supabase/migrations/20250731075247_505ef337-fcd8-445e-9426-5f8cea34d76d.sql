-- Create demo hotel first without conflict handling
DELETE FROM public.hotels WHERE id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
INSERT INTO public.hotels (id, name, location, description, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Grand Plaza Hotel', 'New York, NY', 'Luxury hotel in the heart of Manhattan', now());

-- Set up user roles
DELETE FROM public.user_hotels WHERE user_id IN ('b631bbb1-a2bd-4483-92cf-24550ffeece5'::uuid, 'ab925166-b4a5-469b-bf5b-437e327e5324'::uuid);
INSERT INTO public.user_hotels (user_id, hotel_id, role, created_at) VALUES
  ('b631bbb1-a2bd-4483-92cf-24550ffeece5'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'super_admin', now()),
  ('ab925166-b4a5-469b-bf5b-437e327e5324'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'admin', now());

-- Add sample data for charts and analytics
DELETE FROM public.hotel_metrics WHERE hotel_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
INSERT INTO public.hotel_metrics (hotel_id, month, revenue, expenses, profit, occupancy, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'January 2024', 125000, 75000, 50000, 85, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'February 2024', 135000, 78000, 57000, 88, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'March 2024', 145000, 82000, 63000, 92, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'April 2024', 155000, 85000, 70000, 89, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'May 2024', 165000, 88000, 77000, 94, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'June 2024', 175000, 92000, 83000, 96, now());

-- Add sales channel data
DELETE FROM public.sales_channels WHERE hotel_id = '550e8400-e29b-41d4-a716-446655440000'::uuid;
INSERT INTO public.sales_channels (hotel_id, channel_name, percentage, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Direct Booking', 45, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Booking.com', 25, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Expedia', 15, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Travel Agents', 10, now()),
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Other OTAs', 5, now());