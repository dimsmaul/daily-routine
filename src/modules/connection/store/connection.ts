import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { secureStorage } from '@/lib/secure-storage';
import { createSupabaseClient, clearSupabase } from '@/lib/supabase';

interface ConnectionState {
  supabase_url?: string;
  anon_key?: string;
  isConnected: boolean;

  setConnection: (url: string, key: string) => void;
  clearConnection: () => void;
  initializeConnection: () => void;
}

export const useConnection = create<ConnectionState>()(
  persist(
    (set, get) => ({
      supabase_url: undefined,
      anon_key: undefined,
      isConnected: false,

      setConnection: (url, key) => {
        createSupabaseClient(url, key);
        set({
          supabase_url: url,
          anon_key: key,
          isConnected: true,
        });
      },

      clearConnection: () => {
        clearSupabase();
        set({
          supabase_url: undefined,
          anon_key: undefined,
          isConnected: false,
        });
      },

      // Auto-initialize saat app start
      initializeConnection: () => {
        const { supabase_url, anon_key } = get();
        if (supabase_url && anon_key) {
          createSupabaseClient(supabase_url, anon_key);
          set({ isConnected: true });
        }
      },
    }),
    {
      name: 'connection-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
