import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Saves the list of photos to AsyncStorage.
 * @param {Array<Object>} photos - The list of photos to save.
 * @returns {Promise<void>} A promise that resolves when the photos are saved.
 */
export const savePhotos = async (photos) => {
  // Convert the list of photos to a JSON string
  const data = JSON.stringify(photos);
  // Save the string to AsyncStorage with the key "photos"
  await AsyncStorage.setItem('photos', data);
};

export const loadPhotos = async () => {
  const data = await AsyncStorage.getItem('photos');
  return data ? JSON.parse(data) : [];
};