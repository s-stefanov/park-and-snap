import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Platform, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, router } from 'expo-router';
import { showLocation } from 'react-native-map-link';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function MapScreen() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams(); // Use without generic initially
  const latStr = params.latitude as string | undefined; // Cast to expected type
  const lonStr = params.longitude as string | undefined; // Cast to expected type

  if (!latStr || !lonStr) {
    console.error('[MapScreen] Missing latitude or longitude params');
    return <SafeAreaView style={styles.container}><Text style={{color: Colors[colorScheme ?? 'light'].text}}>Error: Missing location data.</Text></SafeAreaView>;
  }

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lonStr);

  if (isNaN(latitude) || isNaN(longitude)) {
    console.error('[MapScreen] Invalid latitude or longitude params');
    return <SafeAreaView style={styles.container}><Text style={{color: Colors[colorScheme ?? 'light'].text}}>Error: Invalid location data.</Text></SafeAreaView>;
  }

  const handleShare = async () => {
    try {
      await showLocation({
        latitude: latitude,
        longitude: longitude,
        title: 'Photo Location', // Optional
        dialogTitle: 'Open with...', // Optional on Android
        dialogMessage: 'Choose an app to open the location', // Optional on Android
        cancelText: 'Cancel', // Optional
        appsWhiteList: ['google-maps', 'apple-maps', 'waze'] // Explicitly include common map apps
      });
    } catch (error) {
      console.error('Error showing location:', error);
      // Optionally, show an alert to the user if showLocation fails
      // Alert.alert('Error', 'Could not open map application.');
    }
  };

  const onMapReady = () => {
    console.log('[MapScreen] Map is ready');
  };

  const onMapError = (error: any) => { // Using 'any' for error type, @ts-ignore might be needed if strict typing causes issues with the library
    console.error('[MapScreen] Map error:', error);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <IconSymbol name="chevron.backward" size={24} color={Colors[colorScheme ?? 'light'].text} />
          <Text style={[styles.buttonText, { color: Colors[colorScheme ?? 'light'].text }]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <IconSymbol name="square.and.arrow.up" size={24} color={Colors[colorScheme ?? 'light'].text} />
          <Text style={[styles.buttonText, { color: Colors[colorScheme ?? 'light'].text }]}>Share</Text>
        </TouchableOpacity>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE} // Or null for Apple Maps on iOS
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005, // Adjust for desired zoom level
          longitudeDelta: 0.005, // Adjust for desired zoom level
        }}
        onMapReady={onMapReady}
        onRegionChangeComplete={(region) => console.log('[MapScreen] Region changed:', region)}
        // @ts-ignore - MapView's onError prop typing can be inconsistent
        onError={onMapError}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title="Photo Location"
        />
      </MapView>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30, // Adjust based on status bar height and preference
    left: 15,
    zIndex: 10, // Ensure it's above the map
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30, // Adjusted for SafeAreaView
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1, // Ensure buttons are on top of the map
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  buttonText: {
    // color is set dynamically based on colorScheme
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
});
