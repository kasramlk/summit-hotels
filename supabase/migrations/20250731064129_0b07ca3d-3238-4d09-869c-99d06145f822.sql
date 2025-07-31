-- Generate comprehensive test data for the hotel dashboard

-- First, let's insert some additional hotels with diverse characteristics
INSERT INTO public.hotels (id, name, location, description) VALUES
-- Urban Business Hotels
('550e8400-e29b-41d4-a716-446655440001', 'Metropolitan Business Center', 'New York, NY', 'Luxury business hotel in the heart of Manhattan'),
('550e8400-e29b-41d4-a716-446655440002', 'Downtown Executive Suites', 'Chicago, IL', 'Modern executive hotel with conference facilities'),
('550e8400-e29b-41d4-a716-446655440003', 'City Plaza Hotel', 'San Francisco, CA', 'Contemporary urban hotel near financial district'),

-- Resort Hotels
('550e8400-e29b-41d4-a716-446655440004', 'Oceanview Resort & Spa', 'Miami Beach, FL', 'Beachfront luxury resort with full spa services'),
('550e8400-e29b-41d4-a716-446655440005', 'Tropical Paradise Resort', 'Maui, HI', 'Island paradise with ocean views and tropical gardens'),
('550e8400-e29b-41d4-a716-446655440006', 'Alpine Mountain Lodge', 'Aspen, CO', 'Mountain retreat with ski-in/ski-out access'),

-- Boutique Hotels
('550e8400-e29b-41d4-a716-446655440007', 'Historic Grand Palace', 'Charleston, SC', 'Restored 19th-century mansion with period charm'),
('550e8400-e29b-41d4-a716-446655440008', 'Artisan Boutique Hotel', 'Portland, OR', 'Locally-inspired design with artisan touches'),
('550e8400-e29b-41d4-a716-446655440009', 'Riverside Luxury Suites', 'Austin, TX', 'Modern boutique suites overlooking the river'),

-- Budget/Express Hotels
('550e8400-e29b-41d4-a716-446655440010', 'Airport Express Inn', 'Atlanta, GA', 'Convenient airport hotel with shuttle service'),
('550e8400-e29b-41d4-a716-446655440011', 'Highway Comfort Lodge', 'Phoenix, AZ', 'Budget-friendly with essential amenities'),
('550e8400-e29b-41d4-a716-446655440012', 'City Center Budget Inn', 'Las Vegas, NV', 'Value hotel in downtown location');

