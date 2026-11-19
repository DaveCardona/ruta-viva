import { Ionicons } from '@expo/vector-icons';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors } from '../src/theme';

const SIZE = 110;

export default function DragRotate() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const rot = useSharedValue(0);
  const w = useSharedValue(0);
  const h = useSharedValue(0);

  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = x.value;
      startY.value = y.value;
    })
    .onUpdate((e) => {
      const maxX = (w.value - SIZE) / 2;
      const maxY = (h.value - SIZE) / 2;
      x.value = Math.min(Math.max(startX.value + e.translationX, -maxX), maxX);
      y.value = Math.min(Math.max(startY.value + e.translationY, -maxY), maxY);
      // Izquierda -> gira a la izquierda (negativo); derecha -> gira a la derecha (positivo)
      rot.value = interpolate(e.translationX, [-150, 0, 150], [-45, 0, 45], Extrapolation.CLAMP);
    })
    .onEnd(() => {
      rot.value = withSpring(0);
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${rot.value}deg` }],
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    w.value = e.nativeEvent.layout.width;
    h.value = e.nativeEvent.layout.height;
  };

  return (
    <View style={styles.root}>
      <Text style={styles.hint}>Arrastra la figura. Si la mueves a la izquierda gira a la izquierda; a la derecha, gira a la derecha.</Text>
      <View style={styles.area} onLayout={onLayout}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.shape, style]}>
            <Ionicons name="arrow-up" size={56} color="#fff" />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  hint: { fontSize: 15, color: colors.muted, marginBottom: 14 },
  area: { flex: 1, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  shape: { width: SIZE, height: SIZE, borderRadius: 26, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
