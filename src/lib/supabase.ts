import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

// Server-only client using service role key — never expose to browser
// Node.js 20 lacks native WebSocket; pass the ws package as transport
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: { persistSession: false },
    realtime: { transport: ws },
  }
);
