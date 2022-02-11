import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

import MaterialCommunityIcons from '@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';

export default function useIcons() {
  const [fontsLoaded, setFontLoaded] = useState(false);

  async function loadFonts() {
    await Font.loadAsync({
      MaterialCommunityIcons,
      'Material Design Icons': MaterialCommunityIcons,
    });
    setFontLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, []);

  return fontsLoaded !== true;
}
