import MonkCore from '@monkvision/corejs/src';
import Constants from 'expo-constants';

const monkCore = new MonkCore({
  baseUrl: `https://${Constants.manifest.extra.MONK_DOMAIN}/`,
});

export default monkCore;
