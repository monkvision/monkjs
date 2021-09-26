import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import Constants from 'expo-constants';

export default fetchBaseQuery({
  baseUrl: `https://${Constants.manifest.extra.MONK_DOMAIN}/`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    const customAccessToken = Constants.manifest.extra.CUSTOM_ACCESS_TOKEN;

    headers.set('Access-Control-Allow-Origin', '*');

    if (process.env.NODE_ENV === 'development' && customAccessToken) {
      headers.set('authorization', `Bearer ${customAccessToken}`);
    } else if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    return headers;
  },
});
