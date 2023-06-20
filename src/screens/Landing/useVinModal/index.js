import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as names from 'screens/names';
import { utils } from '@monkvision/toolkit';

export default function useVinModal({ isAuthenticated, inspectionId, vehicle }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // VIN
  const handleVinSelect = useCallback((name) => {
    const shouldSignIn = !isAuthenticated;

    // select only value that are not one of the `modals` keys
    if (name === 'manually') {
      utils.log(['[Click] Entering VIN manually']);
      const options = { title: t('vinModal.prompt.title'), key: 'vin' };
      const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_PROMPT;
      const redirect = inspectionId ? names.INSPECTION_VEHICLE_UPDATE : names.INSPECTION_CREATE;

      navigation.navigate(to, {
        selectedMod: 'vinNumber',
        mode: 'manually',
        vehicle,
        afterSignin: names.INSPECTION_PROMPT,
        to: redirect,
        inspectionId,
        options,
        isLastTour: true,
      });
      return;
    }

    utils.log(['[Click] Detecting VIN by taking a photo']);
    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, {
      selectedMod: 'vinNumber',
      vehicle,
      inspectionId,
      isLastTour: true,
    });
  }, [isAuthenticated, inspectionId, navigation, vehicle]);

  return { vin: { onSelect: handleVinSelect, title: t('vinModal.title') } };
}
