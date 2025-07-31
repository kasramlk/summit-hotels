-- Fix RLS security issues for existing tables

-- Enable RLS on existing tables that were missing it
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hotels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for existing tables
CREATE POLICY "Users can view hotels they have access to" ON public.hotels
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = hotels.id
  )
);

CREATE POLICY "Users can view metrics for their hotels" ON public.hotel_metrics
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = hotel_metrics.hotel_id
  )
);

CREATE POLICY "Users can view comparisons for their hotels" ON public.hotel_comparisons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = hotel_comparisons.hotel_id
  )
);

CREATE POLICY "Users can view sales channels for their hotels" ON public.sales_channels
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_hotels 
    WHERE user_id = auth.uid() AND hotel_id = sales_channels.hotel_id
  )
);

CREATE POLICY "Users can view their hotel associations" ON public.user_hotels
FOR SELECT USING (user_id = auth.uid());

-- Fix the function search path issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;