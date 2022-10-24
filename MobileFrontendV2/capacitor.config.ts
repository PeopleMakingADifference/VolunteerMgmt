import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jumbocode.pmd',
  appName: '"People Making A Difference"',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["sound", "alert"],
    },
  },
};

export default config;
