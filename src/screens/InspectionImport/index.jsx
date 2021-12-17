import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Card, Button, useTheme, IconButton, ActivityIndicator } from 'react-native-paper';
import { StyleSheet, Platform, SafeAreaView, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
// import JSONTree from 'react-native-json-tree';

import { sightMasks, utils } from '@monkvision/react-native';
import { ActivityIndicatorView } from '@monkvision/react-native-views';
import { Sight, values, updateOneTaskOfInspection } from '@monkvision/corejs';

import useRequest from 'hooks/useRequest/index';
import { spacing } from 'config/theme';
import useImport, { initialPictureData } from './hooks/useImport';
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
    maxWidth: 170,
    height: 170,
    backgroundColor: '#636363',
    margin: spacing(1),
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
  floatingButton: { position: Platform.OS === 'web' ? 'fixed' : 'absolute', alignSelf: 'center', bottom: 50, zIndex: 9 },
  reloadButtonLayout: { position: 'absolute', display: 'flex', flexDirection: 'row', zIndex: 11 },
  reloadButton: { backgroundColor: '#FFF', alignSelf: 'center' },
});

function SightCard({ sight, events }) {
  const { colors } = useTheme();
  const inputRef = useRef(null);

  const { id, label, uri, isLoading, isFailed } = sight;

  const handleOpenMediaLibrary = useCallback(() => {
    if (Platform.OS === 'web') {
      inputRef.current.click();
    } else { events.handleOpenMediaLibrary(id); }
  }, [events, id]);

  return (
    <TouchableOpacity
      style={styles.sightCard}
      onPress={handleOpenMediaLibrary}
      disabled={uri}
      accessibilityLabel={label}
    >
      {/* web input  */}
      {Platform.OS === 'web' ? (
        <input
          ref={inputRef}
          type="file"
          style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
          onChange={
            (e) => events.handlePickImage(URL.createObjectURL(e.target.files[0]), id)
          }
        />
      ) : null}

      {/* overlay button */}
      <View style={styles.reloadButtonLayout}>
        {isFailed ? (
          <IconButton
            icon="reload"
            size={24}
            onPress={() => events.handleUploadPicture(uri, id)}
            style={styles.reloadButton}
            color={colors.error}
          />
        ) : null}
      </View>

      {/* sight mask */}
      {!isLoading ? (
        <View style={{ transform: [{ scale: 0.3 }], zIndex: 2, height: 400 }}>
          <SightMask id={id.charAt(0).toUpperCase() + id.slice(1)} height="400" width="500" />
        </View>
      ) : null}

      {/* we can try implementing the new Img conponent here for a smooth image rendering */}
      {uri
        ? <Image source={{ uri }} style={styles.picture} />
        : null}

      {/* loading */}
      {isLoading ? <ActivityIndicator color="#FFFFFF" /> : null}

    </TouchableOpacity>
  );
}

SightCard.propTypes = {
  events: PropTypes.shape({
    handleOpenMediaLibrary: PropTypes.func,
    handlePickImage: PropTypes.func,
    handleUploadPicture: PropTypes.func,
  }).isRequired,
  sight: PropTypes.shape({
    id: PropTypes.string,
    isFailed: PropTypes.bool,
    isLoading: PropTypes.bool,
    isUploaded: PropTypes.bool,
    label: PropTypes.string,
    uri: PropTypes.string,
  }).isRequired,
};

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const sights = useMemo(() => Object.values(values.sights.abstract).map((s) => new Sight(...s)),
    []);

  const [pictures, setPictures] = useState(
    sights.map(({ id, label }) => ({ ...initialPictureData, id, label })),
  );
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

  const {
    accessGranted,
    handleOpenMediaLibrary,
    handlePickImage,
    handleRequestMediaLibraryAccess,
    handleUploadPicture,
  } = useImport({ pictures, setPictures, inspectionId });

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Import inspection pictures',
        headerBackVisible: true,
      });
    }
  }, [navigation]);

  // loading
  if (false) { return <ActivityIndicatorView light />; }

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
        Start inspecting
      </Button>
      <Card>
        <Card.Title
          title="Create inspection"
          subtitle="Start an inspection by importing your pictures"
        />
        <Card.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <JSONTree data={pictures} /> */}
            <View style={styles.sightsLayout}>
              {pictures.map((sight) => (
                <SightCard
                  key={sight.id}
                  sight={sight}
                  events={{
                    handleOpenMediaLibrary,
                    handlePickImage,
                    handleUploadPicture,
                  }}
                />
              ))}
            </View>
          </ScrollView>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};
const SightMask = ({ id, ...props }) => (sightMasks?.[id] ? sightMasks[id](props) : null);
