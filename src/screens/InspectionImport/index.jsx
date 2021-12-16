import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useLayoutEffect, useState } from 'react';

import { spacing } from 'config/theme';

import { useNavigation } from '@react-navigation/native';
import { sightMasks, utils } from '@monkvision/react-native';
import { ActivityIndicatorView } from '@monkvision/react-native-views';
import { Sight, values, updateOneTaskOfInspection } from '@monkvision/corejs';

import { Card, Button, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, Platform, SafeAreaView, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import useRequest from 'hooks/useRequest/index';

import useImport from './hooks/useImport';
import useUploadPicture from './hooks/useUploadPicture';
import { INSPECTION_READ } from '../names';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
  },
  id: { fontFamily: 'monospace' },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    minHeight: 200,
  },
  sightCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    height: 170,
    backgroundColor: '#636363',
    marginVertical: spacing(1),
    borderRadius: 22,
    position: 'relative',
  },
  sightsLayout: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 200,
    position: 'relative',
  },
  picture: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    marginVertical: 4,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.2,
  },
  sightLabel: {
    color: '#ffffff',
    backgroundColor: 'blue',
    fontSize: 14,
    height: 28,
    zIndex: 99,
  },
  floatingButton: { position: 'absolute', alignSelf: 'center', bottom: 50, zIndex: 9 },
  editSightPicture: { position: 'absolute', zIndex: 9 },
});

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [pictures, setPictures] = useState([]);
  const [inspectionId] = useState('d97eff45-9261-c45d-d914-5d3a9547ca05');

  // const { isLoading } = useRequest(
  //   createOneInspection({ data: initialInspectionData }),
  //   { onSuccess: ({ result }) => setInspectionId(result) },
  // );

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

  const getSightPreview = useCallback(
    (id) => pictures.find((picture) => picture.id === id), [pictures],
  );

  const {
    accessGranted,
    handleOpenMediaLibrary,
    inputRef,
    handlePickImage,
    handleRequestMediaLibraryAccess,
  } = useImport({ getSightPreview, setPictures, inspectionId });

  const handleUploadPicture = useUploadPicture({ inspectionId, setPictures });

  const sights = Object.values(values.sights.abstract).map((s) => new Sight(...s));
  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Import inspection pictures',
        headerBackVisible: true,
      });
    }
  }, [navigation]);

  // loading
  if (false) { return <ActivityIndicatorView />; }

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
      <StatusBar />
      <Button style={styles.floatingButton} mode="contained" disabled={isUpdating} icon="file-edit-outline" color={colors.primary} onPress={updateTask}>
        Create inspection
      </Button>
      <Card>
        <Card.Title
          title="Create inspection"
          subtitle="Start an inspection by importing your pictures"
        />
        <Card.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <JSONTree data={res} /> */}
            <View style={styles.sightsLayout}>
              {sights.map(({ id, label }) => (
                <TouchableOpacity
                  key={id}
                  style={styles.sightCard}
                  onPress={() => handleOpenMediaLibrary(id)}
                  disabled={getSightPreview(id)}
                  accessibilityLabel={label}
                >
                  {Platform.OS === 'web' ? <input onChange={(e) => handlePickImage(id, e.target.files[0])} type="file" ref={inputRef} style={{ width: 0, height: 0 }} /> : null}
                  {getSightPreview(id) && !getSightPreview(id).isLoading
                    ? (
                      <View style={[styles.editSightPicture, { display: 'flex', flexDirection: 'row' }]}>
                        <IconButton
                          icon="circle-edit-outline"
                          size={24}
                          onPress={() => handleOpenMediaLibrary(id)}
                          style={{ backgroundColor: '#FFF' }}
                          color={colors.primary}
                        />
                        <IconButton
                          icon="reload"
                          size={24}
                          onPress={() => handleUploadPicture(getSightPreview(id).uri, id)}
                          style={{ backgroundColor: '#FFF', alignSelf: 'center' }}
                          color={colors.error}
                        />
                      </View>
                    )
                    : null}

                  {!getSightPreview(id)?.isLoading ? (
                    <View style={{ transform: [{ scale: 0.3 }], zIndex: 2, height: 400 }}>
                      <SightMask id={id.charAt(0).toUpperCase() + id.slice(1)} height="400" width="500" />
                    </View>
                  ) : null}

                  {/* we can try implementing the new Img conponent
                  here for a smooth image rendering */}
                  {getSightPreview(id)?.uri && !getSightPreview(id)?.isLoading
                    ? <Image source={{ uri: getSightPreview(id).uri }} style={styles.picture} />
                    : null}

                  {/* loading */}
                  {getSightPreview(id)?.isLoading ? <ActivityIndicator color="#FFFFFF" /> : null}

                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};
const SightMask = ({ id, ...props }) => (sightMasks?.[id] ? sightMasks[id](props) : null);
