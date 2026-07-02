import type { CapacitorConfig } from '@capacitor/cli';

// Configure the app to use the dist folder (built web assets)

const config: CapacitorConfig = {
  appId: 'com.aiassistantpro.app',
  appName: 'AI Assistant Pro',
  webDir: 'dist'
};

export default config;
