# Ruta Viva

App móvil en React Native + Expo (Expo Router, navegación solo por Tabs).

## Funcionalidades
- **Cámara** (expo-image-picker): tomar fotos o elegirlas de la galería.
- **Ubicación / GPS** (expo-location): coordenadas, dirección y apertura en la app de mapas.
- **Sensor** (expo-sensors, acelerómetro): nivel de burbuja con aviso háptico al nivelar.

## Adaptación por sistema operativo (`Platform`)
- Sombras: `shadow*` en iOS, `elevation` en Android (`src/theme.ts`).
- Altura/padding de la barra de pestañas según plataforma e insets.
- Enlace a mapas: `maps.apple.com` en iOS, `geo:` en Android.
- Recorte de foto (`allowsEditing`) solo en Android.
- Verificación de GPS encendido y signo de ejes del acelerómetro por plataforma.

## Ejecutar
```bash
npm install
npx expo start
```

## Generar APK
```bash
npm i -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```
