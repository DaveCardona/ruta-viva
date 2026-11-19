import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Visor de foto a pantalla completa: zoom, giro y movimiento con gestos
export function ZoomViewer({ uri, onClose }: { uri: string | null; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  useEffect(() => {
    scale.value = 1;
    savedScale.value = 1;
    rotation.value = 0;
    savedRotation.value = 0;
    tx.value = 0;
    ty.value = 0;
    savedTx.value = 0;
    savedTy.value = 0;
  }, [uri]);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 0.5), 6);
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

  // Doble toque: acerca o vuelve al tamaño original
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const next = scale.value > 1.1 ? 1 : 2.5;
      scale.value = withSpring(next);
      savedScale.value = next;
      if (next === 1) {
        tx.value = withTiming(0);
        ty.value = withTiming(0);
        rotation.value = withTiming(0);
        savedTx.value = 0;
        savedTy.value = 0;
        savedRotation.value = 0;
      }
    });

  const gesture = Gesture.Simultaneous(pan, pinch, rotate, doubleTap);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }, { rotate: `${rotation.value}rad` }],
  }));

  return (
    <Modal visible={!!uri} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      {/* Dentro de un Modal en Android se necesita su propio GestureHandlerRootView */}
      <GestureHandlerRootView style={styles.root}>
        {uri && (
          <GestureDetector gesture={gesture}>
            <Animated.Image source={{ uri }} style={[styles.image, style]} resizeMode="contain" />
          </GestureDetector>
        )}
        <Pressable style={[styles.close, { top: insets.top + 12 }]} onPress={onClose} hitSlop={12}>
          <Ionicons name="close" size={26} color="#fff" />
        </Pressable>
        <Text style={[styles.hint, { bottom: insets.bottom + 24 }]}>Pellizca para zoom · gira con dos dedos · doble toque para ampliar</Text>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000F2', alignItems: 'center', justifyContent: 'center' },
  image: { width, height: height * 0.8 },
  close: { position: 'absolute', right: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF33', alignItems: 'center', justifyContent: 'center' },
  hint: { position: 'absolute', color: '#FFFFFFBB', fontSize: 13, textAlign: 'center', paddingHorizontal: 24 },
});
