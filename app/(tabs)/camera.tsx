import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, FlatList, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useApp } from '../../src/AppContext';
import { Bounce } from '../../src/Bounce';
import { PhotoCarousel } from '../../src/PhotoCarousel';
import { Screen } from '../../src/Screen';
import { cardShadow, colors } from '../../src/theme';
import { ZoomViewer } from '../../src/ZoomViewer';

export default function CameraTab() {
  const { photos, addPhoto, removePhoto } = useApp();
  const [mode, setMode] = useState<'grid' | 'carousel'>('grid');
  const [viewing, setViewing] = useState<string | null>(null);

  const save = (res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled && res.assets?.[0]) {
      addPhoto({ uri: res.assets[0].uri, takenAt: new Date().toLocaleString() });
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permiso de cámara', 'Activa el permiso de cámara en Ajustes para tomar fotos.', [
        { text: 'Cancelar', style: 'cancel' },
        ...(perm.canAskAgain ? [] : [{ text: 'Abrir ajustes', onPress: () => Linking.openSettings() }]),
      ]);
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      // En Android el recorte nativo es parte del flujo habitual; en iOS se guarda la foto completa
      allowsEditing: Platform.OS === 'android',
    });
    save(res);
  };

  const pickFromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    save(res);
  };

  const confirmDelete = (uri: string) =>
    Alert.alert('Eliminar foto', '¿Quieres quitar esta foto de tu bitácora?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removePhoto(uri) },
    ]);

  const empty = (
    <View style={styles.empty}>
      <Ionicons name="camera-outline" size={48} color={colors.muted} />
      <Text style={styles.emptyTitle}>Aún no hay fotos</Text>
      <Text style={styles.emptyText}>Toca “Tomar foto” para guardar la primera.</Text>
    </View>
  );

  return (
    <Screen title="Fotos" subtitle="Captura lo que encuentres en el camino">
      <View style={styles.actions}>
        <Bounce containerStyle={{ flex: 2 }} style={styles.btn} onPress={takePhoto}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.btnText}>Tomar foto</Text>
        </Bounce>
        <Bounce containerStyle={{ flex: 1 }} style={[styles.btn, styles.btnGhost]} onPress={pickFromGallery}>
          <Ionicons name="images-outline" size={20} color={colors.primary} />
          <Text style={[styles.btnText, { color: colors.primary }]}>Galería</Text>
        </Bounce>
      </View>

      {photos.length > 0 && (
        <View style={styles.toggle}>
          {(['grid', 'carousel'] as const).map((m) => (
            <Pressable key={m} style={[styles.toggleBtn, mode === m && styles.toggleOn]} onPress={() => setMode(m)}>
              <Ionicons name={m === 'grid' ? 'grid-outline' : 'albums-outline'} size={18} color={mode === m ? '#fff' : colors.primary} />
              <Text style={[styles.toggleText, mode === m && { color: '#fff' }]}>{m === 'grid' ? 'Cuadrícula' : 'Carrusel'}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {photos.length === 0 ? (
        empty
      ) : mode === 'carousel' ? (
        <PhotoCarousel photos={photos} onOpen={setViewing} onDelete={confirmDelete} />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(p) => p.uri}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12, paddingTop: 16 }}
          renderItem={({ item }) => (
            <Animated.View entering={ZoomIn.duration(300)} style={{ flex: 1 }}>
              <Bounce style={styles.photo} onPress={() => setViewing(item.uri)} onLongPress={() => confirmDelete(item.uri)}>
                <Image source={{ uri: item.uri }} style={styles.img} />
                <Text style={styles.date}>{item.takenAt}</Text>
              </Bounce>
            </Animated.View>
          )}
          ListFooterComponent={<Text style={styles.hint}>Toca una foto para ampliarla. Mantén presionada para eliminarla.</Text>}
        />
      )}

      <ZoomViewer uri={viewing} onClose={() => setViewing(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  toggle: { flexDirection: 'row', backgroundColor: '#DDEBE6', borderRadius: 12, padding: 4, marginTop: 14 },
  toggleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 9 },
  toggleOn: { backgroundColor: colors.primary },
  toggleText: { fontWeight: '700', color: colors.primary, fontSize: 14 },
  photo: { backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', ...cardShadow },
  img: { width: '100%', aspectRatio: 1 },
  date: { fontSize: 12, color: colors.muted, padding: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.ink },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  hint: { textAlign: 'center', color: colors.muted, fontSize: 13, paddingVertical: 8 },
});
