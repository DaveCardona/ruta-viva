import { Dimensions, Image, Pressable, StyleSheet, Text } from 'react-native';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Photo } from './AppContext';
import { colors } from './theme';

const LIST_W = Dimensions.get('window').width - 40; // el cuerpo de la pantalla tiene 20 de margen por lado
const CARD = LIST_W * 0.72;
const GAP = 16;
const SNAP = CARD + GAP;
const SIDE = (LIST_W - CARD) / 2 - GAP / 2;

function Card({ photo, index, scrollX, onOpen, onDelete }: { photo: Photo; index: number; scrollX: SharedValue<number>; onOpen: () => void; onDelete: () => void }) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * SNAP, index * SNAP, (index + 1) * SNAP];
    return {
      opacity: interpolate(scrollX.value, input, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(scrollX.value, input, [24, 0, 24], Extrapolation.CLAMP) },
        { scale: interpolate(scrollX.value, input, [0.82, 1, 0.82], Extrapolation.CLAMP) },
        { rotate: `${interpolate(scrollX.value, input, [-8, 0, 8], Extrapolation.CLAMP)}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.card, style]}>
      <Pressable style={{ flex: 1 }} onPress={onOpen} onLongPress={onDelete}>
        <Image source={{ uri: photo.uri }} style={styles.img} />
        <Text style={styles.date}>{photo.takenAt}</Text>
      </Pressable>
    </Animated.View>
  );
}

export function PhotoCarousel({ photos, onOpen, onDelete }: { photos: Photo[]; onOpen: (uri: string) => void; onDelete: (uri: string) => void }) {
  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });
  return (
    <Animated.FlatList
      data={photos}
      keyExtractor={(p) => p.uri}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={SNAP}
      decelerationRate="fast"
      scrollEventThrottle={16}
      onScroll={onScroll}
      style={{ flexGrow: 0, marginTop: 24 }}
      contentContainerStyle={{ paddingHorizontal: SIDE, alignItems: 'center', paddingVertical: 12 }}
      renderItem={({ item, index }) => <Card photo={item} index={index} scrollX={scrollX} onOpen={() => onOpen(item.uri)} onDelete={() => onDelete(item.uri)} />}
    />
  );
}

const styles = StyleSheet.create({
  card: { width: CARD, height: 340, marginHorizontal: GAP / 2, borderRadius: 24, backgroundColor: colors.card, overflow: 'hidden' },
  img: { flex: 1, width: '100%' },
  date: { fontSize: 13, color: colors.muted, padding: 10, textAlign: 'center' },
});
