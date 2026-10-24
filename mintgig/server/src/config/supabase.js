import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://yblwdprzljhpqkzdvklq.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_HJNIMVlRaFoi6OdR5ynOHw_IpvhrENQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
