import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as names from 'screens/names';

export default function useVinModal({ isAuthenticated, inspectionId }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // VIN
  const handleVinSelect = useCallback((name) => {
    const shouldSignIn = !isAuthenticated;

    // select only value that are not one of the `modals` keys
    if (name === 'manually') {
      const options = { title: t('vinModal.prompt.title'), message: t('vinModal.prompt.message'), key: 'vin' };
      const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_PROMPT;
      const redirect = inspectionId ? names.INSPECTION_VEHICLE_UPDATE : names.INSPECTION_CREATE;

      navigation.navigate(to, { selectedMod: 'vinNumber', mode: 'manually', afterSignin: names.INSPECTION_PROMPT, to: redirect, inspectionId, options });
      return;
    }

    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, { selectedMod: 'vinNumber', inspectionId });
  }, [isAuthenticated, inspectionId, navigation]);

  return { vin: { onSelect: handleVinSelect, title: t('vinModal.title') } };
}
