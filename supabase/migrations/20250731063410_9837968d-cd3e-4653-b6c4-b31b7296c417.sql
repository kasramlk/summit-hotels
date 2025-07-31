-- Phase 1: Enhanced Database Schema

-- Create guests table
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  nationality VARCHAR(50),
  date_of_birth DATE,
  guest_type VARCHAR(50) DEFAULT 'individual', -- individual, corporate, group
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create room types and rooms
CREATE TABLE public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL, -- Standard, Deluxe, Suite, Presidential
  base_rate DECIMAL(10,2) NOT NULL,
  max_occupancy INTEGER NOT NULL,
  amenities TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  room_type_id UUID REFERENCES public.room_types(id) ON DELETE CASCADE,
  room_number VARCHAR(10) NOT NULL,
  floor_number INTEGER,
  status VARCHAR(20) DEFAULT 'available', -- available, occupied, maintenance, out_of_order
  last_maintenance DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hotel_id, room_number)
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_source VARCHAR(50) DEFAULT 'direct', -- direct, booking.com, expedia, agoda, corporate
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'confirmed', -- pending, confirmed, checked_in, checked_out, cancelled, no_show
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  special_requests TEXT,
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, refunded, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table for financial tracking
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- room_charge, tax, fee, refund, payment
  payment_method VARCHAR(50), -- cash, credit_card, debit_card, bank_transfer, online
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guest satisfaction surveys
CREATE TABLE public.guest_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  room_rating INTEGER CHECK (room_rating >= 1 AND room_rating <= 5),
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  comments TEXT,
  would_recommend BOOLEAN,
  survey_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table for operational metrics
CREATE TABLE public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  department VARCHAR(50) NOT NULL, -- front_desk, housekeeping, maintenance, food_beverage, management
  position VARCHAR(100) NOT NULL,
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active', -- active, inactive, terminated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create operational metrics table
CREATE TABLE public.operational_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  rooms_cleaned INTEGER DEFAULT 0,
  maintenance_requests INTEGER DEFAULT 0,
  maintenance_completed INTEGER DEFAULT 0,
  energy_consumption DECIMAL(10,2), -- kWh
  water_consumption DECIMAL(10,2), -- liters
  staff_hours_worked DECIMAL(10,2),
  guest_complaints INTEGER DEFAULT 0,
  guest_compliments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hotel_id, metric_date)
);

-- Create food & beverage revenue tracking
CREATE TABLE public.fb_revenue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  revenue_date DATE NOT NULL,
  restaurant_revenue DECIMAL(10,2) DEFAULT 0,
  bar_revenue DECIMAL(10,2) DEFAULT 0,
  room_service_revenue DECIMAL(10,2) DEFAULT 0,
  event_catering_revenue DECIMAL(10,2) DEFAULT 0,
  total_covers INTEGER DEFAULT 0, -- number of guests served
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hotel_id, revenue_date)
);

-- Create billing information table
CREATE TABLE public.billing_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  card_holder_name VARCHAR(100) NOT NULL,
  card_number_encrypted TEXT NOT NULL, -- Store encrypted/tokenized card number
  card_last_four VARCHAR(4) NOT NULL,
  card_expiry VARCHAR(7) NOT NULL, -- MM/YYYY format
  card_brand VARCHAR(20), -- Visa, MasterCard, Amex, etc.
  billing_address TEXT,
  billing_city VARCHAR(100),
  billing_country VARCHAR(100),
  billing_postal_code VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fb_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for hotel-based access
CREATE POLICY "Users can view guests for their hotels" ON public.guests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels uh 
    JOIN public.bookings b ON b.guest_id = guests.id 
    WHERE uh.user_id = auth.uid() AND uh.hotel_id = b.hotel_id
  )
);

CREATE POLICY "Users can manage room types for their hotels" ON public.room_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = room_types.hotel_id
  )
);

CREATE POLICY "Users can manage rooms for their hotels" ON public.rooms
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = rooms.hotel_id
  )
);

CREATE POLICY "Users can view bookings for their hotels" ON public.bookings
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = bookings.hotel_id
  )
);

CREATE POLICY "Users can view transactions for their hotels" ON public.transactions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = transactions.hotel_id
  )
);

CREATE POLICY "Users can view surveys for their hotels" ON public.guest_surveys
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = guest_surveys.hotel_id
  )
);

CREATE POLICY "Users can manage staff for their hotels" ON public.staff
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = staff.hotel_id
  )
);

CREATE POLICY "Users can view operational metrics for their hotels" ON public.operational_metrics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = operational_metrics.hotel_id
  )
);

CREATE POLICY "Users can view FB revenue for their hotels" ON public.fb_revenue
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = fb_revenue.hotel_id
  )
);

CREATE POLICY "Users can manage their billing info" ON public.billing_info
FOR ALL USING (user_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_info_updated_at
  BEFORE UPDATE ON public.billing_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();