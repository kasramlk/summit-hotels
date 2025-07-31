-- Simple fix for demo user data - insert user associations and sample data

-- Add user hotel associations for demo user
DO $$
DECLARE
    demo_user_id UUID;
    hotel_ids UUID[];
BEGIN
    -- Get demo user ID
    SELECT id INTO demo_user_id FROM auth.users WHERE email = 'kasra@demo.com';
    
    IF demo_user_id IS NOT NULL THEN
        -- Get hotel IDs
        SELECT ARRAY_AGG(id) INTO hotel_ids 
        FROM public.hotels 
        WHERE name IN ('Metropolitan Business Center', 'Oceanview Resort & Spa', 'Alpine Mountain Lodge', 'Airport Express Inn');
        
        -- Insert user hotel associations
        INSERT INTO public.user_hotels (user_id, hotel_id, role)
        SELECT demo_user_id, unnest(hotel_ids), 'manager'
        WHERE NOT EXISTS (
            SELECT 1 FROM public.user_hotels 
            WHERE user_id = demo_user_id AND hotel_id = unnest(hotel_ids)
        );
    END IF;
END $$;

-- Add sample sales channels
INSERT INTO public.sales_channels (hotel_id, channel_name, percentage) 
SELECT h.id, 'Direct Booking', 35 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, 'Booking.com', 25 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, 'Expedia', 20 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, 'Corporate', 15 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, 'Walk-in', 5 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center';

-- Add sample metrics data for the last 6 months
INSERT INTO public.hotel_metrics (hotel_id, month, revenue, expenses, profit, occupancy)
SELECT h.id, '2024-01', 450000, 300000, 150000, 85 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, '2023-12', 420000, 280000, 140000, 82 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, '2023-11', 380000, 250000, 130000, 78 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, '2023-10', 410000, 270000, 140000, 80 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, '2023-09', 440000, 290000, 150000, 83 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center'
UNION ALL
SELECT h.id, '2023-08', 480000, 320000, 160000, 87 FROM public.hotels h WHERE h.name = 'Metropolitan Business Center';