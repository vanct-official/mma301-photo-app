import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * A component that renders a photo card with its metadata, and a button to delete it.
 *
 * @param {{uri: string, timestamp: string, description: string, location: object} & {id: string}} photo
 * The photo data to display.
 * @param {function(photo: {uri: string, timestamp: string, description: string, location: object} & {id: string}): void} onSelect
 * Called when the user taps on the photo.
 * @param {function(id: string): void} onDelete
 * Called when the user taps on the Delete button.
 * @param {object} style - Optional style for the card wrapper
 */
const PhotoCard = ({ photo, onSelect, onDelete, style }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <TouchableOpacity onPress={() => onSelect(photo)} activeOpacity={0.85}>
      <View style={[styles.card, style]}>
        {/* The image of the photo */}
        {imageError ? (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Image not available</Text>
          </View>
        ) : (
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            onError={() => setImageError(true)}
          />
        )}
        {/* The timestamp and description of the photo */}
        <Text style={styles.timestamp}>{new Date(photo.timestamp).toLocaleString()}</Text>
        <Text numberOfLines={2} style={styles.description}>{photo.description}</Text>
        {/* The Delete button */}
        <View style={styles.deleteWrapper}>
          <Button title="Delete" color="#ff4d4d" onPress={() => onDelete(photo.id)} />
        </View>
        {photo.tags && photo.tags.map((tag, idx) => (
          <Text key={tag + '-' + idx}>{tag}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export default PhotoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#888',
    fontSize: 16,
  },
  timestamp: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  description: {
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  deleteWrapper: {
    alignItems: 'flex-end',
  },
});
