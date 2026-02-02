import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const createSupabaseClient = (url: string, anonKey: string) => {
  supabaseInstance = createClient(url, anonKey);
  return supabaseInstance;
};

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    throw new Error('Supabase not initialized. Please connect first.');
  }
  return supabaseInstance;
};

export const clearSupabase = () => {
  supabaseInstance = null;
};
