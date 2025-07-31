-- Ensure the demo user has proper data access
DO $$
DECLARE
    demo_user_id UUID;
    metro_hotel_id UUID;
BEGIN
    -- Get demo user ID
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'kasra@demo.com';
    
    -- Get Metropolitan Business Center hotel ID
    SELECT id INTO metro_hotel_id FROM public.hotels WHERE name = 'Metropolitan Business Center';
    
    IF demo_user_id IS NOT NULL AND metro_hotel_id IS NOT NULL THEN
        -- Clear any existing data and start fresh
        DELETE FROM public.user_hotels WHERE user_id = demo_user_id;
        DELETE FROM public.sales_channels WHERE hotel_id = metro_hotel_id;
        DELETE FROM public.hotel_metrics WHERE hotel_id = metro_hotel_id;
        
        -- Insert user hotel association
        INSERT INTO public.user_hotels (user_id, hotel_id, role) 
        VALUES (demo_user_id, metro_hotel_id, 'manager');
        
        -- Insert sales channels data
        INSERT INTO public.sales_channels (hotel_id, channel_name, percentage) VALUES
        (metro_hotel_id, 'Direct Booking', 35),
        (metro_hotel_id, 'Booking.com', 25),
        (metro_hotel_id, 'Expedia', 20),
        (metro_hotel_id, 'Corporate', 15),
        (metro_hotel_id, 'Walk-in', 5);
        
        -- Insert hotel metrics for the past 12 months
        INSERT INTO public.hotel_metrics (hotel_id, month, revenue, expenses, profit, occupancy) VALUES
        (metro_hotel_id, '2024-01', 450000, 300000, 150000, 85),
        (metro_hotel_id, '2023-12', 420000, 280000, 140000, 82),
        (metro_hotel_id, '2023-11', 380000, 250000, 130000, 78),
        (metro_hotel_id, '2023-10', 410000, 270000, 140000, 80),
        (metro_hotel_id, '2023-09', 440000, 290000, 150000, 83),
        (metro_hotel_id, '2023-08', 480000, 320000, 160000, 87),
        (metro_hotel_id, '2023-07', 500000, 330000, 170000, 90),
        (metro_hotel_id, '2023-06', 460000, 310000, 150000, 88),
        (metro_hotel_id, '2023-05', 430000, 290000, 140000, 85),
        (metro_hotel_id, '2023-04', 400000, 270000, 130000, 82),
        (metro_hotel_id, '2023-03', 390000, 260000, 130000, 80),
        (metro_hotel_id, '2023-02', 370000, 250000, 120000, 78);
    END IF;
END $$;