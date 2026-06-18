import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.companiio.app',
  appName: 'Companiio',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'companiio',
  },
  ios: {
    contentInset: 'always',
    scheme: 'companiio',
  },
  android: {
    backgroundColor: '#FAF8F5',
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#FF6B4A',
      style: 'DARK',
    },
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2500,
      backgroundColor: '#FAF8F5',
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
