import { Tabs } from 'expo-router';
import { Activity, LayoutDashboard, ListTodo, Settings } from 'lucide-react-native';

export default function HomeLayout() {

  return (
    <Tabs>
      <Tabs.Screen name="dashboard" options={{ title: 'Home', tabBarIcon: (dt) => <LayoutDashboard {...dt} /> }} />
      <Tabs.Screen name="rutinity" options={{ title: 'Rutinity', tabBarIcon: (dt) => <ListTodo {...dt} /> }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity', tabBarIcon: (dt) => <Activity {...dt} /> }} />
      <Tabs.Screen name="setting" options={{ title: 'Setting', tabBarIcon: (dt) => <Settings {...dt} /> }} />
    </Tabs>
  );
}
