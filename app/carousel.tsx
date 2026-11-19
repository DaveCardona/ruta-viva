import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, SharedValue } from 'react-native-reanimated';
import { colors } from '../src/theme';

const { width } = Dimensions.get('window');
const CARD = width * 0.68;
const GAP = 16;
const SNAP = CARD + GAP;
const SIDE = (width - CARD) / 2 - GAP / 2;

type Item = { id: string; title: string; text: string; icon: React.ComponentProps<typeof Ionicons>['name']; color: string };
const DATA: Item[] = [
  { id: '1', title: 'Fotos', text: 'Captura lo que encuentres en el camino.', icon: 'camera', color: '#1F6F5C' },
  { id: '2', title: 'Lugar', text: 'Guarda tus coordenadas con un toque.', icon: 'location', color: '#FF6B35' },
  { id: '3', title: 'Nivel', text: 'Mide la inclinación con el acelerómetro.', icon: 'speedometer', color: '#2F5D8A' },
  { id: '4', title: 'Gestos', text: 'Zoom, giro y movimiento con dos dedos.', icon: 'hand-left', color: '#8E44AD' },
  { id: '5', title: 'Rebote', text: 'Animaciones con resorte y mucha vida.', icon: 'radio-button-on', color: '#C0392B' },
];

function Card({ item, index, scrollX }: { item: Item; index: number; scrollX: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];
    return {
      opacity: interpolate(scrollX.value, input, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(scrollX.value, input, [24, 0, 24], Extrapolation.CLAMP) },
        { scale: interpolate(scrollX.value, input, [0.8, 1, 0.8], Extrapolation.CLAMP) },
        { rotate: `${interpolate(scrollX.value, input, [-8, 0, 8], Extrapolation.CLAMP)}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.card, { backgroundColor: item.color }, style]}>
      <Ionicons name={item.icon} size={64} color="#fff" />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{item.text}</Text>
    </Animated.View>
  );
}

function Dot({ index, scrollX }: { index: number; scrollX: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];
    return {
      width: interpolate(scrollX.value, input, [8, 24, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.4, 1, 0.4], Extrapolation.CLAMP),
    };
  });
  return <Animated.View style={[styles.dot, style]} />;
}

export default function Carousel() {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  return (
    <View style={styles.root}>
      <Text style={styles.hint}>Desliza horizontalmente entre las tarjetas.</Text>
      <View style={styles.center}>
        <Animated.FlatList
          data={DATA}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP}
          decelerationRate="fast"
          scrollEventThrottle={16}
          onScroll={onScroll}
          contentContainerStyle={{ paddingHorizontal: SIDE, alignItems: 'center' }}
          renderItem={({ item, index }) => <Card item={item} index={index} scrollX={scrollX} />}
        />
      </View>
      <View style={styles.dots}>
        {DATA.map((d, i) => (
          <Dot key={d.id} index={i} scrollX={scrollX} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: 20 },
  hint: { fontSize: 15, color: colors.muted, paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center' },
  card: { width: CARD, height: 340, marginHorizontal: GAP / 2, borderRadius: 28, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 12 },
  cardTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },
  cardText: { color: '#FFFFFFDD', fontSize: 16, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingBottom: 30 },
  dot: { height: 8, borderRadius: 4, backgroundColor: colors.primary },
});
