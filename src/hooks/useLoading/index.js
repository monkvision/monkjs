import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import useAuth from 'hooks/useAuth';
import useMinLoadingTime from 'hooks/useMinLoadingTime';

import MaterialCommunityIcons from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import Roboto from 'assets/fonts/Roboto/Roboto-Regular.ttf';
import RobotoCondensed from 'assets/fonts/Roboto_Condensed/RobotoCondensed-Regular.ttf';
import RobotoMono from 'assets/fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf';
import RobotoSlab from 'assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf';

export default function useLoading() {
  const { isLoading: isAuthenticating } = useAuth();
  const [fontsLoaded, setFontLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      Roboto,
      RobotoCondensed,
      RobotoMono,
      RobotoSlab,
      MaterialCommunityIcons,
      'Material Design Icons': MaterialCommunityIcons,
    });
    setFontLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  return useMinLoadingTime(isAuthenticating || fontsLoaded !== true);
}
