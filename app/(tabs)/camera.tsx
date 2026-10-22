import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, FlatList, Image, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/AppContext';
import { Screen } from '../../src/Screen';
import { cardShadow, colors } from '../../src/theme';

export default function CameraTab() {
  const { photos, addPhoto, removePhoto } = useApp();

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

  return (
    <Screen title="Fotos" subtitle="Captura lo que encuentres en el camino">
      <View style={styles.actions}>
        <Pressable style={[styles.btn, { flex: 2 }]} onPress={takePhoto}>
          <Ionicons name="camera" size={20} color="#fff" />
          <Text style={styles.btnText}>Tomar foto</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnGhost, { flex: 1 }]} onPress={pickFromGallery}>
          <Ionicons name="images-outline" size={20} color={colors.primary} />
          <Text style={[styles.btnText, { color: colors.primary }]}>Galería</Text>
        </Pressable>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(p) => p.uri}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingTop: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="camera-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>Aún no hay fotos</Text>
            <Text style={styles.emptyText}>Toca “Tomar foto” para guardar la primera.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.photo} onLongPress={() => confirmDelete(item.uri)}>
            <Image source={{ uri: item.uri }} style={styles.img} />
            <Text style={styles.date}>{item.takenAt}</Text>
          </Pressable>
        )}
        ListFooterComponent={photos.length ? <Text style={styles.hint}>Mantén presionada una foto para eliminarla.</Text> : null}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  photo: { flex: 1, backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', ...cardShadow },
  img: { width: '100%', aspectRatio: 1 },
  date: { fontSize: 12, color: colors.muted, padding: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.ink },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  hint: { textAlign: 'center', color: colors.muted, fontSize: 13, paddingVertical: 8 },
});
