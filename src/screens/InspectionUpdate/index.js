import React, { useCallback, useLayoutEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import moment from 'moment';
import useRequest from 'hooks/useRequest';

import {
  getOneInspectionById,
  selectInspectionEntities,
  selectVehicleEntities,
  inspectionsEntity,
  vehiclesEntity,
} from '@monkvision/corejs';

import { Appbar, IconButton, useTheme } from 'react-native-paper';
import { ScrollView, SafeAreaView, View, StyleSheet } from 'react-native';
import { ActivityIndicatorView } from '@monkvision/react-native-views';

import { INSPECTION_READ } from 'screens/names';
import VehicleForm from './VehicleForm';
import AdditionalDataForm from './AdditionalDataForm';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

export default () => {
  const route = useRoute();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const { inspectionId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const vehiclesEntities = useSelector(selectVehicleEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    vehicles: [vehiclesEntity],
  }, {
    inspections: inspectionEntities,
    vehicles: vehiclesEntities,
  });

  const handleGoBack = useCallback(
    () => navigation.navigate(INSPECTION_READ, { inspectionId }),
    [navigation, inspectionId],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        headerBackVisible: false,
        title: `Update inspection #${inspectionId.split('-')[0]}`,
        headerTitle: () => (
          <Appbar.Content
            color={colors.text}
            style={{ justifyContent: 'center' }}
            title="More information"
            subtitle={moment(inspection.createdAt).format('lll')}
          />
        ),
        headerLeft: () => (
          <Appbar.BackAction
            accessibilityLabel="Return to inspection"
            onPress={handleGoBack}
          />
        ),
        headerRight: () => (
          <IconButton
            accessibilityLabel="Update inspection"
            disabled
            icon="check"
            color={colors.primary}
          />
        ),
      });
    }
  }, [colors.primary, colors.text, handleGoBack, inspection.createdAt, inspectionId, navigation]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={{ paddingBottom: 250 }}>
          <VehicleForm refresh={refresh} inspection={inspection} inspectionId={inspectionId} />
          <AdditionalDataForm
            refresh={refresh}
            inspection={inspection}
            inspectionId={inspectionId}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
