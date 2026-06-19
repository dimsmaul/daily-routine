import { useToolbar } from '@/hooks/useToolbar';
import { Bell } from 'lucide-react-native';
import { View, Text } from 'react-native';

export default function RutinityView() {
  useToolbar({title: 'Rutinity', right: <Bell/>});
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold">Rutinity</Text>
    </View>
  );
}
