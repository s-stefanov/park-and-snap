require('dotenv').config();

export default {
  expo: {
    name: 'Park & Snap',
    slug: 'park-and-snap',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'parkandsnap',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.park-and-snap',
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'This app uses your location to tag photos with their GPS coordinates so you can remember where they were taken and share their location on a map.',
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY, // Dynamically loaded API key
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: 'com.anonymous.parkandsnap',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'react-native-map-link',
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};
