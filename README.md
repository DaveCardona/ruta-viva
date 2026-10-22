# Ruta Viva

Aplicación móvil desarrollada con **React Native** y **Expo** para Android e iOS. Funciona como una bitácora de campo: permite guardar fotos, registrar la ubicación actual y medir la inclinación del teléfono.

## Descargar el APK (Android)

- Build en Expo (EAS): https://expo.dev/accounts/davewaves/projects/ruta-viva/builds/fc7a478e-5d92-4bb5-8c7d-00b5aeff4646

Para instalarlo, abre el archivo en tu celular y permite la instalación de apps de orígenes desconocidos si Android lo solicita.

## Funcionalidades

| Pestaña | Tipo | Descripción |
|---|---|---|
| Inicio | Resumen | Muestra fotos guardadas, último lugar y datos del dispositivo |
| Fotos | Función nativa: cámara (`expo-image-picker`) | Tomar fotos, elegirlas de la galería y eliminarlas |
| Lugar | Función nativa: GPS (`expo-location`) | Coordenadas, dirección y apertura en la app de mapas |
| Nivel | Sensor: acelerómetro (`expo-sensors`) | Nivel de burbuja con ángulos y vibración al nivelar |

## Validación del sistema operativo

Se usa `Platform` de React Native para adaptar el comportamiento:

- **Sombras:** `shadow*` en iOS y `elevation` en Android.
- **Barra de pestañas:** altura y padding distintos según la plataforma.
- **Mapas:** Apple Maps en iOS y esquema `geo:` en Android.
- **Cámara:** recorte de la foto (`allowsEditing`) solo en Android.
- **GPS:** se verifica que esté encendido antes de pedir la ubicación.
- **Acelerómetro:** ajuste del signo de los ejes por plataforma, y mensaje informativo en la versión web, donde el sensor no existe.

## Tecnologías

- React Native + Expo
- Expo Router (navegación solo por pestañas)
- TypeScript
- EAS Build (generación del APK)

## Estructura del proyecto

​```
app/
  _layout.tsx          Layout raíz
  (tabs)/
    _layout.tsx        Barra de pestañas
    index.tsx          Inicio
    camera.tsx         Fotos
    location.tsx       Lugar
    level.tsx          Nivel
src/
  AppContext.tsx       Estado compartido (fotos y ubicación)
  Screen.tsx           Encabezado común
  theme.ts             Colores y sombras
bin/
  Ruta-Viva.apk        APK instalable
​```

## Ejecutar el proyecto

​```bash
npm install
npx expo start
​```

Escanea el código QR con la app **Expo Go** en tu celular.

## Generar el APK

​```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
​```

## Autor

Nombre del estudiante: David Carona
Materia: Desarrollo Híbrido