import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import MapModal from '../components/MapModal';
import PhotoCard from '../components/PhotoCard';
import { getDescriptionFromGemini } from '../services/gemini';
import { loadPhotos, savePhotos } from '../utils/storage';

export default function HomeScreen() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const saved = await loadPhotos();
        setPhotos(saved);
      } catch (e) {
        setError('Failed to load photos.');
        setDebug('Load photos error: ' + e?.message);
        console.log('Load photos error:', e);
      }
    };
    fetch();
  }, []);

  const capturePhoto = async () => {
    setError('');
    setDebug('');
    try {
      setDebug('Requesting camera permission...');
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setDebug('Camera permission denied');
        return Alert.alert('Permission denied');
      }

      setDebug('Requesting location permission...');
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        setError('Permission to access location was denied');
        setDebug('Location permission denied');
        setLoading(false);
        return;
      }

      setDebug('Launching camera...');
      const result = await ImagePicker.launchCameraAsync({ base64: true });
      console.log('ImagePicker result:', result);

      let uri, base64Data;
      if (result.assets && result.assets.length > 0) {
        uri = result.assets[0].uri;
        base64Data = result.assets[0].base64;
      } else {
        uri = result.uri;
        base64Data = result.base64;
      }

      if (!uri) {
        setError('Không lấy được ảnh từ camera!');
        setDebug('ImagePicker trả về uri = undefined');
        setLoading(false);
        return;
      }

      if (base64Data && base64Data.startsWith('data:image')) {
        base64Data = base64Data.replace(/^data:image\/\w+;base64,/, '');
      }

      setLoading(true);
      setDebug('Getting location...');
      let location;
      try {
        location = await Location.getCurrentPositionAsync({});
      } catch (locErr) {
        setDebug('Location error: ' + locErr?.message);
        setError('Failed to get location: ' + locErr?.message);
        setLoading(false);
        console.log('Location error:', locErr);
        return;
      }

      setDebug('Creating new photo object...');
      const getId = () => uuidv4() || Math.random().toString(36).substr(2, 16);
      const newPhoto = {
        id: getId(),
        uri,
        base64: base64Data,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        timestamp: new Date().toISOString(),
        description: 'Generating...'
      };

      setDebug('Saving photo to AsyncStorage...');
      const updatedPhotos = [newPhoto, ...photos];
      try {
        await savePhotos(updatedPhotos);
      } catch (saveErr) {
        setDebug('Save photo error: ' + saveErr?.message);
        setError('Failed to save photo: ' + saveErr?.message);
        setLoading(false);
        console.log('Save photo error:', saveErr);
        return;
      }
      setPhotos(updatedPhotos);

      setDebug('Calling Gemini AI for description...');
      try {
        const description = await getDescriptionFromGemini(base64Data);
        newPhoto.description = description;
      } catch (e) {
        newPhoto.description = 'Failed to generate description.';
        setError('Gemini AI failed to generate description.');
        setDebug('Gemini error: ' + e?.message);
        console.log('Gemini error:', e);
      }
      // Always update the photo with the final description
      const finalPhotos = [newPhoto, ...photos];
      setPhotos(finalPhotos);
      try {
        await savePhotos(finalPhotos);
      } catch (saveErr2) {
        setDebug('Save photo (after Gemini) error: ' + saveErr2?.message);
        setError('Failed to save photo after Gemini: ' + saveErr2?.message);
        setLoading(false);
        console.log('Save photo (after Gemini) error:', saveErr2);
        return;
      }
      setLoading(false);
      setDebug('Photo captured and saved successfully!');
    } catch (e) {
      setError('Failed to capture photo.');
      setDebug('Capture photo error: ' + e?.message);
      console.log('Capture photo error:', e);
      setLoading(false);
    }
  };

  const deletePhoto = async (id) => {
    Alert.alert(
      'Delete Photo',
      'Are you sure you want to delete this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = photos.filter(p => p.id !== id);
            setPhotos(updated);
            await savePhotos(updated);
          }
        }
      ]
    );
  };

  console.log('photos:', photos);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📷 Photo Memories</Text>
      <Text style={styles.text}>Copyright by VanCt</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {debug ? <Text style={styles.debug}>{debug}</Text> : null}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4f8cff" />
          <Text style={styles.loadingText}>Generating description…</Text>
        </View>
      )}
      {photos.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No photos yet. Tap the + button to capture your first memory!</Text>
        </View>
      )}
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PhotoCard
            photo={item}
            onSelect={setSelectedPhoto}
            onDelete={deletePhoto}
            style={styles.cardWrapper}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={capturePhoto}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <MapModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22223b',
    marginBottom: 16,
    alignSelf: 'center',
    letterSpacing: 1,
  },
  text: {
    color: '#007aff',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: '#4f8cff',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  debug: {
    color: '#007aff',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 13,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#4f8cff',
    fontWeight: '500'
  },
});
