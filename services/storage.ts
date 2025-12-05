import * as ImagePicker from 'expo-image-picker';

/**
 * Request media library permissions
 */
export const requestImagePermissions = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }
  return true;
};

/**
 * Pick an image from the device's image library
 */
export const pickImage = async (): Promise<string | null> => {
  const hasPermission = await requestImagePermissions();
  if (!hasPermission) {
    throw new Error('Permission to access media library is required!');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    return result.assets[0].uri;
  }
  return null;
};

/**
 * Pick an image and return its local URI (no Firebase upload).
 * React Native's <Image> can display both remote (https) and local (file://) URIs.
 * NOTE: Storing local file URIs in Firestore will only work on the same device.
 */
export const pickAndUploadImage = async (): Promise<string | null> => {
  try {
    const localUri = await pickImage();
    if (!localUri) {
      return null;
    }
    return localUri;
  } catch (error: any) {
    console.error('Error in pickAndUploadImage:', error);
    throw new Error(error.message || 'Failed to pick image');
  }
};

