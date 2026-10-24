import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yblwdprzljhpqkzdvklq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HJNIMVlRaFoi6OdR5ynOHw_IpvhrENQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
