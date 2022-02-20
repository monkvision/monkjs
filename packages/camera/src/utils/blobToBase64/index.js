import { Platform } from 'react-native';
import log from '../log';

/**
 * @param blob
 * @return {Promise<string>}
 */
export default function blobToBase64(blob) {
  if (!Platform === 'web') {
    log(['blobToBase64() is only web available'], 'error');
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
