import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartacademy.app',
  appName: 'Smart Academy',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: false,
      backgroundColor: '#0f172a',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      // 'LIGHT' = light (white) icons — correct for a dark #0f172a background.
      // 'DARK' would be dark icons on a dark background (invisible).
      style: 'LIGHT',
      backgroundColor: '#0f172a',
      // overlaysWebView not set — targetSdkVersion 35 forces edge-to-edge on
      // Android 15, so the OS owns the status bar layer. CSS safe-area-inset-top
      // (applied via .safe-top) handles the layout offset per page.
    },
  },
};

export default config;
