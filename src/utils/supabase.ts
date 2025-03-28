import { createClient } from '@supabase/supabase-js';
import { config } from '../config/config';

export const getSupabaseClient = () => createClient(config.supabaseURL!, config.supabaseAnonKey!);
