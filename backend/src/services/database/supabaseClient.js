import { createClient } from '@supabase/supabase-js';
import config from '../../config/index.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  db: { schema: 'public' },
});

export const getSupabaseStatus = async () => {
  try {
    const { error } = await supabase.from('incidents').select('id', { count: 'exact', head: true });
    if (error) throw error;
    return { isConnected: true, error: null };
  } catch (err) {
    return { isConnected: false, error: err.message };
  }
};

export default supabase;
