import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '../src/AppContext';
import { colors } from '../src/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const item = (title: string, icon: IconName, extra = {}) => ({
  title,
  drawerLabel: title,
  drawerIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={icon} size={size} color={color} />,
  ...extra,
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <StatusBar style="light" />
        <Drawer
          screenOptions={{
            headerStyle: { backgroundColor: colors.primaryDark },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            drawerActiveTintColor: colors.primary,
            drawerActiveBackgroundColor: '#DDEBE6',
            drawerInactiveTintColor: colors.ink,
            drawerLabelStyle: { fontSize: 15, fontWeight: '600' },
          }}
        >
          <Drawer.Screen name="(tabs)" options={item('Ruta Viva', 'compass-outline', { headerShown: false })} />
          <Drawer.Screen name="drag" options={item('1. Arrastrar y rotar', 'move-outline')} />
          <Drawer.Screen name="loading" options={item('2. Animación de carga', 'sync-outline')} />
          <Drawer.Screen name="multitouch" options={item('3. Gestos multitáctiles', 'hand-left-outline')} />
          <Drawer.Screen name="bounce" options={item('4. Rebote', 'radio-button-on-outline')} />
          <Drawer.Screen name="carousel" options={item('5. Carrusel animado', 'albums-outline')} />
          <Drawer.Screen name="shake" options={item('6. Sacudir el celular', 'phone-portrait-outline')} />
        </Drawer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
