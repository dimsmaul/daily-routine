import { Text } from '@/components/ui/text';
import { View, ActivityIndicator } from 'react-native';
import { useForm } from '../hooks/useForm';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useConnection } from '../store/connection';
import { Link } from 'expo-router';
import { Info } from 'lucide-react-native'
import { useThemeColors } from '@/hooks/useThemeColors';

export default function ConnectionView() {
  const { handler, handleSubmit, isLoading } = useForm();
  const { isConnected, clearConnection, supabase_url } = useConnection();
  const { colors } = useThemeColors()
  return (
    <View className="flex-1 items-center justify-center">
      <View className='flex flex-row items-center gap-2'>
        <Text variant='header'>Connection</Text>
        <Link href={'/connection/info'}>
          <Info size={20} color={colors.primary} />
        </Link>
      </View>

      {isConnected && (
        <View className="mb-4 p-4 bg-green-100 rounded-lg">
          <Text className="text-green-800">✓ Connected to Supabase</Text>
          <Text className="text-xs text-green-600 mt-1">{supabase_url}</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={clearConnection}
            className="mt-2"
          >
            Disconnect
          </Button>
        </View>
      )}

      <View className='w-full p-10'>
        <Form {...handler}>
          <View>
            <FormField
              control={handler.control}
              name="supabase_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supabase URL</FormLabel>
                  <Input
                    placeholder="https://xxxxx.supabase.co"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    size='sm'
                    editable={!isLoading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={handler.control}
              name="anon_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anon Key</FormLabel>
                  <Input
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    size='sm'
                    secureTextEntry
                    editable={!isLoading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                "Connect & Migrate"
              )}
            </Button>
          </View>
        </Form>
      </View>
    </View>
  );
}
