import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CameraView, CameraCapturedPicture, useCameraPermissions } from 'expo-camera';
import { LocationObject, PermissionStatus as LocationPermissionStatus, getCurrentPositionAsync, useForegroundPermissions } from 'expo-location';
import { PermissionStatus as MediaLibraryPermissionStatus, usePermissions as useMediaLibraryPermissions } from 'expo-media-library';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ParkScreen() {
  const colorScheme = useColorScheme();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = useForegroundPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();

  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>(null);
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (cameraPermission && !cameraPermission.granted) {
      requestCameraPermission();
    }
    if (locationPermission && !locationPermission.granted) {
      requestLocationPermission();
    }
    if (mediaLibraryPermission && mediaLibraryPermission.status === MediaLibraryPermissionStatus.UNDETERMINED) {
      requestMediaLibraryPermission();
    }
  }, [
    cameraPermission, requestCameraPermission,
    locationPermission, requestLocationPermission,
    mediaLibraryPermission, requestMediaLibraryPermission
  ]);

  async function takePicture() {
    if (cameraRef.current && cameraPermission?.granted) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo);
        if (locationPermission?.granted) {
          const location = await getCurrentPositionAsync({});
          setUserLocation(location);
          console.log('Location:', location);
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      }
    }
  }

  function retakePicture() {
    setCapturedImage(null);
    setUserLocation(null);
  }

  if (!cameraPermission || !locationPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}><Text style={styles.infoText}>Requesting permissions...</Text></View>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.infoText}>Camera permission is required to use this feature.</Text>
          <Button title="Grant Camera Permission" onPress={requestCameraPermission} />
        </View>
      </SafeAreaView>
    );
  }

  if (locationPermission.status === LocationPermissionStatus.DENIED) {
    console.log('Location permission denied. Features requiring location may not work.');
    // Optionally, provide a button to guide user to settings or re-request.
  }

  if (capturedImage) {
    return (
      <SafeAreaView style={styles.container}>
        <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
        {userLocation && (
          <Text style={styles.locationText}>
            Lat: {userLocation.coords.latitude.toFixed(4)}, Lon: {userLocation.coords.longitude.toFixed(4)}
          </Text>
        )}
        <View style={styles.buttonContainerFixed}>
            <TouchableOpacity style={styles.controlButton} onPress={retakePicture}>
                <IconSymbol name="arrow.counterclockwise" size={28} color={Colors[colorScheme ?? 'light'].text} />
                <Text style={[styles.buttonText, { color: Colors[colorScheme ?? 'light'].text }]}>Retake</Text>
            </TouchableOpacity>
            {/* Add Save button here later */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={'back'} ref={cameraRef} />
      {/* Overlay for camera controls */}
      <View style={styles.cameraButtonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <IconSymbol name="camera.circle.fill" size={70} color="white" />
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff', // Ensuring info text is visible on dark background
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  locationText: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80, // Adjusted for button container
    left: 10,
    right: 10,
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 70, // Increased to lift above tab bar
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'flex-end', // No longer needed as bottom positioning handles vertical aspect
  },
  captureButton: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonContainerFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'ios' ? 30 : 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlButton: {
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    marginTop: 4,
  },
});
