import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ASYNC_STORAGE_LANG_KEY } from 'screens/Landing/LanguageSwitch';
import { MonitoringContext } from '@monkvision/corejs/src/monitoring';

export default function SilentLang() {
  const [hasBeenDone, setHasBeenDone] = useState(false);
  const { i18n } = useTranslation();
  const { errorHandler } = useContext(MonitoringContext);

  useEffect(() => {
    if (!hasBeenDone) {
      AsyncStorage.getItem(ASYNC_STORAGE_LANG_KEY)
        .then((value) => (value !== null ? i18n.changeLanguage(value) : Promise.resolve()))
        .then(() => setHasBeenDone(true))
        .catch((err) => {
          errorHandler(err);
        });
    }
  }, []);

  return null;
}
