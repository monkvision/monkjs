import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';
import moment from 'moment';
import { denormalize } from 'normalizr';

import { spacing } from 'config/theme';

import {
  damagesEntity,
  getOneInspectionById,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
} from '@monkvision/corejs';

import { Image, Platform, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, Button, Modal } from 'react-native-paper';
import JSONTree from 'react-native-json-tree';
import Carousel from 'components/Carousel';

import { DAMAGES } from 'screens/names';

const { width } = Dimensions.get('window');
const MODAL_MAX_WIDTH = 512;
const CONTENT_WIDTH = Platform.select({ web: MODAL_MAX_WIDTH, native: width });

// we can customize the json component by making changes to the theme object
// see more in the docs https://www.npmjs.com/package/react-native-json-tree
const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
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

const styles = StyleSheet.create({
  card: {
    margin: spacing(2),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  modal: {
    width: '100%',
    height: '100%',
    borderRadius: Platform.select({ web: 40, native: 0 }),
    overflow: 'hidden',
    maxWidth: 512,
    maxHeight: 512,
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: CONTENT_WIDTH,
  },
  closeButton: {
    borderRadius: 999,
    width: 32,
    height: 32,
    backgroundColor: 'grey',
    position: 'absolute',
    top: Platform.select({ web: 20, native: 20 + (MODAL_MAX_WIDTH - width) / 2 }),
    right: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [picturesModal, setPicturesModal] = useState(false);
  const handleOpenModal = useCallback(() => setPicturesModal(true), []);
  const handleCloseModal = useCallback(() => setPicturesModal(false), []);

  const { inspectionId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
    tasks: [tasksEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
    tasks: tasksEntities,
  });

  const [fakeActivity] = useFakeActivity(isLoading);

  const handleShowDamages = useCallback(() => {
    navigation.navigate(DAMAGES, { inspectionId });
  }, [inspectionId, navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Inspection #${inspectionId.split('-')[0]}`,
        headerBackVisible: true,
        headerRight: () => (
          <Button
            icon={fakeActivity ? undefined : 'refresh'}
            onPress={refresh}
            loading={fakeActivity}
            disabled={fakeActivity}
          >
            Refresh
          </Button>
        ),
      });
    }
  }, [fakeActivity, inspectionId, navigation, refresh]);

  if (!inspection) {
    return null;
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <Card style={styles.card}>
            <Card.Title
              title={inspection.id.split('-')[0]}
              subtitle={moment(inspection.createdAt).format('LLL')}
            />
            <Card.Content>
              <JSONTree data={{ ...inspection }} theme={theme} invertTheme={false} />
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button onPress={handleOpenModal}>Show images</Button>
              <Button onPress={handleShowDamages}>Show damages</Button>
            </Card.Actions>
          </Card>
        </ScrollView>
      </SafeAreaView>
      <Modal
        contentContainerStyle={styles.modal}
        onDismiss={handleCloseModal}
        visible={picturesModal}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Carousel
          withArrows
          contentWidth={CONTENT_WIDTH}
          data={inspection?.images}
          renderItem={({ item, index }) => (
            <Image source={{ uri: item.path }} key={index} style={styles.image} />
          )}
        />
      </Modal>
    </>
  );
};
