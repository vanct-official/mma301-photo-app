import React from 'react';
import { View, Text, Image, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

/**
 * A modal component that displays a photo with large size and full description.
 *
 * @param {Object} props - The component props.
 * @param {{ uri: string, timestamp: string, description: string, location: { latitude: number, longitude: number } }} props.photo - The photo object to display.
 * @param {function} props.onClose - The function to call when the modal is closed.
 * @returns {React.ReactElement} The rendered modal component.
 */
const PhotoDetailModal = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <Modal visible={!!photo} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        {/* Header with close button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Photo Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Large Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: photo.uri }}
              style={styles.largeImage}
              resizeMode="contain"
            />
          </View>

          {/* Photo Information */}
          <View style={styles.infoContainer}>
            {/* Timestamp */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Date & Time:</Text>
              <Text style={styles.infoValue}>
                {new Date(photo.timestamp).toLocaleString()}
              </Text>
            </View>

            {/* Location */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Location:</Text>
              <Text style={styles.infoValue}>
                {photo.location?.latitude?.toFixed(6)}, {photo.location?.longitude?.toFixed(6)}
              </Text>
            </View>

            {/* Full Description */}
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>📝 Description:</Text>
              <Text style={styles.fullDescription}>
                {photo.description || 'No description available'}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PhotoDetailModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height * 0.6,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeImage: {
    width: width,
    height: height * 0.6,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    minHeight: height * 0.4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  fullDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
}); 