import { useState } from 'react';
import { useForm as useFormHook } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSupabaseClient } from '@/lib/supabase';
import { useConnection } from '../store/connection';
import { Alert } from 'react-native';
import { router } from 'expo-router';

const validationSchema = z.object({
  supabase_url: z.string().url('Invalid URL').min(1, 'Supabase URL is required'),
  anon_key: z.string().min(12, 'Anon Key is required'),
});

type FormValues = z.infer<typeof validationSchema>;

export function useForm() {
  const { setConnection, isConnected } = useConnection();
  const [isLoading, setIsLoading] = useState(false);

  const handler = useFormHook<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      supabase_url: 'https://cpotonednphaidvzvxru.supabase.co',
      // supabase_url: '',
      anon_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwb3RvbmVkbnBoYWlkdnp2eHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDk5MTgsImV4cCI6MjA4NTUyNTkxOH0.Ur8CP-HFF43o5YCPU7aUdn7rkFacokdC7CA2eqz0kb4',
      // anon_key: '',
    }
  });

  const checkTablesExist = async (supabase: any) => {
    try {
      // Cek routines table
      const { error: routinesError } = await supabase
        .from('routines')
        .select('id')
        .limit(1);

      // Cek actual_activity table
      const { error: activityError } = await supabase
        .from('actual_activity')
        .select('id')
        .limit(1);

      // Jika kedua table ga error, berarti exist
      const tablesExist = !routinesError && !activityError;

      return {
        tablesExist,
        missingTables: [
          routinesError ? 'routines' : null,
          activityError ? 'actual_activity' : null
        ].filter(Boolean)
      };
    } catch (error) {
      return { tablesExist: false, missingTables: ['routines', 'actual_activity'] };
    }
  };

  const handleSubmit = handler.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // 1. Create Supabase client
      const supabase = createSupabaseClient(
        data.supabase_url,
        data.anon_key
      );

      // 2. Test connection basic (coba query apapun)
      try {
        await supabase.auth.getSession();
      } catch (error: any) {
        throw new Error('Invalid Supabase URL or Anon Key. Please check your credentials.');
      }

      // 3. Check if tables exist
      const { tablesExist, missingTables } = await checkTablesExist(supabase);

      if (!tablesExist) {
        // Tables belum ada, minta user setup manual
        Alert.alert(
          '⚠️ Database Setup Required',
          `Missing tables: ${missingTables.join(', ')}\n\n` +
          'Please run the setup SQL in your Supabase SQL Editor first.\n\n' +
          'Steps:\n' +
          '1. Go to your Supabase Dashboard\n' +
          '2. Click "SQL Editor" → "New Query"\n' +
          '3. Copy and paste the setup SQL\n' +
          '4. Click "Run"\n' +
          '5. Come back here and tap "Retry"',
          [
            {
              text: 'Show Setup SQL',
              onPress: () => {
                // Tampilkan SQL di alert atau navigate ke screen khusus
                Alert.alert(
                  'Setup SQL',
                  'Copy this SQL and run it in Supabase SQL Editor:\n\n' +
                  getSetupSQL(),
                  [{ text: 'OK' }]
                );
              }
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
        return;
      }

      // 4. Tables exist, save connection
      setConnection(data.supabase_url, data.anon_key);
      router.push('/(home)/dashboard');
      Alert.alert(
        '✅ Success',
        'Successfully connected to your Supabase database!',
        [{ text: 'OK' }]
      );

    } catch (error: any) {
      Alert.alert(
        '❌ Connection Failed',
        error.message || 'Failed to connect. Please check your URL and Anon Key.',
        [{ text: 'OK' }]
      );
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  });

  return { handler, handleSubmit, isLoading };
}

// Helper: Get setup SQL
const getSetupSQL = () => {
  return `-- Daily Routine Database Setup
-- Copy and paste this into Supabase SQL Editor

-- Create routines table
create table if not exists routines (
  id uuid primary key default gen_random_uuid(),
  activity text not null,
  repeat_every int[] not null,
  description text,
  user_id uuid references auth.users(id),
  created_at timestamp default now()
);

-- Create actual_activity table
create table if not exists actual_activity (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  point int not null,
  percentage numeric(5,2) not null,
  total_routines int not null,
  user_id uuid references auth.users(id),
  created_at timestamp default now(),
  unique (date, user_id)
);

-- Enable Row Level Security
alter table routines enable row level security;
alter table actual_activity enable row level security;

-- Create RLS policies for routines
drop policy if exists "user routines" on routines;
create policy "user routines"
  on routines
  for all
  using (user_id = auth.uid());

-- Create RLS policies for actual_activity
drop policy if exists "user activity" on actual_activity;
create policy "user activity"
  on actual_activity
  for all
  using (user_id = auth.uid());`;
};
