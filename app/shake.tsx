import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors } from '../src/theme';

const THRESHOLD = 1.8; // fuerza total en "g" para considerar una sacudida

export default function Shake() {
  const offset = useSharedValue(0);
  const angle = useSharedValue(0);
  const [count, setCount] = useState(0);
  const [available, setAvailable] = useState(true);
  const last = useRef(0);

  const shake = () => {
    setCount((c) => c + 1);
    offset.value = withSequence(withTiming(-18, { duration: 40 }), withRepeat(withTiming(18, { duration: 80 }), 7, true), withTiming(0, { duration: 40 }));
    angle.value = withSequence(withTiming(-12, { duration: 40 }), withRepeat(withTiming(12, { duration: 80 }), 7, true), withTiming(0, { duration: 40 }));
  };

  useEffect(() => {
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
        sub = Accelerometer.addListener(({ x, y, z }) => {
          const force = Math.sqrt(x * x + y * y + z * z);
          const now = Date.now();
          if (force > THRESHOLD && now - last.current > 900) {
            last.current = now;
            shake();
          }
        });
      })
      .catch(() => setAvailable(false));
    return () => sub?.remove();
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: offset.value }, { rotate: `${angle.value}deg` }] }));

  return (
    <View style={styles.root}>
      <Text style={styles.hint}>Sacude físicamente el celular y la figura vibrará.</Text>
      <View style={styles.center}>
        <Animated.View style={[styles.shape, style]}>
          <Ionicons name="phone-portrait" size={72} color="#fff" />
        </Animated.View>
        <Text style={styles.count}>Sacudidas: {count}</Text>
        {!available && <Text style={styles.warn}>El acelerómetro no está disponible aquí. Usa un celular o el botón de prueba.</Text>}
        {!available && (
          <Pressable style={styles.btn} onPress={shake}>
            <Text style={styles.btnText}>Simular sacudida</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  hint: { fontSize: 15, color: colors.muted },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  shape: { width: 170, height: 170, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  count: { fontSize: 22, fontWeight: '800', color: colors.ink },
  warn: { color: colors.danger, textAlign: 'center', fontSize: 14 },
  btn: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
  btnText: { color: '#fff', fontWeight: '700' },
});
