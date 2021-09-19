import axios from 'axios';
import Constants from 'expo-constants';

export const authAxiosInstance = axios.create({
  baseURL: `https://${Constants.manifest.extra.AUTH_DOMAIN}`,
});

export const monkAxiosInstance = axios.create({
  baseURL: `https://${Constants.manifest.extra.MONK_DOMAIN}`,
});
