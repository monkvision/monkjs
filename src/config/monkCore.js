import MonkCore, { getBaseQuery } from '@monkvision/corejs/src';
import Constants from 'expo-constants';

const monkCore = new MonkCore(getBaseQuery({
  baseUrl: `https://${Constants.manifest.extra.MONK_DOMAIN}/`,
}));

export default monkCore;
