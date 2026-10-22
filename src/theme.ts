import { Platform, ViewStyle } from 'react-native';

export const colors = {
  bg: '#EEF3F1',
  card: '#FFFFFF',
  ink: '#10241F',
  muted: '#5B7069',
  primary: '#1F6F5C',
  primaryDark: '#14352F',
  accent: '#FF6B35',
  line: '#D5E0DC',
  danger: '#C0392B',
};

// Diferencia por plataforma: iOS usa shadow*, Android usa elevation
export const cardShadow: ViewStyle = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#10241F',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
  default: {},
})!;
