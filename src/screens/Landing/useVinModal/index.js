import { useCallback } from 'react';
import * as names from 'screens/names';
import { useNavigation } from '@react-navigation/native';

export default function useVinModal({ isAuthenticated, inspectionId }) {
  const navigation = useNavigation();

  // VIN
  const handleVinSelect = useCallback((name) => {
    const shouldSignIn = !isAuthenticated;

    // select only value that are not one of the `modals` keys
    if (name === 'manually') {
      const options = { title: 'Vehicle identification number', message: 'Please enter the VIN', key: 'vin' };
      const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_PROMPT;
      const redirect = inspectionId ? names.INSPECTION_VEHICLE_UPDATE : names.INSPECTION_CREATE;

      navigation.navigate(to, { selectedMod: 'vinNumber', mode: 'manually', afterSignin: names.INSPECTION_PROMPT, to: redirect, inspectionId, options });
      return;
    }

    const to = shouldSignIn ? names.SIGN_IN : names.INSPECTION_CREATE;
    navigation.navigate(to, { selectedMod: 'vinNumber', inspectionId });
  }, [isAuthenticated, inspectionId, navigation]);

  return { vin: { onSelect: handleVinSelect, title: 'Vin' } };
}
