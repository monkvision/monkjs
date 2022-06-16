import AsyncStorage from '@react-native-async-storage/async-storage';

export function setItem(key, data) {
  return AsyncStorage.setItem(key, data);
}

export function getItem(key) {
  return AsyncStorage.getItem(key);
}

export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}
