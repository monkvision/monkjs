import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as names from 'screens/names';
import { utils } from '@monkvision/toolkit';

export default function useVinModal({ isAuthenticated, inspectionId, vehicle, isLastTour }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  // VIN
  const handleVinSelect = useCallback((name) => {
    // select only value that are not one of the `modals` keys
    if (name === 'manually') {
      utils.log(['[Click] Entering VIN manually']);
      const options = { title: t('vinModal.prompt.title'), key: 'vin' };
      const redirect = inspectionId ? names.INSPECTION_VEHICLE_UPDATE : names.INSPECTION_CREATE;

      navigation.navigate(
        names.INSPECTION_PROMPT,
        { selectedMod: 'vinNumber', mode: 'manually', vehicle, afterSignin: names.INSPECTION_PROMPT, to: redirect, inspectionId, options, isLastTour },
      );
      return;
    }

    utils.log(['[Click] Detecting VIN by taking a photo']);
    navigation.navigate(names.INSPECTION_CREATE, { selectedMod: 'vinNumber', vehicle, inspectionId, isLastTour });
  }, [isAuthenticated, inspectionId, navigation, vehicle, isLastTour]);

  return { vin: { onSelect: handleVinSelect, title: t('vinModal.title') } };
}
