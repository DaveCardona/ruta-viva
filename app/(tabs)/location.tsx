import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/AppContext';
import { Screen } from '../../src/Screen';
import { cardShadow, colors } from '../../src/theme';

export default function LocationTab() {
  const { place, setPlace } = useApp();
  const [loading, setLoading] = useState(false);

  const locate = async () => {
    setLoading(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso de ubicación', 'Activa la ubicación para esta app en Ajustes.', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
        ]);
        return;
      }
      // En Android el GPS puede estar apagado aunque el permiso exista
      if (!(await Location.hasServicesEnabledAsync())) {
        Alert.alert('GPS desactivado', 'Enciende la ubicación del teléfono e inténtalo de nuevo.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      let label = 'Ubicación actual';
      try {
        const [a] = await Location.reverseGeocodeAsync(pos.coords);
        if (a) label = [a.street, a.city ?? a.subregion, a.country].filter(Boolean).join(', ') || label;
      } catch {}
      setPlace({ lat: pos.coords.latitude, lng: pos.coords.longitude, label, at: new Date().toLocaleTimeString() });
    } catch {
      Alert.alert('No se pudo obtener la ubicación', 'Revisa tu conexión o GPS e inténtalo otra vez.');
    } finally {
      setLoading(false);
    }
  };

  const openMaps = () => {
    if (!place) return;
    const { lat, lng } = place;
    const label = encodeURIComponent('Mi lugar');
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
      android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
    })!;
    Linking.openURL(url).catch(() => Alert.alert('No se pudo abrir el mapa'));
  };

  return (
    <Screen title="Lugar" subtitle="Registra dónde estás ahora mismo">
      <Pressable style={styles.btn} onPress={locate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Ionicons name="locate" size={20} color="#fff" />}
        <Text style={styles.btnText}>{loading ? 'Buscando señal…' : 'Obtener mi ubicación'}</Text>
      </Pressable>

      {place ? (
        <View style={styles.card}>
          <Text style={styles.label}>{place.label}</Text>
          <View style={styles.row}>
            <View style={styles.coord}><Text style={styles.coordKey}>Latitud</Text><Text style={styles.coordVal}>{place.lat.toFixed(5)}</Text></View>
            <View style={styles.coord}><Text style={styles.coordKey}>Longitud</Text><Text style={styles.coordVal}>{place.lng.toFixed(5)}</Text></View>
          </View>
          <Text style={styles.time}>Actualizado a las {place.at}</Text>
          <Pressable style={[styles.btn, styles.btnGhost]} onPress={openMaps}>
            <Ionicons name="map-outline" size={20} color={colors.primary} />
            <Text style={[styles.btnText, { color: colors.primary }]}>Ver en el mapa</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyTitle}>Sin ubicación todavía</Text>
          <Text style={styles.emptyText}>Toca el botón para guardar tus coordenadas.</Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary, marginTop: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: 18, marginTop: 20, ...cardShadow },
  label: { fontSize: 18, fontWeight: '700', color: colors.ink },
  row: { flexDirection: 'row', gap: 12, marginTop: 14 },
  coord: { flex: 1, backgroundColor: colors.bg, borderRadius: 12, padding: 12 },
  coordKey: { fontSize: 12, color: colors.muted },
  coordVal: { fontSize: 18, fontWeight: '700', color: colors.ink, marginTop: 2 },
  time: { fontSize: 13, color: colors.muted, marginTop: 12 },
  empty: { alignItems: 'center', gap: 6, paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.ink },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center' },
});
