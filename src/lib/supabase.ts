import { createClient } from '@supabase/supabase-js';

// Server-only client using service role key — never expose to browser
export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false } }
);
