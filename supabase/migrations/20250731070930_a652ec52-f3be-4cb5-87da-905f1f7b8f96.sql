-- Fix demo user hotel associations and add sample data

-- First, ensure we have the user_hotels associations for the demo user
INSERT INTO public.user_hotels (user_id, hotel_id, role)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'kasra@demo.com'),
  h.id,
  'manager'
FROM public.hotels h
WHERE h.name IN (
  'Metropolitan Business Center',
  'Oceanview Resort & Spa', 
  'Alpine Mountain Lodge',
  'Airport Express Inn'
)
ON CONFLICT (user_id, hotel_id) DO NOTHING;

-- Add sample sales channels data for the hotels
INSERT INTO public.sales_channels (hotel_id, channel_name, percentage) 
SELECT h.id, channel, percentage
FROM public.hotels h
CROSS JOIN (
  VALUES 
    ('Direct Booking', 35),
    ('Booking.com', 25),
    ('Expedia', 20),
    ('Corporate', 15),
    ('Walk-in', 5)
) AS channels(channel, percentage)
WHERE h.name IN (
  'Metropolitan Business Center',
  'Oceanview Resort & Spa', 
  'Alpine Mountain Lodge',
  'Airport Express Inn'
)
ON CONFLICT DO NOTHING;

-- Ensure we have recent hotel_metrics data (last 12 months)
INSERT INTO public.hotel_metrics (hotel_id, month, revenue, expenses, profit, occupancy)
SELECT 
  h.id as hotel_id,
  TO_CHAR(month_date, 'YYYY-MM') as month,
  -- Different revenue patterns for each hotel type
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN 350000 + (random() * 100000)
    WHEN 'Oceanview Resort & Spa' THEN 550000 + (random() * 150000)
    WHEN 'Alpine Mountain Lodge' THEN 280000 + (random() * 120000)
    WHEN 'Airport Express Inn' THEN 180000 + (random() * 50000)
    ELSE 200000 + (random() * 80000)
  END as revenue,
  -- Expenses (60-70% of revenue)
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN (350000 + (random() * 100000)) * 0.65
    WHEN 'Oceanview Resort & Spa' THEN (550000 + (random() * 150000)) * 0.70
    WHEN 'Alpine Mountain Lodge' THEN (280000 + (random() * 120000)) * 0.68
    WHEN 'Airport Express Inn' THEN (180000 + (random() * 50000)) * 0.60
    ELSE (200000 + (random() * 80000)) * 0.65
  END as expenses,
  -- Profit (remaining after expenses)
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN (350000 + (random() * 100000)) * 0.35
    WHEN 'Oceanview Resort & Spa' THEN (550000 + (random() * 150000)) * 0.30
    WHEN 'Alpine Mountain Lodge' THEN (280000 + (random() * 120000)) * 0.32
    WHEN 'Airport Express Inn' THEN (180000 + (random() * 50000)) * 0.40
    ELSE (200000 + (random() * 80000)) * 0.35
  END as profit,
  -- Occupancy rates
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN 75 + (random() * 15)::integer
    WHEN 'Oceanview Resort & Spa' THEN 80 + (random() * 15)::integer
    WHEN 'Alpine Mountain Lodge' THEN 70 + (random() * 20)::integer
    WHEN 'Airport Express Inn' THEN 85 + (random() * 10)::integer
    ELSE 72 + (random() * 18)::integer
  END as occupancy
FROM public.hotels h
CROSS JOIN generate_series(
  CURRENT_DATE - INTERVAL '12 months',
  CURRENT_DATE,
  INTERVAL '1 month'
) as month_date
WHERE h.name IN (
  'Metropolitan Business Center',
  'Oceanview Resort & Spa', 
  'Alpine Mountain Lodge',
  'Airport Express Inn'
)
ON CONFLICT (hotel_id, month) DO UPDATE SET
  revenue = EXCLUDED.revenue,
  expenses = EXCLUDED.expenses,
  profit = EXCLUDED.profit,
  occupancy = EXCLUDED.occupancy;