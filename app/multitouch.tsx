import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors } from '../src/theme';

export default function Multitouch() {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.4), 5);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = savedRotation.value + e.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = savedTx.value + e.translationX;
      ty.value = savedTy.value + e.translationY;
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const gesture = Gesture.Simultaneous(pan, pinch, rotate);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }, { rotate: `${rotation.value}rad` }],
  }));

  const reset = () => {
    scale.value = withTiming(1);
    rotation.value = withTiming(0);
    tx.value = withTiming(0);
    ty.value = withTiming(0);
    savedScale.value = 1;
    savedRotation.value = 0;
    savedTx.value = 0;
    savedTy.value = 0;
  };

  return (
    <View style={styles.root}>
      <Text style={styles.hint}>Usa dos dedos para acercar, alejar y rotar la imagen. Con un dedo, muévela.</Text>
      <View style={styles.area}>
        <GestureDetector gesture={gesture}>
          <Animated.Image source={require('../assets/images/icon.png')} style={[styles.image, style]} />
        </GestureDetector>
      </View>
      <Pressable style={styles.btn} onPress={reset}>
        <Text style={styles.btnText}>Restablecer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, padding: 20, gap: 14 },
  hint: { fontSize: 15, color: colors.muted },
  area: { flex: 1, backgroundColor: '#fff', borderRadius: 24, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: 220, height: 220, borderRadius: 24 },
  btn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
