import { useError } from '@monkvision/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentry from 'config/sentry';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ASYNC_STORAGE_LANG_KEY } from 'screens/Landing/LanguageSwitch';

export default function SilentLang() {
  const [hasBeenDone, setHasBeenDone] = useState(false);
  const { i18n } = useTranslation();
  const { errorHandler, Constants } = useError(Sentry);

  useEffect(() => {
    if (!hasBeenDone) {
      AsyncStorage.getItem(ASYNC_STORAGE_LANG_KEY)
        .then((value) => (value !== null ? i18n.changeLanguage(value) : Promise.resolve()))
        .then(() => setHasBeenDone(true))
        .catch((err) => errorHandler(err, Constants.type.APP));
    }
  }, []);

  return null;
}
