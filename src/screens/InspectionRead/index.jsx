import React, { useCallback, useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Appbar } from 'react-native-paper';
import JSONTree from 'react-native-json-tree';

// we can customize the json component by making changes to the theme object
// see more in the docs https://www.npmjs.com/package/react-native-json-tree
const theme = {
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

export default () => {
  const data = useSelector((state) => state.inspections);
  const route = useRoute();
  const navigation = useNavigation();
  const inspectionId = route.params.inspectionId;

  const handleGoBack = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content title="Inspection" subtitle={inspectionId} />
          </Appbar.Header>
        ),
      });
    }
  }, [handleGoBack, navigation, inspectionId]);
  return <JSONTree data={data.entities[inspectionId]} theme={theme} />;
};
