import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.easyledger',
  appName: 'EasyLedger',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
