import { createOneInspection, Sight, updateOneTaskOfInspection, values } from '@monkvision/corejs';
import { utils } from '@monkvision/react-native';
import { ActivityIndicatorView } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { StatusBar } from 'expo-status-bar';

import useRequest from 'hooks/useRequest/index';

import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Appbar, Button, IconButton, useTheme } from 'react-native-paper';
import { INSPECTION_READ, LANDING } from '../names';
import useImport, { initialPictureData } from './hooks/useImport';
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

// createInspection payload
const payload = { data: { tasks: { damage_detection: { status: 'NOT_STARTED' }, images_ocr: { status: 'NOT_STARTED' } } } };
const sightsWitoutVin = Object.values(values.sights.abstract).map((s) => new Sight(...s));

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [pictures, setPictures] = useState(
    sightsWitoutVin.map(({ id, label }) => ({ ...initialPictureData, id, label })),
  );
  const [inspectionId, setInspectionId] = useState();

  const canGoNext = useMemo(() => pictures.some((picture) => picture.isUploaded), [pictures]);
  const { isLoading, request: createInspection } = useRequest(
    createOneInspection(payload),
    { onSuccess: ({ result }) => setInspectionId(result) },
    false,
  );

  React.useEffect(() => navigation.addListener('focus', () => {
    setPictures(sightsWitoutVin.map(({ id, label }) => ({ ...initialPictureData, id, label })));
    setInspectionId(null);
    createInspection();
  }), [navigation, createInspection]);

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
  if (isLoading) { return <ActivityIndicatorView light />; }

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
                handleUploadPicture: sight.id === 'vin'
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
