import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../src/Screen';
import { colors } from '../../src/theme';

const SIZE = 260;
const BUBBLE = 44;
const MAX = (SIZE - BUBBLE) / 2;
// Algunos dispositivos iOS entregan los ejes con signo contrario a Android.
// Si al probar la burbuja se mueve al revés, cambia este valor.
const AXIS_SIGN = Platform.OS === 'ios' ? -1 : 1;
const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

export default function LevelTab() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const wasLevel = useRef(false);

  useEffect(() => {
    // El acelerómetro no existe en navegadores de escritorio
    if (Platform.OS === 'web') {
      setAvailable(false);
      return;
    }
    let sub: { remove: () => void } | undefined;
    Accelerometer.isAvailableAsync()
      .then((ok) => {
        setAvailable(ok);
        if (!ok) return;
        Accelerometer.setUpdateInterval(50);
        sub = Accelerometer.addListener(({ x, y }) => {
          // Filtro suave para que la burbuja no tiemble
          smooth.current = {
            x: smooth.current.x * 0.8 + x * AXIS_SIGN * 0.2,
            y: smooth.current.y * 0.8 + y * AXIS_SIGN * 0.2,
          };
          setTilt({ ...smooth.current });
        });
      })
      .catch(() => setAvailable(false));
    return () => sub?.remove();
  }, []);

  // Ángulos en grados a partir de la gravedad (en unidades g)
  const degX = (Math.asin(clamp(tilt.x, 1)) * 180) / Math.PI;
  const degY = (Math.asin(clamp(tilt.y, 1)) * 180) / Math.PI;
  const isLevel = Math.abs(degX) < 1.5 && Math.abs(degY) < 1.5;

  useEffect(() => {
    if (isLevel && !wasLevel.current) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => { });
    wasLevel.current = isLevel;
  }, [isLevel]);

  return (
    <Screen title="Nivel" subtitle="Apoya el teléfono en una superficie">
      {available === false ? (
        <Text style={styles.error}>
          {Platform.OS === 'web'
            ? 'El nivel necesita el acelerómetro de un celular. Ábrelo desde la app en tu teléfono.'
            : 'Este dispositivo no tiene acelerómetro disponible.'}
        </Text>
      ) : (
        <View style={styles.center}>
          <View style={[styles.dial, isLevel && { borderColor: colors.primary }]}>
            <View style={styles.crossH} />
            <View style={styles.crossV} />
            <View
              style={[
                styles.bubble,
                { backgroundColor: isLevel ? colors.primary : colors.accent },
                { transform: [{ translateX: clamp(-tilt.x * MAX * 2, MAX) }, { translateY: clamp(tilt.y * MAX * 2, MAX) }] },
              ]}
            />
          </View>
          <Text style={[styles.status, isLevel && { color: colors.primary }]}>{isLevel ? 'Nivelado' : 'Inclinado'}</Text>
          <View style={styles.readout}>
            <Text style={styles.deg}>X {degX.toFixed(1)}°</Text>
            <Text style={styles.deg}>Y {degY.toFixed(1)}°</Text>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  dial: { width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: 4, borderColor: colors.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  crossH: { position: 'absolute', width: '70%', height: 1.5, backgroundColor: colors.line },
  crossV: { position: 'absolute', height: '70%', width: 1.5, backgroundColor: colors.line },
  bubble: { width: BUBBLE, height: BUBBLE, borderRadius: BUBBLE / 2 },
  status: { fontSize: 24, fontWeight: '800', color: colors.accent },
  readout: { flexDirection: 'row', gap: 28 },
  deg: { fontSize: 18, fontWeight: '600', color: colors.ink },
  error: { color: colors.danger, fontSize: 16, textAlign: 'center', marginTop: 40 },
});
