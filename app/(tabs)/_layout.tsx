import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../src/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const tab = (title: string, on: IconName, off: IconName) => ({
  title,
  tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => (
    <Ionicons name={focused ? on : off} size={24} color={color} />
  ),
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: colors.line,
          // iOS necesita más alto por la barra home; Android respeta la barra de navegación
          height: (Platform.OS === 'ios' ? 54 : 60) + insets.bottom,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 8),
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={tab('Inicio', 'compass', 'compass-outline')} />
      <Tabs.Screen name="camera" options={tab('Fotos', 'camera', 'camera-outline')} />
      <Tabs.Screen name="location" options={tab('Lugar', 'location', 'location-outline')} />
      <Tabs.Screen name="level" options={tab('Nivel', 'speedometer', 'speedometer-outline')} />
    </Tabs>
  );
}
