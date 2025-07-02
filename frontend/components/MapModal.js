import React from 'react';
import { Button, Modal, Platform, StyleSheet, Text, View } from 'react-native';

let MapView, Marker;
if (Platform.OS !== 'web') {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

/**
 * A modal component that displays a map with a marker at the photo's location.
 *
 * @param {Object} props - The component props.
 * @param {{ uri: string, location: { latitude: number, longitude: number } }} props.photo - The photo object containing the location.
 * @param {function} props.onClose - The function to call when the modal is closed.
 * @returns {React.ReactElement} The rendered modal component.
 */
const MapModal = ({ photo, onClose }) => (
  <Modal visible={!!photo} animationType="slide">
    {photo && (
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Map is not supported on web.</Text>
            <Button title="Close Map" onPress={onClose} />
          </View>
        ) : (
          <>
            {/* MapView displays the map centered around the photo's location */}
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                ...photo.location,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              {/* Marker shows the exact location of the photo */}
              <Marker coordinate={photo.location} />
            </MapView>
            {/* Button to close the map modal */}
            <Button title="Close Map" onPress={onClose} />
          </>
        )}
      </View>
    )}
  </Modal>
);

export default MapModal;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1
  }
});