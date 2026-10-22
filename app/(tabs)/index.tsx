import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/AppContext';
import { Screen } from '../../src/Screen';
import { cardShadow, colors } from '../../src/theme';

export default function Home() {
  const router = useRouter();
  const { photos, place } = useApp();
  const os = Platform.OS === 'ios' ? 'iOS' : 'Android';

  const items = [
    { icon: 'camera' as const, title: 'Fotos', value: `${photos.length} guardadas`, go: '/camera' as const },
    {
      icon: 'location' as const,
      title: 'Último lugar',
      value: place ? place.label : 'Aún sin registrar',
      go: '/location' as const,
    },
    { icon: 'speedometer' as const, title: 'Nivel de burbuja', value: 'Usa el acelerómetro', go: '/level' as const },
  ];

  return (
    <Screen title="Ruta Viva" subtitle="Tu bitácora de campo en el bolsillo">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 20 }}>
        {items.map((it) => (
          <Pressable key={it.title} onPress={() => router.push(it.go)} style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
            <View style={styles.iconBox}>
              <Ionicons name={it.icon} size={26} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{it.title}</Text>
              <Text style={styles.cardValue} numberOfLines={2}>{it.value}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </Pressable>
        ))}

        <View style={[styles.card, { flexDirection: 'column', alignItems: 'flex-start', gap: 4 }]}>
          <Text style={styles.cardTitle}>Este dispositivo</Text>
          <Text style={styles.cardValue}>Sistema: {os} {String(Platform.Version)}</Text>
          <Text style={styles.cardValue}>Versión de la app: {Constants.expoConfig?.version ?? '1.0.0'}</Text>
          <Text style={styles.cardValue}>
            {Platform.OS === 'ios'
              ? 'Mapas: se abrirá Apple Maps.'
              : 'Mapas: se abrirá la app de mapas de Android.'}
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...cardShadow,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.ink },
  cardValue: { fontSize: 14, color: colors.muted, marginTop: 2 },
});
