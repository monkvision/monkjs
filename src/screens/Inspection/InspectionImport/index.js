import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { createOneInspection, updateOneTaskOfInspection } from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';
import { Loader } from '@monkvision/ui';
import { useSights } from '@monkvision/camera';
import { useNavigation } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';

import useRequest from 'hooks/useRequest/index';

import { Appbar, Button, IconButton, useTheme } from 'react-native-paper';
import { INSPECTION_READ, LANDING } from 'screens/names';
import useImport, { initialPictureData, VIN_ID } from './hooks/useImport';
import SightCard from './SightCard';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
  },
  sightsLayout: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 200,
    position: 'relative',
    margin: -2,
  },
});

const sightIds = [
  'sLu0CfOt', // VIN
  'vLcBGkeh', // Front
  'xfbBpq3Q', // Front Bumper Side Left
  'VmFL3v2A', // Front Door Left
  'UHZkpCuK', // Rocker Panel Left
  'OOJDJ7go', // Rear Door Left
  'j8YHvnDP', // Rear Bumper Side Left
  'XyeyZlaU', // Rear
  'LDRoAPnk', // Rear Bumper Side Right
  '2RFF3Uf8', // Rear Door Right
  'B5s1CWT-', // Rocker Panel Right
  'enHQTFae', // Front Door Right
  'CELBsvYD', // Front Bumper Side Right
];

// createInspection payload
const payload = { data: { tasks: { damage_detection: { status: 'NOT_STARTED' }, images_ocr: { status: 'NOT_STARTED' } } } };

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { state: sights } = useSights({ sightIds });

  const [pictures, setPictures] = useState(
    sights.tour.map(({ id, label, overlay }) => ({ ...initialPictureData, id, label, overlay })),
  );
  const [inspectionId, setInspectionId] = useState();

  const canGoNext = useMemo(() => pictures.some((picture) => picture.isUploaded), [pictures]);
  const { isLoading, request: createInspection } = useRequest(
    createOneInspection(payload),
    { onSuccess: ({ result }) => setInspectionId(result) },
    false,
  );

  React.useEffect(() => navigation.addListener('focus', () => {
    setPictures(sights.tour.map(
      ({ id, label, overlay }) => ({ ...initialPictureData, id, label, overlay }),
    ));
    setInspectionId(null);
    createInspection();
  }), [navigation, createInspection, sights.tour]);

  const onSuccess = useCallback(() => {
    navigation.navigate(INSPECTION_READ, { inspectionId });
  }, [inspectionId, navigation]);

  const { isLoading: isUpdating, request: updateTask } = useRequest(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: 'damage_detection',
      data: { status: 'TODO' },
    }),
    { onSuccess },
    false,
  );

  const {
    accessGranted,
    handleOpenMediaLibrary,
    handleRequestMediaLibraryAccess,
    handleUploadPicture,
    handleUploadVinPicture,
  } = useImport({ pictures, setPictures, inspectionId });

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Import pictures',
        headerLeft: () => (
          <Appbar.BackAction
            accessibilityLabel="Return to inspection"
            onPress={() => navigation.navigate(LANDING)}
          />
        ),
        headerRight: () => (
          <IconButton
            accessibilityLabel="Start inspection"
            disabled={isUpdating || !canGoNext}
            icon="check"
            color={colors.primary}
            onPress={updateTask}
          />
        ),
      });
    }
  }, [canGoNext, colors.primary, isUpdating, navigation, updateTask]);

  // loading
  if (isLoading) { return <Loader texts={['Preparing an inspection...', 'We\'re working very Hard...', 'Almost there...', 'Loading...']} />; }

  // no permission given
  if (!accessGranted) {
    return (
      <View style={utils.styles.flex}>
        <Button onPress={handleRequestMediaLibraryAccess}>
          Request access to camera roll
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sightsLayout}>
          {pictures.map((sight) => (
            <SightCard
              key={sight.id}
              sight={sight}
              events={{
                handleOpenMediaLibrary,
                handleUploadPicture: sight.id === VIN_ID
                  ? handleUploadVinPicture
                  : handleUploadPicture,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
