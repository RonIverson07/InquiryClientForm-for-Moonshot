import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // loads server/.env when you run from the server folder

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env');
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
