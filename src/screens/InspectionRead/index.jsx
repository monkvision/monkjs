import React, { useCallback, useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import JSONPretty from 'react-json-pretty';
import { Appbar } from 'react-native-paper';

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
  return <JSONPretty id="json-pretty" data={data.entities[inspectionId]} />;
};
