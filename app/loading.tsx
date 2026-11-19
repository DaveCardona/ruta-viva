import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors } from '../src/theme';

export default function Loading() {
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  // Se inicia automáticamente al montar el componente
  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
    progress.value = withRepeat(withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, false);
  }, []);

  const spinnerStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));
  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.spinner, spinnerStyle]} />
      <Text style={styles.text}>Cargando…</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 24 },
  spinner: { width: 90, height: 90, borderRadius: 45, borderWidth: 9, borderColor: colors.line, borderTopColor: colors.accent },
  text: { fontSize: 20, fontWeight: '700', color: colors.ink },
  track: { width: '100%', height: 16, borderRadius: 8, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 8, backgroundColor: colors.primary },
});