-- Create room types for different hotels
INSERT INTO public.room_types (hotel_id, name, base_rate, max_occupancy, amenities, description) VALUES
-- Metropolitan Business Center
('550e8400-e29b-41d4-a716-446655440001', 'Standard Business', 289.00, 2, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron'], 'Comfortable business room with city view'),
('550e8400-e29b-41d4-a716-446655440001', 'Deluxe Executive', 389.00, 2, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron', 'City View', 'Minibar'], 'Spacious executive room with premium amenities'),
('550e8400-e29b-41d4-a716-446655440001', 'Executive Suite', 589.00, 4, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron', 'City View', 'Minibar', 'Living Area', 'Executive Lounge Access'], 'Luxury suite with separate living area'),
('550e8400-e29b-41d4-a716-446655440001', 'Presidential Suite', 1289.00, 6, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron', 'City View', 'Minibar', 'Living Area', 'Executive Lounge Access', 'Butler Service', 'Dining Room'], 'Ultimate luxury with panoramic city views'),

-- Oceanview Resort & Spa
('550e8400-e29b-41d4-a716-446655440004', 'Standard Ocean View', 329.00, 2, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access'], 'Ocean view room with private balcony'),
('550e8400-e29b-41d4-a716-446655440004', 'Deluxe Beachfront', 429.00, 2, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access', 'Minibar', 'Spa Access'], 'Beachfront room with spa access'),
('550e8400-e29b-41d4-a716-446655440004', 'Ocean Suite', 729.00, 4, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access', 'Minibar', 'Spa Access', 'Living Area', 'Kitchen'], 'Spacious suite with kitchen and living area'),
('550e8400-e29b-41d4-a716-446655440004', 'Presidential Villa', 1589.00, 8, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access', 'Minibar', 'Spa Access', 'Living Area', 'Kitchen', 'Private Beach', 'Butler Service'], 'Luxury villa with private beach access'),

-- Alpine Mountain Lodge
('550e8400-e29b-41d4-a716-446655440006', 'Standard Mountain View', 259.00, 2, ARRAY['WiFi', 'Fireplace', 'Coffee Maker', 'Ski Storage'], 'Cozy mountain room with fireplace'),
('550e8400-e29b-41d4-a716-446655440006', 'Deluxe Ski-In/Ski-Out', 359.00, 2, ARRAY['WiFi', 'Fireplace', 'Coffee Maker', 'Ski Storage', 'Balcony', 'Hot Tub Access'], 'Direct slope access with hot tub'),
('550e8400-e29b-41d4-a716-446655440006', 'Mountain Suite', 559.00, 4, ARRAY['WiFi', 'Fireplace', 'Coffee Maker', 'Ski Storage', 'Balcony', 'Hot Tub Access', 'Kitchen', 'Living Area'], 'Family suite with full kitchen'),

-- Airport Express Inn (Budget)
('550e8400-e29b-41d4-a716-446655440010', 'Standard Double', 89.00, 2, ARRAY['WiFi', 'Coffee Maker', 'Shuttle Service'], 'Comfortable double room'),
('550e8400-e29b-41d4-a716-446655440010', 'Business King', 119.00, 2, ARRAY['WiFi', 'Coffee Maker', 'Shuttle Service', 'Desk'], 'King room with work desk');

-- Create rooms for hotels (focusing on a few hotels for detailed data)
INSERT INTO public.rooms (hotel_id, room_type_id, room_number, floor_number, status) 
SELECT 
  rt.hotel_id,
  rt.id,
  (floor_num || LPAD((room_num)::text, 2, '0'))::text as room_number,
  floor_num,
  CASE 
    WHEN random() < 0.05 THEN 'maintenance'
    WHEN random() < 0.02 THEN 'out_of_order' 
    ELSE 'available'
  END as status
FROM public.room_types rt
CROSS JOIN generate_series(1, 8) as floor_num
CROSS JOIN generate_series(1, 12) as room_num
WHERE rt.hotel_id IN (
  '550e8400-e29b-41d4-a716-446655440001', -- Metropolitan Business Center
  '550e8400-e29b-41d4-a716-446655440004', -- Oceanview Resort
  '550e8400-e29b-41d4-a716-446655440006', -- Alpine Mountain Lodge
  '550e8400-e29b-41d4-a716-446655440010'  -- Airport Express Inn
);

-- Generate realistic guests
INSERT INTO public.guests (first_name, last_name, email, phone, nationality, date_of_birth, guest_type) VALUES
('John', 'Smith', 'john.smith@email.com', '+1-555-0101', 'USA', '1985-03-15', 'individual'),
('Sarah', 'Johnson', 'sarah.johnson@email.com', '+1-555-0102', 'USA', '1990-07-22', 'individual'),
('Michael', 'Brown', 'michael.brown@email.com', '+1-555-0103', 'USA', '1978-11-08', 'corporate'),
('Emily', 'Davis', 'emily.davis@email.com', '+1-555-0104', 'USA', '1992-05-12', 'individual'),
('David', 'Wilson', 'david.wilson@email.com', '+1-555-0105', 'USA', '1983-09-28', 'corporate'),
('Lisa', 'Anderson', 'lisa.anderson@email.com', '+1-555-0106', 'Canada', '1987-01-18', 'individual'),
('Robert', 'Taylor', 'robert.taylor@email.com', '+1-555-0107', 'USA', '1975-12-03', 'corporate'),
('Jennifer', 'Thomas', 'jennifer.thomas@email.com', '+1-555-0108', 'USA', '1989-08-14', 'individual'),
('James', 'Jackson', 'james.jackson@email.com', '+1-555-0109', 'UK', '1986-04-27', 'individual'),
('Maria', 'Garcia', 'maria.garcia@email.com', '+1-555-0110', 'Spain', '1991-06-09', 'individual'),
('William', 'Martinez', 'william.martinez@email.com', '+1-555-0111', 'USA', '1984-10-21', 'corporate'),
('Jessica', 'Robinson', 'jessica.robinson@email.com', '+1-555-0112', 'USA', '1993-02-16', 'individual'),
('Christopher', 'Clark', 'christopher.clark@email.com', '+1-555-0113', 'Canada', '1980-07-30', 'corporate'),
('Amanda', 'Rodriguez', 'amanda.rodriguez@email.com', '+1-555-0114', 'USA', '1988-12-05', 'individual'),
('Daniel', 'Lewis', 'daniel.lewis@email.com', '+1-555-0115', 'Australia', '1982-03-19', 'individual'),
('Ashley', 'Lee', 'ashley.lee@email.com', '+1-555-0116', 'USA', '1994-09-11', 'individual'),
('Matthew', 'Walker', 'matthew.walker@email.com', '+1-555-0117', 'USA', '1977-05-25', 'corporate'),
('Stephanie', 'Hall', 'stephanie.hall@email.com', '+1-555-0118', 'USA', '1990-11-02', 'individual'),
('Andrew', 'Allen', 'andrew.allen@email.com', '+1-555-0119', 'USA', '1985-08-17', 'corporate'),
('Michelle', 'Young', 'michelle.young@email.com', '+1-555-0120', 'France', '1989-01-28', 'individual');

-- Generate bookings for the past 12 months with seasonal patterns
INSERT INTO public.bookings (
  hotel_id, guest_id, room_id, check_in_date, check_out_date, 
  total_amount, booking_source, status, adults, children, payment_status
)
SELECT 
  r.hotel_id,
  g.id as guest_id,
  r.id as room_id,
  check_in_date,
  check_in_date + (1 + floor(random() * 6))::integer as check_out_date,
  rt.base_rate * (1 + floor(random() * 6)) * 
    CASE 
      WHEN EXTRACT(month FROM check_in_date) IN (6,7,8,12) THEN 1.4  -- High season
      WHEN EXTRACT(month FROM check_in_date) IN (3,4,5,9,10) THEN 1.1  -- Medium season
      ELSE 0.8  -- Low season
    END as total_amount,
  CASE floor(random() * 5)
    WHEN 0 THEN 'direct'
    WHEN 1 THEN 'booking.com'
    WHEN 2 THEN 'expedia'
    WHEN 3 THEN 'agoda'
    ELSE 'corporate'
  END as booking_source,
  CASE 
    WHEN check_in_date < CURRENT_DATE - INTERVAL '2 days' THEN 'checked_out'
    WHEN check_in_date < CURRENT_DATE THEN 'checked_in'
    WHEN random() < 0.05 THEN 'cancelled'
    WHEN random() < 0.02 THEN 'no_show'
    ELSE 'confirmed'
  END as status,
  1 + floor(random() * 3) as adults,
  floor(random() * 3) as children,
  CASE 
    WHEN random() < 0.9 THEN 'paid'
    WHEN random() < 0.05 THEN 'refunded'
    ELSE 'pending'
  END as payment_status
FROM public.rooms r
JOIN public.room_types rt ON r.room_type_id = rt.id
CROSS JOIN public.guests g
CROSS JOIN generate_series(
  CURRENT_DATE - INTERVAL '12 months',
  CURRENT_DATE + INTERVAL '3 months',
  INTERVAL '1 day'
) as check_in_date
WHERE 
  r.hotel_id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004', 
    '550e8400-e29b-41d4-a716-446655440006',
    '550e8400-e29b-41d4-a716-446655440010'
  )
  AND random() < 
    CASE 
      WHEN EXTRACT(dow FROM check_in_date) IN (5,6) THEN 0.008  -- Higher weekend occupancy
      WHEN EXTRACT(month FROM check_in_date) IN (6,7,8,12) THEN 0.006  -- High season
      WHEN EXTRACT(month FROM check_in_date) IN (3,4,5,9,10) THEN 0.004  -- Medium season
      ELSE 0.002  -- Low season
    END
LIMIT 5000;