import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '../src/theme';

export default function Bounce() {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.root}>
      <Text style={styles.hint}>Mantén presionada la figura para encogerla y suéltala para ver el rebote.</Text>
      <View style={styles.center}>
        <Pressable
          onPressIn={() => {
            scale.value = withTiming(0.65, { duration: 150 });
          }}
          onPressOut={() => {
            // Resorte con poco amortiguamiento = efecto de rebote
            scale.value = withSpring(1, { damping: 4, stiffness: 180, mass: 0.8 });
          }}
        >
          <Animated.View style={[styles.shape, style]}>
            <Text style={styles.label}>Presióname</Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  hint: { fontSize: 15, color: colors.muted },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  shape: { width: 190, height: 190, borderRadius: 95, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#fff', fontSize: 20, fontWeight: '800' },
});
