-- Continue generating test data - rooms, guests, and bookings

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

-- Create rooms for the main hotels (50 rooms per hotel for good data variety)
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
CROSS JOIN generate_series(1, 5) as floor_num -- 5 floors
CROSS JOIN generate_series(1, 10) as room_num -- 10 rooms per floor
WHERE rt.hotel_id IN (
  SELECT id FROM public.hotels WHERE name IN (
    'Metropolitan Business Center',
    'Oceanview Resort & Spa', 
    'Alpine Mountain Lodge',
    'Airport Express Inn'
  )
);

-- Set up user hotel associations for the demo user
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
);

-- Generate enhanced hotel metrics with more realistic data for the past 18 months
INSERT INTO public.hotel_metrics (hotel_id, month, revenue, expenses, profit, occupancy)
SELECT 
  h.id as hotel_id,
  TO_CHAR(month_date, 'YYYY-MM') as month,
  -- Revenue varies by hotel type and seasonality
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN base_revenue * business_multiplier * seasonal_factor
    WHEN 'Oceanview Resort & Spa' THEN base_revenue * resort_multiplier * seasonal_factor * 1.5
    WHEN 'Alpine Mountain Lodge' THEN base_revenue * ski_multiplier * seasonal_factor
    WHEN 'Airport Express Inn' THEN base_revenue * budget_multiplier * seasonal_factor * 0.6
    ELSE base_revenue * seasonal_factor
  END as revenue,
  -- Expenses are typically 60-70% of revenue
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN (base_revenue * business_multiplier * seasonal_factor) * 0.65
    WHEN 'Oceanview Resort & Spa' THEN (base_revenue * resort_multiplier * seasonal_factor * 1.5) * 0.70
    WHEN 'Alpine Mountain Lodge' THEN (base_revenue * ski_multiplier * seasonal_factor) * 0.68
    WHEN 'Airport Express Inn' THEN (base_revenue * budget_multiplier * seasonal_factor * 0.6) * 0.60
    ELSE (base_revenue * seasonal_factor) * 0.65
  END as expenses,
  -- Profit is revenue minus expenses
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN (base_revenue * business_multiplier * seasonal_factor) * 0.35
    WHEN 'Oceanview Resort & Spa' THEN (base_revenue * resort_multiplier * seasonal_factor * 1.5) * 0.30
    WHEN 'Alpine Mountain Lodge' THEN (base_revenue * ski_multiplier * seasonal_factor) * 0.32
    WHEN 'Airport Express Inn' THEN (base_revenue * budget_multiplier * seasonal_factor * 0.6) * 0.40
    ELSE (base_revenue * seasonal_factor) * 0.35
  END as profit,
  -- Occupancy rates vary by hotel type and season
  CASE h.name
    WHEN 'Metropolitan Business Center' THEN LEAST(95, (70 + business_occupancy_boost + seasonal_occupancy)::integer)
    WHEN 'Oceanview Resort & Spa' THEN LEAST(95, (75 + resort_occupancy_boost + seasonal_occupancy)::integer)
    WHEN 'Alpine Mountain Lodge' THEN LEAST(95, (65 + ski_occupancy_boost + seasonal_occupancy)::integer)
    WHEN 'Airport Express Inn' THEN LEAST(95, (80 + budget_occupancy_boost + seasonal_occupancy)::integer)
    ELSE LEAST(95, (72 + seasonal_occupancy)::integer)
  END as occupancy
FROM public.hotels h
CROSS JOIN generate_series(
  CURRENT_DATE - INTERVAL '18 months',
  CURRENT_DATE,
  INTERVAL '1 month'
) as month_date
CROSS JOIN LATERAL (
  SELECT 
    200000 as base_revenue,
    -- Seasonal factors
    CASE 
      WHEN EXTRACT(month FROM month_date) IN (6,7,8,12) THEN 1.4  -- Peak season
      WHEN EXTRACT(month FROM month_date) IN (3,4,5,9,10) THEN 1.1  -- Medium season
      ELSE 0.8  -- Low season
    END as seasonal_factor,
    -- Hotel type multipliers
    (1.0 + random() * 0.3) as business_multiplier,
    (1.2 + random() * 0.4) as resort_multiplier,
    CASE 
      WHEN EXTRACT(month FROM month_date) IN (12,1,2,3) THEN (1.8 + random() * 0.5)  -- Ski season
      ELSE (0.4 + random() * 0.2)  -- Off season
    END as ski_multiplier,
    (0.7 + random() * 0.2) as budget_multiplier,
    -- Occupancy seasonal adjustments
    CASE 
      WHEN EXTRACT(month FROM month_date) IN (6,7,8) THEN 15  -- Summer boost
      WHEN EXTRACT(month FROM month_date) = 12 THEN 10  -- Holiday boost
      WHEN EXTRACT(month FROM month_date) IN (1,2) THEN -10  -- Winter decline
      ELSE 0
    END as seasonal_occupancy,
    -- Hotel-specific occupancy patterns
    CASE 
      WHEN EXTRACT(dow FROM month_date) IN (1,2,3,4) THEN 10  -- Business hotels weekday boost
      ELSE 0
    END as business_occupancy_boost,
    CASE 
      WHEN EXTRACT(month FROM month_date) IN (6,7,8,12) THEN 15  -- Resort peak season
      ELSE -5
    END as resort_occupancy_boost,
    CASE 
      WHEN EXTRACT(month FROM month_date) IN (12,1,2,3) THEN 20  -- Ski season
      ELSE -15
    END as ski_occupancy_boost,
    5 as budget_occupancy_boost  -- Budget hotels maintain steady occupancy
) factors
WHERE h.name IN (
  'Metropolitan Business Center',
  'Oceanview Resort & Spa', 
  'Alpine Mountain Lodge',
  'Airport Express Inn'
);