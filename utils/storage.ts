/**
 * Thin storage abstraction:
 *  - Web:    plain localStorage (synchronous, unchanged behaviour)
 *  - Native: localStorage as synchronous primary + async mirror to
 *            @capacitor/preferences so data survives "Clear cache"
 *            without losing user progress.
 *
 * One-time migration (initStorage): on first native launch with this
 * version all existing localStorage keys are copied to Preferences so
 * no user data is lost during the upgrade.
 */

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

const IS_NATIVE = Capacitor.isNativePlatform();

export function storageGet(key: string): string | null {
  return localStorage.getItem(key);
}

export function storageSet(key: string, value: string): void {
  localStorage.setItem(key, value);
  if (IS_NATIVE) Preferences.set({ key, value }).catch(() => {});
}

export function storageRemove(key: string): void {
  localStorage.removeItem(key);
  if (IS_NATIVE) Preferences.remove({ key }).catch(() => {});
}

const MIGRATION_KEY = '_storage_migrated_v1';

/**
 * Call once on app boot (native only).
 * Copies all current localStorage entries to Preferences so they are
 * preserved even if the WebView cache is cleared by the OS.
 */
export async function initStorage(): Promise<void> {
  if (!IS_NATIVE) return;
  try {
    const { value } = await Preferences.get({ key: MIGRATION_KEY });
    if (value) return; // already migrated
    const keys = Object.keys(localStorage);
    await Promise.allSettled(
      keys.map(k =>
        Preferences.set({ key: k, value: localStorage.getItem(k) ?? '' })
      )
    );
    await Preferences.set({ key: MIGRATION_KEY, value: '1' });
  } catch {
    // Non-fatal — localStorage still works as primary
  }
}
