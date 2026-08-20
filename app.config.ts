import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'E-Waste Management',
  slug: 'e-waste-management',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#2E7D32'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.ewaste.management',
    jsEngine: 'jsc'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#2E7D32'
    },
    package: 'com.ewaste.management',
    jsEngine: 'jsc'
  },
  web: {
    favicon: './assets/images/favicon.png',
    bundler: 'metro'
  },
  plugins: [
    'expo-router',
  ],
  scheme: 'ewaste',
  experiments: {}
});
