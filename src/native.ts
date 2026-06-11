import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export async function initNative(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await Promise.all([
    StatusBar.setStyle({ style: Style.Dark }),
    StatusBar.setBackgroundColor({ color: '#0f172a' }),
  ]);

  await SplashScreen.hide({ fadeOutDuration: 300 });
}
