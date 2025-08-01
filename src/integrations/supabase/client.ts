// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yurmvwtzfobybhrqqjnf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cm12d3R6Zm9ieWJocnFxam5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4Nzc3NTcsImV4cCI6MjA2OTQ1Mzc1N30.DiUkjwKa4A3fnXncnKOUy7OGRMa2ja2yucdbGjvb5Sg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});