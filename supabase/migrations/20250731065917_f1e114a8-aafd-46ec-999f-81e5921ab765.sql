-- Generate comprehensive test data with proper UUID generation

-- Insert additional hotels with random UUIDs
INSERT INTO public.hotels (name, location, description) VALUES
-- Urban Business Hotels
('Metropolitan Business Center', 'New York, NY', 'Luxury business hotel in the heart of Manhattan'),
('Downtown Executive Suites', 'Chicago, IL', 'Modern executive hotel with conference facilities'),
('City Plaza Hotel', 'San Francisco, CA', 'Contemporary urban hotel near financial district'),

-- Resort Hotels
('Oceanview Resort & Spa', 'Miami Beach, FL', 'Beachfront luxury resort with full spa services'),
('Tropical Paradise Resort', 'Maui, HI', 'Island paradise with ocean views and tropical gardens'),
('Alpine Mountain Lodge', 'Aspen, CO', 'Mountain retreat with ski-in/ski-out access'),

-- Boutique Hotels
('Historic Grand Palace', 'Charleston, SC', 'Restored 19th-century mansion with period charm'),
('Artisan Boutique Hotel', 'Portland, OR', 'Locally-inspired design with artisan touches'),
('Riverside Luxury Suites', 'Austin, TX', 'Modern boutique suites overlooking the river'),

-- Budget/Express Hotels
('Airport Express Inn', 'Atlanta, GA', 'Convenient airport hotel with shuttle service'),
('Highway Comfort Lodge', 'Phoenix, AZ', 'Budget-friendly with essential amenities'),
('City Center Budget Inn', 'Las Vegas, NV', 'Value hotel in downtown location');

-- Get hotel IDs for room type creation
DO $$
DECLARE
    metro_id UUID;
    ocean_id UUID;
    alpine_id UUID;
    airport_id UUID;
BEGIN
    -- Get the hotel IDs
    SELECT id INTO metro_id FROM public.hotels WHERE name = 'Metropolitan Business Center';
    SELECT id INTO ocean_id FROM public.hotels WHERE name = 'Oceanview Resort & Spa';
    SELECT id INTO alpine_id FROM public.hotels WHERE name = 'Alpine Mountain Lodge';
    SELECT id INTO airport_id FROM public.hotels WHERE name = 'Airport Express Inn';
    
    -- Create room types for Metropolitan Business Center
    INSERT INTO public.room_types (hotel_id, name, base_rate, max_occupancy, amenities, description) VALUES
    (metro_id, 'Standard Business', 289.00, 2, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron'], 'Comfortable business room with city view'),
    (metro_id, 'Deluxe Executive', 389.00, 2, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron', 'City View', 'Minibar'], 'Spacious executive room with premium amenities'),
    (metro_id, 'Executive Suite', 589.00, 4, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron', 'City View', 'Minibar', 'Living Area', 'Executive Lounge Access'], 'Luxury suite with separate living area'),
    (metro_id, 'Presidential Suite', 1289.00, 6, ARRAY['WiFi', 'Desk', 'Coffee Maker', 'Iron', 'City View', 'Minibar', 'Living Area', 'Executive Lounge Access', 'Butler Service', 'Dining Room'], 'Ultimate luxury with panoramic city views');

    -- Create room types for Oceanview Resort & Spa
    INSERT INTO public.room_types (hotel_id, name, base_rate, max_occupancy, amenities, description) VALUES
    (ocean_id, 'Standard Ocean View', 329.00, 2, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access'], 'Ocean view room with private balcony'),
    (ocean_id, 'Deluxe Beachfront', 429.00, 2, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access', 'Minibar', 'Spa Access'], 'Beachfront room with spa access'),
    (ocean_id, 'Ocean Suite', 729.00, 4, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access', 'Minibar', 'Spa Access', 'Living Area', 'Kitchen'], 'Spacious suite with kitchen and living area'),
    (ocean_id, 'Presidential Villa', 1589.00, 8, ARRAY['WiFi', 'Balcony', 'Coffee Maker', 'Beach Access', 'Minibar', 'Spa Access', 'Living Area', 'Kitchen', 'Private Beach', 'Butler Service'], 'Luxury villa with private beach access');

    -- Create room types for Alpine Mountain Lodge
    INSERT INTO public.room_types (hotel_id, name, base_rate, max_occupancy, amenities, description) VALUES
    (alpine_id, 'Standard Mountain View', 259.00, 2, ARRAY['WiFi', 'Fireplace', 'Coffee Maker', 'Ski Storage'], 'Cozy mountain room with fireplace'),
    (alpine_id, 'Deluxe Ski-In/Ski-Out', 359.00, 2, ARRAY['WiFi', 'Fireplace', 'Coffee Maker', 'Ski Storage', 'Balcony', 'Hot Tub Access'], 'Direct slope access with hot tub'),
    (alpine_id, 'Mountain Suite', 559.00, 4, ARRAY['WiFi', 'Fireplace', 'Coffee Maker', 'Ski Storage', 'Balcony', 'Hot Tub Access', 'Kitchen', 'Living Area'], 'Family suite with full kitchen');

    -- Create room types for Airport Express Inn
    INSERT INTO public.room_types (hotel_id, name, base_rate, max_occupancy, amenities, description) VALUES
    (airport_id, 'Standard Double', 89.00, 2, ARRAY['WiFi', 'Coffee Maker', 'Shuttle Service'], 'Comfortable double room'),
    (airport_id, 'Business King', 119.00, 2, ARRAY['WiFi', 'Coffee Maker', 'Shuttle Service', 'Desk'], 'King room with work desk');
END $$;