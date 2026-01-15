import { StorageAdapter } from './adapter';
import { WebStorageAdapter } from './web-adapter';
import { Capacitor } from '@capacitor/core';
import { MobileStorageAdapter } from './mobile-adapter';

let adapterInstance: StorageAdapter | null = null;

export async function getAdapter(): Promise<StorageAdapter> {
  if (adapterInstance) {
    return adapterInstance;
  }

  if (Capacitor.isNativePlatform()) {
    adapterInstance = new MobileStorageAdapter();
  } else {
    adapterInstance = new WebStorageAdapter();
  }

  await adapterInstance.initialize();
  return adapterInstance;
}
