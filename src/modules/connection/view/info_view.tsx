

import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { useToolbar } from '@/hooks/useToolbar';

export default function InfoView() {
  const setupSQL = `-- Daily Routine Database Setup
-- Copy and paste this into Supabase SQL Editor

create table if not exists routines (
  id uuid primary key default gen_random_uuid(),
  activity text not null,
  repeat_every int[] not null,
  description text,
  user_id uuid references auth.users(id),
  created_at timestamp default now()
);

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

alter table routines enable row level security;
alter table actual_activity enable row level security;

drop policy if exists "user routines" on routines;
create policy "user routines"
  on routines
  for all
  using (user_id = auth.uid());

drop policy if exists "user activity" on actual_activity;
create policy "user activity"
  on actual_activity
  for all
  using (user_id = auth.uid());`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(setupSQL);
    Alert.alert('Copied!', 'Setup SQL copied to clipboard', [{ text: 'OK' }]);
  };

  useToolbar({
    title: 'Connection Info',
  })

  return (
    <>
      <View className="flex-1 p-4">
        <Text variant="header" className="mb-4">Database Setup</Text>

        <Text className="mb-4">
          Follow these steps to setup your Supabase database:
        </Text>

        <View className="mb-4 space-y-2">
          <Text>1. Open your Supabase Dashboard</Text>
          <Text>2. Go to SQL Editor → New Query</Text>
          <Text>3. Copy the SQL below and paste it there</Text>
          <Text>4. Click "Run" button</Text>
          <Text>5. Return to Connection screen and retry</Text>
        </View>

        <Button onPress={handleCopy} className="mb-4">
          📋 Copy SQL to Clipboard
        </Button>

        <ScrollView className="flex-1 bg-gray-900 p-4 rounded-lg">
          <Text className="text-white font-mono text-sm">
            {setupSQL}
          </Text>
        </ScrollView>
      </View>
    </>
  );
}
